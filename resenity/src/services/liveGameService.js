import { getChampionById, CHAMPIONS } from '../data/champions';
import { lookupSummoner, normalizeRank } from './riotService';

export async function fetchLiveGame(gameName, tagLine) {
  try {
    const accountResponse = await fetch(
      `/api/riot/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
    );

    if (!accountResponse.ok) {
      const error = await accountResponse.json();
      return { success: false, error: error.error || 'Player not found' };
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;

    const gameResponse = await fetch(`/api/riot/live-game?puuid=${puuid}`);

    if (gameResponse.status === 404) {
      return { 
        success: false, 
        error: 'No active game found. Make sure the player is currently in a match.' 
      };
    }

    if (!gameResponse.ok) {
      const error = await gameResponse.json();
      return { success: false, error: error.error || 'Failed to fetch game' };
    }

    const gameData = await gameResponse.json();

    const blueTeam = await processTeam(gameData.blueTeam);
    const redTeam = await processTeam(gameData.redTeam);

    return {
      success: true,
      game: {
        gameId: gameData.gameId,
        gameMode: gameData.gameMode,
        gameType: gameData.gameType,
        gameStartTime: gameData.gameStartTime,
        blueTeam,
        redTeam
      }
    };

  } catch (error) {
    console.error('Live game fetch error:', error);
    return { success: false, error: 'Failed to connect to server' };
  }
}

async function processTeam(players) {
  const playersWithChampions = players.map(player => {
    const championName = getChampionById(player.championId);
    return {
      ...player,
      champion: championName,
      championId: player.championId
    };
  });

  const assignedRoles = [];
  const playersWithRoles = playersWithChampions.map(player => {
    const role = inferRoleFromChampionWithContext(player.champion, assignedRoles);
    assignedRoles.push(role);
    return {
      ...player,
      role
    };
  });

  const playersWithStats = await Promise.all(
    playersWithRoles.map(async (player) => {
      try {
        const riotIdParts = player.riotId?.split('#') || [];
        let rank = 'Gold';
        let winRate = 50;
        let puuid = player.puuid;

        if (riotIdParts.length === 2) {
          const result = await lookupSummoner(riotIdParts[0], riotIdParts[1]);
          if (result.success) {
            rank = normalizeRank(result.player.rank);
            winRate = result.player.winRate;
          }
        }

        let championMastery = null;
        if (puuid && player.championId) {
          try {
            const masteryResponse = await fetch(
              `/api/riot/champion-mastery?puuid=${puuid}&championId=${player.championId}`
            );
            if (masteryResponse.ok) {
              const masteryData = await masteryResponse.json();
              if (masteryData.success) {
                championMastery = masteryData.data;
              }
            }
          } catch (masteryError) {
            console.error('Error fetching mastery:', masteryError);
          }
        }

        return {
          ...player,
          name: player.riotId || player.summonerName || 'Unknown',
          rank,
          winRate,
          championMastery
        };
      } catch (error) {
        console.error('Error fetching player stats:', error);
        return {
          ...player,
          name: player.riotId || player.summonerName || 'Unknown',
          rank: 'Gold',
          winRate: 50,
          championMastery: null
        };
      }
    })
  );

  const roleOrder = ['top', 'jungle', 'mid', 'adc', 'support'];
  playersWithStats.sort((a, b) => {
    return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
  });

  return playersWithStats;
}

function inferRoleFromChampionWithContext(championName, assignedRoles) {
  if (!championName) return getNextAvailableRole(assignedRoles);
  
  const champion = CHAMPIONS[championName];
  if (!champion) return getNextAvailableRole(assignedRoles);

  const sortedRoles = Object.entries(champion.roles)
    .sort((a, b) => a[1] - b[1])
    .map(([role]) => role);

  for (const role of sortedRoles) {
    if (!assignedRoles.includes(role)) {
      return role;
    }
  }

  return getNextAvailableRole(assignedRoles);
}

function getNextAvailableRole(assignedRoles) {
  const allRoles = ['top', 'jungle', 'mid', 'adc', 'support'];
  for (const role of allRoles) {
    if (!assignedRoles.includes(role)) {
      return role;
    }
  }
  return 'support';
}