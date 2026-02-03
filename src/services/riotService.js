const API_BASE = '/api/riot';

export async function lookupSummoner(gameName, tagLine, region = 'americas') {
    try {
        const response = await fetch(
            `${API_BASE}/summoner?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&region=${encodeURIComponent(region)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch summoner data');
        }

        return {
            success: true,
            player: {
                name: `${data.data.name}#${data.data.tag}`,
                rank: data.data.rank || 'Unranked',
                winRate: data.data.winRate || 50,
                wins: data.data.wins || 0,
                losses: data.data.losses || 0,
                level: data.data.summonerLevel || 0,
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

export function normalizeRank(riotRank) {
    const rankMap = {
        'Iron': 'Iron',
        'Bronze': 'Bronze',
        'Silver': 'Silver',
        'Gold': 'Gold',
        'Platinum': 'Platinum',
        'Diamond': 'Diamond',
        'Master': 'Master',
        'Grandmaster': 'Grandmaster',
        'Challenger': 'Challenger',
        'Unranked': 'Gold'
    };

    return rankMap[riotRank] || 'Gold';
}