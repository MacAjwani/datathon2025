from flask import Flask, request, jsonify
import numpy as np
import joblib
import xgboost as xgb
import re
import ast
import pandas as pd
from dateutil import parser
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
model = joblib.load("xgb_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        x = assemble_input_vector(data.get("rating_x"), data.get("review"), data.get("duration_str"), data.get("rating_y"), data.get("genres_str"), data.get("review_date"), data.get("release_date"), data.get("synopsis_text"))
        prediction = model.predict_proba(x.reshape(1, -1))
        print(prediction)
        spoiler_prob = prediction[0][1]
        threshold = 0.20
        return jsonify({"prediction": 1 if spoiler_prob >= threshold else 0})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def assemble_input_vector(rating_x, review, duration_str, rating_y, genres_str, review_date, release_date, synopsis_text):
    splr_word = 1 if has_splr_wrd(review) else 0
    word_count = len(review.split())
    duration = parse_duration(duration_str)
    genres = parse_genres(genres_str)
    time_diff = find_time_diff(review_date, release_date) 
    similarity_diff = compute_similarity(review, synopsis_text)  
    feature_vector = np.array([rating_x, splr_word, word_count, duration, rating_y] + genres + [time_diff, similarity_diff])
    print(feature_vector)
    return feature_vector

def has_splr_wrd(review):
    spoiler_words = {'alert', 'dy', 'kill', 'killed', 'spoiler'}
    return len(set(review.split()).intersection(spoiler_words)) != 0

def parse_duration(duration):
    matcher = re.match(r'(?:(\d+)h)?\s?(?:(\d+)min)?', duration.strip())
    hours = int(matcher.group(1)) if matcher.group(1) else 0
    minutes = int(matcher.group(2)) if matcher.group(2) else 0
    return hours * 60 + minutes

def parse_genres(genres_str):
    genres = set(ast.literal_eval(genres_str))
    all_genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
       'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music',
       'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War',
       'Western']
    
    return [1 if genre in genres else 0 for genre in all_genres]

def find_time_diff(review_date, release_date):
    return (parser.parse(review_date) - parser.parse(release_date)).days

def compute_similarity(review_text, synopsis_text):
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([review_text, synopsis_text])
    similarity_score = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
    return similarity_score

# Run the app
if __name__ == "__main__":
    app.run(debug=True)