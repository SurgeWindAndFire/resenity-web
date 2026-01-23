function PredictionCardMock() {
  return (
    <article className="card mock-card" aria-label="Prediction card mock">
      <header className="card-header">
        <h3>Example Match:</h3>
        <span className="chip">League of Legends</span>
      </header>

      <div className="rows" role="group" aria-label="Team odds">
        <div className="row">
          <span className="team-chip">Red Team</span>
          <strong>62%</strong>
        </div>
        <div className="row">
          <span className="team-chip">Blue Team</span>
          <strong>38%</strong>
        </div>
      </div>

      <div className="bar" aria-label="Win probability bar">
        <div className="bar-track">
          <div className="bar-fill" style={{ width: "62%" }} />
        </div>
      </div>

      <div className="meta" aria-label="Confidence">
        <span className="muted small">Confidence Level</span>
        <span className="badge">Medium</span>
      </div>
    </article>
  );
}

function WhyPanelMock() {
  return (
    <article className="card mock-card" aria-label="Why panel mock">
      <header className="card-header">
        <h3>Why Red Team leads:</h3>
      </header>

      <div className="chip-row" aria-label="Top factors">
        <span className="chip">Higher Average Rank</span>
        <span className="chip">Stronger Skirmishes</span>
        <span className="chip">Better Objective Control</span>
      </div>
    </article>
  );
}

function MiniChartMock() {
  return (
    <article className="card mock-card" aria-label="Mini chart mock">
      <header className="card-header">
        <h3>Momentum:</h3>
      </header>

      <div className="chart" role="img" aria-label="Line chart placeholder">
        <div className="chart-line" />
      </div>
    </article>
  );
}

export default function HeroPredictionMock() {
  return (
    <div className="mock-stack" aria-label="Mock stack">
      <PredictionCardMock />
      <WhyPanelMock />
      <MiniChartMock />
    </div>
  );
}
