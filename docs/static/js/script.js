document.addEventListener('DOMContentLoaded', () => {

    // --- Backend API Base Configuration ---
    // If running on local Flask server, use relative path ('').
    // If hosted on GitHub Pages or custom domain, route to the Render backend URL.
    const PRODUCTION_BACKEND_URL = 'https://cropguru-backend.onrender.com';
    const API_BASE_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
        ? ''
        : PRODUCTION_BACKEND_URL;

    // --- Smart Backend Server Pre-Warming (Awakens Render Instance on Page Load) ---
    const warmUpBackendServer = () => {
        const healthUrl = (API_BASE_URL ? API_BASE_URL : '') + '/health';
        fetch(healthUrl, { method: 'GET', mode: 'cors' })
            .then(res => res.json())
            .then(data => console.log('✔ CropGuru Backend Status:', data.message || 'Awake & Ready'))
            .catch(() => console.log('🚀 Pre-warming backend server in the background...'));
    };
    warmUpBackendServer();

    // --- Dark Mode Logic (No changes) ---
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;
    if (toggleButton) {
        const applySavedTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') { body.classList.add('dark-mode'); } 
            else { body.classList.remove('dark-mode'); }
        };
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        applySavedTheme();
    }

    // --- Recommendation Form Logic ---
    const form = document.getElementById('recommendation-form');
    if (form) {
        const resultContainer = document.getElementById('prediction-result');
        const cropNameElement = document.getElementById('crop-name');
        const suggestionTextElement = document.getElementById('suggestion-text');
        const viewDetailsBtn = document.getElementById('view-crop-details-btn');
        const placeholderText = document.getElementById('crop-name-placeholder');

        // ==========================================================
        // =========== NEW: LOCATION & WEATHER FETCH LOGIC ==========
        // ==========================================================
        const fetchLocationBtn = document.getElementById('fetch-location-btn');
        const locationStatus = document.getElementById('location-status');
        const tempInput = document.getElementById('temperature');
        const humidityInput = document.getElementById('humidity');
        const rainfallInput = document.getElementById('rainfall'); // We will leave this blank as rainfall is complex

        fetchLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                locationStatus.textContent = 'Fetching location...';
                navigator.geolocation.getCurrentPosition(fetchWeather, handleLocationError);
            } else {
                locationStatus.textContent = "Geolocation is not supported by your browser.";
            }
        });

        async function fetchWeather(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            locationStatus.textContent = `Location found! Fetching weather...`;

            // Using a free, no-key weather API (Open-Meteo)
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Weather data not available.');
                const weatherData = await response.json();

                const temp = weatherData.current.temperature_2m;
                const humidity = weatherData.current.relative_humidity_2m;
                
                // Populate the form fields
                tempInput.value = temp.toFixed(1);
                humidityInput.value = humidity;
                // Note: We don't fetch rainfall as it requires historical data and is more complex.
                // We guide the user to enter it manually.
                rainfallInput.focus(); // Move cursor to rainfall input

                locationStatus.textContent = `Temperature and Humidity have been filled. Please enter average rainfall.`;

                // Re-validate the fields we just filled
                validateInput(tempInput);
                validateInput(humidityInput);

            } catch (error) {
                console.error("Weather Fetch Error:", error);
                locationStatus.textContent = 'Could not fetch weather data. Please enter manually.';
            }
        }

        function handleLocationError(error) {
            let message = 'An unknown error occurred.';
            if (error.code === 1) message = 'Permission denied. Please allow location access.';
            if (error.code === 2) message = 'Location information is unavailable.';
            if (error.code === 3) message = 'Request timed out.';
            locationStatus.textContent = message;
        }

        // --- Form Validation Logic (No changes) ---
        const inputs = form.querySelectorAll('input[required]');
        const validationRules = {
            n: { min: 0, max: 250, message: "Please enter a value between 0 and 250." },
            p: { min: 0, max: 200, message: "Please enter a value between 0 and 200." },
            k: { min: 0, max: 250, message: "Please enter a value between 0 and 250." },
            ph: { min: 0, max: 14, message: "Please enter a pH value between 0 and 14." },
            temperature: { min: -10, max: 55, message: "Please enter a temperature between -10 and 55°C." },
            humidity: { min: 0, max: 100, message: "Please enter a humidity value between 0 and 100%." },
            rainfall: { min: 0, max: 1000, message: "Please enter a value between 0 and 1000mm." }
        };

        const validateInput = (input) => {
            const rule = validationRules[input.id];
            const value = parseFloat(input.value);
            const errorMessageElement = input.nextElementSibling;
            let isValid = true;

            if (input.value === '') { isValid = false; } 
            else if (isNaN(value) || value < rule.min || value > rule.max) {
                errorMessageElement.textContent = rule.message;
                input.classList.add('input-error');
                isValid = false;
            }

            if (isValid) {
                errorMessageElement.textContent = '';
                input.classList.remove('input-error');
            }
            return isValid;
        };
        
        inputs.forEach(input => { input.addEventListener('input', () => validateInput(input)); });

        // --- Form Submission Logic (UPDATED) ---
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isFormValid = true;
            inputs.forEach(input => { if (!validateInput(input)) isFormValid = false; });
            if (!isFormValid) return;

            // Show loading state in the new result card
            resultContainer.classList.remove('hidden');
            resultContainer.classList.add('visible');
            placeholderText.textContent = 'Analyzing...';
            placeholderText.classList.remove('hidden');
            cropNameElement.classList.add('hidden');
            viewDetailsBtn.classList.add('hidden');

            const formData = new FormData(form);
            const data = {
                n: formData.get('n'), p: formData.get('p'), k: formData.get('k'),
                ph: formData.get('ph'), temperature: formData.get('temperature'),
                humidity: formData.get('humidity'), rainfall: formData.get('rainfall')
            };

            try {
                const response = await fetch(`${API_BASE_URL}/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(`Server error: ${response.status}`);
                const result = await response.json();

                // --- NEW: Populate the enhanced result card ---
                placeholderText.classList.add('hidden');
                cropNameElement.textContent = result.recommendation;
                suggestionTextElement.textContent = result.suggestion;

                // Set data attribute for the details button
                viewDetailsBtn.dataset.cropId = result.recommendation.toLowerCase().replace(/ \(.+\)/, '').replace(' ', '');
                
                cropNameElement.classList.remove('hidden');
                viewDetailsBtn.classList.remove('hidden');

            } catch (error) {
                placeholderText.textContent = 'Error: Could not get a recommendation.';
                console.error('Error fetching recommendation:', error);
            }
        });

        // --- NEW: Event Listener for the 'View Cultivation Guide' button ---
        viewDetailsBtn.addEventListener('click', () => {
            const cropId = viewDetailsBtn.dataset.cropId;
            const cropName = cropNameElement.textContent;
            
            // Find the matching option in our chatbot content to open the popup
            const cropOption = { id: cropId, question: cropName };
            handleOptionClick(cropOption); // This reuses our chatbot popup logic
        });
    }

    // --- BHOOMI AI LOGIC (No changes, but now shared with recommendation results) ---
    const bhoomiButton = document.getElementById('bhoomi-button');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const welcomeModal = document.getElementById('welcome-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatOptions = document.getElementById('chat-options');
    const responsePopup = document.getElementById('response-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const printResponseBtn = document.getElementById('print-response-btn');

    function showElement(element) { if (!element) return; element.classList.remove('hidden'); setTimeout(() => { element.classList.add('visible'); }, 10); }
    function hideElement(element) { if (!element) return; element.classList.remove('visible'); setTimeout(() => { element.classList.add('hidden'); }, 150); }

    const showWelcomeSequence = () => { showElement(welcomeModal); showElement(modalOverlay); if(bhoomiButton) bhoomiButton.classList.add('highlighted'); document.body.classList.add('modal-open'); };
    const closeWelcomeSequence = () => { hideElement(welcomeModal); hideElement(modalOverlay); if(bhoomiButton) bhoomiButton.classList.remove('highlighted'); document.body.classList.remove('modal-open'); };
    const showChatWindow = () => { if(chatWindow && chatWindow.classList.contains('hidden')) { showElement(chatWindow); renderOptions(chatbotContent.mainMenu); } };
    const hideChatWindow = () => { hideElement(chatWindow); };
    const hideResponsePopup = () => { hideElement(responsePopup); hideElement(modalOverlay); document.body.classList.remove('modal-open'); };

    if(bhoomiButton) { bhoomiButton.addEventListener('click', () => { if (welcomeModal && !welcomeModal.classList.contains('hidden')) { closeWelcomeSequence(); } chatWindow.classList.contains('hidden') ? showChatWindow() : hideChatWindow(); }); }
    if(closeChatBtn) closeChatBtn.addEventListener('click', hideChatWindow);
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeWelcomeSequence);
    if(closePopupBtn) closePopupBtn.addEventListener('click', hideResponsePopup);
    if(modalOverlay) { modalOverlay.addEventListener('click', () => { closeWelcomeSequence(); hideResponsePopup(); }); }
    setTimeout(showWelcomeSequence, 1500);

    function renderOptions(optionsArray, isSubMenu = false) {
        if (!chatOptions) return; chatOptions.innerHTML = '';
        optionsArray.forEach(option => {
            const button = document.createElement('button'); button.textContent = option.question; button.classList.add('chat-option-btn'); button.addEventListener('click', () => handleOptionClick(option)); chatOptions.appendChild(button);
        });
        if (isSubMenu) {
            const backButton = document.createElement('button'); backButton.textContent = '← Back'; backButton.classList.add('chat-option-btn', 'back-btn'); backButton.addEventListener('click', () => renderOptions(chatbotContent.mainMenu)); chatOptions.appendChild(backButton);
        }
    }

    function handleOptionClick(option) {
        if (!option.response && !option.id) return; // safety check
        if(chatWindow && !chatWindow.classList.contains('hidden')) addMessageToChat(option.question, 'user');
        
        setTimeout(() => {
            if (typeof option.response === 'string') { popupTitle.textContent = option.question; popupText.textContent = option.response; showPopup(); } 
            else if (Array.isArray(option.response)) { renderOptions(option.response, true); } 
            else {
                const cropDataElement = document.querySelector(`#crop-data-source #${option.id}`);
                if (cropDataElement) { popupTitle.textContent = option.question; popupText.innerHTML = cropDataElement.innerHTML; showPopup(); } 
                else { popupTitle.textContent = "Error"; popupText.textContent = `Information for "${option.question}" could not be found.`; showPopup(); }
            }
        }, 300);
    }

    function showPopup() { hideChatWindow(); showElement(responsePopup); showElement(modalOverlay); document.body.classList.add('modal-open'); }
    function addMessageToChat(text, sender) {
        if (!chatMessages) return; const messageElement = document.createElement('div'); messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message'); messageElement.textContent = text; chatMessages.appendChild(messageElement); chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (printResponseBtn) {
        printResponseBtn.addEventListener('click', () => {
            const title = popupTitle.textContent; const contentHTML = popupText.innerHTML; const logoUrl = '/static/images/cropguru_logo5.svg';
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`<html><head><title>CropGuru - ${title}</title><style>body{font-family:'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;margin:25px;}.print-header{display:flex;align-items:center;gap:15px;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #eee;}.print-header .logo{height:50px;width:50px;}.print-header .brand-name{font-size:2.5rem;font-weight:bold;color:#2e7d32;}h1,h2,h3{color:#2e7d32;page-break-after:avoid;}.meta{display:flex;flex-wrap:wrap;gap:10px;font-size:.9em;margin-bottom:1em;}.pill{border:1px solid #ccc;padding:2px 8px;border-radius:12px;}ul{padding-left:20px;}.print-button{margin-top:20px;padding:10px 20px;border:none;background-color:#4CAF50;color:white;border-radius:5px;cursor:pointer;}@media print{.print-button{display:none;}}</style></head><body><div class="print-header"><img src="${logoUrl}" alt="CropGuru Logo" class="logo"><span class="brand-name">CropGuru</span></div><h1>${title} Information</h1>${contentHTML}<hr style="margin-top:25px;"><p><em>Report generated by CropGuru.</em></p><button onclick="window.print()" class="print-button">Print this page</button></body></html>`);
            printWindow.document.close();
        });
    }
});