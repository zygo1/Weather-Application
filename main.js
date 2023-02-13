"use strict"
import { getWeather } from "/weather.js";

// Create a Map for the icons
const icon_map = new Map();
addMapping([0, 1], 'day');
addMapping([2], 'cloudy-day');
addMapping([3], 'cloudy');
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], 'rainy');
addMapping([71, 73, 75, 77, 85, 86], 'snowy');
addMapping([95, 96, 99], 'thunder');

function addMapping(values, icon) {
    values.forEach(value => {
        icon_map.set(value, icon)
    });
}

// stats for testing

navigator.geolocation.getCurrentPosition(successful, failed);

function successful({ coords }) {
    let lat = coords.latitude;
    let long = coords.longitude;
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=${timezone}&past_days=5`;
    getWeather(url).then(renderWeather);
}

function failed() {
    alert("There was an error getting your location.")
}

// let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,windspeed_10m_max&current_weather=true&timezone=${timezone}&past_days=5`;

function renderWeather({ current, daily }) {
    renderCurrentWeather(current);
    renderDailyWeather(current, daily);
}

const currentIcon = document.querySelector("[data-current-icon]")

function renderCurrentWeather(current) {
    currentIcon.src = `icons/weather/${icon_map.get(current.iconCode)}.svg`;
    document.querySelector("[data-current-temp]").textContent = current.currentTemp;
    document.querySelector("[data-current-high]").textContent = current.highTemp;
    document.querySelector("[data-current-low]").textContent = current.lowTemp;
    document.querySelector("[data-feels-like]").textContent = current.feelsLike;
    document.querySelector("[data-wind]").textContent = current.windSpeed;
    document.querySelector("[data-humid]").textContent = current.humid;
    document.querySelector("[data-pressure]").textContent = current.press;
}

const divs = document.querySelectorAll('[day-of-the-week]');
const imgs = document.querySelectorAll('[forecast-icon]');
const dayTemp = document.querySelectorAll('[data-temp]');
const dayFeel = document.querySelectorAll('[data-feels]');
const dayWind = document.querySelectorAll('[data-wind]');
function renderDailyWeather(current, daily) {
    let days = [], icons = [], temps = [], dayFL = [], dayW = [];
    daily.forEach(day => {
        // Day
        const unixTime = day.timestamp;
        const date = new Date(unixTime);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = (daysOfWeek[date.getUTCDay()]);
        days.push(dayOfWeek);
        // Icon
        const dayIconCode = day.iconCode;
        icons.push(`icons/weather/${icon_map.get(dayIconCode)}.svg`);
        // Temperature
        temps.push(day.maxTemp);
        //Feels Like
        dayFL.push(day.dayFeelsLike);
        //Wind
        dayW.push(day.dayWindSpeed);
    })
    for (let i = 0; i < 5; i++) {
        divs[i].textContent = days[i];
        imgs[i].src = icons[i];
        dayTemp[i].textContent = temps[i];
        dayFeel[i].textContent = dayFL[i];
        dayWind[i].textContent = dayW[i];
    }
}



