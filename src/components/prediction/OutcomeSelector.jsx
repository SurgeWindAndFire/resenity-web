import { useState } from "react";
import { updatePredictionOutcome } from "../../services/predictionServices";
import "./OutcomeSelector.css";

export default function OutcomeSelector({ 
  predictionId, 
  currentOutcome, 
  predictedWinner,
  wasCorrect,
  onOutcomeUpdate 
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(currentOutcome);
  
  const isLocked = currentOutcome && currentOutcome !== "pending";
  
  const handleOutcomeSelect = async (outcome) => {
    if (isLocked || isUpdating) return;
    
    if (outcome === selectedOutcome) return;
    
    setIsUpdating(true);
    setSelectedOutcome(outcome);
    
    const wasCorrectResult = 
      (outcome === "won" && predictedWinner === "team1") ||
      (outcome === "lost" && predictedWinner === "team2");
    
    const result = await updatePredictionOutcome(predictionId, outcome, wasCorrectResult);
    
    setIsUpdating(false);
    
    if (result.success) {
      onOutcomeUpdate?.({ outcome, wasCorrect: wasCorrectResult });
    } else {
      setSelectedOutcome(currentOutcome);
    }
  };
  
  return (
    <div className={`outcome-selector ${isLocked ? 'locked' : ''}`}>
      <div className="outcome-header">
        <h3>Match Result</h3>
        {isLocked ? (
          <p className="outcome-locked-message">Result recorded</p>
        ) : (
          <p className="outcome-subtitle">Select the outcome of your match</p>
        )}
      </div>
      
      <div className="outcome-buttons">
        <button
          className={`outcome-btn won ${selectedOutcome === "won" ? "selected" : ""}`}
          onClick={() => handleOutcomeSelect("won")}
          disabled={isUpdating || isLocked}
        >
          <span className="outcome-icon">🏆</span>
          <span className="outcome-label">We Won</span>
        </button>
        
        <button
          className={`outcome-btn lost ${selectedOutcome === "lost" ? "selected" : ""}`}
          onClick={() => handleOutcomeSelect("lost")}
          disabled={isUpdating || isLocked}
        >
          <span className="outcome-icon">💀</span>
          <span className="outcome-label">We Lost</span>
        </button>
      </div>
      
      {isLocked && wasCorrect !== null && (
        <div className={`prediction-accuracy ${wasCorrect ? 'correct' : 'incorrect'}`}>
          <span className="accuracy-icon">{wasCorrect ? '✓' : '✗'}</span>
          {wasCorrect 
            ? "Resenity predicted correctly!" 
            : "Resenity missed this one"
          }
        </div>
      )}
    </div>
  );
}