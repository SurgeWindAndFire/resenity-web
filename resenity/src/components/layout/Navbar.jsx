import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          Resenity
        </Link>
        
        <div className="navbar-links">
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How It Works</a>
          <Link to="/demo">Demo</Link>
        </div>
        
        <div className="navbar-actions">
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
