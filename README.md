# 🌾 CropGuru: ML-Driven Precision Crop Recommendation System

> **An Intelligent Full-Stack Precision Agriculture & Agronomic Advisory Platform**

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-3.1.3-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/scikit--learn-1.9.0-F7931E?style=flat-square&logo=scikitlearn&logoColor=white" alt="scikit-learn">
  <img src="https://img.shields.io/badge/Model-Random_Forest-2e7d32?style=flat-square" alt="Random Forest">
  <img src="https://img.shields.io/badge/Accuracy-99.55%25-brightgreen?style=flat-square" alt="Accuracy">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
</p>

---

### 🔗 Project Links & Resources
* 👉 **Live Web Application**: https://sonu0sharma.github.io/CropGuru___ML_based_crop_recommendation_system/
* 👉 **GitHub Repository**: https://github.com/Sonu0Sharma/CropGuru___ML_based_crop_recommendation_system
* 👉 **Kaggle Collection**: https://www.kaggle.com/work/collections/19016604
* 👉 **Medium Technical Deep-Dive**: https://medium.com/@sonusharmaofficial01mail

---

## 📖 Table of Contents
1. [Abstract & Problem Background](#-abstract--problem-background)
2. [Ideation & Architectural Thinking](#-ideation--architectural-thinking)
3. [Key Features](#-key-features)
4. [Hybrid Cloud Architecture & Cold-Start Strategy](#-hybrid-cloud-architecture--cold-start-strategy)
5. [Machine Learning Engine & Benchmarks](#-machine-learning-engine--benchmarks)
6. [Technology Stack & Exact Versions](#-technology-stack--exact-versions)
7. [Repository Structure](#-repository-structure)
8. [Local Development Setup](#-local-development-setup)
9. [Automated Testing Suite](#-automated-testing-suite)
10. [Author & Support](#-author--support)

---

## 📌 Abstract & Problem Background

Over **80% of farmers in India operate on smallholder lands** under 2 hectares. For generations, seasonal crop planning has relied heavily on historical intuition or peer habits. However, accelerated climate variations, unpredictable monsoon shifts, and indiscriminate chemical fertilizer application have made traditional guesswork hazardous, leading to soil degradation, severe yield collapse, and devastating debt cycles.

**CropGuru** was engineered to solve this agricultural challenge by transforming **7 fundamental soil chemical and meteorological parameters** (Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Soil pH, and Rainfall) into instant, scientifically optimized crop recommendations and actionable cultivation advisory.

---

## 💡 Ideation & Architectural Thinking

When designing **CropGuru**, several key engineering decisions were prioritized:

1. **Why Random Forest over Deep Learning?**  
   Tabular agro-climatic datasets with 2,200 rows do not benefit from heavy deep neural networks, which are prone to overfitting and require high compute. An ensemble of 100 decorrelated decision trees achieves **99.55% accuracy**, is highly explainable, and executes in **~8.5 milliseconds**.

2. **Why a Lightweight Custom Assistant (Bhoomi AI) instead of LLMs?**  
   Calling general-purpose Large Language Models (like GPT-4 or Claude) for simple crop cultivation inquiries introduces high API latency, recurring billing costs, and hallucinations. Instead, **Bhoomi AI** was engineered as a custom, lightweight, deterministic expert guidance system embedded directly into the frontend. It delivers instant, zero-latency agronomic responses with 100% domain accuracy and zero operational cost.

3. **Solving Free Cloud "Cold Starts" (Hybrid Cloud Design):**  
   Free-tier hosting providers (like Render) spin down servers after 15 minutes of inactivity, resulting in a 40–50 second delay on the next request. By hosting the frontend statically on **GitHub Pages CDN** and dispatching an asynchronous background `/health` pre-warming ping on page load, the Render backend wakes up while the farmer is typing soil details, guaranteeing instantaneous predictions when clicking **Recommend Crop**.

---

## 🚀 Key Features

* **🧠 99.55% Accurate ML Recommendation Engine**: Evaluates soil Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Soil pH, Temperature, Relative Humidity, and Rainfall across 22 major Indian crop categories.
* **📍 One-Click Geolocation & Live Weather Autofill**: Automatically detects field coordinates via the HTML5 Geolocation API and retrieves real-time local temperature and humidity using the free Open-Meteo API without requiring API keys.
* **🤖 Bhoomi AI Conversational Assistant**: Embedded agricultural advisor providing structured guidelines on sowing windows, N-P-K schedules, irrigation cycles, and pest protection.
* **📄 Printable Agricultural Factsheets**: Complete cultivation dossiers optimized for physical printing (`@media print`) for offline field sharing.
* **🌓 Persistent Dark / Light Theme**: Eye-friendly interface designed for bright outdoor field sunlight and nighttime review, persisted in `localStorage`.

---

## 🏗️ Hybrid Cloud Architecture & Cold-Start Strategy

```text
[ Client Browser ]
       │
       ├─► (1. Sub-300ms Load) ──► [ GitHub Pages CDN (Static Frontend: HTML5 / CSS3 / JS) ]
       │
       ├─► (2. Background Ping) ─► [ Render WSGI API: GET /health (Pre-Warms Sleeping Server) ]
       │
       └─► (3. Form POST /predict)
                     │
                     ▼
       [ Flask REST API on Render (Python 3.12 + Gunicorn + CORS) ]
                     │
                     ▼ (joblib.load)
       [ Random Forest Classifier (99.55% Accuracy @ 8.5ms Latency) ]
                     │
                     ▼
       [ Instant JSON Response: Recommended Crop + Advisory Guide ]
```

---

## 📊 Machine Learning Engine & Benchmarks

Benchmarked across 7 classification algorithms under **5-Fold Stratified Cross-Validation** on the [Kaggle Crop Recommendation Dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset):

| Algorithm | 5-Fold CV Mean | Test Accuracy | Precision | Recall | F1-Score | Inference Latency |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Classifier (100 Trees)** 🏆 | **99.38% (±0.45%)** | **99.55%** | **99.57%** | **99.55%** | **99.55%** | **~8.5 ms** |
| **Gaussian Naive Bayes** | 99.38% (±0.40%) | 99.55% | 99.58% | 99.55% | 99.55% | ~2.1 ms |
| **Gradient Boosting Classifier** | 98.75% (±0.72%) | 99.32% | 99.36% | 99.32% | 99.32% | ~3.8 ms |
| **Decision Tree Classifier** | 98.64% (±0.62%) | 98.64% | 98.70% | 98.64% | 98.64% | ~0.7 ms |
| **Support Vector Machine (SVC)** | 97.90% (±0.51%) | 98.18% | 98.29% | 98.18% | 98.17% | ~12.3 ms |
| **Logistic Regression (Multinomial)** | 96.76% (±0.85%) | 97.50% | 97.58% | 97.50% | 97.49% | ~0.8 ms |
| **K-Nearest Neighbors (KNN)** | 97.50% (±0.68%) | 96.59% | 96.71% | 96.59% | 96.55% | ~9.2 ms |

---

## 🛠️ Technology Stack & Exact Versions

### Backend & Cloud API
* **Python**: `3.12.4`
* **Flask**: `3.1.3` (REST API & WSGI routing)
* **Flask-CORS**: `6.0.5` (Cross-Origin Resource Sharing)
* **Gunicorn**: `26.2.0` (Production WSGI Server)
* **Jinja2**: `3.1.6` (Server-side templating)

### Machine Learning & Data Science
* **scikit-learn**: `1.9.0` (Random Forest, StratifiedKFold, Pipeline)
* **pandas**: `3.0.5` (Data ingestion & manipulation)
* **NumPy**: `2.5.2` (Vectorized computations)
* **joblib**: `1.5.3` (Model serialization)
* **Matplotlib**: `3.11.1` & **Seaborn**: `0.13.2` (Data visualization)

### Frontend & APIs
* **HTML5 & Vanilla CSS3**: CSS Custom Properties, Flexbox, Grid, Glassmorphism, Print Stylesheets.
* **Vanilla JavaScript (ES6+)**: Asynchronous `fetch`, DOM mutations, form validation.
* **Open-Meteo Weather API**: Real-time meteorological data fetching.
* **HTML5 Geolocation API**: Coordinates acquisition.

---

## 📂 Repository Structure

```text
cropguru/
├── backend/
│   └── app.py                                  # Flask REST API with CORS & /health endpoints
├── docs/                                       # Standalone static distribution for GitHub Pages
│   ├── index.html                              # Static landing page
│   └── static/                                 # CSS, JS, and Image assets
├── frontend/
│   ├── static/
│   │   ├── css/                                # style.css, chatbot.css
│   │   ├── images/                             # Logos and avatars
│   │   └── js/                                 # script.js, chatbot_content.js
│   └── templates/                              # index.html, chatbot.html (Jinja2)
├── ml_model/
│   ├── data/
│   │   └── Crop_recommendation.csv             # 2,200 Pan-India agricultural samples
│   ├── notebooks/
│   │   ├── Model_Development.ipynb            # Exploratory Data Analysis & visual charts
│   │   └── Model_Comparison_and_Benchmarking.ipynb # 7-Model benchmark notebook with plots
│   ├── src/
│   │   ├── train.py                           # Model training pipeline
│   │   ├── predict.py                         # Prediction handler
│   │   └── crop_recommendation_model.pkl      # Production Random Forest model
│   └── CropGuru_README.ipynb                  # Kaggle documentation notebook
├── tests/
│   ├── browser_test.js                        # Automated browser console test suite
│   ├── test_backend.py                        # Python unittest suite for backend & ML
│   └── README.md                              # Test execution instructions
├── .gitignore
├── Procfile                                   # Render WSGI deployment command
├── requirements.txt                           # Production Python dependencies
└── README.md                                  # Repository documentation
```

---

## 💻 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Sonu0Sharma/CropGuru___ML_based_crop_recommendation_system.git
cd CropGuru___ML_based_crop_recommendation_system
```

### 2. Create and Activate Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Train the Model (Optional)
```bash
python ml_model/src/train.py
```

### 5. Run the Local Server
```bash
python backend/app.py
```
Open **`http://127.0.0.1:5001`** in your browser.

---

## 🧪 Automated Testing Suite

### 1. Backend & ML Model Unit Tests
```bash
python -m unittest tests/test_backend.py
```

### 2. Browser End-to-End Test Suite
1. Open `http://127.0.0.1:5001` in your browser.
2. Open Developer Tools Console (`F12` or `Cmd + Option + J`).
3. Paste the contents of [`tests/browser_test.js`](tests/browser_test.js) and press Enter.

---

## 👨‍💻 Author & Support

**Sonu Sharma**  
*Full-Stack ML & Software Engineer*

* 📧 **Email**: [sonusharma15772@gmail.com](mailto:sonusharma15772@gmail.com)
* 💼 **LinkedIn**: [linkedin.com/in/sonu-sharma1000](https://www.linkedin.com/in/sonu-sharma1000/)
* 🐦 **X (Twitter)**: [x.com/Sonu001Sharma](https://x.com/Sonu001Sharma)
* 💻 **GitHub**: [github.com/Sonu0Sharma](https://github.com/Sonu0Sharma)
* 📊 **Kaggle**: [kaggle.com/work/collections/19016604](https://www.kaggle.com/work/collections/19016604)
* ✍️ **Medium**: [medium.com/@sonusharmaofficial01mail](https://medium.com/@sonusharmaofficial01mail)

---

<p align="center">
  ⭐ <strong>If you found this project helpful, please consider starring the repository on GitHub and upvoting on Kaggle!</strong> ⭐
</p>
