/**
 * CropGuru Automated Browser Test Suite
 * 
 * HOW TO RUN:
 * 1. Open CropGuru in your browser (e.g. http://127.0.0.1:5000)
 * 2. Open Developer Tools (Press F12 or Right Click -> Inspect -> Console)
 * 3. Copy and paste this entire script into the console and press Enter
 * 4. Watch the automated test suite execute and view the test summary report!
 */

(async function runCropGuruTestSuite() {
    const results = [];
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function logHeader(text) {
        console.log(`%c=== ${text} ===`, 'color: #2e7d32; font-weight: bold; font-size: 14px;');
    }

    function recordResult(testName, passed, details = '') {
        results.push({ testName, passed, details });
        if (passed) {
            console.log(`%c✔ PASS: ${testName}`, 'color: #2e7d32; font-weight: bold;', details);
        } else {
            console.error(`✖ FAIL: ${testName}`, details);
        }
    }

    console.clear();
    logHeader('STARTING CROPGURU AUTOMATED TEST SUITE');

    // Test 1: Check essential DOM elements
    try {
        const form = document.getElementById('recommendation-form');
        const darkToggle = document.getElementById('dark-mode-toggle');
        const bhoomiBtn = document.getElementById('bhoomi-button');
        const weatherBtn = document.getElementById('fetch-location-btn');
        
        const elementsExist = !!(form && darkToggle && bhoomiBtn && weatherBtn);
        recordResult('DOM Structure & Controls Check', elementsExist, 'Form, Dark Mode, Chatbot, and Location buttons exist');
    } catch (e) {
        recordResult('DOM Structure Check', false, e.message);
    }

    // Test 2: Dismiss Welcome Modal if present
    try {
        const welcomeModal = document.getElementById('welcome-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn && welcomeModal && !welcomeModal.classList.contains('hidden')) {
            closeModalBtn.click();
            await sleep(300);
        }
        recordResult('Welcome Modal Interaction', true, 'Dismissed welcome modal');
    } catch (e) {
        recordResult('Welcome Modal Interaction', false, e.message);
    }

    // Test 3: Dark Mode Toggle
    try {
        const darkToggle = document.getElementById('dark-mode-toggle');
        const initialDark = document.body.classList.contains('dark-mode');
        darkToggle.click();
        await sleep(200);
        const toggledDark = document.body.classList.contains('dark-mode');
        // Toggle back
        darkToggle.click();
        await sleep(200);
        const finalDark = document.body.classList.contains('dark-mode');
        
        const darkWorks = (initialDark !== toggledDark) && (initialDark === finalDark);
        recordResult('Dark / Light Theme Toggle', darkWorks, 'Theme switches and restores successfully');
    } catch (e) {
        recordResult('Dark / Light Theme Toggle', false, e.message);
    }

    // Test 4: Form Input Validation & Population
    try {
        const testInputs = {
            'n': 90,
            'p': 42,
            'k': 43,
            'ph': 6.5,
            'temperature': 20.8,
            'humidity': 82.0,
            'rainfall': 202.9
        };

        for (const [id, val] of Object.entries(testInputs)) {
            const input = document.getElementById(id);
            if (input) {
                input.value = val;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        recordResult('Form Inputs Population', true, 'Populated N, P, K, pH, Temperature, Humidity, Rainfall');
    } catch (e) {
        recordResult('Form Inputs Population', false, e.message);
    }

    // Test 5: Submit Recommendation Form & Check API Response
    try {
        const form = document.getElementById('recommendation-form');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

        // Wait for asynchronous API call to finish
        let attempts = 0;
        let cropName = '';
        const cropNameElement = document.getElementById('crop-name');
        const resultContainer = document.getElementById('prediction-result');

        while (attempts < 20) {
            await sleep(250);
            if (cropNameElement && cropNameElement.textContent.trim().length > 0 && !cropNameElement.classList.contains('hidden')) {
                cropName = cropNameElement.textContent.trim();
                break;
            }
            attempts++;
        }

        const isVisible = resultContainer && !resultContainer.classList.contains('hidden');
        const gotPrediction = cropName.length > 0;
        recordResult('Recommendation Engine API (/predict)', gotPrediction && isVisible, `Recommended crop: "${cropName}"`);
    } catch (e) {
        recordResult('Recommendation Engine API (/predict)', false, e.message);
    }

    // Test 6: View Cultivation Guide Modal
    try {
        const viewDetailsBtn = document.getElementById('view-crop-details-btn');
        const responsePopup = document.getElementById('response-popup');
        const closePopupBtn = document.getElementById('close-popup-btn');

        if (viewDetailsBtn && !viewDetailsBtn.classList.contains('hidden')) {
            viewDetailsBtn.click();
            await sleep(400);

            const popupVisible = responsePopup && !responsePopup.classList.contains('hidden');
            const popupTitle = document.getElementById('popup-title')?.textContent || '';
            
            recordResult('Cultivation Guide Popup Display', popupVisible && popupTitle.length > 0, `Guide opened for "${popupTitle}"`);

            if (closePopupBtn) {
                closePopupBtn.click();
                await sleep(300);
            }
        } else {
            recordResult('Cultivation Guide Popup Display', false, 'View details button not found or hidden');
        }
    } catch (e) {
        recordResult('Cultivation Guide Popup Display', false, e.message);
    }

    // Test 7: Bhoomi AI Chatbot
    try {
        const bhoomiBtn = document.getElementById('bhoomi-button');
        const chatWindow = document.getElementById('chat-window');
        const closeChatBtn = document.getElementById('close-chat-btn');
        
        bhoomiBtn.click();
        await sleep(400);

        const chatVisible = chatWindow && !chatWindow.classList.contains('hidden');
        const optionsCount = document.querySelectorAll('#chat-options .chat-option-btn').length;

        recordResult('Bhoomi AI Chatbot Window & Menu', chatVisible && optionsCount > 0, `Found ${optionsCount} menu options`);

        if (closeChatBtn) {
            closeChatBtn.click();
            await sleep(300);
        }
    } catch (e) {
        recordResult('Bhoomi AI Chatbot Window & Menu', false, e.message);
    }

    // Test Summary
    logHeader('TEST SUMMARY REPORT');
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    console.table(results);

    if (passedCount === totalCount) {
        console.log(`%c🎉 ALL ${totalCount}/${totalCount} TESTS PASSED SUCCESSFULLY!`, 'color: #2e7d32; font-weight: bold; font-size: 16px;');
    } else {
        console.warn(`⚠️ ${passedCount}/${totalCount} TESTS PASSED. Please check failures above.`);
    }

    return { total: totalCount, passed: passedCount, results };
})();
