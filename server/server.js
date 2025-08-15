import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import pool from './db/connection.js';
import requestsRouter from './routes/requests.js';

const app = express()

// Enable CORS for all routes
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-url-encoded
app.use(bodyParser.urlencoded({extended : true}));

// Log every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Leaderboard API is running.");
});

app.use(requestsRouter);

async function readData() {
  try {
    console.log('Connection established');
    // Fetch all rows from the players table
    const { rows } = await pool.query('SELECT * FROM leaderboard;');
    console.log('\n--- Leaderboard ---');
    rows.forEach((player) => {
      console.log(
        `RIOT ID: ${player.riot_id}, SUMMONER NAME: ${player.summoner_name}, Tier: ${player.tier}, Rank: ${player.rank}, Winrate: ${player.winrate}`
      );
    });
    console.log('--------------------\n');
  } catch (err) {
    console.error('Connection failed.', err);
  } 
}

app.listen(process.env.PORT || 5000, () => {
  readData();
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
//readData();