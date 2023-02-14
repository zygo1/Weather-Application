"use strict"
import { getWeather } from "/weather.js";
import { getArea } from "./geolocation.js";
import { icon_map } from "./iconmap.js";

// Geolocation | Weather
navigator.geolocation.getCurrentPosition(successful, failed);
function successful({ coords }) {
    let lat = coords.latitude;
    let long = coords.longitude;
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=${timezone}&past_days=5`;
    let nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`;
    getArea(nomUrl).then(render);
    getWeather(url).then(renderWeather);
}

function failed() {
    alert("There was an error getting your location.")
    document.querySelector(".blur").classList.remove("blur")
}

// API | Weather
// https://api.open-meteo.com/v1/forecast?latitude=10&longitude=10&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=Europe%2FBerlin&past_days=5`;
// API | Location Coords
// https://nominatim.openstreetmap.org/search/Thessaloniki?format=json

// Geolocation | City
const cityLabel = document.querySelector('.city-name');
function render(city) {
    cityLabel.textContent = city.city;
}

// Rendering
function renderWeather({ current, daily }) {
    renderCurrentWeather(current);
    renderDailyWeather(current, daily);
}

// Search
// With Button Click
document.querySelector('#search-button').addEventListener('click', function () {
    const value = document.querySelector('#search').value;
    getCoords(value);
})

// With Enter Button
document.querySelector("#search").addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        const value = document.querySelector('#search').value;
        getCoords(value);
    }
})

async function getCoords(value) {
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const urlLoc = `https://nominatim.openstreetmap.org/search/${value}?format=json`;
    try {
        const response = await fetch(urlLoc);
        if (!response.ok) {
            throw Error();
        }
        const data = await response.json();
        const _lat = data[0].lat;
        const _lon = data[0].lon;
        const name = data[0].display_name.split(',')[0];
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${_lat}&longitude=${_lon}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=${timezone}&past_days=5`;
        getWeather(url).then(renderWeather);
        cityLabel.textContent = name;
    }
    catch (error) {
        alert('Oops! Something went wrong. Please make sure the city name you entered is correct.')
    }
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
    currentIcon.src = `icons/weather/${icon_map.get(current.iconCode)}.svg`;
    document.querySelector("[data-current-temp]").textContent = current.currentTemp;
    document.querySelector("[data-current-high]").textContent = current.highTemp;
    document.querySelector("[data-current-low]").textContent = current.lowTemp;
    document.querySelector("[data-feels-like]").textContent = current.feelsLike;
    document.querySelector("[data-wind-details]").textContent = current.windSpeed;
    document.querySelector("[data-humid]").textContent = current.humid;
    document.querySelector("[data-pressure]").textContent = current.press;
    // document.querySelector(".blur").classList.remove("blur")
}

const divs = document.querySelectorAll('[day-of-the-week]');
const imgs = document.querySelectorAll('[forecast-icon]');
const dayTemp = document.querySelectorAll('[data-temp]');
const dayTempLow = document.querySelectorAll('[data-temp-low]');
const dayFeel = document.querySelectorAll('[data-feels]');
const dayFeelLow = document.querySelectorAll("[data-feel-low]");
const dayWind = document.querySelectorAll('[data-wind]');
function renderDailyWeather(current, daily) {
    let days = [], icons = [], temps = [], tempsLow = [], dayFL = [], dayFLow = [], dayW = [];
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
        // Temperature High
        temps.push(day.maxTemp);
        // Temperature Low
        tempsLow.push(day.minTemp);
        // Feels Like High
        dayFL.push(day.dayFeelsLike);
        // Feels Like Low
        dayFLow.push(day.dayFeelsLikeMin);
        //Wind
        dayW.push(day.dayWindSpeed);
    })

    for (let i = 0; i < 5; i++) {
        divs[i].textContent = days[i];
        imgs[i].src = icons[i];
        dayTemp[i].textContent = temps[i];
        dayFeel[i].textContent = dayFL[i];
        dayWind[i].textContent = dayW[i];
        dayTempLow[i].textContent = tempsLow[i];
        dayFeelLow[i].textContent = dayFLow[i];
    }
}
