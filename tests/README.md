# CropGuru Test Suite

This folder contains automated testing scripts for both frontend (browser) and backend (API & ML model) components.

---

## 1. Browser Test (`browser_test.js`)

An automated, non-invasive end-to-end JavaScript test suite that runs directly in your browser without requiring extra testing libraries like Selenium or Cypress.

### How to Run:
1. Start the Flask server:
   ```bash
   python backend/app.py
   ```
2. Open `http://127.0.0.1:5000` in your web browser (Chrome, Firefox, Edge, Safari).
3. Open the browser Developer Console:
   - **Windows/Linux**: Press `F12` or `Ctrl + Shift + J`
   - **Mac**: Press `Cmd + Option + J`
4. Copy the entire contents of [`browser_test.js`](browser_test.js), paste into the console, and press **Enter**.
5. The script will automatically:
   - Verify all DOM elements & layouts
   - Test Welcome popup dismissal
   - Test Dark/Light mode toggle
   - Populate soil and climate input fields
   - Submit the prediction form and verify the ML recommendation
   - Test the Cultivation Guide modal popup
   - Test Bhoomi AI chatbot navigation & menus
   - Print a color-coded test report in the console

---

## 2. Backend & ML Model Test (`test_backend.py`)

A Python `unittest` test suite that verifies the Flask endpoints and machine learning model predictions.

### How to Run:
```bash
# Make sure your virtual environment is activated
source venv/bin/activate

# Run the test suite
python -m unittest tests/test_backend.py
```
