import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCcNHr2Em_tPYwiasw7L1ayQ7hHCnDaYhc",
  authDomain: "tripgenie-6fb92.firebaseapp.com",
  databaseURL: "https://tripgenie-6fb92-default-rtdb.firebaseio.com",
  projectId: "tripgenie-6fb92",
  storageBucket: "tripgenie-6fb92.firebasestorage.app",
  messagingSenderId: "813945038133",
  appId: "1:813945038133:web:e24a4aa31b101c9663587c",
  measurementId: "G-BJSFM382Y9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };