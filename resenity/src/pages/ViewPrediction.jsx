import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import PredictionResult from "../components/match/PredictionResult";
import { getPredictionById, deletePrediction } from "../services/predictionServices";
import "../styles/history.css";
import usePageTitle from "../hooks/usePageTitle";

export default function ViewPrediction() {
  usePageTitle("View Prediction");
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrediction() {
      setLoading(true);
      const result = await getPredictionById(id);
      
      if (result.success) {
        if (result.prediction.userId !== currentUser?.uid) {
          setError("You don't have permission to view this prediction");
        } else {
          setPrediction(result.prediction);
        }
      } else {
        setError("Prediction not found");
      }
      setLoading(false);
    }
    
    fetchPrediction();
  }, [id, currentUser]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) {
      return;
    }
    
    const result = await deletePrediction(id);
    
    if (result.success) {
      navigate("/dashboard/history");
    } else {
      alert("Failed to delete prediction");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="page">
      <Navbar />
      <main className="view-prediction-page">
        <div className="container">
          <header className="page-header">
            <div className="page-header-content">
              <h1>Prediction Details</h1>
              {prediction && (
                <p className="muted">{formatDate(prediction.createdAt)}</p>
              )}
            </div>
            <Link to="/dashboard/history" className="btn btn-ghost">
              ← Back to History
            </Link>
          </header>

          {loading ? (
            <div className="loading-state">
              <p>Loading prediction...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <Link to="/dashboard/history" className="btn btn-primary">
                Go to History
              </Link>
            </div>
          ) : prediction ? (
            <>
              <div className="teams-detail">
                <div className="team-detail blue">
                  <h3>Blue Team</h3>
                  <ul className="players-detail-list">
                    {prediction.team1.map((player, index) => (
                      <li key={index}>
                        <span className="player-name">{player.name}</span>
                        <span className="player-stats">
                          {player.rank} • {player.winRate}% WR
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="team-detail red">
                  <h3>Red Team</h3>
                  <ul className="players-detail-list">
                    {prediction.team2.map((player, index) => (
                      <li key={index}>
                        <span className="player-name">{player.name}</span>
                        <span className="player-stats">
                          {player.rank} • {player.winRate}% WR
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <PredictionResult prediction={prediction.result} />
              
              <div className="prediction-actions">
                <button 
                  className="btn btn-ghost btn-danger"
                  onClick={handleDelete}
                >
                  Delete Prediction
                </button>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}