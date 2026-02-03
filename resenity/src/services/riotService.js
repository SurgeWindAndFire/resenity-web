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

// Convert Riot rank to our rank format
export function normalizeRank(riotRank) {
  if (!riotRank) return 'Gold';
  
  // Capitalize first letter, lowercase rest
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
  
  // Check if it's a valid rank
  if (validRanks.includes(normalized)) {
    // Map Unranked to Gold as default
    if (normalized === 'Unranked') return 'Gold';
    return normalized;
  }
  
  console.warn(`Unknown rank: ${riotRank}, defaulting to Gold`);
  return 'Gold';
}