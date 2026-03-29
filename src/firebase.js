import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 1. 보관함 기능을 불러옵니다.

const firebaseConfig = {
  apiKey: "AIzaSyC4vH3f1jqoRhRBpJRgoAWXZBZve_X8YY",
  authDomain: "calandar-413dd.firebaseapp.com",
  projectId: "calandar-413dd",
  storageBucket: "calandar-413dd.firebasestorage.app",
  messagingSenderId: "223769112722",
  appId: "1:223769112722:web:173eb233308604631c364b",
  measurementId: "G-TY2BWZ3DVK"
};

// Firebase 시작
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. 보관함(db)을 만들어서 밖으로 내보냅니다.
export const db = getFirestore(app); 
export default app;