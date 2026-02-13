import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/about.css";

export default function About() {
  return (
    <div className="about-page">
      <Navbar />
      
      <main className="container">
        <div className="about-hero">
          <h1>About <span className="highlight">Resenity</span></h1>
          <p className="tagline">Predict smarter. Win more.</p>
        </div>

        <section className="about-section">
          <h2>What is Resenity?</h2>
          <p>
            Resenity is a League of Legends match prediction platform that helps players 
            make informed decisions before their games. By analyzing player ranks, win rates, 
            and team compositions, Resenity provides data-driven predictions to give you 
            an edge in champion select.
          </p>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <div className="how-it-works-grid">
            <div className="how-step">
              <span className="step-number">1</span>
              <h3>Enter Players</h3>
              <p>Input all 10 players from your match or use Live Game Lookup to auto-detect.</p>
            </div>
            <div className="how-step">
              <span className="step-number">2</span>
              <h3>Get Prediction</h3>
              <p>Our algorithm analyzes ranks, win rates, and team balance to calculate win probability.</p>
            </div>
            <div className="how-step">
              <span className="step-number">3</span>
              <h3>Track Results</h3>
              <p>Mark your matches as won or lost to track Resenity's accuracy over time.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>The Algorithm</h2>
          <p>
            Resenity's prediction algorithm considers multiple factors:
          </p>
          <ul className="feature-list">
            <li>
              <span className="feature-icon">📊</span>
              <div>
                <strong>Average Team Rank</strong>
                <p>Higher ranked teams generally have better game knowledge and mechanics.</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📈</span>
              <div>
                <strong>Win Rate Analysis</strong>
                <p>Recent performance indicates current form and consistency.</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">⚖️</span>
              <div>
                <strong>Team Consistency</strong>
                <p>Teams with similar skill levels tend to coordinate better.</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">⭐</span>
              <div>
                <strong>High-Elo Impact</strong>
                <p>Presence of high-ranking players can significantly influence outcomes.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>About the Creator</h2>
          <div className="creator-card">
            <div className="creator-info">
              <h3>Built with passion for competitive gaming</h3>
              <p>
                Resenity was created as a personal project to solve a real problem: 
                the information overload players face in champion select. Instead of 
                manually checking each player's stats across multiple sites, Resenity 
                brings everything together into one simple prediction.
              </p>
              <p>
                This project demonstrates full-stack development skills including React, 
                Firebase, and third-party API integration with Riot Games.
              </p>
              <div className="creator-links">
                <a 
                  href="https://github.com/SurgeWindAndFire/resenity-web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  View on GitHub
                </a>
                <Link to="/suggestions" className="btn btn-primary">
                  Suggest a Feature
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section cta-section">
          <h2>Ready to predict your matches?</h2>
          <p>Join Resenity and start making data-driven decisions.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
            <Link to="/demo" className="btn btn-ghost btn-large">
              Try Demo
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}