import unittest
import json
import sys
import os

# Add backend directory and root directory to system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app import app
from ml_model.src.predict import predict_crop
import numpy as np

class CropGuruTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_homepage_loads(self):
        """Test if the home page loads successfully (HTTP 200)."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'CropGuru', response.data)

    def test_health_check(self):
        """Test if the /health endpoint returns 200 and awake status."""
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('status'), 'healthy')

    def test_prediction_api_rice(self):
        """Test the /predict endpoint for Rice parameters."""
        payload = {
            'n': 90,
            'p': 42,
            'k': 43,
            'ph': 6.5,
            'temperature': 20.8,
            'humidity': 82.0,
            'rainfall': 202.9
        }
        response = self.app.post('/predict',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('recommendation', data)
        self.assertEqual(data['recommendation'].lower(), 'rice')

    def test_direct_model_prediction(self):
        """Test direct ML model prediction function."""
        features = np.array([[90, 42, 43, 6.5, 20.8, 82.0, 202.9]])
        pred = predict_crop(features)
        self.assertEqual(pred.lower(), 'rice')

if __name__ == '__main__':
    unittest.main()
