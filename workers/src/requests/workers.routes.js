
import { dbGetAll, dbInsert, dbDelete, dbWipe, dbGetPlayers } from "../db/index.js";
import { riotPUUID, riotPlayerDetails } from '../riot/index.js';
import { Router } from 'itty-router';

const router = Router();

function buildHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
}

// GET /api
router.get('/api', async (request, env) => {
  try {
    const rows = await dbGetAll();
    return new Response(JSON.stringify({ leaderboard: rows }), {
      headers: buildHeaders()
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: buildHeaders()
    });
  }
});

// POST /api/insert
router.post('/api/insert', async (request, env) => {
  try {
    const body = await request.json();
    const { summoner_name, tagLine } = body;
    const playerID = await riotPUUID(summoner_name, tagLine);
    const playerData = await riotPlayerDetails(playerID.puuid);
    let winrate = null;
    if (playerData.wins + playerData.losses > 0) {
      winrate = ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(2);
    }
    await dbInsert(playerID, playerData, winrate);
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
router.post('/api/update', async (request, env) => {
  try {
    const players = await dbGetPlayers();
    await dbWipe();
    for (const player of players) {
      try {
        const playerID = await riotPUUID(player.summoner_name, player.tagLine);
        const playerData = await riotPlayerDetails(playerID.puuid);
        let winrate = null;
        if (playerData.wins + playerData.losses > 0) {
          winrate = ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(2);
        }
        await dbInsert(playerID, playerData, winrate);
      } catch (err) {
        console.error(`Error updating player ${player.summoner_name}:`, err);
      }
    }
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
router.post('/api/delete', async (request, env) => {
  try {
    const body = await request.json();
    const { items } = body;
    const summoner_name = items.summoner_name;
    const tagLine = items.tagLine;
    await dbDelete(summoner_name, tagLine);
    return new Response(JSON.stringify({ message: "Player removed from leaderboard." }), {
      status: 200,
      headers: buildHeaders()
    });
  } catch (error) {
    console.error('Error in /api/delete:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: buildHeaders()
    });
  }
});

export { router };