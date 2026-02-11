export default function FeaturesSection() {
  return (
    <section id="features" className="section features">
      <div className="container">
        <header className="section-header">
          <h2>Why Use Resenity?</h2>
          <p className="muted">Everything that you might possibly need to make wiser decisions in champion select</p>
        </header>

        <div className="features-list">
          <div className="feature">
            <h3>Live Game Detection</h3>
            <p>Enter your player ID, and we'll automatically search your live game and analyze everyone in the match as well.</p>
          </div>

          <div className="feature">
            <h3>Real Player Data</h3>
            <p>Our service uses Riot's official API, so all of your results are real player data, not estimates.</p>
          </div>

          <div className="feature">
            <h3>Smart Predictions</h3>
            <p>Our algorithm factors in team composition, rank distribution, and win rates to accurately predict the outcomes.</p>
          </div>

          <div className="feature">
            <h3>Save & Track</h3>
            <p>Save your predictions to build your history. Use this to see how many of your matches turned out exactly like you predicted.</p>
          </div>
        </div>
      </div>
    </section>
  );
}