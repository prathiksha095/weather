
async function getWeather() {
    const city = document.getElementById("city").value.trim();
    const message = document.getElementById("message");

    if (city === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    message.textContent = "Loading weather...";
    
    try {
        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) + "&count=1&language=en&format=json";

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            message.textContent = "City not found. Try another city.";
            return;
        }

        const place = geoData.results[0];

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);
        const data = await weatherResponse.json();

        if (!data.current) {
            throw new Error("Weather data unavailable");
        }

        const current = data.current;
        const code = current.weather_code;

        let condition = "Cloudy";
        let icon = "☁️";

        if (code === 0) {
            condition = "Sunny";
            icon = "☀️";
        } else if ([1, 2].includes(code)) {
            condition = "Partly Cloudy";
            icon = "🌤️";
        } else if (code === 3) {
            condition = "Overcast";
            icon = "☁️";
        } else if ([45, 48].includes(code)) {
            condition = "Foggy";
            icon = "🌫️";
        } else if (code >= 51 && code <= 67 ||
                   code >= 80 && code <= 82) {
            condition = "Rainy";
            icon = "🌧️";
        } else if (code >= 71 && code <= 77 ||
                   code >= 85 && code <= 86) {
            condition = "Snowy";
            icon = "❄️";
        } else if (code >= 95) {
            condition = "Thunderstorm";
            icon = "⛈️";
        }

        document.getElementById("cityName").textContent =
            place.name + (place.country ? ", " + place.country : "");

        document.getElementById("temperature").textContent =
            current.temperature_2m + " °C";

        document.getElementById("condition").textContent = condition;
        document.getElementById("icon").textContent = icon;

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m;

        document.getElementById("wind").textContent =
            current.wind_speed_10m;

        message.textContent = "Weather details updated successfully!";

    } catch (error) {
        message.textContent =
            "Unable to get weather. Check your internet and try again.";
    }
}

document.getElementById("city").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
