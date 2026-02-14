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
      downvotes: [],
      score: 0,
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
      orderBy("score", "desc")
    );
    
    const snapshot = await getDocs(q);
    const suggestions = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      suggestions.push({
        id: doc.id,
        ...data,
        score: data.score ?? data.upvoteCount ?? 0
      });
    });
    
    return { success: true, data: suggestions };
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return { success: false, error: error.message };
  }
}

export async function voteSuggestion(suggestionId, userId, voteType) {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: "Suggestion not found" };
    }
    
    const data = docSnap.data();
    const upvotes = data.upvotes || [];
    const downvotes = data.downvotes || [];
    
    const hasUpvoted = upvotes.includes(userId);
    const hasDownvoted = downvotes.includes(userId);
    
    let newUpvotes = [...upvotes];
    let newDownvotes = [...downvotes];
    let action = "";
    
    if (voteType === "up") {
      if (hasUpvoted) {
        newUpvotes = newUpvotes.filter(id => id !== userId);
        action = "removed_upvote";
      } else {
        newUpvotes.push(userId);
        if (hasDownvoted) {
          newDownvotes = newDownvotes.filter(id => id !== userId);
        }
        action = "upvoted";
      }
    } else if (voteType === "down") {
      if (hasDownvoted) {
        newDownvotes = newDownvotes.filter(id => id !== userId);
        action = "removed_downvote";
      } else {
        newDownvotes.push(userId);
        if (hasUpvoted) {
          newUpvotes = newUpvotes.filter(id => id !== userId);
        }
        action = "downvoted";
      }
    }
    
    const newScore = newUpvotes.length - newDownvotes.length;
    
    await updateDoc(docRef, {
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      score: newScore,
      upvoteCount: newUpvotes.length
    });
    
    return { 
      success: true, 
      action,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      score: newScore
    };
  } catch (error) {
    console.error("Error voting on suggestion:", error);
    return { success: false, error: error.message };
  }
}

export async function upvoteSuggestion(suggestionId, userId) {
  return voteSuggestion(suggestionId, userId, "up");
}

export async function downvoteSuggestion(suggestionId, userId) {
  return voteSuggestion(suggestionId, userId, "down");
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