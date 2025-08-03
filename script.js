document.getElementById("tripForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get values from the form
    const destination = document.getElementById("destination").value;
    const mapURL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAdDJikR71zI7EI4XktHgZV7kxDSZ0XYFM&q=${destination}`;
    
    // Update the iframe src dynamically
    const googleMap = document.getElementById("google-map");
    googleMap.src = mapURL;
    
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const budget = document.getElementById("budget").value;
    const interests = Array.from(document.getElementById("interests").selectedOptions).map(option => option.value);

    // Display a message while the itinerary is being generated
    const resultDiv = document.getElementById("output");
    resultDiv.innerHTML = "<p>⏳ Generating your itinerary...</p>";

    // Check if all required fields are filled
    if (!destination || !startDate || !endDate || !budget || interests.length === 0) {
        resultDiv.innerHTML = "<p style='color:red;'>❌ Please fill in all fields before submitting.</p>";
        return;
    }

    try {
        // Fetch request to generate itinerary
        const response = await fetch("http://127.0.0.1:5000/generate-itinerary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination, startDate, endDate, budget, interests })
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error("Failed to fetch itinerary");
        }

        // Parse the response as JSON
        const result = await response.json();

        // Handle case if the response does not contain valid itinerary data
        if (!result.plan || !result.destination) {
            resultDiv.innerHTML = `<p style="color:red;">❌ Invalid response data. Please try again later.</p>`;
            return;
        }

        // Build the output for the itinerary
        let output = `<h2>📅 Itinerary for ${result.destination}</h2>`;
        result.plan.forEach(day => {
            output += `<h3>${day.day}</h3><ul>`;
            day.activities.forEach(activity => {
                output += `<li>🗺️ ${activity}</li>`;
            });
            output += `</ul>`;
        });

        // Update the resultDiv with the generated itinerary
        resultDiv.innerHTML = output;

        // Dynamically update map
        const googleMap = document.getElementById("google-map");
        googleMap.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDgyaTo7x9zOLzUDyfG_Rfl788S49FHHDo&q=${destination}`;

        // Show the map section
        document.getElementById("map-section").style.display = "block";

        // Show weather forecast (using a static message for simplicity)
        document.getElementById("weather-section").style.display = "block";
        document.getElementById("weather-output").innerHTML = `🌤️ The weather forecast for ${destination} is sunny with a temperature of 25°C.`;

        // Show flight suggestions (using placeholder data here for simplicity)
        document.getElementById("flights-section").style.display = "block";
        const flightsHTML = `
            <li><a href="https://www.google.com/search?q=flight+from+Delhi+to+${destination}" target="_blank">Flight 1: Delhi → ${destination} ₹45,000</a></li>
            <li><a href="https://www.google.com/search?q=flight+from+Mumbai+to+${destination}" target="_blank">Flight 2: Mumbai → ${destination} ₹47,000</a></li>
            <li><a href="https://www.google.com/search?q=flight+from+Bengaluru+to+${destination}" target="_blank">Flight 3: Bengaluru → ${destination} ₹43,000</a></li>
        `;
        document.getElementById("flight-list").innerHTML = flightsHTML;
        // Hotels section
        if (result.hotels && result.hotels.length > 0) {
            let hotelsHTML = `<h2>🏨 Hotel Recommendations</h2><ul style="list-style:none; padding-left:0;">`;
            result.hotels.slice(0, 5).forEach(hotel => {
                hotelsHTML += `
                    <li style="margin-bottom:15px; border-bottom:1px solid #ccc; padding-bottom:10px;">
                        <a href="${hotel.link}" target="_blank" style="font-weight:bold; font-size:1.1em; color:#2a7ae2; text-decoration:none;">
                            ${hotel.name}
                        </a> <br>
                        <span>Price: ₹${hotel.price}</span> | 
                        <span>⭐ Rating: ${hotel.rating}</span> | 
                        <span>Type: ${hotel.type}</span>
                    </li>
                `;
            });
            hotelsHTML += `</ul>`;
            document.getElementById("hotels-output").innerHTML = hotelsHTML;
            document.getElementById("hotels-section").style.display = "block";
        } else {
            document.getElementById("hotels-output").innerHTML = `<p>No hotels found.</p>`;
        }
        
    } 
    catch (error) {
        console.error("Error:", error);
        resultDiv.innerHTML = `<p style="color:red;">❌ Failed to generate itinerary. Make sure the Flask server is running.</p>`;
    }
});
