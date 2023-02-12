"use strict"

export async function getWeather(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        // return data
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
        }
    }
    catch (error) {
        console.error(error);
    }
};

function parseCurrentWeather({ current_weather, daily, hourly }) {
    const { temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode
    } = current_weather;

    const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp]
    } = daily;

    const {
        relativehumidity_2m: [humid],
        surface_pressure: [press],
        apparent_temperature: [feelsLike]
    } = hourly;

    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        feelsLike,
        windSpeed: Math.round(windSpeed),
        humid,
        press,
        iconCode
    }
}

function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index],),
            feelsLike: daily.apparent_temperature_max[index],
            windSpeed: daily.windspeed_10m_max[index]
        }
    })
}