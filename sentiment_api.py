from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)
CORS(app)  # allow cross-origin requests

@app.route('/sentiment', methods=['POST'])
def sentiment():
    data = request.get_json()
    text = data.get('text', '')
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    print(f"Text: {text} | Polarity: {polarity}")  # Debugging log

    # Improved thresholding
    if polarity > 0.01:
        label = "positive"
    elif polarity < -0.01:
        label = "negative"
    else:
        label = "neutral"

    return jsonify({"label": label})

if __name__ == '__main__':
    app.run(debug=True)
