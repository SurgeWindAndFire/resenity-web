import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  deleteDoc,
  updateDoc,
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
    const team1Prob = predictionData.result.team1Probability || 50;
    const team2Prob = predictionData.result.team2Probability || 50;
    const winner = predictionData.result.winner || (team1Prob >= team2Prob ? "team1" : "team2");

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      team1: predictionData.team1,
      team2: predictionData.team2,
      result: {
        team1Probability: team1Prob,
        team2Probability: team2Prob,
        confidence: predictionData.result.confidence || "Medium",
        factors: predictionData.result.factors || [],
        winner: winner
      },
      createdAt: serverTimestamp(),
      outcome: "pending",
      outcomeUpdatedAt: null,
      wasCorrect: null
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving prediction:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserPredictions(userId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const predictions = [];
    
    snapshot.forEach((doc) => {
      predictions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: predictions };
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return { success: false, error: error.message };
  }
}

export async function getPrediction(predictionId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, predictionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } 
      };
    } else {
      return { success: false, error: "Prediction not found" };
    }
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePrediction(predictionId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, predictionId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting prediction:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update the outcome of a prediction
 * @param {string} predictionId 
 * @param {string} outcome 
 * @param {string} predictedWinner
 */
export async function updatePredictionOutcome(predictionId, outcome, predictedWinner) {
  try {
    const docRef = doc(db, COLLECTION_NAME, predictionId);
    
    let wasCorrect = null;
    
    if (outcome === "won") {
      wasCorrect = predictedWinner === "team1";
    } else if (outcome === "lost") {
      wasCorrect = predictedWinner === "team2";
    }
    
    await updateDoc(docRef, {
      outcome,
      outcomeUpdatedAt: serverTimestamp(),
      wasCorrect
    });
    
    return { success: true, wasCorrect };
  } catch (error) {
    console.error("Error updating prediction outcome:", error);
    return { success: false, error: error.message };
  }
}

export async function clearPredictionOutcome(predictionId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, predictionId);
    
    await updateDoc(docRef, {
      outcome: "pending",
      outcomeUpdatedAt: null,
      wasCorrect: null
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error clearing prediction outcome:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserStats(userId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const predictions = [];
    
    snapshot.forEach((doc) => {
      predictions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    const total = predictions.length;
    const completed = predictions.filter(p => p.outcome && p.outcome !== "pending").length;
    const pending = total - completed;
    const correct = predictions.filter(p => p.wasCorrect === true).length;
    const incorrect = predictions.filter(p => p.wasCorrect === false).length;
    
    const accuracy = completed > 0 ? Math.round((correct / completed) * 100) : null;
    
    const byConfidence = {
      high: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      low: { total: 0, correct: 0 }
    };
    
    const byTeamPicked = {
      team1: { total: 0, correct: 0 },
      team2: { total: 0, correct: 0 }
    };
    
    const recentCompleted = predictions
      .filter(p => p.outcome && p.outcome !== "pending")
      .slice(0, 10);
    
    const recentCorrect = recentCompleted.filter(p => p.wasCorrect === true).length;
    const recentAccuracy = recentCompleted.length > 0 
      ? Math.round((recentCorrect / recentCompleted.length) * 100) 
      : null;
    
    predictions.forEach(p => {
      if (p.outcome && p.outcome !== "pending" && p.result) {
        const winProbability = Math.max(p.result.team1Probability || 50, p.result.team2Probability || 50);
        
        if (winProbability >= 70) {
          byConfidence.high.total++;
          if (p.wasCorrect) byConfidence.high.correct++;
        } else if (winProbability >= 55) {
          byConfidence.medium.total++;
          if (p.wasCorrect) byConfidence.medium.correct++;
        } else {
          byConfidence.low.total++;
          if (p.wasCorrect) byConfidence.low.correct++;
        }
        
        if (p.result.winner === "team1") {
          byTeamPicked.team1.total++;
          if (p.wasCorrect) byTeamPicked.team1.correct++;
        } else if (p.result.winner === "team2") {
          byTeamPicked.team2.total++;
          if (p.wasCorrect) byTeamPicked.team2.correct++;
        }
      }
    });
    
    const calculateAccuracy = (obj) => {
      return obj.total > 0 ? Math.round((obj.correct / obj.total) * 100) : null;
    };
    
    return {
      success: true,
      data: {
        total,
        completed,
        pending,
        correct,
        incorrect,
        accuracy,
        recentAccuracy,
        recentGames: recentCompleted.length,
        byConfidence: {
          high: { ...byConfidence.high, accuracy: calculateAccuracy(byConfidence.high) },
          medium: { ...byConfidence.medium, accuracy: calculateAccuracy(byConfidence.medium) },
          low: { ...byConfidence.low, accuracy: calculateAccuracy(byConfidence.low) }
        },
        byTeamPicked: {
          team1: { ...byTeamPicked.team1, accuracy: calculateAccuracy(byTeamPicked.team1) },
          team2: { ...byTeamPicked.team2, accuracy: calculateAccuracy(byTeamPicked.team2) }
        },
        predictions: predictions.slice(0, 20)
      }
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { success: false, error: error.message };
  }
}