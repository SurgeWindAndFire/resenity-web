import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleHashLink = (e, hash) => {
    closeMenu();
    
    if (location.pathname === "/") {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img 
            src="/ResenityWhite.png" 
            alt="Resenity" 
            className="brand-logo"
          />
          <span className="brand-text">Resenity</span>
        </Link>

        <button 
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="nav-links">
            <Link to="/features" onClick={closeMenu}>Features</Link>
            <a 
              href="/#how" 
              onClick={(e) => handleHashLink(e, "#how")}
            >
              How It Works
            </a>
            <Link to="/demo" onClick={closeMenu}>Demo</Link>
            <Link to="/suggestions" onClick={closeMenu}>Suggestions</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
          </div>
          
          <div className="nav-actions">
            {currentUser ? (
              <Link to="/dashboard" className="btn btn-primary" onClick={closeMenu}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}