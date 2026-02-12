const RANK_VALUES = {
  "Iron": 1,
  "Bronze": 2,
  "Silver": 3,
  "Gold": 4,
  "Platinum": 5,
  "Emerald": 6,
  "Diamond": 7,
  "Master": 8,
  "Grandmaster": 9,
  "Challenger": 10,
  "Unranked": 4
};

function normalizeRankForCalc(rank) {
  if (!rank) return "Gold";
  
  const rankParts = rank.split(' ');
  const tier = rankParts[0];
  
  if (RANK_VALUES[tier] !== undefined) {
    return tier;
  }
  
  for (const key of Object.keys(RANK_VALUES)) {
    if (rank.toLowerCase().includes(key.toLowerCase())) {
      return key;
    }
  }
  
  return "Gold";
}

function calculateTeamScore(team) {
  let totalRankScore = 0;
  let totalWinRate = 0;
  let totalMasteryBonus = 0;
  
  team.forEach(player => {
    const normalizedRank = normalizeRankForCalc(player.rank);
    totalRankScore += RANK_VALUES[normalizedRank] || 4;
    totalWinRate += player.winRate || 50;
    
    if (player.championMastery) {
      const masteryLevel = player.championMastery.championLevel || 0;
      const gamesPlayed = player.championMastery.gamesPlayed || 0;
      
      if (masteryLevel >= 7) totalMasteryBonus += 3;
      else if (masteryLevel >= 5) totalMasteryBonus += 2;
      else if (masteryLevel >= 4) totalMasteryBonus += 1;
      
      if (gamesPlayed >= 100) totalMasteryBonus += 2;
      else if (gamesPlayed >= 50) totalMasteryBonus += 1.5;
      else if (gamesPlayed >= 20) totalMasteryBonus += 1;
      else if (gamesPlayed >= 10) totalMasteryBonus += 0.5;
    }
  });
  
  const avgRank = totalRankScore / team.length;
  const avgWinRate = totalWinRate / team.length;
  const masteryBonus = totalMasteryBonus / team.length;
  
  const score = (avgRank * 4) + (avgWinRate * 0.4) + (masteryBonus * 2);
  
  return { avgRank, avgWinRate, masteryBonus, score };
}

function generateFactors(team1Stats, team2Stats, team1, team2) {
  const factors = [];

  const rankDiff = team1Stats.avgRank - team2Stats.avgRank;
  if (Math.abs(rankDiff) >= 0.5) {
    const advantageTeam = rankDiff > 0 ? "blue" : "red";
    const rankNames = Object.keys(RANK_VALUES);
    const team1AvgRankName = rankNames[Math.round(team1Stats.avgRank) - 1] || "Gold";
    const team2AvgRankName = rankNames[Math.round(team2Stats.avgRank) - 1] || "Gold";
    
    factors.push({
      team: advantageTeam,
      text: `Higher average rank (${advantageTeam === "blue" ? team1AvgRankName : team2AvgRankName})`
    });
  }

  const winRateDiff = team1Stats.avgWinRate - team2Stats.avgWinRate;
  if (Math.abs(winRateDiff) >= 2) {
    const advantageTeam = winRateDiff > 0 ? "blue" : "red";
    const betterWinRate = Math.round(advantageTeam === "blue" ? team1Stats.avgWinRate : team2Stats.avgWinRate);
    
    factors.push({
      team: advantageTeam,
      text: `Better average win rate (${betterWinRate}%)`
    });
  }

  const masteryDiff = team1Stats.masteryBonus - team2Stats.masteryBonus;
  if (Math.abs(masteryDiff) >= 1) {
    const advantageTeam = masteryDiff > 0 ? "blue" : "red";
    factors.push({
      team: advantageTeam,
      text: "More experienced on their champions"
    });
  }

  const allPlayers = [
    ...team1.map(p => ({ ...p, team: "blue" })),
    ...team2.map(p => ({ ...p, team: "red" }))
  ];

  allPlayers.forEach(player => {
    if (player.championMastery && player.championMastery.championLevel >= 7) {
      const gamesPlayed = player.championMastery.gamesPlayed || 0;
      if (gamesPlayed >= 50) {
        factors.push({
          team: player.team,
          text: `${player.champion} one-trick (${formatGames(gamesPlayed)} games)`
        });
      }
    }
  });

  allPlayers.forEach(player => {
    const normalizedRank = normalizeRankForCalc(player.rank);
    if (RANK_VALUES[normalizedRank] >= 8) {
      factors.push({
        team: player.team,
        text: `Has a ${normalizedRank} player`
      });
    }
  });
  
  return factors.slice(0, 6);
}

function formatGames(games) {
  if (games >= 1000) return `${(games / 1000).toFixed(1)}k`;
  return games.toString();
}

export function calculatePrediction(team1, team2) {
  const team1Stats = calculateTeamScore(team1);
  const team2Stats = calculateTeamScore(team2);
  
  const totalScore = team1Stats.score + team2Stats.score;
  const team1Probability = Math.round((team1Stats.score / totalScore) * 100);
  const team2Probability = 100 - team1Probability;
  
  const probDiff = Math.abs(team1Probability - team2Probability);
  let confidence;
  if (probDiff >= 15) {
    confidence = "high";
  } else if (probDiff >= 8) {
    confidence = "medium";
  } else {
    confidence = "low";
  }
  
  const factors = generateFactors(team1Stats, team2Stats, team1, team2);
  
  return {
    team1Probability,
    team2Probability,
    predictedWinner: team1Probability >= team2Probability ? "blue" : "red",
    confidence,
    factors
  };
}
