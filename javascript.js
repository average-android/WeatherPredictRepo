var apiKey ; "278f7c5fc519547f73f9996c475c3d92"
var cities = [];

var SearchEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecast5Day = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var formSubmit = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        searchWeather(city);
        Forecast5Day(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
    SearchSave();
    pastSearch(city);
}

var SearchSave = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var SearchWeather = function (city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayWeather(data, city);
            });
        });
};

function displayTime() {
    var TimeEl = moment().format('MMM DD, YYYY [at] hh:mm:ss a');
    $("#time").text("Local Time: " + TimeEl);
}
setInterval(displayTime, 1000);





searchBtn.addEventListener("click", function(){
    var searchResults = search.value
    currentWeather(searchResults)
    searchHistory.push(searchResults)
    localStorage.setItem('searchHistory' , searchHistory)
    searchList();
});

var displayWeather = function (weather, searchCity) {
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    
    console.log(weather);

    
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item";

    
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";

    
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

  
    console.log(lat);
    console.log(lon);

    UVIndex(lat, lon)
}

var UVIndex = function (lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayUvIndex(data)
                console.log(data)
            });
        });
}

var displayUvIndex = function (index) {
    var UVIndexEl = document.createElement("div");
    UVIndexEl.textContent = "UV Index: "
    UVIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if (index.value <= 2) {
        uvIndexValue.classList = "uv-good"
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "uv-moderate "
    }
    else if (index.value > 8) {
        uvIndexValue.classList = "uv-danger"
    };

    UVIndexEl.appendChild(uvIndexValue);

    
    weatherContainerEl.appendChild(UVIndexEl);
}

var Forecast5Day = function (city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                Show5Day(data);
            });
        });
};

var Show5Day = function (weather) {
    forecast5Day.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];
        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";

        
        console.log(dailyForecast)

        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);


        
        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        
        forecastEl.appendChild(weatherIcon);

        
        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        
        forecastEl.appendChild(forecastTempEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

        
        forecastEl.appendChild(forecastHumEl);

        console.log(forecastEl);
        
        forecast5Day.appendChild(forecastEl);
    }
}


var pastSearch = function (pastSearch) {
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.prepend(pastSearchEl);

    console.log(pastSearch)
}

var pastSearchActivate = function (event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        SearchWeather(city);
        Forecast5Day(city);
    }
}

SearchEl.addEventListener("submit", formSubmit);
pastSearchButtonEl.addEventListener("click", pastSearchActivate);