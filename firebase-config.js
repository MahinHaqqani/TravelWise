// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcNHr2Em_tPYwiasw7L1ayQ7hHCnDaYhc",
  authDomain: "tripgenie-6fb92.firebaseapp.com",
  databaseURL: "https://tripgenie-6fb92-default-rtdb.firebaseio.com",
  projectId: "tripgenie-6fb92",
  storageBucket: "tripgenie-6fb92.appspot.com",
  messagingSenderId: "813945038133",
  appId: "1:813945038133:web:e24a4aa31b101c9663587c",
  measurementId: "G-BJSFM382Y9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
