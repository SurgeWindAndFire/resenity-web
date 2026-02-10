import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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

        {/* Hamburger Button */}
        <button 
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="nav-links">
            <a href="/#features" onClick={closeMenu}>Features</a>
            <a href="/#how-it-works" onClick={closeMenu}>How It Works</a>
            <Link to="/demo" onClick={closeMenu}>Demo</Link>
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
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}