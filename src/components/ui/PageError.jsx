import { useNavigate } from "react-router-dom";
import "./PageError.css";

export default function PageError({ message = "Something went wrong", onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="page-error">
      <div className="page-error-icon">😕</div>
      <h3>Oops!</h3>
      <p className="muted">{message}</p>
      <div className="page-error-actions">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            Try Again
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}