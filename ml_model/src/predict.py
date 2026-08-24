import joblib
import os
import pandas as pd

FEATURE_NAMES = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']

def predict_crop(data):
    """Predicts the best crop to grow using the saved model."""
    # Construct the path to the saved model
    model_path = os.path.join(os.path.dirname(__file__), 'crop_recommendation_model.pkl')
    try:
        model = joblib.load(model_path)
    except FileNotFoundError:
        print(f"Error: The model file 'crop_recommendation_model.pkl' was not found.")
        return "Error: Model not found."

    # Ensure feature names are provided to avoid scikit-learn warnings
    if not isinstance(data, pd.DataFrame):
        data = pd.DataFrame(data, columns=FEATURE_NAMES)

    # The input 'data' must be a 2D structure
    prediction = model.predict(data)
    
    # The output of predict() is an array (e.g., ['rice']), so we return the first item.
    return prediction[0]