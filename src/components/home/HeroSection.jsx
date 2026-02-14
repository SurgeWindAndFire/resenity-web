import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ScreenshotSlideshow from "./ScreenshotSlideshow";
import FadeIn from "../ui/FadeIn";

export default function HeroSection() {
  const { currentUser } = useAuth();

  return (
    <section className="hero">
      <div className="container hero-container">
        <FadeIn>
          <div className="hero-content">
            <div className="hero-badge">
              A League of Legends Analytics Platform • Real-Time Match Predictions
            </div>
            
            <h1 className="hero-title">
              Know Your Match Outcomes<br />
              <span className="highlight">Before You Even Play.</span>
            </h1>
            
            <p className="hero-description">
              Enter any 10 League players and get instant win probability based on 
              real ranks and win rates. Or let us auto-detect your live game and 
              analyze all players automatically.
            </p>
            
            <div className="hero-cta">
              {currentUser ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="btn btn-primary">
                  Sign Up Today
                </Link>
              )}
              <Link to="/demo" className="btn btn-ghost">
                Try Demo
              </Link>
            </div>
            
            <p className="hero-note">
              Powered by official Riot Games API • No download required
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={200}>
          <div className="hero-visual">
            <ScreenshotSlideshow />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}