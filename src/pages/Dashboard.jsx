import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="dashboard">
        <div className="container">
          <header className="dashboard-header">
            <h1>Dashboard</h1>
            <p className="muted">Welcome back, {currentUser?.email}</p>
          </header>

          <div className="dashboard-content">
            <div className="card">
              <header className="card-header">
                <h3>Quick Actions</h3>
              </header>
              <div className="dashboard-actions">
                <Link to="/dashboard/create-match" className="btn btn-primary">
                  Create New Match
                </Link>
                <button className="btn btn-ghost">
                  View History
                </button>
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>

            <div className="card">
              <header className="card-header">
                <h3>Recent Predictions</h3>
              </header>
              <p className="muted">No predictions yet. Create your first match!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
