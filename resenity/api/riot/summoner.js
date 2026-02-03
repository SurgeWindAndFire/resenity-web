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

  try {
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

    const summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    
    const summonerResponse = await fetch(summonerUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!summonerResponse.ok) {
      throw new Error(`Summoner API error: ${summonerResponse.status}`);
    }

    const summonerData = await summonerResponse.json();

    const rankedUrl = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}`;
    
    const rankedResponse = await fetch(rankedUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!rankedResponse.ok) {
      throw new Error(`Ranked API error: ${rankedResponse.status}`);
    }

    const rankedData = await rankedResponse.json();

    const soloQueue = rankedData.find(q => q.queueType === 'RANKED_SOLO_5x5');

    let rank = 'Unranked';
    let tier = '';
    let winRate = 50;
    let wins = 0;
    let losses = 0;

    if (soloQueue) {
      tier = soloQueue.tier.charAt(0) + soloQueue.tier.slice(1).toLowerCase();
      rank = tier;
      wins = soloQueue.wins;
      losses = soloQueue.losses;
      winRate = Math.round((wins / (wins + losses)) * 100);
    }

    return res.status(200).json({
      success: true,
      data: {
        name: accountData.gameName,
        tag: accountData.tagLine,
        puuid: puuid,
        summonerLevel: summonerData.summonerLevel,
        profileIconId: summonerData.profileIconId,
        rank: rank,
        tier: tier,
        wins: wins,
        losses: losses,
        winRate: winRate
      }
    });

  } catch (error) {
    console.error('Riot API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch summoner data',
      details: error.message 
    });
  }
}