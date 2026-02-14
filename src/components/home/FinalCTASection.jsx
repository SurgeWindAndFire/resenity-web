import { Link } from "react-router-dom";

export default function FinalCTASection() {
  return (
    <section className="section" aria-label="Final call to action">
      <div className="container">
        <div className="card cta">
          <div>
            <h2>Ready to predict your next match?</h2>
            <p className="muted">Join thousands of players making smarter decisions in champion select.</p>
          </div>
          <div className="cta-actions">
            <Link to="/demo" className="btn btn-primary">
              Try Demo
            </Link>
            <Link to="/signup" className="btn btn-ghost">
              Sign Up Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}