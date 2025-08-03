// reviewService.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// 🔍 Analyze sentiment via your ML API
async function analyzeSentiment(text) {
  try {
    const res = await fetch("http://127.0.0.1:5000/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const result = await res.json();
    return result.label || "Unknown";
  } catch (err) {
    console.error("Sentiment analysis failed:", err);
    return "Unknown";
  }
}

// ✍️ Add new review to Firestore with sentiment & user info
export async function submitReview(activity, text, rating) {
  const sentiment = await analyzeSentiment(text);
  const username = localStorage.getItem("loggedInUser") || "guest";

  await addDoc(collection(db, "reviews"), {
    activity,
    review: text,
    rating: parseInt(rating),
    sentiment,
    user: username,
    timestamp: Date.now()
  });
}

// 📥 Listen and render reviews with sentiment badges
export function loadReviews(activity) {
  const q = query(collection(db, "reviews"), where("activity", "==", activity));
  const container = document.getElementById(`reviews-${activity}`);

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = "<p>No reviews yet.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const time = new Date(data.timestamp).toLocaleString();
      const sentimentColor =
        data.sentiment === "Positive" ? "#4CAF50" :
        data.sentiment === "Negative" ? "#F44336" : "#9E9E9E";

      container.innerHTML += `
        <div style="margin-top: 10px; padding:10px; background:#f9f9f9; border-radius:8px;">
          <strong>${data.user}</strong> <span style="color:#666;">(${time})</span><br>
          <span style="color:gold;">${"⭐️".repeat(data.rating)}</span><br>
          <span style="background:${sentimentColor}; color:white; padding:2px 6px; border-radius:4px; font-size:12px;">
            ${data.sentiment}
          </span>
          <p>${data.review}</p>
        </div>
      `;
    });
  });
}
