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
                Resenity combines real-time data from Riot's official data with our trusted analytics
                and prediction algorithm so you can get the upper hand during every match.
              </p>
            </header>
          </FadeIn>

          <div className="features-grid">
            <FadeIn delay={100}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Live Game Detection</h3>
                <p>
                  Enter your Player ID and we'll automatically detect your current match. 
                  All 10 players are analyzed instantly, so you don't have to hurry up to input data.
                </p>
                <ul className="feature-benefits">
                  <li>Works in loading screen or in-game</li>
                  <li>Fetches every player in lobby automatically</li>
                  <li>Real-time rank and win rate data</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Real Player Data</h3>
                <p>
                  We use data from Riot's official API to fetch accurate and fresh player data.
                  No longer do you have to worry about estimates when we straight up show you
                  the facts.
                </p>
                <ul className="feature-benefits">
                  <li>Official Riot Games API</li>
                  <li>Current Season Ranks</li>
                  <li>Accurate and Precise Win Rates</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Smart Predictions</h3>
                <p>
                  Our service's algorithm factors in rank distribution, team composition, and
                  individual win rates to give our users the most accurate predicitions and 
                  win probabilities for their matches.
                </p>
                <ul className="feature-benefits">
                  <li>Team Rank Comparison</li>
                  <li>Win Rate Analysis</li>
                  <li>Champion Mastery Detection</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Accuracy Tracking</h3>
                <p>
                  After your matches, mark your predictions as either right or wrong to track Resenity's accuracy. 
                  See how often we stand up to our users when it comes to making accurate predictions.
                </p>
                <ul className="feature-benefits">
                  <li>One-click Outcome Recording</li>
                  <li>Right/Wrong Indicators</li>
                  <li>Historical Accuracy Data</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Stats Dashboard</h3>
                <p>
                  Want to see how accurate your predictions are?
                  View your complete prediction statistics that breaks down the details
                  whether it be confidence level and recent perfomance trends.
                </p>
                <ul className="feature-benefits">
                  <li>Overall Accuracy Percentage</li>
                  <li>Confidence-based Breakdown</li>
                  <li>Recent Form Tracking</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={600}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Prediction History</h3>
                <p>
                  Save your predictions and start viewing your predictions. You can filter your
                  outcomes so you can quickly find the past matches you would like to view.
                </p>
                <ul className="feature-benefits">
                  <li>Unlimited Saved Predictions</li>
                  <li>Filter by Status</li>
                  <li>Detailed Match Breakdowns</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={700}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Manual Match Entry</h3>
                <p>
                  Want to analyze how you'd matchup against Faker (or any other scenario)?
                  Manually input 10 players of any caliber to see who will come out on top
                  and acheive victory.
                </p>
                <ul className="feature-benefits">
                  <li>Analyze Any Matchup</li>
                  <li>Test Team Compositions</li>
                  <li>Pre-game Planning</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={800}>
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Community Suggestions</h3>
                <p>
                  Want to shape the future of Resenity? Submit your
                  ideas and suggestions of all caliber on our Suggestions page to gain
                  recognition as well as upvoting others who deserve our attention as well.
                </p>
                <ul className="feature-benefits">
                  <li>Submit Feedback Directly</li>
                  <li>Upvote Community Ideas</li>
                  <li>Track Feature Requests</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={900}>
              <div className="feature-card coming-soon">
                <div className="feature-icon"></div>
                <h3>Multi-Region Support</h3>
                <span className="coming-soon-badge">Coming Soon</span>
                <p>
                  Our service is only operable on NA servers. We plan
                  to roll out our service for EUW, EUNE, KR, and others
                  in the future.
                </p>
                <ul className="feature-benefits">
                  <li>All Major Regions Supported</li>
                  <li>Cross-region Comparisons</li>
                  <li>Region-specific Analytics</li>
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="features-cta">
              <h2>Ready to Get Started?</h2>
              <p className="muted">Create an account and start predicting your matches today.</p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary">Sign Up Today</Link>
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