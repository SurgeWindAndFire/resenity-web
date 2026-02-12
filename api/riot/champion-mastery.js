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

  const { puuid, championId } = req.query;

  if (!puuid || !championId) {
    return res.status(400).json({ error: 'Missing puuid or championId parameter' });
  }

  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const masteryUrl = `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/by-champion/${championId}`;
    
    const masteryResponse = await fetch(masteryUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (masteryResponse.status === 404) {
      return res.status(200).json({
        success: true,
        data: {
          championId: parseInt(championId),
          championLevel: 0,
          championPoints: 0,
          gamesPlayed: 0,
          lastPlayTime: null
        }
      });
    }

    if (!masteryResponse.ok) {
      console.error(`Mastery API error: ${masteryResponse.status}`);
      return res.status(masteryResponse.status).json({ 
        error: 'Failed to fetch mastery data' 
      });
    }

    const masteryData = await masteryResponse.json();

    const estimatedGames = Math.round(masteryData.championPoints / 800);

    return res.status(200).json({
      success: true,
      data: {
        championId: masteryData.championId,
        championLevel: masteryData.championLevel,
        championPoints: masteryData.championPoints,
        gamesPlayed: estimatedGames,
        lastPlayTime: masteryData.lastPlayTime
      }
    });

  } catch (error) {
    console.error('Champion mastery API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}