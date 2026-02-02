import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  deleteDoc,
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_NAME = "predictions";

export async function savePrediction(userId, predictionData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      team1: predictionData.team1,
      team2: predictionData.team2,
      result: {
        team1Probability: predictionData.result.team1Probability,
        team2Probability: predictionData.result.team2Probability,
        confidence: predictionData.result.confidence,
        factors: predictionData.result.factors,
        winner: predictionData.result.winner
      },
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error saving prediction:", error);
    return { success: false, error };
  }
}

export async function getUserPredictions(userId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const predictions = [];
    querySnapshot.forEach((doc) => {
      predictions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { predictions, success: true };
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return { predictions: [], success: false, error };
  }
}

export async function getPredictionById(predictionId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, predictionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        prediction: { id: docSnap.id, ...docSnap.data() }, 
        success: true 
      };
    } else {
      return { prediction: null, success: false, error: "Not found" };
    }
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return { prediction: null, success: false, error };
  }
}

export async function deletePrediction(predictionId) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, predictionId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting prediction:", error);
    return { success: false, error };
  }
}