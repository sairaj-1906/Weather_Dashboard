# ◐ Skyline — Weather Dashboard

A clean, responsive weather dashboard built with vanilla HTML, CSS, and JavaScript — styled with Bootstrap 5 and Tailwind CSS, and powered by the OpenWeatherMap API.

---

## ✨ Overview

Skyline lets you check current conditions and a 5-day forecast for any city, or instantly pull weather for your current location. It includes light/dark themes and a signature **sky band** — a thin gradient strip at the top of the page that shifts color based on the live weather condition (clear, cloudy, rainy, stormy, snowy) and time of day.

The project is intentionally framework-light on the JavaScript side (no build step, no dependencies to install) while using Bootstrap and Tailwind via CDN for layout and styling — making it easy to read, fork, and extend.

## 🚀 Features

- **Live weather data** — current temperature, conditions, feels-like, humidity, wind speed, and pressure via the OpenWeatherMap API
- **5-day forecast** — daily summaries built from OpenWeatherMap's 3-hour interval data
- **City search** — look up weather for any city worldwide
- **Current location** — one-click geolocation lookup using the browser's Geolocation API
- **Dark mode** — toggle with preference saved in `localStorage`, defaulting to the OS theme on first visit
- **Fully responsive** — adapts from mobile to desktop using Bootstrap's grid system
- **Dynamic sky band** — a gradient accent bar that reflects real-time weather conditions

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties for theming) |
| Logic | Vanilla JavaScript (Fetch API, Geolocation API) |
| Data | [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather & 5 Day / 3 Hour Forecast) |
| Fonts | Space Grotesk, Inter, JetBrains Mono (Google Fonts) |

## 📦 Getting Started

### Prerequisites

- A modern web browser
- A free [OpenWeatherMap API key](https://home.openweathermap.org/users/sign_up) (activation can take a few minutes after signup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skyline-weather-dashboard.git
   cd skyline-weather-dashboard
   ```

2. **Add your API key**

   Open `script.js` and replace the placeholder with your own key:
   ```js
   const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
   ```

3. **Run it**

   Since this is a static site, just open `index.html` directly in your browser, or serve it locally for a smoother experience (recommended, so the Geolocation API works reliably):
   ```bash
   # using Python
   python3 -m http.server 8000

   # or using the VS Code "Live Server" extension
   ```
   Then visit `http://localhost:8000`.

## 📁 Project Structure

```
skyline-weather-dashboard/
├── index.html      # Markup and layout
├── style.css       # Design tokens, theming, and custom styles
├── script.js       # API calls, rendering, and interactivity
├── screenshots/     # App screenshots for this README
└── README.md
```

## ⚙️ Configuration Notes

- **API key exposure**: The API key lives in client-side JavaScript, which is fine for a personal/portfolio project but not recommended for production — for a real deployment, proxy requests through a backend so the key isn't publicly visible.
- **Rate limits**: OpenWeatherMap's free tier has a request-per-minute limit; avoid triggering rapid repeated searches while testing.
- **Units**: Temperatures are fetched in metric (°C). To switch to imperial, change `units=metric` to `units=imperial` in `script.js` and update the labels accordingly.

## 🗺️ Roadmap Ideas

- [ ] Hourly forecast view
- [ ] Search history / recently viewed cities
- [ ] Unit toggle (°C / °F) in the UI
- [ ] Weather alerts/warnings
- [ ] PWA support for offline access

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap's weather icon set
- Fonts from [Google Fonts](https://fonts.google.com/)
