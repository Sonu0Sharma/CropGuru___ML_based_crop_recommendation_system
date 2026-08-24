// This object holds all the possible chat interactions.
// The final crop responses are now fetched from the HTML, not from here.
const chatbotContent = {
    // These are the initial options the user will see.
    mainMenu: [
        {
            // === CATEGORY 1: CROP INFORMATION ===
            id: 'crop_info',
            question: "Plant Health Related Information",
            response: [
                {
                    id: 'nutrition_info',
                    question: "Nutrition Information",
                    response: [
                        { id: 'n_info', question: "Nitrogen (N)", response: "Nitrogen is vital for leaf and stem growth. It's a major component of chlorophyll, which gives plants their green color and is essential for photosynthesis." },
                        { id: 'p_info', question: "Phosphorus (P)", response: "Phosphorus is crucial for developing strong roots, flowers, and seeds. It plays a key role in energy transfer within the plant." },
                        { id: 'k_info', question: "Potassium (K)", response: "Potassium improves a plant's overall health and vigor. It helps regulate water, enhances disease resistance, and is essential for producing high-quality fruit." }
                    ]
                },
                {
                    id: 'other_info',
                    question: "Other Information",
                    response: [
                        { id: 'weather_impact', question: "Weather Impact", response: "Weather, including temperature and humidity, dictates a plant's growth rate and health. Extreme weather can stress plants and reduce yield." },
                        { id: 'soil_type', question: "Soil Type", response: "Soil type (like sandy, clay, or loamy) determines water retention and nutrient availability. Different crops are adapted to different soil structures." },
                        { id: 'soil_ph', question: "Soil pH", response: "Soil pH is a master variable that controls nutrient availability. Most crops prefer a neutral range of 6.0 to 7.5 to absorb nutrients effectively." },
                        { id: 'soil_moisture', question: "Soil Moisture", response: "Adequate soil moisture is essential for nutrient transport and photosynthesis. Both too little (drought) and too much (waterlogging) can harm the plant." },
                        { id: 'rainfall_impact', question: "Rainfall Impact", response: "Rainfall is the primary source of water for most crops. The amount and timing are critical for every stage of growth, from germination to harvest." }
                    ]
                }
            ]
        },
        {
            // === CATEGORY 2: SPECIFIC CROP HEALTH INFO (THE 22 CROPS) ===
            id: 'plant_health',
            question: "Specific Crop Information",
            response: [
                { id: 'apple', question: "Apple" },
                { id: 'banana', question: "Banana" },
                { id: 'blackgram', question: "Black Gram" },
                { id: 'chickpea', question: "Chickpea" },
                { id: 'coconut', question: "Coconut" },
                { id: 'coffee', question: "Coffee" },
                { id: 'cotton', question: "Cotton" },
                { id: 'grapes', question: "Grapes" },
                { id: 'jute', question: "Jute" },
                { id: 'kidneybeans', question: "Kidney Beans" },
                { id: 'lentil', question: "Lentil" },
                { id: 'maize', question: "Maize (Corn)" },
                { id: 'mango', question: "Mango" },
                { id: 'mothbeans', question: "Moth Beans" },
                { id: 'mungbean', question: "Mung Bean" },
                { id: 'muskmelon', question: "Muskmelon" },
                { id: 'orange', question: "Orange" },
                { id: 'papaya', question: "Papaya" },
                { id: 'pigeonpeas', question: "Pigeon Peas" },
                { id: 'pomegranate', question: "Pomegranate" },
                { id: 'rice', question: "Rice" },
                { id: 'watermelon', question: "Watermelon" }
            ]
        }
    ]
};