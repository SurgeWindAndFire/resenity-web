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

  // Platform for NA server
  const platform = 'na1';

  try {
    // Step 1: Get PUUID from Riot ID (name#tag)
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

    // Step 2: Get Summoner data from PUUID
    console.log(`[2] Looking up summoner data...`);
    const summonerUrl = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    
    const summonerResponse = await fetch(summonerUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!summonerResponse.ok) {
      console.log(`[2] Summoner API failed: ${summonerResponse.status}`);
      return res.status(200).json({
        success: true,
        data: {
          name: accountData.gameName,
          tag: accountData.tagLine,
          puuid: puuid,
          summonerLevel: 0,
          rank: 'Unranked',
          winRate: 50,
          wins: 0,
          losses: 0,
          note: 'Summoner data not found'
        }
      });
    }

    const summonerData = await summonerResponse.json();
    console.log(`[2] Got summoner ID: ${summonerData.id}, Level: ${summonerData.summonerLevel}`);

    // Step 3: Get Ranked data
    console.log(`[3] Looking up ranked data...`);
    const rankedUrl = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}`;
    
    console.log(`[3] Ranked URL: ${rankedUrl}`);
    
    const rankedResponse = await fetch(rankedUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    console.log(`[3] Ranked API status: ${rankedResponse.status}`);

    let rank = 'Unranked';
    let tier = '';
    let winRate = 50;
    let wins = 0;
    let losses = 0;

    if (rankedResponse.ok) {
      const rankedData = await rankedResponse.json();
      console.log(`[3] Ranked data:`, JSON.stringify(rankedData));
      
      const soloQueue = rankedData.find(q => q.queueType === 'RANKED_SOLO_5x5');

      if (soloQueue) {
        tier = soloQueue.tier.charAt(0) + soloQueue.tier.slice(1).toLowerCase();
        rank = tier;
        wins = soloQueue.wins;
        losses = soloQueue.losses;
        winRate = Math.round((wins / (wins + losses)) * 100);
        console.log(`[3] Found Solo/Duo: ${rank}, ${wins}W ${losses}L, ${winRate}%`);
      } else {
        console.log(`[3] No Solo/Duo queue data found`);
      }
    } else {
      const errorText = await rankedResponse.text();
      console.log(`[3] Ranked API failed: ${rankedResponse.status} - ${errorText}`);
    }

    // Return the data
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