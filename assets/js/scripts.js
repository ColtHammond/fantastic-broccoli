const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

const apiKey = 'c1b107b7902c51bf3ca3952b59bafa78';

const mostPopulousCities = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'Fort Worth',
  'Columbus',
  'Charlotte',
];

function displayMostPopulousCities() {
  mostPopulousCities.forEach((city) => {
    const cityBtn = document.createElement('button');
    cityBtn.textContent = city;
    cityBtn.classList.add('city-btn');
    searchHistory.appendChild(cityBtn);
  });
}

async function searchCity(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  if (response.ok) {
    const data = await response.json();
    const { lat, lon } = data.coord;
    getWeatherData(lat, lon, city);
  } else {
    alert('Error: City not found. Please try again.');
  }
}

displayMostPopulousCities();

searchBtn.addEventListener('click', () => {
  searchCity(searchInput.value);
});

searchHistory.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    searchCity(event.target.textContent);
  }
});

async function getWeatherData(lat, lon, city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  displayCurrentWeather(data, city);
  displayForecast(data);
  addToSearchHistory(city);
}

function displayCurrentWeather(data, city) {
  const currentDate = new Date(data.list[0].dt * 1000).toLocaleDateString();
  const icon = data.list[0].weather[0].icon;
  const temperature = data.list[0].main.temp;
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;

  currentWeather.innerHTML = `
    <h2>${city} (${currentDate})</h2>
    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;
}

function displayForecast(data) {
  forecast.innerHTML = '';
  for (let i = 0; i < data.list.length; i += 8) {
    const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
    const icon = data.list[i].weather[0].icon;
    const temperature = data.list[i].main.temp;
    const windSpeed = data.list[i].wind.speed;
    const humidity = data.list[i].main.humidity;

    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');
    forecastDay.innerHTML = `
      <h3>${date}</h3>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
      <p>Temperature: ${temperature}°C</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
      <p>Humidity: ${humidity}%</p>
    `;
    forecast.appendChild(forecastDay);
  }
}

function addToSearchHistory(city) {
  const cityBtn = document.createElement('button');
  cityBtn.textContent = city;
  searchHistory.appendChild(cityBtn);
}
