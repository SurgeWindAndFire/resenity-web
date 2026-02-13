import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { updateUsername } from "../services/userService";
import Navbar from "../components/layout/Navbar";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/profile.css";

export default function Profile() {
  usePageTitle("Profile");
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { userProfile, refreshProfile } = useUser();
  const { success, error: showError } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(userProfile?.username || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      showError("Username cannot be empty");
      return;
    }

    if (newUsername === userProfile?.username) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    const result = await updateUsername(currentUser.uid, newUsername.trim());

    setIsSaving(false);

    if (result.success) {
      await refreshProfile();
      setIsEditing(false);
      success("Username updated successfully!");
    } else {
      showError(result.error || "Failed to update username");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      showError("Failed to log out");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="page">
      <Navbar />
      <main className="profile-page">
        <div className="container">
          <header className="page-header">
            <div className="page-header-content">
              <h1>Profile</h1>
              <p className="muted">Manage your account settings</p>
            </div>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>
          </header>

          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-avatar">
                <span>{(userProfile?.username || "U")[0].toUpperCase()}</span>
              </div>

              <div className="profile-info">
                <div className="profile-field">
                  <label>Username</label>
                  {isEditing ? (
                    <div className="edit-username">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter new username"
                        maxLength={20}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={handleSaveUsername}
                          disabled={isSaving}
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setIsEditing(false);
                            setNewUsername(userProfile?.username || "");
                          }}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-value-row">
                      <span className="profile-value">{userProfile?.username || "Not set"}</span>
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Email</label>
                  <span className="profile-value">{currentUser?.email}</span>
                </div>

                <div className="profile-field">
                  <label>Member Since</label>
                  <span className="profile-value">{formatDate(userProfile?.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}