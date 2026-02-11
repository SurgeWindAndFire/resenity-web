import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import PredictionResult from "../components/match/PredictionResult";
import { calculatePrediction } from "../utils/prediction";
import "../styles/demo.css";
import usePageTitle from "../hooks/usePageTitle";

const DEMO_BLUE_TEAM = [
  { name: "ProPlayer1#NA1", rank: "Diamond", winRate: 58 },
  { name: "MidLaner99#NA1", rank: "Platinum", winRate: 52 },
  { name: "JungleDiff#NA1", rank: "Diamond", winRate: 55 },
  { name: "BotCarry#NA1", rank: "Emerald", winRate: 49 },
  { name: "Support4Life#NA1", rank: "Platinum", winRate: 51 }
];

const DEMO_RED_TEAM = [
  { name: "Enemy1#NA1", rank: "Platinum", winRate: 48 },
  { name: "Enemy2#NA1", rank: "Emerald", winRate: 50 },
  { name: "Enemy3#NA1", rank: "Platinum", winRate: 46 },
  { name: "Enemy4#NA1", rank: "Gold", winRate: 53 },
  { name: "Enemy5#NA1", rank: "Emerald", winRate: 47 }
];

export default function Demo() {
  usePageTitle("Demo");
  const [prediction, setPrediction] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const result = calculatePrediction(DEMO_BLUE_TEAM, DEMO_RED_TEAM);
    setPrediction(result);
    setHasCalculated(true);
  };

  return (
    <div className="page">
      <Navbar />
      <main className="demo-page">
        <div className="container">
          <header className="demo-header">
            <h1>See Resenity in Action</h1>
            <p className="muted">
              This demo shows how Resenity analyzes teams and predicts match outcomes.
              Sign up to use real player data and save your predictions!
            </p>
          </header>

          <div className="demo-content">
            <div className="demo-teams">
              <div className="demo-team blue">
                <h3>Blue Team</h3>
                <ul>
                  {DEMO_BLUE_TEAM.map((player, index) => (
                    <li key={index}>
                      <span className="player-name">{player.name}</span>
                      <span className="player-stats">{player.rank} • {player.winRate}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="demo-vs">VS</div>

              <div className="demo-team red">
                <h3>Red Team</h3>
                <ul>
                  {DEMO_RED_TEAM.map((player, index) => (
                    <li key={index}>
                      <span className="player-name">{player.name}</span>
                      <span className="player-stats">{player.rank} • {player.winRate}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {!hasCalculated ? (
              <div className="demo-action">
                <button className="btn btn-primary btn-lg" onClick={handleCalculate}>
                  Calculate Prediction
                </button>
              </div>
            ) : (
              <>
                <PredictionResult prediction={prediction} />
                
                <div className="demo-cta">
                  <h3>Want to analyze your own games?</h3>
                  <p className="muted">
                    Sign up to use Live Game Lookup with real player data from Riot's API.
                  </p>
                  <div className="demo-cta-buttons">
                    <Link to="/signup" className="btn btn-primary">
                      Create Free Account
                    </Link>
                    <Link to="/login" className="btn btn-ghost">
                      Sign In
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}