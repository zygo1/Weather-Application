"use strict"
import { getWeather } from "/weather.js";

// stats for testing
let lat = 40.61;
let long = 22.97;
let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// ------------------

let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=${timezone}&past_days=5`
getWeather(url).then(renderWeather);

function renderWeather({ current, daily }) {
    renderCurrentWeather(current);
    // renderDailyWeather(daily);
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
    currentIcon.src = "";
    document.querySelector("[data-current-temp]").textContent = current.currentTemp;
    document.querySelector("[data-current-high]").textContent = current.highTemp;
    document.querySelector("[data-current-low]").textContent = current.lowTemp;
    document.querySelector("[data-feels-like]").textContent = current.feelsLike;
    document.querySelector("[data-wind]").textContent = current.windSpeed;
    document.querySelector("[data-humid]").textContent = current.humid;
    document.querySelector("[data-pressure]").textContent = current.press;
    // document.body.classList.remove("blurred");
}


function renderDailyWeather(daily) {

}



