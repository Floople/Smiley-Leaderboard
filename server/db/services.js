import pool from './connection.js';

export async function dbGetAll() {
  try {
    const result = await pool.query('SELECT riot_id, summoner_name, tagline as "tagLine", tier, rank, winrate, wins, loss, LP, last_updated_on FROM leaderboard;');
    return result.rows;
  } catch (err) {
    console.error('Error fetching leaderboard data:', err);
    throw new Error('Failed to fetch leaderboard data');
  }
}

export async function dbGetPlayers() {
  try {
    const result = await pool.query('SELECT DISTINCT summoner_name, tagline as "tagLine" FROM leaderboard;');
    return result.rows;
  } catch (err) {
    console.error('Error fetching leaderboard data:', err);
    throw new Error('Failed to fetch leaderboard data');
  }
}

export async function dbWipe() {
  try {
    await pool.query('TRUNCATE TABLE leaderboard;');
    return { success: true };
  } catch (err) {
    console.error('Error wiping leaderboard data:', err);
    throw new Error('Failed to wipe leaderboard data');
  }
}

export async function dbInsert(playerID, playerData, winrate) {
  try {
    const query = `INSERT INTO leaderboard (riot_id, summoner_name, tagLine, tier, rank, winrate, wins, loss, LP) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const values = [
      `${playerID.gameName}${playerID.tagLine}`,
      playerID.gameName,
      playerID.tagLine,
      playerData.tier,
      playerData.rank,
      winrate,
      playerData.wins,
      playerData.losses,
      playerData.leaguePoints
    ];
    await pool.query(query, values);
    return { success: true };
  } catch (err) {
    if (err.code === '23505' || (err.message && err.message.includes('duplicate key value'))) {
      console.error('Primary key violation:', err);
      throw new Error('A player with this RIOT ID already exists in the leaderboard.');
    }
    console.error('Database insert error:', err);
    throw new Error(err.message || 'Failed to insert player into database');
  }
}

export async function dbDelete(summoner_name, tagLine) {
  try {
    const query = 'DELETE FROM leaderboard WHERE riot_id = $1';
    const values = [`${summoner_name}${tagLine}`];
    await pool.query(query, values);
    return { success: true };
  } catch (err) {
    console.error('Error deleting player from leaderboard:', err);
    throw new Error('Failed to delete player from leaderboard');
  }
}