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

  const { puuid } = req.query;

  if (!puuid) {
    return res.status(400).json({ error: 'PUUID is required' });
  }

  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const spectatorUrl = `https://na1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`;
    
    const spectatorResponse = await fetch(spectatorUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (spectatorResponse.status === 404) {
      return res.status(404).json({ 
        error: 'No active game found',
        message: 'This player is not currently in a game'
      });
    }

    if (!spectatorResponse.ok) {
      const errorText = await spectatorResponse.text();
      console.error('Spectator API error:', errorText);
      return res.status(spectatorResponse.status).json({ 
        error: 'Failed to fetch game data' 
      });
    }

    const gameData = await spectatorResponse.json();

    const participants = gameData.participants.map(p => ({
      puuid: p.puuid,
      summonerId: p.summonerId,
      summonerName: p.summonerName || p.riotId || 'Unknown',
      riotId: p.riotId || p.summonerName || 'Unknown',
      championId: p.championId,
      teamId: p.teamId,
      spell1Id: p.spell1Id,
      spell2Id: p.spell2Id
    }));

    const blueTeam = participants.filter(p => p.teamId === 100);
    const redTeam = participants.filter(p => p.teamId === 200);

    return res.status(200).json({
      gameId: gameData.gameId,
      gameMode: gameData.gameMode,
      gameType: gameData.gameType,
      gameStartTime: gameData.gameStartTime,
      mapId: gameData.mapId,
      participants,
      blueTeam,
      redTeam
    });

  } catch (error) {
    console.error('Live game error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}