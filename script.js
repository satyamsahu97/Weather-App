let MumbaiTemp = document.getElementById("MumbaiTemp");
let MumbaiDesc = document.getElementById("MumbaiDesc");
let DelhiTemp = document.getElementById("DelhiTemp");
let DelhiDesc = document.getElementById("DelhiDesc");
let IndoreTemp = document.getElementById("IndoreTemp");
let IndoreDesc = document.getElementById("IndoreDesc");
let PuneTemp = document.getElementById("PuneTemp");
let PuneDesc = document.getElementById("PuneDesc");


let OutPutSection = document.getElementById("OutPutSection");
let inpt = document.querySelector("input");


// API Configuration
const API_KEY = '502e22ca24228158b8782b0772de385f';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';


// Utility function to get weather icon based on condition
function getWeatherIcon(weatherMain) {
   const icons = {
       'Clear': '☀️',
       'Clouds': '☁️',
       'Rain': '🌧️',
       'Drizzle': '🌦️',
       'Thunderstorm': '⛈️',
       'Snow': '❄️',
       'Mist': '🌫️',
       'Smoke': '💨',
       'Haze': '🌫️',
       'Dust': '🌪️',
       'Fog': '🌫️',
       'Sand': '🌪️',
       'Ash': '🌋',
       'Squall': '💨',
       'Tornado': '🌪️'
   };
   return icons[weatherMain] || '🌤️';
}


// Utility function to format temperature
function formatTemp(temp) {
   return `${Math.round(temp)}°C`;
}


// Utility function to capitalize city name
function capitalizeCityName(city) {
   return city.split(' ')
       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
       .join(' ');
}


// Main function to fetch weather data
async function getWeather(city) {
   try {
       let res = await fetch(`${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      
       if (!res.ok) {
           throw new Error(`City not found: ${city}`);
       }
      
       let data = await res.json();
       console.log(data);
       return data;
   } catch (error) {
       console.error('Error fetching weather:', error);
       return null;
   }
}


// Function to update default city cards
async function updateCityCard(city, tempElement, descElement) {
   try {
       // Add loading state
       tempElement.innerHTML = '⏳ Loading...';
       descElement.innerHTML = '';
      
       let data = await getWeather(city);
      
       if (data) {
           const weatherIcon = getWeatherIcon(data.weather[0].main);
           tempElement.innerHTML = `${weatherIcon} ${formatTemp(data.main.temp)}`;
           descElement.innerHTML = `${data.weather[0].main} - Feels like ${formatTemp(data.main.feels_like)}`;
       } else {
           tempElement.innerHTML = 'N/A';
           descElement.innerHTML = 'Unable to load data';
       }
   } catch (error) {
       tempElement.innerHTML = 'Error';
       descElement.innerHTML = 'Failed to load';
   }
}


// Show default cities weather
async function showDefaultCities() {
   await updateCityCard("Mumbai", MumbaiTemp, MumbaiDesc);
   await updateCityCard("Delhi", DelhiTemp, DelhiDesc);
   await updateCityCard("Indore", IndoreTemp, IndoreDesc);
   await updateCityCard("Pune", PuneTemp, PuneDesc);
}


// Initialize default cities
showDefaultCities();


// Enhanced search weather function
async function SearchWeather() {
   let cityToSearch = inpt.value.trim();
  
   // Validation
   if (!cityToSearch) {
       OutPutSection.innerHTML = `
           <div class="error-message">
               <h3>⚠️ Please enter a city name</h3>
           </div>
       `;
       return;
   }
  
   // Show loading state
   OutPutSection.innerHTML = `
       <div class="loading-card">
           <h3>🔍 Searching for ${capitalizeCityName(cityToSearch)}...</h3>
       </div>
   `;
  
   let data = await getWeather(cityToSearch);
  
   if (!data) {
       OutPutSection.innerHTML = `
           <div class="error-message">
               <h3>❌ City "${capitalizeCityName(cityToSearch)}" not found</h3>
               <p>Please check the spelling and try again</p>
           </div>
       `;
       return;
   }
  
   // Calculate additional weather info
   const weatherIcon = getWeatherIcon(data.weather[0].main);
   const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
       hour: '2-digit',
       minute: '2-digit'
   });
   const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
       hour: '2-digit',
       minute: '2-digit'
   });
  
   OutPutSection.innerHTML = `
       <div class="search-result-card">
           <div class="Card weather-detail-card">
               <div class="weather-header">
                   <div class="weather-icon-large">${weatherIcon}</div>
                   <div class="weather-main-info">
                       <h2>${capitalizeCityName(data.name)}, ${data.sys.country}</h2>
                       <h3 class="main-temp">${formatTemp(data.main.temp)}</h3>
                       <p class="weather-description">${data.weather[0].description}</p>
                   </div>
               </div>
              
               <div class="weather-details-grid">
                   <div class="weather-detail-item">
                       <span class="detail-label">Feels Like</span>
                       <span class="detail-value">${formatTemp(data.main.feels_like)}</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Humidity</span>
                       <span class="detail-value">💧 ${data.main.humidity}%</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Wind Speed</span>
                       <span class="detail-value">💨 ${data.wind.speed} m/s</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Pressure</span>
                       <span class="detail-value">🌡️ ${data.main.pressure} hPa</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Visibility</span>
                       <span class="detail-value">👁️ ${(data.visibility / 1000).toFixed(1)} km</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Cloudiness</span>
                       <span class="detail-value">☁️ ${data.clouds.all}%</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Min Temp</span>
                       <span class="detail-value">🔽 ${formatTemp(data.main.temp_min)}</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Max Temp</span>
                       <span class="detail-value">🔼 ${formatTemp(data.main.temp_max)}</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Sunrise</span>
                       <span class="detail-value">🌅 ${sunrise}</span>
                   </div>
                  
                   <div class="weather-detail-item">
                       <span class="detail-label">Sunset</span>
                       <span class="detail-value">🌇 ${sunset}</span>
                   </div>
               </div>
           </div>
       </div>
   `;
  
   // Clear input field
   inpt.value = '';
}


// Add enter key support for search
inpt.addEventListener('keypress', function(event) {
   if (event.key === 'Enter') {
       SearchWeather();
   }
});


// Refresh default cities every 5 minutes
setInterval(showDefaultCities, 300000);


// Add visual feedback when input is focused
inpt.addEventListener('focus', function() {
   this.parentElement.classList.add('search-focused');
});


inpt.addEventListener('blur', function() {
   this.parentElement.classList.remove('search-focused');
});
