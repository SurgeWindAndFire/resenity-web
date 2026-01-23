import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import TeamBuilder from "../components/match/TeamBuilder";
import PredictionResult from "../components/match/PredictionResult";
import { calculatePrediction } from "../utils/prediction";
import "../styles/match.css";

const emptyPlayer = { name: "", rank: "Gold", winRate: 50 };

const createEmptyTeam = () => Array(5).fill(null).map(() => ({ ...emptyPlayer }));

export default function CreateMatch() {
  const navigate = useNavigate();
  
  const [team1, setTeam1] = useState(createEmptyTeam());
  const [team2, setTeam2] = useState(createEmptyTeam());
  const [prediction, setPrediction] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate a brief calculation delay for UX
    setTimeout(() => {
      const result = calculatePrediction(team1, team2);
      setPrediction(result);
      setIsCalculating(false);
    }, 800);
  };

  const handleReset = () => {
    setTeam1(createEmptyTeam());
    setTeam2(createEmptyTeam());
    setPrediction(null);
  };

  const isTeamValid = (team) => {
    return team.every(player => player.name.trim() !== "");
  };

  const canCalculate = isTeamValid(team1) && isTeamValid(team2);

  return (
    <div className="page">
      <Navbar />
      <main className="create-match">
        <div className="container">
          <header className="page-header">
            <div className="page-header-content">
              <h1>Create Match</h1>
              <p className="muted">Enter player details for both teams to get a prediction</p>
            </div>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>
          </header>

          <div className="match-builder">
            <div className="teams-container">
              <TeamBuilder 
                team={team1} 
                setTeam={setTeam1} 
                teamName="Blue Team"
                teamColor="blue"
              />
              
              <div className="vs-divider">
                <span>VS</span>
              </div>
              
              <TeamBuilder 
                team={team2} 
                setTeam={setTeam2} 
                teamName="Red Team"
                teamColor="red"
              />
            </div>

            <div className="match-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleCalculate}
                disabled={!canCalculate || isCalculating}
              >
                {isCalculating ? "Calculating..." : "Calculate Prediction"}
              </button>
              <button 
                className="btn btn-ghost"
                onClick={handleReset}
              >
                Reset Teams
              </button>
            </div>

            {!canCalculate && (
              <p className="validation-hint muted">
                Please fill in all player names to calculate prediction
              </p>
            )}
          </div>

          {prediction && (
            <PredictionResult prediction={prediction} />
          )}
        </div>
      </main>
    </div>
  );
}