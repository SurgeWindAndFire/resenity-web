import "./Spinner.css";

export default function Spinner({ size = "medium", text = "" }) {
  return (
    <div className={`spinner-container ${size}`}>
      <div className="spinner"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}