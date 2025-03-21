# app.py
from flask import Flask, request, jsonify, render_template
import pandas as pd
import joblib

# Initialize Flask app
app = Flask(__name__)

# Load trained model and LabelEncoder
model = joblib.load("air_quality_model.pkl")
label_classes = ["Good", "Hazardous", "Moderate", "Poor"]
le = joblib.load("label_encoder.pkl")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data from request
        data = request.json

        # Prepare input features as DataFrame
        user_data = pd.DataFrame({
            "Temperature": [float(data["temperature"])],
            "Humidity": [float(data["humidity"])],
            "PM2.5": [float(data["pm25"])],
            "PM10": [float(data["pm10"])],
            "NO2": [float(data["no2"])],
            "SO2": [float(data["so2"])],
            "CO": [float(data["co"])],
            "Proximity_to_Industrial_Areas": [float(data["industrialProximity"])],
            "Population_Density": [int(data["populationDensity"])]
        })

        # Make predictions
        prediction = model.predict(user_data)
        
        # Decode prediction to original class
        predicted_label = le.inverse_transform(prediction)[0]

        # Return JSON response
        return jsonify({"prediction": predicted_label})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
