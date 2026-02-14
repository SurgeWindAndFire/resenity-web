import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import { getSuggestions, submitSuggestion, upvoteSuggestion, deleteSuggestion } from "../services/suggestionsService";
import { useToast } from "../contexts/ToastContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Spinner from "../components/ui/Spinner";
import "../styles/suggestions.css";

const ADMIN_UID = "fcevRuPpMNSzzLRcfzmfPK8DZcA3";

export default function Suggestions() {
  const { currentUser } = useAuth();
  const { userData } = useUser();
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
    
    const displayName = userData?.username || 
                        currentUser.displayName || 
                        currentUser.email?.split('@')[0] || 
                        "User";
    
    const result = await submitSuggestion(
      currentUser.uid,
      displayName,
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

  async function handleUpvote(suggestionId) {
    if (!currentUser) {
      addToast("Please sign in to upvote", "error");
      return;
    }
    
    const result = await upvoteSuggestion(suggestionId, currentUser.uid);
    
    if (result.success) {
      setSuggestions(prev => prev.map(s => {
        if (s.id === suggestionId) {
          const hasUpvoted = s.upvotes?.includes(currentUser.uid);
          return {
            ...s,
            upvotes: hasUpvoted 
              ? s.upvotes.filter(id => id !== currentUser.uid)
              : [...(s.upvotes || []), currentUser.uid],
            upvoteCount: hasUpvoted ? s.upvoteCount - 1 : s.upvoteCount + 1
          };
        }
        return s;
      }));
    } else {
      addToast("Failed to upvote", "error");
    }
  }

  async function handleDelete(suggestionId) {
    if (!isAdmin) return;
    
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
    { value: "feature", label: "Feature Request", icon: "✨" },
    { value: "improvement", label: "Improvement", icon: "🔧" },
    { value: "bug", label: "Bug Report", icon: "🐛" },
    { value: "other", label: "Other", icon: "💬" }
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
              <span className="posting-as">Posting as: <strong>{userData?.username || currentUser.displayName || currentUser.email?.split('@')[0]}</strong></span>
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
            <div className="empty-icon">💡</div>
            <h2>No suggestions yet</h2>
            <p>Be the first to share your ideas!</p>
          </div>
        ) : (
          <div className="suggestions-list">
            {filteredSuggestions.map(suggestion => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                currentUser={currentUser}
                isAdmin={isAdmin}
                onUpvote={handleUpvote}
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

function SuggestionCard({ suggestion, currentUser, isAdmin, onUpvote, onDelete, categories }) {
  const { id, title, description, category, username, userId, upvotes, upvoteCount, createdAt, status } = suggestion;
  const hasUpvoted = currentUser && upvotes?.includes(currentUser.uid);
  const categoryInfo = categories.find(c => c.value === category) || categories[3];
  const isCreator = userId === ADMIN_UID;
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="suggestion-card">
      <button 
        className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
        onClick={() => onUpvote(id)}
      >
        <span className="upvote-arrow">▲</span>
        <span className="upvote-count">{upvoteCount || 0}</span>
      </button>
      
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
          
          {isAdmin && (
            <button 
              className="delete-suggestion-btn"
              onClick={() => onDelete(id)}
              title="Delete suggestion"
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