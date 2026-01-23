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
  "Challenger": 10
};

function getAverageRank(team) {
  const total = team.reduce((sum, player) => sum + RANK_VALUES[player.rank], 0);
  return total / team.length;
}

function getAverageWinRate(team) {
  const total = team.reduce((sum, player) => sum + player.winRate, 0);
  return total / team.length;
}

function getRankName(value) {
  const rounded = Math.round(value);
  return Object.keys(RANK_VALUES).find(key => RANK_VALUES[key] === rounded) || "Gold";
}

export function calculatePrediction(team1, team2) {
  // Calculate team averages
  const team1AvgRank = getAverageRank(team1);
  const team2AvgRank = getAverageRank(team2);
  const team1AvgWinRate = getAverageWinRate(team1);
  const team2AvgWinRate = getAverageWinRate(team2);

  // Calculate factors
  const factors = [];

  // Rank difference factor (weighted 50%)
  const rankDiff = team1AvgRank - team2AvgRank;
  const rankScore = rankDiff * 5; // Each rank tier = 5% difference

  if (Math.abs(rankDiff) >= 0.5) {
    factors.push({
      text: `Higher Average Rank (${getRankName(rankDiff > 0 ? team1AvgRank : team2AvgRank)})`,
      favor: rankDiff > 0 ? "blue" : "red",
      impact: Math.abs(rankDiff) * 5
    });
  }

  // Win rate difference factor (weighted 35%)
  const winRateDiff = team1AvgWinRate - team2AvgWinRate;
  const winRateScore = winRateDiff * 0.35;

  if (Math.abs(winRateDiff) >= 3) {
    factors.push({
      text: `Better Recent Form (${Math.round(winRateDiff > 0 ? team1AvgWinRate : team2AvgWinRate)}% avg)`,
      favor: winRateDiff > 0 ? "blue" : "red",
      impact: Math.abs(winRateDiff) * 0.35
    });
  }

  // Consistency factor (weighted 15%)
  const team1Variance = calculateVariance(team1.map(p => RANK_VALUES[p.rank]));
  const team2Variance = calculateVariance(team2.map(p => RANK_VALUES[p.rank]));
  const varianceDiff = team2Variance - team1Variance; // Lower variance is better
  const consistencyScore = varianceDiff * 2;

  if (Math.abs(varianceDiff) >= 0.5) {
    factors.push({
      text: "More Consistent Team Ranks",
      favor: varianceDiff > 0 ? "blue" : "red",
      impact: Math.abs(varianceDiff) * 2
    });
  }

  // Check for high-rank players
  const team1HasHighRank = team1.some(p => RANK_VALUES[p.rank] >= 8);
  const team2HasHighRank = team2.some(p => RANK_VALUES[p.rank] >= 8);
  
  if (team1HasHighRank && !team2HasHighRank) {
    factors.push({
      text: "Has Master+ Player",
      favor: "blue",
      impact: 5
    });
  } else if (team2HasHighRank && !team1HasHighRank) {
    factors.push({
      text: "Has Master+ Player",
      favor: "red",
      impact: 5
    });
  }

  // Calculate total score
  const totalScore = rankScore + winRateScore + consistencyScore;
  
  // Convert to probability (sigmoid-like normalization)
  let team1Probability = 50 + totalScore;
  team1Probability = Math.max(15, Math.min(85, team1Probability)); // Clamp between 15-85%
  team1Probability = Math.round(team1Probability);
  
  const team2Probability = 100 - team1Probability;

  // Determine confidence
  let confidence;
  const probDiff = Math.abs(team1Probability - 50);
  if (probDiff >= 25) {
    confidence = "High";
  } else if (probDiff >= 10) {
    confidence = "Medium";
  } else {
    confidence = "Low";
  }

  // Determine winner
  const winner = team1Probability > 50 ? "Blue Team" : 
                 team1Probability < 50 ? "Red Team" : "Tie";

  // Sort factors by impact
  factors.sort((a, b) => b.impact - a.impact);

  return {
    team1Probability,
    team2Probability,
    confidence,
    factors: factors.slice(0, 4), // Top 4 factors
    winner
  };
}

function calculateVariance(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}