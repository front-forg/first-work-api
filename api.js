const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const resultDiv = document.getElementById('weather-result');

async function getWeatherByCity() {
    const cityName = document.getElementById('city-input').value.trim();

    if(!cityName){
        resultDiv.textContent = 'Пожалуйста, введите название города...';
        return;
    }

    resultDiv.textContent = 'Ищем город....';

    try {
        const geoHost = ['https', '://', 'geocoding-api.', 'open-meteo.com', '/v1/', 'search'].join('');
        const geoUrl = `${geoHost}?name=${encodeURIComponent(cityName)}&count=1&language=ru&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if(!geoData.results || geoData.results.length === 0) {
            resultDiv.textContent = `Город ${cityName} не найден`;
            return;
        }

        const city = geoData.results[0];
        const {latitude, longitude, name, country} = city;

        const weatherHost = ['https', '://', 'api.', 'open-meteo.com', '/v1/', 'forecast'].join('');
        const weatherUrl = `${weatherHost}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherReponse = await fetch(weatherUrl);
        const weatherData = await weatherReponse.json();

        const temp = weatherData.current.temperature_2m;
        const wind = weatherData.current.wind_speed_10m;

        const daily = weatherData.daily;
        let forecastHtml = '<h2 class="forecast-title">Прогноз на 7 дней</h2><div class = "forecast-list">';

        for(let i = 0; i < daily.time.length; i++){
            const dataObj = new Date(daily.time.at(i));
            const formattedDate = dataObj.toLocaleDateString('ru-RU',{
                day: 'numeric',
                month: 'short',
                weekday: 'short'
            });

            const minTemp = Math.round(daily.temperature_2m_min.at(i));
            const maxTemp = Math.round(daily.temperature_2m_max.at(i));

            forecastHtml +=`
            <div class ="forecast-item">
                <span class = "forecast-date">${formattedDate}</span>
                <span class = "forecast-temp">от <strong>${minTemp}</strong> до <strong>${maxTemp}</strong></span>
            </div>
            `;
        }

        forecastHtml += '</div>';

        resultDiv.innerHTML = `
        <div class="current-weather">
            <h3>${name} (${country})</h3>
            <p>Температура: <strong>${temp} C</strong></p>
            <p>Ветер: <strong>${wind} км/ч</strong></p>
        </div>

        <div class="forecast-section">
            ${forecastHtml}
        </divs>
        `;
    } catch(error){
        resultDiv.textContent = 'Произошла ошибка при загрухке данных';
        console.error(error);
    }
}

searchBtn.addEventListener('click', getWeatherByCity);

cityInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        getWeatherByCity();
    }
});