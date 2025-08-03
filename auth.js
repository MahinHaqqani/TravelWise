import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAdDJikR71zI7EI4XktHgZV7kxDSZ0XYFM",
  authDomain: "travelwise-29ed0.firebaseapp.com",
  projectId: "travelwise-29ed0",
  storageBucket: "travelwise-29ed0.appspot.com",
  messagingSenderId: "4340431701",
  appId: "1:4340431701:web:3d6dafe890fe36bc0e8ddc",
  measurementId: "G-V8CV336RNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// UI Elements
const authSection = document.getElementById("auth-section");
const plannerSection = document.getElementById("planner-section");
const userInfo = document.getElementById("user-info");
const welcomeMsg = document.getElementById("welcome-msg");
const logoutBtn = document.getElementById("logout-btn");
const tripForm = document.getElementById("tripForm");
const output = document.getElementById("output");

// Wait until the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  // Google Sign-In
  document.getElementById("signin-btn").addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        showPlannerForUser(result.user);
      })
      .catch((error) => {
        alert("Sign-in error: " + error.message);
      });
  });

  // Guest Mode
  document.getElementById("guest-btn").addEventListener("click", () => {
    signInAnonymously(auth)
      .then(() => {
        showPlannerForUser({ displayName: "Guest" });
      })
      .catch((error) => {
        alert("Guest login error: " + error.message);
      });
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("Signed out");
        location.reload();
      })
      .catch((error) => {
        alert("Logout error: " + error.message);
      });
  });
});

// Show planner UI
function showPlannerForUser(user) {
  authSection.style.display = "none";
  plannerSection.style.display = "block";
  userInfo.style.display = "block";
  welcomeMsg.textContent = `Welcome, ${user.displayName || user.email || "Guest"}`;
}

// Auto-login detection
onAuthStateChanged(auth, (user) => {
  if (user) {
    showPlannerForUser(user);
  }
});

// Handle trip form submission
tripForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const budget = document.getElementById("budget").value;
  const interests = Array.from(document.getElementById("interests").selectedOptions).map(option => option.value);

  const tripDetails = {
    destination,
    startDate,
    endDate,
    budget,
    interests
  };

  // Save trip to Firestore
  const tripsCollection = collection(firestore, "trips");
  await addDoc(tripsCollection, tripDetails);

  output.innerHTML = `<h3>Itinerary Generated for ${destination}</h3>`;
  output.innerHTML += `<p>Start Date: ${startDate}</p>`;
  output.innerHTML += `<p>End Date: ${endDate}</p>`;
  output.innerHTML += `<p>Budget: ₹${budget}</p>`;
  output.innerHTML += `<p>Interests: ${interests.join(", ")}</p>`;

  // Show map, weather, and flights
  displayMap(destination);
  displayWeather(destination);
  displayFlights(destination);
});

// Display Google Map
function displayMap(destination) {
  const mapFrame = document.getElementById("google-map");
  mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAdDJikR71zI7EI4XktHgZV7kxDSZ0XYFM&q=${destination}`;
  document.getElementById("map-section").style.display = "block";
}

// Display Weather (using OpenWeatherMap API as an example)
function displayWeather(destination) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=a8a6a242eb3f1c4f38a9f947f0336bf0`)
    .then(response => response.json())
    .then(data => {
      const weather = data.weather[0].description;
      const temp = Math.round(data.main.temp - 273.15); // Convert Kelvin to Celsius
      document.getElementById("weather-output").innerHTML = `<p>${weather}, ${temp}°C</p>`;
      document.getElementById("weather-section").style.display = "block";
    })
    .catch(error => {
      console.log(error);
      alert("Failed to load weather data");
    });
}

// Display Flights (Dynamic based on destination)
function displayFlights(destination) {
  const flights = getFlightDetails(destination);

  const flightList = document.getElementById("flight-list");
  flightList.innerHTML = "";  // Clear any previous flight data

  flights.forEach(flight => {
    const listItem = document.createElement("li");
    listItem.textContent = flight;
    flightList.appendChild(listItem);
  });

  // Show the flight section after displaying the flight list
  document.getElementById("flights-section").style.display = "block";
}

// Function to simulate fetching dynamic flight details based on destination
function getFlightDetails(destination) {
  const flightData = {
    "Paris": [
      "Flight 1: Delhi → Paris ₹40,000",
      "Flight 2: Mumbai → Paris ₹42,000",
      "Flight 3: Bengaluru → Paris ₹38,000"
    ],
    "New York": [
      "Flight 1: Delhi → New York ₹60,000",
      "Flight 2: Mumbai → New York ₹62,000",
      "Flight 3: Bengaluru → New York ₹58,000"
    ],
    "Tokyo": [
      "Flight 1: Delhi → Tokyo ₹50,000",
      "Flight 2: Mumbai → Tokyo ₹52,000",
      "Flight 3: Bengaluru → Tokyo ₹48,000"
    ],
    "London": [
      "Flight 1: Delhi → London ₹45,000",
      "Flight 2: Mumbai → London ₹47,000",
      "Flight 3: Bengaluru → London ₹43,000"
    ]
  };

  return flightData[destination] || ["No flights available for this destination"];
}
