import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import usePageTitle from "../hooks/usePageTitle";

export default function Login() {
    usePageTitle("Sign In");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to sign in. Please check your credentials.");
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div className ="auth-page">
            <div className = "auth-container">
                <h1>Welcome Back</h1>
                <p className="muted">Sign in to your Resenity account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className ="field">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder = "you@example.com"
                        />
                    </div>

                    <div className ="field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="password123"
                        />
                    </div>

                    <button
                        type="submit"
                        className = "btn btn-primary auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>

                <Link to="/" className="auth-home-link">Back to Home</Link>
            </div>
        </div>
    );
}