///Selecting the dashboard
var $cityName = $('#city-name');
var $cityTemp = $('#city-temp');
var $cityWind = $('#city-wind');
var $cityHumidity = $('#city-humidity');
var $cityUV = $('#city-uv');
var $fiveDayForcast1 = $('#5df-1');
var $fiveDayForcast2 = $('#5df-2');
var $fiveDayForcast3 = $('#5df-3');
var $fiveDayForcast4 = $('#5df-4');
var $fiveDayForcast5 = $('#5df-5');
var $5DayForcastContainer = $('#five-day-forecast-ctn').children();
var $iconSelector = $('.icon');
var $searchInput = $('#search-input');
var $searchButton = $('#search-button');
var testButton = document.getElementById('testButton');

//error ceased when i wrapped the fetch in a function. Look into that 'does fetch need to be wrapped in functino to work?'
function writeToDashboard(testCity){
    var lon, lat;
    // var testCity = 'Tulsa';
    
    // var myApiKey = '2dc0f96b8109c931e6f8ead21fdf1052';
    var testCurrentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${testCity}&units=imperial&appid=2dc0f96b8109c931e6f8ead21fdf1052`;

    //Fetching data for current weather
    fetch(testCurrentDayUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            $cityName.text(data.name);
            $cityTemp.text("Temp: " + data.main.temp);
            $cityWind.text("Wind(mph): " + data.wind.speed);
            $cityHumidity.text("Humidity: " + data.main.humidity);
            return data;
        })
        .then(function(data){

            //need to get longitude and latitude coord for next fetch
            lon = data.coord.lon;
            lat = data.coord.lat;

            var myApiKey = '2dc0f96b8109c931e6f8ead21fdf1052';
            var newfetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${myApiKey}`; 

            //This new fetch is added in order to get other data that is not provided in the previous fetch
            //This new fetch container data about the UV index and data we need for the 5-day forecast and icon
            return fetch(newfetchUrl).then(function (response) {
                return response.json();
            })
            .then(function(data){
                console.log(data.daily);
                $cityUV.text("UV Index: " + data.current.uvi);

                // console.log($5DayForcastContainer); 

                $5DayForcastContainer.each( function( index ) {
                    var dayEl = $5DayForcastContainer[index];
                    var iconcode = data.daily[index].weather[0].icon;
                    console.log("the icon code is: " + iconcode);
                    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                    // var createSpan = document.createElement('span');
                    // createSpan.innerText = "Temp: " + data.daily[index].temp.day;
                    // createSpan.innerText = "Wind: " + data.daily[index].wind_speed;
                    // createSpan.innerText = "Humidity: " + data.daily[index].humidity;

                    $iconSelector.attr('src', iconUrl);
                    console.log($iconSelector[index]);
                   
                    dayEl.children[2].innerText = "Temp: " + data.daily[index].temp.day;
                    dayEl.children[3].innerText = "Wind: " + data.daily[index].wind_speed;
                    dayEl.children[4].innerText = "Humidity: " + data.daily[index].humidity;
                
                })
            })
        })   
}

function addSearchHistory(name){
    var pastItem = document.createElement('button');
    var thisName = name;
    pastItem.innerText = thisName;

    document.getElementById('search-history').appendChild(pastItem);
    pastItem.addEventListener('click', showWeather);
}

function showWeather(){ 
    writeToDashboard(this.innerText);
}


$(function(){
    $searchButton.on('click', function(){
        var userSearchInput = $searchInput.val();
        addSearchHistory(userSearchInput);
        writeToDashboard(userSearchInput);
    });
})


// testButton.addEventListener('click', writeToDashboard);
