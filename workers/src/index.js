import { dbGetAll, dbInsert, dbDelete, dbWipe, dbGetPlayers } from "./db/index.js";
import { riotPUUID, riotPlayerDetails } from './riot/index.js';
import { Hono } from 'hono';

const app = new Hono();

//app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))


function buildHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
}

// GET /api
app.get('/api', async () => {
  try {
    console.log('GET /api: calling dbGetAll...');
    const rows = await dbGetAll();
    console.log('GET /api: dbGetAll finished');
    return new Response(JSON.stringify({ leaderboard: rows }), {
      headers: buildHeaders()
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: buildHeaders()
    });
  }
});

// POST /api/insert
app.post('/api/insert', async (c) => {
  try {
    console.log('POST /api/insert: calling riotPUUID...');
    const { summoner_name, tagLine } = await c.req.json();
    //const { summoner_name } = c.req.param('summoner_name');
    //const { tagLine } = c.req.param('tagLine');
    console.log(`POST /api/insert: summoner_name=${summoner_name}, tagLine=${tagLine}`);
    const playerID = await riotPUUID(summoner_name, tagLine);
    console.log('POST /api/insert: riotPUUID finished, calling riotPlayerDetails...');
    const playerData = await riotPlayerDetails(playerID.puuid);
    console.log('POST /api/insert: riotPlayerDetails finished');
    let winrate = null;
    if (playerData.wins + playerData.losses > 0) {
      winrate = ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(2);
    }
    console.log('POST /api/insert: calling dbInsert...');
    await dbInsert(playerID, playerData, winrate);
    console.log('POST /api/insert: dbInsert finished');
    return new Response(JSON.stringify({ message: "Player added to leaderboard." }), {
      status: 201,
      headers: buildHeaders()
    });
  } catch (error) {
    console.error('Error in /api/insert:', error);
    const status = error.message && error.message.includes('duplicate key value') ? 400 : 500;
    return new Response(JSON.stringify({ error: error.message }), {
      status,
      headers: buildHeaders()
    });
  }
});

// POST /api/update
app.post('/api/update', async () => {
  try {
    console.log('POST /api/update: calling dbGetPlayers...');
    const players = await dbGetPlayers();
    console.log('POST /api/update: dbGetPlayers finished, calling dbWipe...');
    await dbWipe();
    console.log('POST /api/update: dbWipe finished, updating players...');
    for (const player of players) {
      try {
        console.log(`POST /api/update: updating player ${player.summoner_name}...`);
        const playerID = await riotPUUID(player.summoner_name, player.tagLine);
        console.log(`POST /api/update: riotPUUID for ${player.summoner_name} finished, calling riotPlayerDetails...`);
        const playerData = await riotPlayerDetails(playerID.puuid);
        console.log(`POST /api/update: riotPlayerDetails for ${player.summoner_name} finished`);
        let winrate = null;
        if (playerData.wins + playerData.losses > 0) {
          winrate = ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(2);
        }
        console.log(`POST /api/update: calling dbInsert for ${player.summoner_name}...`);
        await dbInsert(playerID, playerData, winrate);
        console.log(`POST /api/update: dbInsert for ${player.summoner_name} finished`);
      } catch (err) {
        console.error(`Error updating player ${player.summoner_name}:`, err);
      }
    }
    console.log('POST /api/update: all players updated');
    return new Response(JSON.stringify({ message: "Leaderboard updated." }), {
      status: 200,
      headers: buildHeaders()
    });
  } catch (error) {
    console.error('Error in /api/update:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: buildHeaders()
    });
  }
});

// POST /api/delete
//update to take from hono c object not request,env
app.delete('/api/delete', async (c) => {
  try {
    const data = await c.req.json();
    const { summoner_name, tagLine } = data.items;
    const result = await dbDelete(summoner_name, tagLine);
    if (result && result.success) {
      return new Response(JSON.stringify({ message: "Player removed from leaderboard." }), {
        status: 200,
        headers: buildHeaders()
      });
    } else {
      return new Response(JSON.stringify({ message: "Player delete failed." }), {
        status: 400,
        headers: buildHeaders()
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: buildHeaders()
    });
  }
});


export default app;