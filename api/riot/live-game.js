export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, tag, region = 'americas' } = req.query;

  if (!name || !tag) {
    return res.status(400).json({ error: 'Missing name or tag parameter' });
  }

  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const platform = 'na1';

  try {
    // Step 1: Get PUUID from Riot ID
    console.log(`[1] Looking up account: ${name}#${tag}`);
    const accountUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    const accountResponse = await fetch(accountUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!accountResponse.ok) {
      if (accountResponse.status === 404) {
        return res.status(404).json({ error: 'Summoner not found' });
      }
      throw new Error(`Account API error: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;
    console.log(`[1] Got PUUID: ${puuid.substring(0, 20)}...`);

    // Step 2: Check if player is in an active game
    console.log(`[2] Checking for active game...`);
    const spectatorUrl = `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`;
    
    const spectatorResponse = await fetch(spectatorUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (spectatorResponse.status === 404) {
      return res.status(200).json({
        success: true,
        inGame: false,
        message: 'Player is not currently in a game'
      });
    }

    if (!spectatorResponse.ok) {
      throw new Error(`Spectator API error: ${spectatorResponse.status}`);
    }

    const gameData = await spectatorResponse.json();
    console.log(`[2] Found active game! Mode: ${gameData.gameMode}`);

    // Step 3: Get all players' data
    const participants = gameData.participants || [];
    console.log(`[3] Found ${participants.length} participants`);

    const blueTeam = [];
    const redTeam = [];

    for (const participant of participants) {
      const playerPuuid = participant.puuid;
      const playerName = participant.riotId || `${participant.summonerName || 'Unknown'}`;
      const teamId = participant.teamId; // 100 = blue, 200 = red
      const championId = participant.championId;

      // Get ranked data for this player
      let rank = 'Unranked';
      let winRate = 50;
      let wins = 0;
      let losses = 0;

      try {
        const rankedUrl = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${playerPuuid}`;
        const rankedResponse = await fetch(rankedUrl, {
          headers: { 'X-Riot-Token': apiKey }
        });

        if (rankedResponse.ok) {
          const rankedData = await rankedResponse.json();
          const soloQueue = rankedData.find(q => q.queueType === 'RANKED_SOLO_5x5');
          
          if (soloQueue) {
            rank = soloQueue.tier.charAt(0) + soloQueue.tier.slice(1).toLowerCase();
            wins = soloQueue.wins;
            losses = soloQueue.losses;
            winRate = Math.round((wins / (wins + losses)) * 100);
          }
        }
      } catch (e) {
        console.log(`Failed to get ranked data for ${playerName}`);
      }

      const playerData = {
        name: playerName,
        rank: rank,
        winRate: winRate,
        wins: wins,
        losses: losses,
        championId: championId
      };

      if (teamId === 100) {
        blueTeam.push(playerData);
      } else {
        redTeam.push(playerData);
      }
    }

    console.log(`[3] Blue team: ${blueTeam.length}, Red team: ${redTeam.length}`);

    return res.status(200).json({
      success: true,
      inGame: true,
      gameMode: gameData.gameMode,
      gameType: gameData.gameType,
      gameLength: gameData.gameLength,
      blueTeam: blueTeam,
      redTeam: redTeam
    });

  } catch (error) {
    console.error('Live Game API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch live game data',
      details: error.message 
    });
  }
}