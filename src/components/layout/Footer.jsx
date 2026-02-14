import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/ResenityWhite.png" alt="Resenity" />
            <span>Resenity</span>
          </Link>
          <p>Predict smarter. Win more.</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/demo">Demo</Link>
            <Link to="/about">About</Link>
          </div>
          
          <div className="footer-column">
            <h4>Community</h4>
            <Link to="/suggestions">Suggestions</Link>
            <a href="https://github.com/SurgeWindAndFire/Resenity" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          
          <div className="footer-column">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Get Started</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Resenity. All rights reserved.</p>
          <p className="disclaimer">
            Resenity isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games.
          </p>
        </div>
      </div>
    </footer>
  );
}