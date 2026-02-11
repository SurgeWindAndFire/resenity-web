import { memo } from "react";
import "../../styles/match.css";

function PredictionResult({ prediction }) {
  if (!prediction) return null;
  
  const { 
    team1Probability = 50, 
    team2Probability = 50, 
    confidence = "Medium", 
    factors = [], 
    winner = "Blue Team" 
  } = prediction;

  return (
    <div className="prediction-result">
      <header className="result-header">
        <h2>Prediction Result</h2>
        <span className={`confidence-badge ${confidence.toLowerCase()}`}>
          {confidence} Confidence
        </span>
      </header>

      <div className="result-content">
        <div className="probability-display">
          <div className="team-prob blue">
            <span className="team-label">Blue Team</span>
            <span className="prob-value">{team1Probability}%</span>
          </div>
          
          <div className="prob-bar">
            <div 
              className="prob-fill blue" 
              style={{ width: `${team1Probability}%` }}
            />
            <div 
              className="prob-fill red" 
              style={{ width: `${team2Probability}%` }}
            />
          </div>
          
          <div className="team-prob red">
            <span className="team-label">Red Team</span>
            <span className="prob-value">{team2Probability}%</span>
          </div>
        </div>

        <div className="winner-announcement">
          <p>
            <strong>{winner}</strong> is predicted to win
          </p>
        </div>

        <div className="factors-section">
          <h3>Key Factors</h3>
          <div className="factors-list">
            {factors.length > 0 ? (
              factors.map((factor, index) => (
                <div key={index} className={`factor-chip ${factor.favor}`}>
                  <span className="factor-text">{factor.text}</span>
                  <span className="factor-team">{factor.favor === "blue" ? "Blue" : "Red"}</span>
                </div>
              ))
            ) : (
              <p className="muted">Teams are evenly matched</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PredictionResult);