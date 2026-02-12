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

  const name = req.query.name || req.query.gameName;
  const tag = req.query.tag || req.query.tagLine;
  const region = req.query.region || 'americas';

  if (!name || !tag) {
    return res.status(400).json({ error: 'Missing name or tag parameter' });
  }

  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const platform = 'na1';

  try {
    console.log(`[1] Looking up account: ${name}#${tag}`);
    const accountUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    const accountResponse = await fetch(accountUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!accountResponse.ok) {
      console.log(`[1] Account API failed: ${accountResponse.status}`);
      if (accountResponse.status === 404) {
        return res.status(404).json({ error: 'Summoner not found' });
      }
      if (accountResponse.status === 403) {
        return res.status(403).json({ error: 'API key expired or invalid' });
      }
      throw new Error(`Account API error: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;
    console.log(`[1] Got PUUID: ${puuid.substring(0, 20)}...`);

    console.log(`[2] Looking up summoner by PUUID...`);
    const summonerUrl = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    
    let summonerLevel = 0;
    let profileIconId = 0;
    let summonerId = null;

    const summonerResponse = await fetch(summonerUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (summonerResponse.ok) {
      const summonerData = await summonerResponse.json();
      console.log(`[2] Summoner response keys: ${Object.keys(summonerData).join(', ')}`);
      
      summonerLevel = summonerData.summonerLevel || 0;
      profileIconId = summonerData.profileIconId || 0;
      summonerId = summonerData.id || summonerData.summonerId || null;
    }

    if (!summonerId) {
      console.log(`[2b] Trying legacy summoner lookup by name...`);
      const legacyUrl = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`;
      
      const legacyResponse = await fetch(legacyUrl, {
        headers: { 'X-Riot-Token': apiKey }
      });

      if (legacyResponse.ok) {
        const legacyData = await legacyResponse.json();
        console.log(`[2b] Legacy response keys: ${Object.keys(legacyData).join(', ')}`);
        summonerId = legacyData.id || legacyData.summonerId || null;
        
        if (!summonerLevel && legacyData.summonerLevel) {
          summonerLevel = legacyData.summonerLevel;
        }
      } else {
        console.log(`[2b] Legacy lookup failed: ${legacyResponse.status}`);
      }
    }

    let rank = 'Unranked';
    let tier = '';
    let winRate = 50;
    let wins = 0;
    let losses = 0;

    if (summonerId) {
      console.log(`[3] Looking up ranked data by summoner ID: ${summonerId}`);
      const rankedUrl = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
      
      const rankedResponse = await fetch(rankedUrl, {
        headers: { 'X-Riot-Token': apiKey }
      });

      console.log(`[3] Ranked API status: ${rankedResponse.status}`);

      if (rankedResponse.ok) {
        const rankedData = await rankedResponse.json();
        console.log(`[3] Ranked entries found: ${rankedData.length}`);
        
        const soloQueue = rankedData.find(q => q.queueType === 'RANKED_SOLO_5x5');

        if (soloQueue) {
          tier = soloQueue.tier.charAt(0) + soloQueue.tier.slice(1).toLowerCase();
          rank = tier;
          wins = soloQueue.wins;
          losses = soloQueue.losses;
          winRate = Math.round((wins / (wins + losses)) * 100);
          console.log(`[3] Found Solo/Duo: ${rank}, ${wins}W ${losses}L, ${winRate}%`);
        }
      }
    } else {
      console.log(`[3] No summoner ID, trying ranked by PUUID...`);
      const rankedByPuuidUrl = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
      
      const rankedResponse = await fetch(rankedByPuuidUrl, {
        headers: { 'X-Riot-Token': apiKey }
      });

      console.log(`[3] Ranked by PUUID status: ${rankedResponse.status}`);

      if (rankedResponse.ok) {
        const rankedData = await rankedResponse.json();
        console.log(`[3] Ranked entries found: ${rankedData.length}`);
        
        const soloQueue = rankedData.find(q => q.queueType === 'RANKED_SOLO_5x5');

        if (soloQueue) {
          tier = soloQueue.tier.charAt(0) + soloQueue.tier.slice(1).toLowerCase();
          rank = tier;
          wins = soloQueue.wins;
          losses = soloQueue.losses;
          winRate = Math.round((wins / (wins + losses)) * 100);
          console.log(`[3] Found Solo/Duo: ${rank}, ${wins}W ${losses}L, ${winRate}%`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      puuid: puuid,
      data: {
        name: accountData.gameName,
        tag: accountData.tagLine,
        puuid: puuid,
        summonerLevel: summonerLevel,
        profileIconId: profileIconId,
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