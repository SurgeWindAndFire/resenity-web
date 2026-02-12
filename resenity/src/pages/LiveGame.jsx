import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Navbar from "../components/layout/Navbar";
import PredictionResult from "../components/match/PredictionResult";
import Spinner from "../components/ui/Spinner";
import { fetchLiveGame } from "../services/liveGameService";
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

  const handleSave = async () => {
    if (!prediction || !currentUser || !gameData) return;

    setIsSaving(true);

    const result = await savePrediction(currentUser.uid, {
      team1: gameData.blueTeam,
      team2: gameData.redTeam,
      result: prediction,
      gameId: gameData.gameId,
      gameMode: gameData.gameMode,
      source: 'live-game'
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
              </div>

              <div className="teams-comparison">
                <div className="team-card blue">
                  <h3>Blue Team</h3>
                  <ul className="player-list">
                    {gameData.blueTeam.map((player, index) => (
                      <li key={index} className="player-row">
                        <div className="player-role-champion">
                          <span className="player-role">{ROLE_LABELS[player.role]}</span>
                          {player.champion && (
                            <span className="player-champion">{player.champion}</span>
                          )}
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
                          {player.champion && (
                            <span className="player-champion">{player.champion}</span>
                          )}
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