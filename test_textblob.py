from textblob import TextBlob

texts = ["I love this product!", "This is terrible!", "It’s okay."]
for text in texts:
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    print(f"Text: {text} | Polarity: {polarity} | Full Sentiment: {blob.sentiment}")
