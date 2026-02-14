import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import { getSuggestions, submitSuggestion, voteSuggestion, deleteSuggestion } from "../services/suggestionsService";
import { useToast } from "../contexts/ToastContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Spinner from "../components/ui/Spinner";
import "../styles/suggestions.css";

const ADMIN_UID = "fcevRuPpMNSzzLRcfzmfPK8DZcA3";

export default function Suggestions() {
  const { currentUser } = useAuth();
  const { username } = useUser();
  const { addToast } = useToast();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "feature"
  });

  const isAdmin = currentUser?.uid === ADMIN_UID;

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    setLoading(true);
    const result = await getSuggestions();
    if (result.success) {
      setSuggestions(result.data);
    } else {
      addToast("Failed to load suggestions", "error");
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
      addToast("Please sign in to submit a suggestion", "error");
      return;
    }
    
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast("Please fill in all fields", "error");
      return;
    }
    
    setSubmitting(true);
    
    const result = await submitSuggestion(
      currentUser.uid,
      username,
      formData
    );
    
    if (result.success) {
      addToast("Suggestion submitted! Thanks for your feedback.", "success");
      setFormData({ title: "", description: "", category: "feature" });
      setShowForm(false);
      fetchSuggestions();
    } else {
      addToast("Failed to submit suggestion", "error");
    }
    setSubmitting(false);
  }

  async function handleVote(suggestionId, voteType) {
    if (!currentUser) {
      addToast("Please sign in to vote", "error");
      return;
    }
    
    const result = await voteSuggestion(suggestionId, currentUser.uid, voteType);
    
    if (result.success) {
      setSuggestions(prev => prev.map(s => {
        if (s.id === suggestionId) {
          return {
            ...s,
            upvotes: result.upvotes,
            downvotes: result.downvotes,
            score: result.score
          };
        }
        return s;
      }));
    } else {
      addToast("Failed to vote", "error");
    }
  }

  async function handleDelete(suggestionId, suggestionUserId) {
    const canDelete = isAdmin || currentUser?.uid === suggestionUserId;
    
    if (!canDelete) {
      addToast("You don't have permission to delete this", "error");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this suggestion?")) {
      return;
    }
    
    const result = await deleteSuggestion(suggestionId);
    
    if (result.success) {
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      addToast("Suggestion deleted", "success");
    } else {
      addToast("Failed to delete suggestion", "error");
    }
  }

  const filteredSuggestions = suggestions.filter(s => {
    if (filter === "all") return true;
    return s.category === filter;
  });

  const categories = [
    { value: "feature", label: "Feature Request" },
    { value: "improvement", label: "Improvement" },
    { value: "bug", label: "Bug Report" },
    { value: "other", label: "Other" }
  ];

  if (!currentUser) {
    return (
      <div className="suggestions-page">
        <Navbar />
        
        <main className="container">
          <div className="login-prompt">
            <div className="login-prompt-icon">💡</div>
            <h1>Community Suggestions</h1>
            <p>Sign in to view and submit suggestions for Resenity</p>
            <div className="login-prompt-actions">
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-ghost">
                Create Account
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="suggestions-page">
      <Navbar />
      
      <main className="container">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Community Suggestions</h1>
            <p className="muted">Help shape the future of Resenity</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ New Suggestion"}
          </button>
        </div>

        {showForm && (
          <form className="suggestion-form" onSubmit={handleSubmit}>
            <h2>Submit a Suggestion</h2>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <div className="category-select">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-btn ${formData.category === cat.value ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief summary of your suggestion"
                maxLength={100}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your suggestion in detail..."
                rows={4}
                maxLength={1000}
              />
            </div>
            
            <div className="form-footer">
              <span className="posting-as">Posting as: <strong>{username}</strong></span>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Suggestion"}
              </button>
            </div>
          </form>
        )}

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-tab ${filter === cat.value ? 'active' : ''}`}
              onClick={() => setFilter(cat.value)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <Spinner size="large" text="Loading suggestions..." />
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h2>No suggestions yet</h2>
            <p>Be the first to share your groundbreaking ideas!</p>
          </div>
        ) : (
          <div className="suggestions-list">
            {filteredSuggestions.map(suggestion => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                currentUser={currentUser}
                isAdmin={isAdmin}
                onVote={handleVote}
                onDelete={handleDelete}
                categories={categories}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SuggestionCard({ suggestion, currentUser, isAdmin, onVote, onDelete, categories }) {
  const { id, title, description, category, username, userId, upvotes = [], downvotes = [], score = 0, createdAt, status } = suggestion;
  
  const hasUpvoted = currentUser && upvotes.includes(currentUser.uid);
  const hasDownvoted = currentUser && downvotes.includes(currentUser.uid);
  const categoryInfo = categories.find(c => c.value === category) || categories[3];
  const isCreator = userId === ADMIN_UID;
  const isOwner = currentUser?.uid === userId;
  const canDelete = isAdmin || isOwner;
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="suggestion-card">
      <div className="vote-buttons">
        <button 
          className={`vote-btn upvote ${hasUpvoted ? 'active' : ''}`}
          onClick={() => onVote(id, "up")}
          title="Upvote"
        >
          ▲
        </button>
        <span className={`vote-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}>
          {score}
        </span>
        <button 
          className={`vote-btn downvote ${hasDownvoted ? 'active' : ''}`}
          onClick={() => onVote(id, "down")}
          title="Downvote"
        >
          ▼
        </button>
      </div>
      
      <div className="suggestion-content">
        <div className="suggestion-header">
          <span className="category-tag">
            {categoryInfo.icon} {categoryInfo.label}
          </span>
          {status && status !== "pending" && (
            <span className={`status-tag ${status}`}>
              {status}
            </span>
          )}
        </div>
        
        <h3 className="suggestion-title">{title}</h3>
        <p className="suggestion-description">{description}</p>
        
        <div className="suggestion-footer">
          <span className="suggestion-author">
            by <strong>{username}</strong>
            {isCreator && <span className="admin-badge">Admin</span>}
          </span>
          <span className="suggestion-date">{formatDate(createdAt)}</span>
          
          {canDelete && (
            <button 
              className="delete-suggestion-btn"
              onClick={() => onDelete(id, userId)}
              title={isOwner && !isAdmin ? "Delete your suggestion" : "Delete suggestion"}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { ADMIN_UID };