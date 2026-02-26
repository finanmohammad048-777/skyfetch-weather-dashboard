// Your OpenWeatherMap API Key
const API_KEY = '3824fcac5e28bf7f55311a0bd658415e';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
// Convert this function to async/await
async function getWeather(city) {
    showLoading();

    // Disable search button
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        displayWeather(response.data);
    } catch (error) {
        console.error('Error:', error);

        // Show appropriate error message
        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please try again later.');
        }
    } finally {
        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
    }
}
// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
        cityInput.focus();
}

// Call the function when page loads
 document.getElementById('weather-display').innerHTML = `
    <div class="welcome-message">
        Enter a city name!
    </div>
`;// You can change this to any city you like
// Get references to HTML elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');


// previous basic listeners removed to avoid duplication and facilitate improved validation

// Create showLoading function
function showLoading() {
    // Create loading HTML
    const loadingHTML = `
        <div class="loading-message">
            <div class="spinner"></div>
            <span>Loading weather data...</span>
        </div>
    `;

    // Display in #weather-display div
    document.getElementById('weather-display').innerHTML = loadingHTML;
}

// Function to show error messages (used by validation and getWeather)
function showError(message) {
    const errorHTML = `
        <p class="loading" style="color: #ff4d4d;">❌ Error: ${message}</p>
    `;
    document.getElementById('weather-display').innerHTML = errorHTML;
}
// Centralized validation + search function used by both click and Enter
function validateAndSearch() {
    const cityRaw = cityInput.value;

    // 1. Check if input is empty
    if (!cityRaw) {
        showError("City name cannot be empty.");
        return;
    }

    // 2. Check if input has only spaces
    if (cityRaw.trim().length === 0) {
        showError("City name cannot be just spaces.");
        return;
    }

    // 3. Check minimum length (at least 2 characters)
    if (cityRaw.trim().length < 2) {
        showError("City name must be at least 2 characters long.");
        return;
    }

    // ✅ If all validations pass, call getWeather
    getWeather(cityRaw.trim());
}

// Wire up UI events
searchBtn.addEventListener('click', validateAndSearch);

// Trigger search on Enter key inside the input
cityInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        validateAndSearch();
    }
});