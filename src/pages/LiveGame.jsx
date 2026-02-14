import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Navbar from "../components/layout/Navbar";
import PredictionResult from "../components/match/PredictionResult";
import Spinner from "../components/ui/Spinner";
import { fetchLiveGame } from "../services/liveGameService";
import { getDeepAnalysis } from "../services/riotService";
import { calculatePrediction } from "../utils/prediction";
import { savePrediction } from "../services/predictionServices";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/live-game.css";

const ROLE_LABELS = {
  top: "Top",
  jungle: "JG",
  mid: "Mid",
  adc: "ADC",
  support: "Sup"
};

function getMasteryBadge(level) {
  if (level >= 7) return { label: "M7", className: "mastery-7" };
  if (level >= 6) return { label: "M6", className: "mastery-6" };
  if (level >= 5) return { label: "M5", className: "mastery-5" };
  if (level >= 4) return { label: "M4", className: "mastery-4" };
  return null;
}

function formatGamesPlayed(games) {
  if (games >= 1000) return `${(games / 1000).toFixed(1)}k`;
  return games.toString();
}

export default function LiveGame() {
  usePageTitle("Live Game Lookup");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();

  const [riotId, setRiotId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [gameData, setGameData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [deepAnalysisData, setDeepAnalysisData] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const trimmedId = riotId.trim();
    if (!trimmedId) {
      setSearchError("Please enter a Riot ID");
      return;
    }

    const parts = trimmedId.split('#');
    if (parts.length !== 2) {
      setSearchError("Use format: Name#TAG (e.g., Player#NA1)");
      return;
    }

    const [gameName, tagLine] = parts;

    setIsSearching(true);
    setSearchError("");
    setGameData(null);
    setPrediction(null);
    setSaved(false);
    setDeepAnalysisData(null);
    setAnalysisProgress(0);

    const result = await fetchLiveGame(gameName, tagLine);

    setIsSearching(false);

    if (result.success) {
      setGameData(result.game);
      
      const predictionResult = calculatePrediction(
        result.game.blueTeam,
        result.game.redTeam
      );
      setPrediction(predictionResult);
    } else {
      setSearchError(result.error);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!gameData) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const allPlayers = [
        ...gameData.blueTeam.map(p => ({ ...p, teamSide: 'blue' })),
        ...gameData.redTeam.map(p => ({ ...p, teamSide: 'red' }))
      ];
      
      const analysisResults = [];
      
      for (let i = 0; i < allPlayers.length; i++) {
        const player = allPlayers[i];
        
        if (player.puuid && player.championId) {
          try {
            const response = await fetch(
              `/api/riot/match-history?puuid=${encodeURIComponent(player.puuid)}&championId=${player.championId}&count=20`
            );
            const data = await response.json();
            
            analysisResults.push({
              playerName: player.name,
              champion: player.champion,
              teamSide: player.teamSide,
              ...(data.success ? data.data : {
                championGames: 0,
                championWins: 0,
                championWinRate: 50
              })
            });
          } catch (err) {
            analysisResults.push({
              playerName: player.name,
              champion: player.champion,
              teamSide: player.teamSide,
              championGames: 0,
              championWins: 0,
              championWinRate: 50
            });
          }
        } else {
          analysisResults.push({
            playerName: player.name,
            champion: player.champion,
            teamSide: player.teamSide,
            championGames: 0,
            championWins: 0,
            championWinRate: 50
          });
        }
        
        setAnalysisProgress(Math.round(((i + 1) / allPlayers.length) * 100));
        
        if (i < allPlayers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      setDeepAnalysisData(analysisResults);
      
      const blueTeamWithAnalysis = gameData.blueTeam.map(player => {
        const analysis = analysisResults.find(
          a => a.playerName === player.name && a.teamSide === 'blue'
        );
        return { ...player, deepAnalysis: analysis };
      });
      
      const redTeamWithAnalysis = gameData.redTeam.map(player => {
        const analysis = analysisResults.find(
          a => a.playerName === player.name && a.teamSide === 'red'
        );
        return { ...player, deepAnalysis: analysis };
      });
      
      const newPrediction = calculatePrediction(
        blueTeamWithAnalysis,
        redTeamWithAnalysis,
        true
      );
      
      setPrediction(newPrediction);
      success("Deep analysis complete!");
      
    } catch (err) {
      showError("Failed to complete deep analysis");
      console.error("Deep analysis error:", err);
    }
    
    setIsAnalyzing(false);
  };

  const handleSave = async () => {
    if (!prediction || !currentUser || !gameData) return;

    setIsSaving(true);

    const result = await savePrediction(currentUser.uid, {
      team1: gameData.blueTeam,
      team2: gameData.redTeam,
      result: prediction,
      gameId: gameData.gameId,
      gameMode: gameData.gameMode,
      source: 'live-game',
      deepAnalysisUsed: prediction.deepAnalysisUsed || false
    });

    setIsSaving(false);

    if (result.success) {
      setSaved(true);
      success("Prediction saved successfully!");
    } else {
      showError("Failed to save prediction");
    }
  };

  const formatGameTime = (startTime) => {
    if (!startTime) return "In Progress";
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getChampionWinRateDisplay = (playerName, teamSide) => {
    if (!deepAnalysisData) return null;
    
    const analysis = deepAnalysisData.find(
      a => a.playerName === playerName && a.teamSide === teamSide
    );
    
    if (!analysis || analysis.championGames < 1) return null;
    
    const { championWinRate, championGames } = analysis;
    const colorClass = championWinRate >= 55 ? 'win-rate-good' : 
                       championWinRate <= 45 ? 'win-rate-bad' : 
                       'win-rate-neutral';
    
    return (
      <span className={`champion-win-rate ${colorClass}`} title="Champion-specific win rate">
        {championWinRate}% ({championGames}g)
      </span>
    );
  };

  return (
    <div className="page">
      <Navbar />
      <main className="live-game-page">
        <div className="container">
          <header className="page-header">
            <div className="page-header-content">
              <h1>Live Game Lookup</h1>
              <p className="muted">Enter a Riot ID to analyze their current game</p>
            </div>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>
          </header>

          <form onSubmit={handleSearch} className="live-game-search">
            <div className="search-box">
              <input
                type="text"
                value={riotId}
                onChange={(e) => setRiotId(e.target.value)}
                placeholder="Enter Riot ID (e.g., Doublelift#NA1)"
                disabled={isSearching}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSearching}
              >
                {isSearching ? <Spinner size="small" /> : "Find Game"}
              </button>
            </div>
            {searchError && <p className="error-message">{searchError}</p>}
          </form>

          {isSearching && (
            <div className="search-loading">
              <Spinner size="large" text="Searching for active game..." />
            </div>
          )}

          {gameData && !isSearching && (
            <>
              <div className="game-info">
                <span className="game-mode">{gameData.gameMode}</span>
                <span className="game-time">⏱ {formatGameTime(gameData.gameStartTime)}</span>
                {prediction?.deepAnalysisUsed && (
                  <span className="deep-analysis-badge">🔬 Deep Analysis</span>
                )}
              </div>

              <div className="teams-comparison">
                <div className="team-card blue">
                  <h3>Blue Team</h3>
                  <ul className="player-list">
                    {gameData.blueTeam.map((player, index) => (
                      <li key={index} className="player-row">
                        <div className="player-role-champion">
                          <span className="player-role">{ROLE_LABELS[player.role]}</span>
                          <div className="champion-info">
                            <span className="player-champion">{player.champion || 'Unknown'}</span>
                            {player.championMastery && getMasteryBadge(player.championMastery.championLevel) && (
                              <span className={`mastery-badge ${getMasteryBadge(player.championMastery.championLevel).className}`}>
                                {getMasteryBadge(player.championMastery.championLevel).label}
                              </span>
                            )}
                            {player.championMastery && player.championMastery.gamesPlayed > 0 && (
                              <span className="games-played" title="Estimated games on this champion">
                                {formatGamesPlayed(player.championMastery.gamesPlayed)} games
                              </span>
                            )}
                            {getChampionWinRateDisplay(player.name, 'blue')}
                          </div>
                        </div>
                        <span className="player-name">{player.name}</span>
                        <span className="player-stats">
                          {player.rank} • {player.winRate}%
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
                        <div className="player-role-champion">
                          <span className="player-role">{ROLE_LABELS[player.role]}</span>
                          <div className="champion-info">
                            <span className="player-champion">{player.champion || 'Unknown'}</span>
                            {player.championMastery && getMasteryBadge(player.championMastery.championLevel) && (
                              <span className={`mastery-badge ${getMasteryBadge(player.championMastery.championLevel).className}`}>
                                {getMasteryBadge(player.championMastery.championLevel).label}
                              </span>
                            )}
                            {player.championMastery && player.championMastery.gamesPlayed > 0 && (
                              <span className="games-played" title="Estimated games on this champion">
                                {formatGamesPlayed(player.championMastery.gamesPlayed)} games
                              </span>
                            )}
                            {getChampionWinRateDisplay(player.name, 'red')}
                          </div>
                        </div>
                        <span className="player-name">{player.name}</span>
                        <span className="player-stats">
                          {player.rank} • {player.winRate}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {!deepAnalysisData && !isAnalyzing && (
                <div className="deep-analysis-section">
                  <button 
                    className="btn btn-secondary deep-analysis-btn"
                    onClick={handleDeepAnalysis}
                  >
                    🔬 Run Deep Analysis
                  </button>
                  <p className="deep-analysis-info">
                    Fetches champion-specific win rates from recent ranked games for more accurate predictions.
                    <br />
                    <span className="muted">This may take 10-20 seconds.</span>
                  </p>
                </div>
              )}

              {/* Deep Analysis Progress */}
              {isAnalyzing && (
                <div className="deep-analysis-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    Analyzing players... {analysisProgress}%
                  </p>
                </div>
              )}

              {/* Deep Analysis Complete Badge */}
              {deepAnalysisData && !isAnalyzing && (
                <div className="deep-analysis-complete">
                  <span className="complete-badge">✓ Deep Analysis Complete</span>
                  <p className="muted">Champion-specific win rates have been factored into the prediction.</p>
                </div>
              )}

              {prediction && (
                <>
                  <PredictionResult prediction={prediction} />

                  <div className="save-section">
                    {saved ? (
                      <div className="save-success">
                        <span>✓ Prediction saved!</span>
                        <button 
                          className="btn btn-ghost"
                          onClick={() => navigate("/dashboard/history")}
                        >
                          View History
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Prediction"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {!gameData && !isSearching && (
            <div className="instructions">
              <h3>How to Use</h3>
              <ol>
                <li>Enter your Riot ID or any player's Riot ID (e.g., <strong>Doublelift#NA1</strong>)</li>
                <li>Make sure the player is currently in an active game</li>
                <li>Click "Find Game" to fetch all players and their stats</li>
                <li>Optionally run <strong>Deep Analysis</strong> for champion-specific win rates</li>
                <li>View the prediction and save it to track accuracy</li>
              </ol>
              <p className="note">
                Note: The player must be in an active game for this to work. 
                Champion select and post-game lobbies are not detected.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}