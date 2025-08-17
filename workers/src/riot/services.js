// Riot API helper functions

export async function riotPUUID(summoner_name, tagLine) {
  try {
    return await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summoner_name}/${tagLine}`,
      {
        headers: { "X-Riot-Token": process.env.API_KEY_VALUE }
      }
    )
    .then(response => {
      if (!response.ok) {
        console.error('Failed to fetch from Riot API:', response.statusText);
        throw new Error(`${response.statusText}` || 'Failed to fetch from Riot API');
      }
      return response.json();
    })
    .then(playerID => {
      if (!playerID.puuid || typeof playerID.puuid !== 'string' || playerID.puuid.trim() === '') {
        throw new Error('Invalid PUUID received from Riot API');
      }
      return playerID;
    });
  } catch (err) {
    console.error('Error in riotPUUID:', err);
    throw new Error(err.message || 'Failed to fetch player details from Riot API');
  }
}

export async function riotPlayerDetails(puuid) {
  try {
    const response = await fetch(
      `https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
      {
        headers: { "X-Riot-Token": process.env.API_KEY_VALUE }
      }
    );
    if (!response.ok) {
      console.error('Failed to fetch player details from Riot API:', response.statusText);
      throw new Error('Failed to fetch player details from Riot API');
    }
    const rawBody = await response.text();
    try {
      let player = JSON.parse(rawBody);
      let playerData = Array.isArray(player)
        ? player.find(p => p.queueType === "RANKED_SOLO_5x5")
        : player;
      if (!playerData) {
        console.error('No RANKED_SOLO_5x5 player data found for database insert:', player);
        throw new Error('No RANKED_SOLO_5x5 player data found for database insert');
      }
      return playerData;
    } catch (jsonErr) {
      console.error('Error parsing player details response as JSON:', jsonErr, rawBody);
      throw new Error('Failed to parse player details response as JSON');
    }
  } catch (err) {
    console.error('Error in riotPlayerDetails:', err);
    throw new Error(err.message || 'Failed to fetch player details from Riot API');
  }
}