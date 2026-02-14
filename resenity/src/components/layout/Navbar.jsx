import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { username } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSignOut = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      closeMenu();
      navigate("/");
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const getUserInitial = () => {
    if (username) return username[0].toUpperCase();
    return "U";
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
              <div className="user-menu-container" ref={userMenuRef}>
                <button 
                  className="user-menu-trigger"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="user-avatar">{getUserInitial()}</span>
                  <span className="user-name">{username}</span>
                  <span className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}>▾</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <Link 
                      to="/dashboard" 
                      className="dropdown-item"
                      onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}
                    >
                      <span className="dropdown-icon"></span>
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard/profile" 
                      className="dropdown-item"
                      onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}
                    >
                      <span className="dropdown-icon"></span>
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard/stats" 
                      className="dropdown-item"
                      onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}
                    >
                      <span className="dropdown-icon"></span>
                      My Stats
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item sign-out"
                      onClick={handleSignOut}
                    >
                      <span className="dropdown-icon"></span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
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