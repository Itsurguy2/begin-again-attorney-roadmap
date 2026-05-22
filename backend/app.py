from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# =========================
# HEALTH CHECK
# =========================
@app.route("/")
def home():
    return jsonify({"message": "Attorney Roadmap API running"})

# =========================
# SCORE ANALYSIS ENDPOINT
# =========================
@app.route("/api/analyze-score", methods=["POST"])
def analyze_score():
    data = request.get_json()

    score = data.get("score", 0)
    name = data.get("name", "User")

    if score >= 360:
        level = "FAST-TRACK READY"
        message = "You are highly prepared for legal success."
    elif score >= 280:
        level = "POTENTIAL TO SUCCEED"
        message = "Strong potential with some improvements needed."
    elif score >= 200:
        level = "NOT YET READY"
        message = "You need more preparation before law school."
    else:
        level = "BUILD FOUNDATION FIRST"
        message = "Focus on discipline and consistency first."

    return jsonify({
        "name": name,
        "score": score,
        "level": level,
        "message": message
    })

# =========================
# RUN SERVER (DEPLOY READY)
# =========================
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)