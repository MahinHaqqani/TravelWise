// reviewService.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// 🔍 Sentiment API
async function analyzeSentiment(text) {
  try {
    const res = await fetch("http://127.0.0.1:5000/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    return (data.label || "neutral").toLowerCase();
  } catch {
    return "neutral";
  }
}

// ✍️ Submit review
async function submitUserReview(activityId) {
  console.log("🟢 Submit clicked for:", activityId);

  const reviewEl = document.getElementById(`review-${activityId}`);
  const ratingEl = document.getElementById(`rating-${activityId}`);

  if (!reviewEl || !ratingEl) {
    alert("Review elements not found");
    return;
  }

  const text = reviewEl.value.trim();
  const rating = Number(ratingEl.value);

  if (!text) {
    alert("Please write a review");
    return;
  }

  const review = {
    user: localStorage.getItem("loggedInUser") || "guest",
    text,
    rating,
    sentiment: "neutral",
    timestamp: Date.now()
  };

  try {
    await firebase.database().ref(`reviews/${activityId}`).push(review);
    console.log("✅ Review saved");

    reviewEl.value = "";
    document.getElementById(`form-${activityId}`).style.display = "none";

    // 🔥 FORCE refresh reviews
    loadReviewsOnce(activityId);

  } catch (err) {
    console.error("❌ Review save failed:", err);
    alert("Failed to submit review");
  }
}

// 📥 Load reviews
function loadReviewsOnce(activityId) {
  const container = document.getElementById(`reviews-${activityId}`);
  if (!container) return;

  firebase.database()
    .ref(`reviews/${activityId}`)
    .once("value")
    .then(snapshot => {
      const data = snapshot.val();

      if (!data) {
        container.innerHTML = "<p>No reviews yet.</p>";
        return;
      }

      const reviews = Object.values(data);

      container.innerHTML = reviews.map(r => `
        <div style="background:#f9f9f9;padding:10px;border-radius:8px;margin:10px 0;">
          <strong>${r.user}</strong><br>
          <span style="color:gold">${"⭐".repeat(r.rating)}</span>
          <p>${r.text}</p>
        </div>
      `).join("");
    });
}