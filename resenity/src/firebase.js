import { get } from "express/lib/response";
import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyATYPFBE432scrEoS5OMaZ-FNPsiBiM-MA",
    authDomain: "resenity-28203.firebaseapp.com",
    projectId: "resenity-28203",
    storageBucket: "resenity-28203.firebasestorage.app",
    messagingSenderId: "391489603054",
    appId: "1:391489603054:web:964013d619018a5573faff"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;