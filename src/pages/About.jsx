import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BuiltForSection from "../components/home/BuiltForSection";
import RoadmapTeaserSection from "../components/home/RoadmapTeaserSection";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/about.css";

export default function About() {
  usePageTitle("About");

  return (
    <div className="about-page">
      <Navbar />
      
      <main>
        <section className="about-hero">
          <div className="container">
            <h1>About <span className="highlight">Resenity</span></h1>
            <p className="tagline">Empowering players with data-driven insights</p>
          </div>
        </section>

        <section className="container">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              Resenity was born from a simple frustration: the information overload players 
              face in champion select. Instead of manually checking each player's stats across 
              multiple websites, we bring everything together into one clear, actionable prediction.
            </p>
            <p>
              Our goal is to help every League of Legends player—from casual to competitive—make 
              smarter decisions before their games even start. No more guessing, no more doubt.
            </p>
          </div>
        </section>

        <BuiltForSection />

        <section className="container">
          <div className="about-section">
            <h2>The Algorithm</h2>
            <p>
              Resenity's prediction engine analyzes multiple factors to calculate win probability:
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-icon"></span>
                <div>
                  <strong>Team Rank Analysis</strong>
                  <p>We compare average team ranks and identify skill gaps that could influence the outcome.</p>
                </div>
              </li>
              <li>
                <span className="feature-icon"></span>
                <div>
                  <strong>Win Rate Comparison</strong>
                  <p>Recent performance data shows who's on a hot streak and who might be tilted.</p>
                </div>
              </li>
              <li>
                <span className="feature-icon"></span>
                <div>
                  <strong>Team Consistency</strong>
                  <p>Teams with similar skill levels across all roles tend to perform more predictably.</p>
                </div>
              </li>
              <li>
                <span className="feature-icon"></span>
                <div>
                  <strong>Champion Mastery</strong>
                  <p>We factor in one-tricks and champion specialists who can swing matchups.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <RoadmapTeaserSection />

        <section className="container">
          <div className="about-section">
            <h2>About the Creator</h2>
            <div className="creator-card">
              <div className="creator-info">
                <h3>Built with passion for competitive gaming</h3>
                <p>
                  Resenity is a personal project that demonstrates full-stack development skills 
                  including React, Firebase, and third-party API integration with Riot Games.
                </p>
                <p>
                  This platform is continuously evolving based on community feedback. Have an idea? 
                  Check out our Suggestions page and let your voice be heard!
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
                    Share Your Ideas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container">
          <div className="about-section cta-section">
            <h2>Ready to predict smarter?</h2>
            <p>Join Resenity and start making data-driven decisions in champion select.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                Sign Up Today
              </Link>
              <Link to="/demo" className="btn btn-ghost btn-large">
                Try Demo First
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}