import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getUserProfile } from "../services/userService";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        setLoading(true);
        const result = await getUserProfile(currentUser.uid);
        if (result.success) {
          setUserProfile(result.profile);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    }

    fetchProfile();
  }, [currentUser]);

  const refreshProfile = async () => {
    if (currentUser) {
      const result = await getUserProfile(currentUser.uid);
      if (result.success) {
        setUserProfile(result.profile);
      }
    }
  };

  const value = {
    userProfile,
    loading,
    refreshProfile,
    username: userProfile?.username || currentUser?.email?.split('@')[0] || 'User'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}