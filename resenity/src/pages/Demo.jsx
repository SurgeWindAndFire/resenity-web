import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PredictionResult from "../components/match/PredictionResult";
import { calculatePrediction } from "../utils/prediction";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/demo.css";

const ROLE_LABELS = {
  top: "Top",
  jungle: "JG",
  mid: "Mid",
  adc: "ADC",
  support: "Sup"
};

const DEMO_BLUE_TEAM = [
  { name: "Hullbreaker#NA1", rank: "Diamond", winRate: 58, role: "top", champion: null },
  { name: "JGGap#NA1", rank: "Platinum", winRate: 52, role: "jungle", champion: null },
  { name: "SonOfFaker#NA1", rank: "Diamond", winRate: 55, role: "mid", champion: null },
  { name: "Pentakill#NA1", rank: "Emerald", winRate: 49, role: "adc", champion: null },
  { name: "FiveManKnockup#NA1", rank: "Platinum", winRate: 51, role: "support", champion: null }
];

const DEMO_RED_TEAM = [
  { name: "TopGap#NA1", rank: "Platinum", winRate: 48, role: "top", champion: null },
  { name: "SmiteCannon#NA1", rank: "Emerald", winRate: 50, role: "jungle", champion: null },
  { name: "PermaRoam#NA1", rank: "Platinum", winRate: 46, role: "mid", champion: null },
  { name: "FF15#NA1", rank: "Gold", winRate: 53, role: "adc", champion: null },
  { name: "SonOfKeria#NA1", rank: "Emerald", winRate: 47, role: "support", champion: null }
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

  const handleReset = () => {
    setPrediction(null);
    setHasCalculated(false);
  };

  return (
    <div className="page">
      <Navbar />
      <main className="demo-page">
        <div className="container">
          <header className="demo-header">
            <h1>See Resenity in Action</h1>
            <p className="muted">
              The demonstration is a showcase of how Resenity performs when it assesses team performance to calculate predictions. 
              Sign up today to be able to use real player data to make your own predictions today!
            </p>
          </header>

          <div className="demo-content">
            <div className="demo-teams">
              <div className="demo-team blue">
                <h3>Blue Team</h3>
                <ul className="demo-players">
                  {DEMO_BLUE_TEAM.map((player, index) => (
                    <li key={index} className="demo-player">
                      <span className="demo-role">{ROLE_LABELS[player.role]}</span>
                      <span className="demo-name">{player.name}</span>
                      <span className="demo-stats">{player.rank} • {player.winRate}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="demo-vs">VS</div>

              <div className="demo-team red">
                <h3>Red Team</h3>
                <ul className="demo-players">
                  {DEMO_RED_TEAM.map((player, index) => (
                    <li key={index} className="demo-player">
                      <span className="demo-role">{ROLE_LABELS[player.role]}</span>
                      <span className="demo-name">{player.name}</span>
                      <span className="demo-stats">{player.rank} • {player.winRate}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="demo-action">
              {!hasCalculated ? (
                <button className="btn btn-primary btn-lg" onClick={handleCalculate}>
                  Calculate Prediction
                </button>
              ) : (
                <button className="btn btn-ghost" onClick={handleReset}>
                  Reset Demo
                </button>
              )}
            </div>

            {hasCalculated && prediction && (
              <>
                <PredictionResult prediction={prediction} />
                
                <div className="demo-cta">
                  <h3>Want to start analyzing your own games?</h3>
                  <p className="muted">
                    Sign up now to use Live Game Search with real and trustworthy player data.
                  </p>
                  <div className="demo-cta-buttons">
                    <Link to="/signup" className="btn btn-primary">
                      Create Account
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
      <Footer />
    </div>
  );
}