import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserPredictions, deletePrediction } from "../services/predictionServices";
import { useToast } from "../contexts/ToastContext";
import Navbar from "../components/layout/Navbar";
import Spinner from "../components/ui/Spinner";
import "../styles/history.css";

export default function History() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchPredictions() {
      if (!currentUser) return;
      
      setLoading(true);
      const result = await getUserPredictions(currentUser.uid);
      
      if (result.success) {
        setPredictions(result.data);
      } else {
        addToast("Failed to load predictions", "error");
      }
      
      setLoading(false);
    }
    
    fetchPredictions();
  }, [currentUser, addToast]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) {
      return;
    }
    
    setDeleting(id);
    const result = await deletePrediction(id);
    
    if (result.success) {
      setPredictions(predictions.filter(p => p.id !== id));
      addToast("Prediction deleted", "success");
    } else {
      addToast("Failed to delete prediction", "error");
    }
    
    setDeleting(null);
  };

  const stats = {
    total: predictions.length,
    completed: predictions.filter(p => p.outcome && p.outcome !== "pending").length,
    pending: predictions.filter(p => !p.outcome || p.outcome === "pending").length,
    correct: predictions.filter(p => p.wasCorrect === true).length,
    incorrect: predictions.filter(p => p.wasCorrect === false).length
  };
  
  const accuracy = stats.completed > 0 
    ? Math.round((stats.correct / stats.completed) * 100) 
    : null;

  const filteredPredictions = predictions.filter(p => {
    if (filter === "pending") return !p.outcome || p.outcome === "pending";
    if (filter === "completed") return p.outcome && p.outcome !== "pending";
    return true;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="history-page">
        <Navbar />
        <main className="container">
          <div className="loading-container">
            <Spinner size="large" text="Loading your predictions..." />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="history-page">
      <Navbar />
      
      <main className="container">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Prediction History</h1>
            <p className="muted">{stats.total} predictions total</p>
          </div>
          <div className="header-actions">
            <Link to="/dashboard/stats" className="btn btn-ghost">
              View Stats
            </Link>
            <Link to="/dashboard/create-match" className="btn btn-primary">
              + New Match
            </Link>
          </div>
        </div>

        {stats.completed > 0 && (
          <div className="accuracy-summary">
            <div className="accuracy-main">
              <span className={`accuracy-value ${accuracy >= 50 ? 'positive' : 'negative'}`}>
                {accuracy}%
              </span>
              <span className="accuracy-label">Accuracy</span>
            </div>
            <div className="accuracy-breakdown">
              <div className="breakdown-item correct">
                <span className="breakdown-value">{stats.correct}</span>
                <span className="breakdown-label">Correct</span>
              </div>
              <div className="breakdown-item incorrect">
                <span className="breakdown-value">{stats.incorrect}</span>
                <span className="breakdown-label">Incorrect</span>
              </div>
              <div className="breakdown-item pending">
                <span className="breakdown-value">{stats.pending}</span>
                <span className="breakdown-label">Pending</span>
              </div>
            </div>
          </div>
        )}

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {predictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h2>No predictions yet</h2>
            <p>Analyze a live match or create a match to start viewing your predictions!</p>
            <div className="empty-actions">
              <Link to="/dashboard/create-match" className="btn btn-primary">Create Match</Link>
              <Link to="/dashboard/live-game" className="btn btn-ghost">Live Game Lookup</Link>
            </div>
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div className="empty-state">
            <p>No {filter} predictions found</p>
            <button className="btn btn-ghost" onClick={() => setFilter('all')}>
              Show All
            </button>
          </div>
        ) : (
          <div className="predictions-list">
            {filteredPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                formatDate={formatDate}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PredictionCard({ prediction, formatDate, onDelete, deleting }) {
  const { id, team1, team2, result, createdAt, outcome, wasCorrect } = prediction;
  const team1Prob = result?.team1Probability || 50;
  const team2Prob = result?.team2Probability || 50;
  const predictedWinner = result?.winner || "team1";
  const isPending = !outcome || outcome === "pending";

  return (
    <div className={`prediction-card ${!isPending ? outcome : ''}`}>
      <Link to={`/dashboard/prediction/${id}`} className="prediction-card-link">
        <div className="prediction-card-header">
          <span className="prediction-date">{formatDate(createdAt)}</span>
          <div className="prediction-badges">
            {!isPending && (
              <span className={`outcome-pill ${outcome}`}>
                {outcome === "won" ? "Won" : "Lost"}
              </span>
            )}
            {wasCorrect !== null && (
              <span className={`accuracy-pill ${wasCorrect ? 'correct' : 'incorrect'}`}>
                {wasCorrect ? '✓' : '✗'}
              </span>
            )}
            {isPending && (
              <span className="outcome-pill pending">Pending</span>
            )}
          </div>
        </div>
        
        <div className="prediction-card-body">
          <div className="team-preview blue">
            <span className="team-label">Blue</span>
            <span className={`team-prob ${predictedWinner === 'team1' ? 'winner' : ''}`}>
              {team1Prob}%
            </span>
          </div>
          
          <span className="vs-text">vs</span>
          
          <div className="team-preview red">
            <span className={`team-prob ${predictedWinner === 'team2' ? 'winner' : ''}`}>
              {team2Prob}%
            </span>
            <span className="team-label">Red</span>
          </div>
        </div>
        
        <div className="prediction-card-footer">
          <span className="player-count">{team1.length + team2.length} players</span>
          <span className="confidence-text">{result?.confidence || 'Medium'} confidence</span>
        </div>
      </Link>
      
      <button
        className="delete-btn"
        onClick={(e) => { e.preventDefault(); onDelete(id); }}
        disabled={deleting === id}
        title="Delete prediction"
      >
        {deleting === id ? "..." : "×"}
      </button>
    </div>
  );
}