export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="brand" aria-label="Resenity home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">Resenity</span>
        </a>

        <div className="nav-links" aria-label="Primary navigation">
          <a href="#features">Features</a>
          <a href="#how">How it Works</a>
          <a href="#demo">Demonstration</a>
        </div>

        <div className="nav-actions">
          <a className="btn btn-ghost" href="/login">
            Sign in
          </a>
          <a className="btn btn-primary" href="#demo">
            Try our service
          </a>
        </div>
      </div>
    </header>
  );
}
