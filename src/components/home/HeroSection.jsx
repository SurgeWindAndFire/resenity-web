import HeroPredictionMock from "./HeroPredictionMock.jsx";

export default function HeroSection() {
  return (
    <section id="top" className="section hero" aria-label="Hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="pill" role="note">
            A League of Legends Analytics Platform • New Competitive Games Coming Soon
          </div>

          <h1>The Full Insights to Everything in Competitive Gaming.</h1>

          <p className="lead">
            Resenity allows users to turn their game data into simple explanations
            and winning odds, helping them make the best decisions and improve their
            performance to help win more games.
          </p>

          <div className="hero-cta">
            <a className="btn btn-primary" href="#demo">
              Try Demo
            </a>
            <a className="btn btn-ghost" href="/login">
              Sign in
            </a>
          </div>

          <p className="muted small">Account not needed for demo.</p>

          <ul className="hero-highlights" aria-label="Key highlights">
            <li>Winning Odds</li>
            <li>Simple and Fluent Explanations</li>
            <li>Saved History</li>
          </ul>
        </div>

        <div className="hero-visual" aria-label="Prediction preview">
          <HeroPredictionMock />
        </div>
      </div>
    </section>
  );
}
