import { useState } from "react";
import { updatePredictionOutcome, clearPredictionOutcome } from "../../services/predictionServices";
import "./OutcomeSelector.css";

export default function OutcomeSelector({ 
  predictionId, 
  currentOutcome, 
  predictedWinner,
  wasCorrect,
  onOutcomeUpdate 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOutcomeSelect = async (outcome) => {
    if (currentOutcome === outcome) {
      setLoading(true);
      setError(null);
      
      const result = await clearPredictionOutcome(predictionId);
      
      if (result.success) {
        onOutcomeUpdate({ outcome: "pending", wasCorrect: null });
      } else {
        setError("Failed to update. Please try again.");
      }
      
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const result = await updatePredictionOutcome(predictionId, outcome, predictedWinner);
    
    if (result.success) {
      onOutcomeUpdate({ outcome, wasCorrect: result.wasCorrect });
    } else {
      setError("Failed to update. Please try again.");
    }
    
    setLoading(false);
  };

  const isPending = !currentOutcome || currentOutcome === "pending";

  return (
    <div className="outcome-selector">
      <div className="outcome-header">
        <h3>Match Result</h3>
        <p className="outcome-subtitle">
          {isPending 
            ? "How did the game end?" 
            : "Click again to change"}
        </p>
      </div>
      
      <div className="outcome-buttons">
        <button
          className={`outcome-btn won ${currentOutcome === "won" ? "selected" : ""}`}
          onClick={() => handleOutcomeSelect("won")}
          disabled={loading}
        >
          <span className="outcome-icon">🏆</span>
          <span className="outcome-label">We Won</span>
        </button>
        
        <button
          className={`outcome-btn lost ${currentOutcome === "lost" ? "selected" : ""}`}
          onClick={() => handleOutcomeSelect("lost")}
          disabled={loading}
        >
          <span className="outcome-icon">💀</span>
          <span className="outcome-label">We Lost</span>
        </button>
      </div>
      
      {error && <p className="outcome-error">{error}</p>}
      
      {!isPending && wasCorrect !== null && (
        <div className={`prediction-accuracy ${wasCorrect ? "correct" : "incorrect"}`}>
          {wasCorrect ? (
            <>
              <span className="accuracy-icon">✓</span>
              <span>Resenity predicted correctly!</span>
            </>
          ) : (
            <>
              <span className="accuracy-icon">✗</span>
              <span>Resenity missed this one</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}