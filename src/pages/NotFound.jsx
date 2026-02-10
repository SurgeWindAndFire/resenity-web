import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import "../styles/not-found.css";

export default function NotFound() {
  return (
    <div className="page">
      <Navbar />
      <main className="not-found-page">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p className="muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </main>
    </div>
  );
}