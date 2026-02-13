import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    
    if (userDoc.exists()) {
      return {
        success: true,
        profile: {
          id: userDoc.id,
          ...userDoc.data()
        }
      };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function createUserProfile(uid, data) {
  try {
    await setDoc(doc(db, "users", uid), {
      username: data.username,
      email: data.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}

export async function updateUserProfile(uid, data) {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updateUsername(uid, newUsername) {
  if (newUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters" };
  }
  if (newUsername.length > 20) {
    return { success: false, error: "Username must be 20 characters or less" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    return { success: false, error: "Username can only contain letters, numbers, and underscores" };
  }

  return updateUserProfile(uid, { username: newUsername });
}