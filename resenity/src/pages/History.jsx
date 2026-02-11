import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import { useToast } from "../contexts/ToastContext";
import { getUserPredictions, deletePrediction } from "../services/predictionServices";
import { SkeletonCard } from "../components/ui/Skeleton";
import "../styles/history.css";
import usePageTitle from "../hooks/usePageTitle";

export default function History() {
  usePageTitle("Prediction History");
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPredictions() {
      if (!currentUser) return;
      
      setLoading(true);
      const result = await getUserPredictions(currentUser.uid);
      
      if (result.success) {
        setPredictions(result.predictions);
      } else {
        setError("Failed to load predictions");
      }
      setLoading(false);
    }
    
    fetchPredictions();
  }, [currentUser]);

  const handleDelete = async (predictionId) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) {
      return;
    }
    
    const result = await deletePrediction(predictionId);
    
    if (result.success) {
      setPredictions(predictions.filter(p => p.id !== predictionId));
      success("Prediction deleted");
    } else {
      showError("Failed to delete prediction");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="page">
      <Navbar />
      <main className="history-page">
        <div className="container">
          <header className="page-header">
            <div className="page-header-content">
              <h1>Prediction History</h1>
              <p className="muted">View all your past predictions</p>
            </div>
            <Link to="/dashboard" className="btn btn-ghost">
              ← Back to Dashboard
            </Link>
          </header>

          {loading ? (
            <div className="predictions-list">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="empty-state">
              <h3>No predictions yet</h3>
              <p className="muted">Create your first match prediction to see it here!</p>
              <Link to="/dashboard/create-match" className="btn btn-primary">
                Create Match
              </Link>
            </div>
          ) : (
            <div className="predictions-list">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="prediction-card">
                  <div className="prediction-card-header">
                    <span className="prediction-date">
                      {formatDate(prediction.createdAt)}
                    </span>
                    <span className={`confidence-badge ${prediction.result.confidence.toLowerCase()}`}>
                      {prediction.result.confidence}
                    </span>
                  </div>
                  
                  <div className="prediction-card-body">
                    <div className="teams-summary">
                      <div className="team-summary blue">
                        <span className="team-name">Blue Team</span>
                        <span className="team-prob">{prediction.result.team1Probability}%</span>
                      </div>
                      <span className="vs">vs</span>
                      <div className="team-summary red">
                        <span className="team-name">Red Team</span>
                        <span className="team-prob">{prediction.result.team2Probability}%</span>
                      </div>
                    </div>
                    
                    <div className="winner-text">
                      <strong>{prediction.result.winner}</strong> predicted to win
                    </div>
                  </div>
                  
                  <div className="prediction-card-actions">
                    <Link 
                      to={`/dashboard/prediction/${prediction.id}`} 
                      className="btn btn-ghost btn-sm"
                    >
                      View Details
                    </Link>
                    <button 
                      className="btn btn-ghost btn-sm btn-danger"
                      onClick={() => handleDelete(prediction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}