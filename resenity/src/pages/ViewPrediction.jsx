import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPrediction } from "../services/predictionServices";
import Navbar from "../components/layout/Navbar";
import Spinner from "../components/ui/Spinner";
import OutcomeSelector from "../components/prediction/OutcomeSelector";
import "../styles/view-prediction.css";

export default function ViewPrediction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrediction() {
      if (!currentUser || !id) return;
      
      setLoading(true);
      const result = await getPrediction(id);
      
      if (result.success) {
        if (result.data.userId !== currentUser.uid) {
          setError("You don't have permission to view this prediction.");
        } else {
          setPrediction(result.data);
        }
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    }
    
    fetchPrediction();
  }, [currentUser, id]);

  const handleOutcomeUpdate = ({ outcome, wasCorrect }) => {
    setPrediction(prev => ({
      ...prev,
      outcome,
      wasCorrect
    }));
  };

  if (loading) {
    return (
      <div className="view-prediction-page">
        <Navbar />
        <main className="container">
          <div className="loading-container">
            <Spinner size="large" text="Loading prediction..." />
          </div>
        </main>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="view-prediction-page">
        <Navbar />
        <main className="container">
          <div className="error-container">
            <h2>{error || "Prediction not found"}</h2>
            <Link to="/dashboard/history" className="btn btn-ghost">
              Back to History
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { team1, team2, result, createdAt, outcome, wasCorrect } = prediction;
  const team1WinProbability = result?.team1Probability || 50;
  const team2WinProbability = result?.team2Probability || 50;
  const predictedWinner = result?.winner || "team1";
  const confidence = result?.confidence || "Medium";
  const factors = result?.factors || [];

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="view-prediction-page">
      <Navbar />
      
      <main className="container">
        <div className="page-header">
          <div className="page-header-content">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h1>Match Prediction</h1>
            <p className="muted">{formatDate(createdAt)}</p>
          </div>
          
          {outcome && outcome !== "pending" && (
            <div className={`outcome-badge ${outcome}`}>
              {outcome === "won" ? "🏆 Victory" : "💀 Defeat"}
              {wasCorrect !== null && (
                <span className={`accuracy-badge ${wasCorrect ? 'correct' : 'incorrect'}`}>
                  {wasCorrect ? '✓ Predicted' : '✗ Missed'}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="prediction-summary">
          <div className={`team-probability ${predictedWinner === 'team1' ? 'winner' : ''}`}>
            <span className="team-name">Blue Team</span>
            <span className="probability">{team1WinProbability}%</span>
          </div>
          
          <div className="vs-divider">
            <span className="confidence-badge">{confidence} Confidence</span>
          </div>
          
          <div className={`team-probability ${predictedWinner === 'team2' ? 'winner' : ''}`}>
            <span className="team-name">Red Team</span>
            <span className="probability">{team2WinProbability}%</span>
          </div>
        </div>

        <div className="teams-comparison">
          <div className="team-card blue">
            <h3>
              Blue Team
              {predictedWinner === 'team1' && <span className="predicted-tag">Predicted Winner</span>}
            </h3>
            <div className="players-list">
              {team1.map((player, i) => (
                <div key={i} className="player-row">
                  <div className="player-role-info">
                    {player.role && <span className="role-badge">{player.role}</span>}
                    {player.champion && <span className="champion-name">{player.champion}</span>}
                  </div>
                  <span className="player-name">{player.name || `Player ${i + 1}`}</span>
                  <span className="player-stats">
                    {player.rank || "Unranked"} • {player.winRate || 50}% WR
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="vs-badge">
            <span>VS</span>
          </div>

          <div className="team-card red">
            <h3>
              Red Team
              {predictedWinner === 'team2' && <span className="predicted-tag">Predicted Winner</span>}
            </h3>
            <div className="players-list">
              {team2.map((player, i) => (
                <div key={i} className="player-row">
                  <div className="player-role-info">
                    {player.role && <span className="role-badge">{player.role}</span>}
                    {player.champion && <span className="champion-name">{player.champion}</span>}
                  </div>
                  <span className="player-name">{player.name || `Player ${i + 1}`}</span>
                  <span className="player-stats">
                    {player.rank || "Unranked"} • {player.winRate || 50}% WR
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {factors.length > 0 && (
          <div className="factors-section">
            <h3>Key Factors</h3>
            <ul className="factors-list">
              {factors.map((factor, i) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
          </div>
        )}

        <OutcomeSelector
          predictionId={id}
          currentOutcome={outcome}
          predictedWinner={predictedWinner}
          wasCorrect={wasCorrect}
          onOutcomeUpdate={handleOutcomeUpdate}
        />

        <div className="action-buttons">
          <Link to="/dashboard/history" className="btn btn-ghost">
            View All Predictions
          </Link>
          <Link to="/dashboard/stats" className="btn btn-primary">
            View My Stats
          </Link>
        </div>
      </main>
    </div>
  );
}