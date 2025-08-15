import express from "express";
import { dbGetAll, dbInsert, dbDelete, dbWipe, dbGetPlayers } from "../db/index.js";
import {riotPUUID, riotPlayerDetails} from '../riot/index.js';

const router = express.Router();

router.get("/api", async (req, res) => {
  try {
    const rows = await dbGetAll();
    res.json({ leaderboard: rows });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/insert", async (req, res) => {
  const { summoner_name, tagLine } = req.body;
  console.log('Received:', summoner_name, tagLine);
  try {
    const playerID = await riotPUUID(summoner_name, tagLine);
    const playerData = await riotPlayerDetails(playerID.puuid);
    let winrate = null;
    if (playerData.wins + playerData.losses > 0) {
      winrate = ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(2);
    }
    await dbInsert(playerID, playerData, winrate);
    res.status(201).json({ message: "Player added to leaderboard." });
  } catch (error) {
    console.error('Error in /api/insert:', error);
    if (error.message && error.message.includes('duplicate key value')) {
      res.status(400).json({ error: error.message});
    } else {
      res.status(500).json({ error: error.message});
    }
  } 
});

router.post("/api/update", async (req, res) => {
  try {
    // Get all players
    const players = await dbGetPlayers();
    console.log('Players to update:', players);
    // Wipe leaderboard
    await dbWipe();
    // Reinsert each player
    for (const player of players) {
      console.log('Updating player:', player.summoner_name, player.tagLine);
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
    res.status(200).json({ message: "Leaderboard updated." });
  } catch (error) {
    console.error('Error in /api/update:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/delete", async (req, res) => {
  try {
    console.log('Received delete request:', req.body);
    const { items, _} = req.body;
    console.log('Received:', items);
    const summoner_name = items.summoner_name;
    const tagLine = items.tagLine;
    await dbDelete(summoner_name, tagLine);
    res.status(200).json({ message: "Player removed from leaderboard." });
  } catch (error) {
    console.error('Error in /api/delete:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;