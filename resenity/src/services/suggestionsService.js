import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc,
  deleteDoc,
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_NAME = "suggestions";

export async function submitSuggestion(userId, username, suggestionData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      username: username || "User",
      title: suggestionData.title,
      description: suggestionData.description,
      category: suggestionData.category || "feature",
      status: "pending",
      upvotes: [],
      upvoteCount: 0,
      createdAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting suggestion:", error);
    return { success: false, error: error.message };
  }
}

export async function getSuggestions() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("upvoteCount", "desc")
    );
    
    const snapshot = await getDocs(q);
    const suggestions = [];
    
    snapshot.forEach((doc) => {
      suggestions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: suggestions };
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return { success: false, error: error.message };
  }
}

export async function upvoteSuggestion(suggestionId, userId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: "Suggestion not found" };
    }
    
    const data = docSnap.data();
    const hasUpvoted = data.upvotes?.includes(userId);
    
    if (hasUpvoted) {
      await updateDoc(docRef, {
        upvotes: arrayRemove(userId),
        upvoteCount: (data.upvoteCount || 1) - 1
      });
      return { success: true, action: "removed" };
    } else {
      await updateDoc(docRef, {
        upvotes: arrayUnion(userId),
        upvoteCount: (data.upvoteCount || 0) + 1
      });
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("Error upvoting suggestion:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSuggestion(suggestionId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestionId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSuggestionStatus(suggestionId, status) {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestionId);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error) {
    console.error("Error updating suggestion status:", error);
    return { success: false, error: error.message };
  }
}