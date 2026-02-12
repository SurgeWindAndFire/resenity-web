import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FadeIn from "../components/ui/FadeIn";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/features.css";

export default function Features() {
  usePageTitle("Features");

  return (
    <div className="page">
      <Navbar />
      <main className="features-page">
        <div className="container">
          <FadeIn>
            <header className="features-hero">
              <h1>Everything You Need to<br /><span className="highlight">Predict with Confidence</span></h1>
              <p className="lead">
                Resenity combines real-time data from Riot's API with smart analytics 
                to give you the edge before every match.
              </p>
            </header>
          </FadeIn>

          <div className="features-grid">
            <FadeIn delay={100}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Live Game Detection</h3>
                <p>
                  Enter your Riot ID and we'll automatically detect your current game. 
                  All 10 players are analyzed instantly — no manual input required.
                </p>
                <ul className="feature-benefits">
                  <li>Works in loading screen or in-game</li>
                  <li>Fetches all players automatically</li>
                  <li>Real-time rank and win rate data</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Real Player Data</h3>
                <p>
                  We use Riot's official API to fetch accurate, up-to-date player statistics. 
                  No estimates, no outdated data — just the facts.
                </p>
                <ul className="feature-benefits">
                  <li>Official Riot Games API</li>
                  <li>Current season ranks</li>
                  <li>Accurate win rates</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Smart Predictions</h3>
                <p>
                  Our algorithm analyzes team composition, rank distribution, and individual 
                  win rates to calculate accurate win probabilities.
                </p>
                <ul className="feature-benefits">
                  <li>Team rank comparison</li>
                  <li>Win rate analysis</li>
                  <li>Confidence scoring</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Save & Track</h3>
                <p>
                  Save your predictions and build a history. Track your accuracy over time 
                  and see how often Resenity gets it right.
                </p>
                <ul className="feature-benefits">
                  <li>Prediction history</li>
                  <li>Quick access to past matches</li>
                  <li>Track your insights</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Manual Match Entry</h3>
                <p>
                  Want to analyze a hypothetical matchup? Enter any 10 players manually 
                  to see who would have the advantage.
                </p>
                <ul className="feature-benefits">
                  <li>Analyze any matchup</li>
                  <li>Test team compositions</li>
                  <li>Pre-game planning</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={600}>
              <div className="feature-card coming-soon">
                <div className="feature-icon"></div>
                <h3>Champion Analytics</h3>
                <span className="coming-soon-badge">Coming Soon</span>
                <p>
                  Factor in champion picks, win rates, and playstyles for even more 
                  accurate predictions.
                </p>
                <ul className="feature-benefits">
                  <li>Champion win rates</li>
                  <li>Role-based analysis</li>
                  <li>Playstyle insights</li>
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="features-cta">
              <h2>Ready to Get Started?</h2>
              <p className="muted">Create a free account and start predicting your matches today.</p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
                <Link to="/demo" className="btn btn-ghost">Try the Demo</Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}