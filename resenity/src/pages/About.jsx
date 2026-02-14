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
              An idea for a service was born out of a desire to let all competitive players know the numbers and 
              statistics behind their future decision-making for their upcoming ambitions in their next match.
              However, their main conflict resides in the fact that all this valuable information is stored behind an
              abundance of websites, leading to increases in players frustrations and worries over how to collect
              all this data and apply it to a singular match.
            </p>
            <p>
              Luckily, the call for an answer comes into picture when Resenity arrives on the scene.
            </p>
            <p>
              Resenity's goal is to help every competitive player, whether they lean on the more casual side or not,
              to better understand their data by combining every meaningful metric into a singular, powerful service,
              helping players make better informed decisions before their matches even start. Now is not the time to              
              play the guessing game, but rather the game of determination.
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
                  Resenity is a personal project of the creator who wishes to create meaningful and creative
                  solutions to problems no one could have ever thought of, but are glad that they have existence anyways.
                  No funds or donations are ever used to create these projects, but strictly out of curiosity, adrenaline,
                  and enthusiasm.
                </p>
                <p>
                  This platform will continuously get better over time based on demand and community feedback. Have an idea?
                  Check out the Suggestions page below and let your voice be known!
                </p>
                <div className="creator-links">
                  <a 
                    href="https://github.com/SurgeWindAndFire/Resenity" 
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
            <p>Join Resenity and start making data-driven decisions in champion select immediately!</p>
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