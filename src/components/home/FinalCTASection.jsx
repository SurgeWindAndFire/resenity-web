export default function FinalCTASection() {
  return (
    <section className="section" aria-label="Final call to action">
      <div className="container">
        <div className="card cta">
          <div>
            <h2>Ready to take your game to the next level?</h2>
            <p className="muted">Test out our platform now, then save predictions when you're ready.</p>
          </div>

          <div className="cta-actions">
            <a className="btn btn-primary" href="#demo">
              Try our service
            </a>
            <a className="btn btn-ghost" href="/login">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
