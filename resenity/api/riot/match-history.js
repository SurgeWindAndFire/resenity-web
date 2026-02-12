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

  const { puuid, championId, count = 20 } = req.query;

  if (!puuid) {
    return res.status(400).json({ error: 'Missing puuid parameter' });
  }

  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const matchListUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=ranked&count=${count}`;
    
    const matchListResponse = await fetch(matchListUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!matchListResponse.ok) {
      console.error(`Match list API error: ${matchListResponse.status}`);
      return res.status(matchListResponse.status).json({ 
        error: 'Failed to fetch match history' 
      });
    }

    const matchIds = await matchListResponse.json();

    if (matchIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalGames: 0,
          wins: 0,
          losses: 0,
          winRate: 50,
          championGames: 0,
          championWins: 0,
          championWinRate: 50
        }
      });
    }

    const matchesToFetch = matchIds.slice(0, Math.min(10, matchIds.length));
    
    let totalWins = 0;
    let totalLosses = 0;
    let championWins = 0;
    let championGames = 0;

    for (const matchId of matchesToFetch) {
      try {
        const matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;
        
        const matchResponse = await fetch(matchUrl, {
          headers: { 'X-Riot-Token': apiKey }
        });

        if (matchResponse.ok) {
          const matchData = await matchResponse.json();
          
          const participant = matchData.info.participants.find(p => p.puuid === puuid);
          
          if (participant) {
            if (participant.win) {
              totalWins++;
            } else {
              totalLosses++;
            }

            if (championId && participant.championId === parseInt(championId)) {
              championGames++;
              if (participant.win) {
                championWins++;
              }
            }
          }
        }
      } catch (matchError) {
        console.error(`Error fetching match ${matchId}:`, matchError);
      }
    }

    const totalGames = totalWins + totalLosses;
    const overallWinRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 50;
    const champWinRate = championGames > 0 ? Math.round((championWins / championGames) * 100) : 50;

    return res.status(200).json({
      success: true,
      data: {
        totalGames,
        wins: totalWins,
        losses: totalLosses,
        winRate: overallWinRate,
        championGames,
        championWins,
        championWinRate: champWinRate
      }
    });

  } catch (error) {
    console.error('Match history API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}