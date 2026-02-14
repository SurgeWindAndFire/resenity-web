import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import Navbar from "../components/layout/Navbar";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/dashboard.css";

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { currentUser } = useAuth();
  const { username } = useUser();

  return (
    <div className="page">
      <Navbar />
      <main className="dashboard">
        <div className="container">
          <header className="dashboard-header">
            <div>
              <h1>Welcome back, {username}!</h1>
              <p className="muted">What would you like to do today?</p>
            </div>
            <Link to="/dashboard/profile" className="btn btn-ghost">
              Profile
            </Link>
          </header>

          <div className="dashboard-grid">
            <Link to="/dashboard/live-game" className="dashboard-card primary">
              <div className="card-icon"></div>
              <h2>Live Game Search</h2>
              <p>Analyze and make predictions on games in real-time</p>
            </Link>

            <Link to="/dashboard/create-match" className="dashboard-card">
              <div className="card-icon"></div>
              <h2>Create Match</h2>
              <p>Manually enter players to make predictions on hypothetical/future matches</p>
            </Link>

            <Link to="/dashboard/history" className="dashboard-card">
              <div className="card-icon"></div>
              <h2>History</h2>
              <p>View your saved predictions and accuracy stats</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
