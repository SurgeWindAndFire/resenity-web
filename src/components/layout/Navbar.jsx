import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-dot" aria-hidden="true" />
          Resenity
        </Link>
        
        <ul className="nav-links">
          <li><a href="/#features">Features</a></li>
          <li><a href="/#how">How It Works</a></li>
          <li><a href="/#demo">Demo</a></li>
        </ul>
        
        <div className="nav-actions">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}