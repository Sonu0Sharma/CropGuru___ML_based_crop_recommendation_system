import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def train_model():
    """Trains the crop recommendation model and saves it."""
    # Load the dataset from the data folder
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'Crop_recommendation.csv')
    df = pd.read_csv(data_path)

    # Define features (inputs) and target (output)
    X = df[['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']]
    y = df['label']

    # We train on the full dataset for the final production model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Save the model to the same 'src' directory
    model_path = os.path.join(os.path.dirname(__file__), 'crop_recommendation_model.pkl')
    joblib.dump(model, model_path)
    print(f"Production model trained and saved to {model_path}")

if __name__ == '__main__':
    train_model()