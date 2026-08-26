// ============================================
// CONFIG
// ============================================
// Get a free key at https://home.openweathermap.org/users/sign_up
// then paste it below.
const API_KEY = "ADD_OPEN_WEATHER_MAP_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ============================================
// DOM REFERENCES
// ============================================
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const locationBtn = document.getElementById("locationBtn");
const themeToggle = document.getElementById("themeToggle");
const statusMsg = document.getElementById("statusMsg");

const currentCard = document.getElementById("currentCard");
const place = document.getElementById("place");
const updated = document.getElementById("updated");
const currentIcon = document.getElementById("currentIcon");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

const forecastSection = document.getElementById("forecast");
const forecastStrip = document.getElementById("forecastStrip");
const skyBand = document.getElementById("skyBand");

// ============================================
// THEME (dark mode)
// ============================================
function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.body.dataset.theme = theme;
    themeToggle.textContent = theme === "dark" ? "☀" : "☾";
}

function toggleTheme() {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    themeToggle.textContent = next === "dark" ? "☀" : "☾";
    localStorage.setItem("theme", next);
}

themeToggle.addEventListener("click", toggleTheme);
initTheme();

// ============================================
// STATUS HELPERS
// ============================================
function setStatus(message, isError = false) {
    statusMsg.textContent = message;
    statusMsg.classList.toggle("error", isError);
}

function clearStatus() {
    statusMsg.textContent = "";
    statusMsg.classList.remove("error");
}

// ============================================
// SKY BAND (signature element)
// Maps OpenWeatherMap condition codes to a gradient
// ============================================
const SKY_GRADIENTS = {
    clear_day: "linear-gradient(90deg, #ffe5a8, #ff8552, #2e86ab)",
    clear_night: "linear-gradient(90deg, #1b2a4a, #3aafa9, #0b1b2b)",
    clouds: "linear-gradient(90deg, #c9d6e3, #8fa6bd, #4d6a8a)",
    rain: "linear-gradient(90deg, #4d6a8a, #2e86ab, #16324f)",
    thunderstorm: "linear-gradient(90deg, #2c2c54, #6b4e9e, #16324f)",
    snow: "linear-gradient(90deg, #eaf4fb, #c9d6e3, #3aafa9)",
    mist: "linear-gradient(90deg, #b8c4d0, #93a9c2, #6b7f99)",
};

function updateSkyBand(weatherMain, isDay) {
    const key = weatherMain.toLowerCase();
    let gradientKey = "clouds";
    if (key.includes("clear")) gradientKey = isDay ? "clear_day" : "clear_night";
    else if (key.includes("cloud")) gradientKey = "clouds";
    else if (key.includes("rain") || key.includes("drizzle")) gradientKey = "rain";
    else if (key.includes("thunderstorm")) gradientKey = "thunderstorm";
    else if (key.includes("snow")) gradientKey = "snow";
    else if (["mist", "fog", "haze"].some((w) => key.includes(w))) gradientKey = "mist";

    skyBand.style.background = SKY_GRADIENTS[gradientKey];
    document.body.dataset.condition = gradientKey;
}

// ============================================
// RENDER: current conditions
// ============================================
function renderCurrent(data) {
    const isDay = data.weather[0].icon.endsWith("d");

    place.textContent = `${data.name}, ${data.sys.country}`;
    updated.textContent = `Updated ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
    currentIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentIcon.alt = data.weather[0].description;

    temp.textContent = `${Math.round(data.main.temp)}°C`;
    condition.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;

    updateSkyBand(data.weather[0].main, isDay);
    currentCard.hidden = false;
}

// ============================================
// RENDER: 5-day forecast
// The free /forecast endpoint returns data in 3-hour
// steps for 5 days. We pick one entry per day (close
// to midday) to build a simple daily summary.
// ============================================
function renderForecast(list) {
    const dailyMap = {};

    list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        const hour = entry.dt_txt.split(" ")[1];

        // Prefer the entry closest to noon as the representative reading
        if (!dailyMap[date] || hour === "12:00:00") {
            dailyMap[date] = entry;
        }
    });

    const days = Object.values(dailyMap).slice(0, 5);

    forecastStrip.innerHTML = days
        .map((day) => {
            const dateObj = new Date(day.dt_txt.replace(" ", "T"));
            const dayName = dateObj.toLocaleDateString([], { weekday: "short" });
            const icon = day.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

            return `
        <div class="forecast-day">
          <p class="forecast-day-name">${dayName}</p>
          <img src="${iconUrl}" alt="${day.weather[0].description}" width="50" height="50" />
          <p class="forecast-day-temp">
            <span class="max">${Math.round(day.main.temp_max)}°</span>
            <span class="min">${Math.round(day.main.temp_min)}°</span>
          </p>
        </div>
      `;
        })
        .join("");

    forecastSection.hidden = false;
}

// ============================================
// API CALLS
// ============================================
async function fetchWeatherByCity(city) {
    setStatus(`Searching for "${city}"…`);
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`),
        ]);

        if (!currentRes.ok) throw new Error("City not found");

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        renderCurrent(currentData);
        renderForecast(forecastData.list);
        clearStatus();
    } catch (err) {
        setStatus(err.message || "Something went wrong. Try again.", true);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    setStatus("Getting weather for your location…");
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        ]);

        if (!currentRes.ok) throw new Error("Couldn't fetch weather for your location");

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        renderCurrent(currentData);
        renderForecast(forecastData.list);
        clearStatus();
    } catch (err) {
        setStatus(err.message || "Something went wrong. Try again.", true);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
});

locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        setStatus("Geolocation isn't supported by your browser.", true);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => setStatus("Location access denied. Search for a city instead.", true)
    );
});

// ============================================
// INITIAL LOAD
// ============================================
(function init() {
    if (API_KEY === "ADD_OPEN_WEATHER_MAP_API_KEY") {
        setStatus("Add your OpenWeatherMap API key in script.js to get started.", true);
        return;
    }
    // Default: try geolocation first, fall back to a default city
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            () => fetchWeatherByCity("London")
        );
    } else {
        fetchWeatherByCity("London");
    }
})();
