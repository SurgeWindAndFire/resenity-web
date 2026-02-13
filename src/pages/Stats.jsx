import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserStats } from "../services/predictionServices";
import Navbar from "../components/layout/Navbar";
import Spinner from "../components/ui/Spinner";
import "../styles/stats.css";

export default function Stats() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      if (!currentUser) return;
      
      setLoading(true);
      const result = await getUserStats(currentUser.uid);
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    }
    
    fetchStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="stats-page">
        <Navbar />
        <main className="container">
          <div className="loading-container">
            <Spinner size="large" text="Loading your stats..." />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <Navbar />
        <main className="container">
          <div className="error-container">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  const hasData = stats && stats.total > 0;
  const hasCompletedData = stats && stats.completed > 0;

  return (
    <div className="stats-page">
      <Navbar />
      
      <main className="container">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Your Stats</h1>
            <p className="muted">Track your prediction accuracy over time</p>
          </div>
          <Link to="/dashboard/history" className="btn btn-ghost">View History</Link>
        </div>

        {!hasData ? (
          <div className="empty-stats">
            <div className="empty-icon">📊</div>
            <h2>No predictions yet</h2>
            <p>Start making predictions to see your accuracy stats!</p>
            <div className="empty-actions">
              <Link to="/dashboard/create-match" className="btn btn-primary">Create Match</Link>
              <Link to="/dashboard/live-game" className="btn btn-ghost">Live Game Lookup</Link>
            </div>
          </div>
        ) : (
          <div className="stats-content">
            <div className="accuracy-hero">
              <div className="accuracy-ring-container">
                <AccuracyRing percentage={stats.accuracy} completed={stats.completed} />
              </div>
              <div className="accuracy-details">
                <div className="accuracy-stat">
                  <span className="stat-value correct">{stats.correct}</span>
                  <span className="stat-label">Correct</span>
                </div>
                <div className="accuracy-stat">
                  <span className="stat-value incorrect">{stats.incorrect}</span>
                  <span className="stat-label">Incorrect</span>
                </div>
                <div className="accuracy-stat">
                  <span className="stat-value pending">{stats.pending}</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <h3>Recent Form</h3>
                  <span className="stat-period">Last {stats.recentGames} games</span>
                </div>
                <div className="stat-card-body">
                  {stats.recentAccuracy !== null ? (
                    <>
                      <div className="big-stat">
                        <span className={`value ${stats.recentAccuracy >= 50 ? 'positive' : 'negative'}`}>
                          {stats.recentAccuracy}%
                        </span>
                        {stats.accuracy !== null && (
                          <span className={`trend ${stats.recentAccuracy > stats.accuracy ? 'up' : stats.recentAccuracy < stats.accuracy ? 'down' : ''}`}>
                            {stats.recentAccuracy > stats.accuracy && '↑'}
                            {stats.recentAccuracy < stats.accuracy && '↓'}
                            {stats.recentAccuracy === stats.accuracy && '→'}
                          </span>
                        )}
                      </div>
                      <p className="stat-description">
                        {stats.recentAccuracy > stats.accuracy 
                          ? "Improving lately!" 
                          : stats.recentAccuracy < stats.accuracy 
                            ? "Slight dip recently"
                            : "Holding steady"}
                      </p>
                    </>
                  ) : (
                    <p className="no-data">Mark more matches to see trends</p>
                  )}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3>By Confidence</h3>
                  <span className="stat-period">Win probability</span>
                </div>
                <div className="stat-card-body">
                  <div className="confidence-breakdown">
                    <ConfidenceRow label="High (70%+)" data={stats.byConfidence.high} color="high" />
                    <ConfidenceRow label="Medium (55-69%)" data={stats.byConfidence.medium} color="medium" />
                    <ConfidenceRow label="Close (< 55%)" data={stats.byConfidence.low} color="low" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3>By Team Picked</h3>
                  <span className="stat-period">Which side Resenity favored</span>
                </div>
                <div className="stat-card-body">
                  <div className="team-breakdown">
                    <TeamRow label="Blue Side" data={stats.byTeamPicked.team1} color="blue" />
                    <TeamRow label="Red Side" data={stats.byTeamPicked.team2} color="red" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3>Total Activity</h3>
                </div>
                <div className="stat-card-body">
                  <div className="activity-stats">
                    <div className="activity-item">
                      <span className="activity-value">{stats.total}</span>
                      <span className="activity-label">Predictions Made</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-value">{stats.completed}</span>
                      <span className="activity-label">Matches Tracked</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-value">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </span>
                      <span className="activity-label">Completion Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {hasCompletedData && stats.predictions && (
              <div className="recent-results">
                <h3>Recent Results</h3>
                <div className="results-strip">
                  {stats.predictions
                    .filter(p => p.outcome && p.outcome !== "pending")
                    .slice(0, 10)
                    .map((p, i) => (
                      <Link 
                        key={p.id} 
                        to={`/dashboard/prediction/${p.id}`}
                        className={`result-dot ${p.wasCorrect ? 'correct' : 'incorrect'}`}
                        title={p.wasCorrect ? 'Correct' : 'Incorrect'}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {p.wasCorrect ? '✓' : '✗'}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function AccuracyRing({ percentage, completed }) {
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - ((percentage || 0) / 100) * circumference;
  
  return (
    <div className="accuracy-ring">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255, 255, 255, 0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="accuracy-progress"
          stroke={percentage >= 50 ? "#16ddb2" : "#f87171"}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="accuracy-center">
        {completed > 0 ? (
          <>
            <span className="accuracy-percentage">{percentage}%</span>
            <span className="accuracy-label">Accuracy</span>
          </>
        ) : (
          <>
            <span className="accuracy-percentage">—</span>
            <span className="accuracy-label">No data yet</span>
          </>
        )}
      </div>
    </div>
  );
}

function ConfidenceRow({ label, data, color }) {
  return (
    <div className={`confidence-row ${color}`}>
      <div className="confidence-info">
        <span className="confidence-label">{label}</span>
        <span className="confidence-count">{data.correct}/{data.total}</span>
      </div>
      <div className="confidence-bar-bg">
        <div 
          className="confidence-bar-fill"
          style={{ width: data.accuracy !== null ? `${data.accuracy}%` : '0%' }}
        />
      </div>
      <span className="confidence-accuracy">
        {data.accuracy !== null ? `${data.accuracy}%` : '—'}
      </span>
    </div>
  );
}

function TeamRow({ label, data, color }) {
  return (
    <div className={`team-row ${color}`}>
      <div className="team-info">
        <span className={`team-indicator ${color}`}></span>
        <span className="team-label">{label}</span>
      </div>
      <div className="team-stats">
        <span className="team-record">{data.correct}/{data.total}</span>
        <span className="team-accuracy">
          {data.accuracy !== null ? `${data.accuracy}%` : '—'}
        </span>
      </div>
    </div>
  );
}