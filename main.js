let appId = 'ec512cd9041e9da6fdbf995f1d34558c';
let unit = 'metric';
let searchMethod;

function getSearchMethod(searchTerm) {
    if (searchTerm.lenght === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'id';
    else
        searchMethod = 'q';
}

function searchWeather(searchTerm) {
    getSearchMethod(searchTerm);
    fetch('http://api.openweathermap.org/data/2.5/weather?' + searchMethod + '=' + searchTerm + '&APPID=' + appId + '&units=' + unit +'&lang=it').then(result => {
        return result.json();
    }).then(result => {
        init(result);
    })
    
    getForecast (searchTerm, searchMethod);
}

function searchByPos(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon +'&APPID=' + appId +'&units=' + unit +'&lang=it').then(result => {
        return result.json();
    }).then (result => {
        init(result);
    })
    getForecastByPos(lat, lon);
}

function init(resultFromServer) {
    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let temperatureElement = document.getElementById('temperature');
    let humidityElement = document.getElementById('humidityElement');
    let windSpeedElement = document.getElementById('windSpeed');
    let cityHeader = document.getElementById('cityHeader');
    let weatherIcon = document.getElementById('documentIconImg');

    weatherIcon.src = 'http://openweathermap.org/img/w/' + resultFromServer.weather[0].icon + '.png';

    let resultDescription = resultFromServer.weather[0].description;
    weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);

    temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp) + '&#176';
    windSpeedElement.innerHTML = 'Velocit&agrave; del vento: ' + Math.floor(resultFromServer.wind.speed) + ' m/s';
    humidityElement.innerHTML = 'Umidit&agrave;: ' + resultFromServer.main.humidity + '%';
    cityHeader.innerHTML = resultFromServer.name;

    setWeatherInfo();
}

function setWeatherInfo(){
    let weatherBlock = document.getElementById("weatherBlock");
    weatherBlock.style.visibility = 'visible';
}


if (document.getElementById('searchBtn').addEventListener('click', () => {
    let searchTerm = document.getElementById("searchInput").value;
    if (searchTerm)
        searchWeather(searchTerm);
}));
if (document.getElementById('geoBtn').addEventListener('click', () =>{
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(searchByPos);
    } else {
        alert ("La geolocalizzazione non è supportata.")
    }
}));

function getForecast (searchTerm, searchMethod) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?' + searchMethod + '=' + searchTerm + '&units=' + unit + '&appid='+ appId + '&lang=it').then(result => {
        return result.json();
    }).then (result => {
        //console.log(result);
        writeForecast (result);
    })
}

function writeForecast (data) {
    var i = 0, j = 0;

    while (i<4){
        let day = document.getElementById('day'+i)
        let description = document.getElementById('desc'+i);
        let icon = document.getElementById('icon'+i)
        let max = document.getElementById('temp_max'+i);
        let min = document.getElementById('temp_min'+i);

        let resultDescription = data.list[j].weather[0].description;
        description.innerHTML = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);

        icon.src = 'http://openweathermap.org/img/w/' + data.list[j].weather[0].icon + '.png';

        max.innerHTML = Math.floor(data.list[j].main.temp_max) + '&#176';
        min.innerHTML = Math.floor(data.list[j].main.temp_min) + '&#176';
        
        i++;
        j+=8;

    }
}

function getForecastByPos(lat, lon){
    fetch('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon +'&APPID=' + appId +'&units=' + unit +'&lang=it').then(result => {
        return result.json();
    }).then (result => {
        writeForecast(result);
    })
}

