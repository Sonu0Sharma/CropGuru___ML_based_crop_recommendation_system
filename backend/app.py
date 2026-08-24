from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sys
import os
import numpy as np

# Add project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ml_model.src.predict import predict_crop

# Initialize the Flask app with template and static paths
app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

# Enable Cross-Origin Resource Sharing (CORS) for external frontend hosting (e.g. GitHub Pages)
CORS(app)

# Health check / ping endpoint (used to pre-warm the backend server on visitor arrival)
@app.route('/health', methods=['GET', 'HEAD'])
@app.route('/ping', methods=['GET', 'HEAD'])
def health_check():
    """Health check endpoint to pre-warm the backend server on visitor arrival."""
    return jsonify({
        'status': 'healthy',
        'service': 'CropGuru Backend API',
        'message': 'Server is awake and ready to serve predictions!'
    }), 200

# Route for the home page (when accessed via Flask directly)
@app.route('/')
def home():
    """Renders the main HTML page."""
    return render_template('index.html')

# Route that handles the crop prediction logic
@app.route('/predict', methods=['POST'])
def predict():
    """Receives input data from the form, makes a prediction, and returns it."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        # Create a numpy array in the exact order the model expects
        features = np.array([[
            float(data['n']),
            float(data['p']),
            float(data['k']),
            float(data['ph']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['rainfall'])
        ]])

        # Call the prediction function
        recommendation = predict_crop(features)
        
        response = {
            'recommendation': recommendation.title(),
            'suggestion': f"For the given soil and climate conditions, {recommendation.title()} is the most suitable crop to cultivate."
        }

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)