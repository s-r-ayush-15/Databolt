from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Import CORS
import pandas as pd
import joblib
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Load trained model and LabelEncoder
try:
    model = joblib.load("air_quality_model.pkl")
    le = joblib.load("label_encoder.pkl")
    label_classes = ["Good", "Hazardous", "Moderate", "Poor"]
    logging.info("Model and LabelEncoder loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model or LabelEncoder: {e}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data from request
        data = request.json
        logging.debug(f"Received data: {data}")

        # Prepare input features as DataFrame
        user_data = pd.DataFrame({
            "Temperature": [float(data.get("temperature", 0))],
            "Humidity": [float(data.get("humidity", 0))],
            "PM2.5": [float(data.get("pm25", 0))],
            "PM10": [float(data.get("pm10", 0))],
            "NO2": [float(data.get("no2", 0))],
            "SO2": [float(data.get("so2", 0))],
            "CO": [float(data.get("co", 0))],
            "Proximity_to_Industrial_Areas": [float(data.get("industrialProximity", 0))],
            "Population_Density": [int(data.get("populationDensity", 0))]
        })

        logging.debug(f"Prepared data for prediction: {user_data}")

        # Make predictions
        prediction = model.predict(user_data)
        logging.debug(f"Raw prediction: {prediction}")

        # Decode prediction to original class
        predicted_label = le.inverse_transform(prediction)[0]
        logging.debug(f"Decoded prediction: {predicted_label}")

        # Return JSON response
        return jsonify({"prediction": predicted_label})

    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)