import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import PredictionResult from "../components/match/PredictionResult";
import { checkLiveGame } from "../services/liveGameService";
import { calculatePrediction } from "../utils/prediction";
import "../styles/live-game.css";

export default function LiveGame() {
  const navigate = useNavigate();
  
  const [riotId, setRiotId] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [gameData, setGameData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleCheck = async () => {
    const trimmed = riotId.trim();
    
    if (!trimmed) {
      setError("Enter your Riot ID (e.g., Name#TAG)");
      return;
    }

    const parts = trimmed.split('#');
    if (parts.length !== 2) {
      setError("Use format: Name#TAG");
      return;
    }

    const [gameName, tagLine] = parts;
    
    setIsChecking(true);
    setError("");
    setGameData(null);
    setPrediction(null);

    const result = await checkLiveGame(gameName, tagLine);
    
    setIsChecking(false);

    if (!result.success) {
      setError(result.error || "Failed to check live game");
      return;
    }

    if (!result.inGame) {
      setError("You're not currently in a game. Queue up and try again!");
      return;
    }

    setGameData(result);

    // Calculate prediction from the live game data
    const team1 = result.blueTeam.map(p => ({
      name: p.name,
      rank: p.rank,
      winRate: p.winRate
    }));

    const team2 = result.redTeam.map(p => ({
      name: p.name,
      rank: p.rank,
      winRate: p.winRate
    }));

    // Pad teams to 5 if needed
    while (team1.length < 5) {
      team1.push({ name: "Unknown", rank: "Gold", winRate: 50 });
    }
    while (team2.length < 5) {
      team2.push({ name: "Unknown", rank: "Gold", winRate: 50 });
    }

    const pred = calculatePrediction(team1, team2);
    setPrediction(pred);
  };

  const normalizeRank = (rank) => {
    const validRanks = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"];
    if (validRanks.includes(rank)) return rank;
    return "Unranked";
  };

  return (
    <div className="page">
      <Navbar />
      <main className="live-game-page">
        <div className="container">
          <header className="page-header">
            <div className="page-header-content">
              <h1>Live Game Lookup</h1>
              <p className="muted">Enter your Riot ID to analyze your current match</p>
            </div>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>
          </header>

          <div className="live-game-search">
            <div className="search-box">
              <input
                type="text"
                value={riotId}
                onChange={(e) => setRiotId(e.target.value)}
                placeholder="Enter your Riot ID (e.g., Speedyx512#NA1)"
                onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              />
              <button 
                className="btn btn-primary"
                onClick={handleCheck}
                disabled={isChecking}
              >
                {isChecking ? "Checking..." : "Find My Game"}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          {gameData && (
            <div className="live-game-results">
              <div className="game-info">
                <span className="game-mode">{gameData.gameMode}</span>
                {gameData.gameLength > 0 && (
                  <span className="game-time">
                    {Math.floor(gameData.gameLength / 60)}:{String(gameData.gameLength % 60).padStart(2, '0')} elapsed
                  </span>
                )}
              </div>

              <div className="teams-comparison">
                <div className="team-card blue">
                  <h3>Blue Team</h3>
                  <ul className="player-list">
                    {gameData.blueTeam.map((player, index) => (
                      <li key={index} className="player-row">
                        <span className="player-name">{player.name}</span>
                        <span className="player-stats">
                          {normalizeRank(player.rank)} • {player.winRate}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="vs-badge">VS</div>

                <div className="team-card red">
                  <h3>Red Team</h3>
                  <ul className="player-list">
                    {gameData.redTeam.map((player, index) => (
                      <li key={index} className="player-row">
                        <span className="player-name">{player.name}</span>
                        <span className="player-stats">
                          {normalizeRank(player.rank)} • {player.winRate}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {prediction && (
                <PredictionResult prediction={prediction} />
              )}
            </div>
          )}

          {!gameData && !isChecking && !error && (
            <div className="instructions">
              <h3>How it works</h3>
              <ol>
                <li>Start a League of Legends match (Ranked, Normal, etc.)</li>
                <li>Once you're in the loading screen or in-game, come back here</li>
                <li>Enter your Riot ID and click "Find My Game"</li>
                <li>See instant predictions for all 10 players!</li>
              </ol>
              <p className="note">
                Note: Works after champion select ends (loading screen or in-game). 
                For champion select analysis, a desktop app would be needed.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}