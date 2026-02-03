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

  // Map regional routing for account API
  // americas = NA, BR, LAN, LAS, OCE
  // europe = EUW, EUNE, TR, RU
  // asia = KR, JP
  // sea = PH, SG, TH, TW, VN
  
  // Map platform for game data API
  const platformMap = {
    'NA1': 'na1',
    'EUW1': 'euw1', 
    'EUN1': 'eun1',
    'KR': 'kr',
    'JP1': 'jp1',
    'BR1': 'br1',
    'LA1': 'la1',
    'LA2': 'la2',
    'OC1': 'oc1',
    'TR1': 'tr1',
    'RU': 'ru'
  };

  // Guess platform from tag (common patterns)
  let platform = 'na1'; // default
  const tagUpper = tag.toUpperCase();
  
  if (tagUpper.includes('NA') || tagUpper === 'NA1') platform = 'na1';
  else if (tagUpper.includes('EUW')) platform = 'euw1';
  else if (tagUpper.includes('EUNE') || tagUpper.includes('EUN')) platform = 'eun1';
  else if (tagUpper.includes('KR') || tagUpper === 'KR1') platform = 'kr';
  else if (tagUpper.includes('JP')) platform = 'jp1';
  else if (tagUpper.includes('BR')) platform = 'br1';
  else if (tagUpper.includes('OCE') || tagUpper.includes('OC')) platform = 'oc1';

  try {
    // Step 1: Get PUUID from Riot ID (name#tag)
    const accountUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    const accountResponse = await fetch(accountUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!accountResponse.ok) {
      if (accountResponse.status === 404) {
        return res.status(404).json({ error: 'Summoner not found' });
      }
      if (accountResponse.status === 403) {
        return res.status(403).json({ error: 'API key expired or invalid. Please refresh.' });
      }
      throw new Error(`Account API error: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;

    // Step 2: Get Summoner data from PUUID
    const summonerUrl = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    
    const summonerResponse = await fetch(summonerUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (!summonerResponse.ok) {
      // If summoner not found on this platform, return basic data
      if (summonerResponse.status === 404) {
        return res.status(200).json({
          success: true,
          data: {
            name: accountData.gameName,
            tag: accountData.tagLine,
            puuid: puuid,
            summonerLevel: 0,
            profileIconId: 0,
            rank: 'Unranked',
            tier: '',
            wins: 0,
            losses: 0,
            winRate: 50,
            note: 'Summoner found but no LoL data on this region'
          }
        });
      }
      throw new Error(`Summoner API error: ${summonerResponse.status}`);
    }

    const summonerData = await summonerResponse.json();

    // Step 3: Get Ranked data (this can fail, so we handle it gracefully)
    let rank = 'Unranked';
    let tier = '';
    let winRate = 50;
    let wins = 0;
    let losses = 0;

    try {
      const rankedUrl = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}`;
      
      const rankedResponse = await fetch(rankedUrl, {
        headers: { 'X-Riot-Token': apiKey }
      });

      if (rankedResponse.ok) {
        const rankedData = await rankedResponse.json();
        const soloQueue = rankedData.find(q => q.queueType === 'RANKED_SOLO_5x5');

        if (soloQueue) {
          tier = soloQueue.tier.charAt(0) + soloQueue.tier.slice(1).toLowerCase();
          rank = tier;
          wins = soloQueue.wins;
          losses = soloQueue.losses;
          winRate = Math.round((wins / (wins + losses)) * 100);
        }
      }
      // If ranked API fails, we just use defaults (Unranked, 50% WR)
    } catch (rankedError) {
      console.log('Ranked data not available:', rankedError.message);
      // Continue with defaults
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
