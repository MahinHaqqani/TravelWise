from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)  # Allows frontend to access backend

# Sample activity database
sample_places = {
    "sightseeing": ["Visit famous landmarks", "City bus tour", "Sunset point"],
    "nature": ["Park walk", "Hike to viewpoint", "Botanical garden"],
    "history": ["Museum", "Heritage fort", "Old town walking tour"],
    "food": ["Local street food", "Try top-rated café", "Food market visit"],
    "adventure": ["Zip lining", "Kayaking", "Mountain biking"]
}

@app.route('/generate-itinerary', methods=['POST'])
def generate_itinerary():
    data = request.json
    destination = data['destination']
    start = datetime.strptime(data['startDate'], "%Y-%m-%d")
    end = datetime.strptime(data['endDate'], "%Y-%m-%d")
    interests = data['interests']

    days = (end - start).days + 1
    itinerary = []

    # Generate itinerary based on selected interests and dates
    for i in range(days):
        day_plan = {"day": f"Day {i+1}", "activities": []}
        for interest in interests:
            activity = sample_places.get(interest, ["Explore local area"])[i % 3]
            day_plan["activities"].append(f"{interest.capitalize()}: {activity}")
        itinerary.append(day_plan)

    # Load hotel data
    try:
        with open("hotels.json", "r") as f:
            hotel_data = json.load(f)
        hotels = hotel_data.get(destination, [])
    except Exception as e:
        print(f"Error reading hotels.json: {e}")
        hotels = []

    # Send hotels + itinerary to frontend
    return jsonify({
        "destination": destination,
        "days": days,
        "plan": itinerary,
        "hotels": hotels[:5]  # Send minimum 5 if available
    })

if __name__ == '__main__':
    app.run(debug=True)
