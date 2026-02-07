import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <img 
            src="/ResenityTransparent.png" 
            alt="Resenity" 
            className="brand-logo"
          />
          <span className="brand-text">Resenity</span>
        </Link>
        
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How It Works</a>
          <Link to="/demo">Demo</Link>
        </div>
        
        <div className="nav-actions">
          {currentUser ? (
            <Link to="/dashboard" className="btn btn-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}