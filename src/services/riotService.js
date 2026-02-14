const API_BASE = '/api/riot';

export async function lookupSummoner(gameName, tagLine, region = 'americas') {
  try {
    const response = await fetch(
      `${API_BASE}/summoner?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&region=${region}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to lookup summoner');
    }
    return {
      success: true,
      player: {
        name: `${data.data.name}#${data.data.tag}`,
        puuid: data.data.puuid,
        rank: data.data.rank || 'Unranked',
        winRate: data.data.winRate || 50,
        wins: data.data.wins || 0,
        losses: data.data.losses || 0,
        level: data.data.summonerLevel
      }
    };
  } catch (error) {
    console.error('Summoner lookup error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getChampionWinRate(puuid, championId) {
  try {
    const response = await fetch(
      `${API_BASE}/match-history?puuid=${encodeURIComponent(puuid)}&championId=${championId}&count=20`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch match history');
    }
    
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Champion win rate lookup error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getDeepAnalysis(players) {
  const results = [];
  
  for (const player of players) {
    if (player.puuid && player.championId) {
      const result = await getChampionWinRate(player.puuid, player.championId);
      
      results.push({
        playerName: player.name,
        champion: player.champion,
        championId: player.championId,
        ...(result.success ? result.data : {
          championGames: 0,
          championWins: 0,
          championWinRate: 50
        })
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      results.push({
        playerName: player.name,
        champion: player.champion,
        championGames: 0,
        championWins: 0,
        championWinRate: 50
      });
    }
  }
  
  return results;
}

export function normalizeRank(riotRank) {
  if (!riotRank) return 'Gold';
  
  const normalized = riotRank.charAt(0).toUpperCase() + riotRank.slice(1).toLowerCase();
  
  const validRanks = [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Emerald',
    'Diamond',
    'Master',
    'Grandmaster',
    'Challenger',
    'Unranked'
  ];
  
  if (validRanks.includes(normalized)) {
    if (normalized === 'Unranked') return 'Gold';
    return normalized;
  }
  
  console.warn(`Unknown rank: ${riotRank}, defaulting to Gold`);
  return 'Gold';
}