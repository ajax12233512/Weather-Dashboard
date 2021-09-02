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
var $5DayForcastContainer = $('#5-day-forcast').children();
var $iconSelector = $('.icon');
var testButton = document.getElementById('testButton');

//error ceased when i wrapped the fetch in a function. Look into that 'does fetch need to be wrapped in functino to work?'



function testApi(){
    var lon, lat;
    // var myApiKey = '2dc0f96b8109c931e6f8ead21fdf1052';
    var testCity = 'Tulsa';
    var testCurrentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${testCity}&units=imperial&appid=2dc0f96b8109c931e6f8ead21fdf1052`;

    fetch(testCurrentDayUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log('Made it here');
            console.log(data);

            $cityName.text(data.name);
            $cityTemp.text(data.main.temp);
            $cityWind.text(data.wind.speed);
            $cityHumidity.text(data.main.humidity);
            return data;
        })
        .then(function(data){
            lon = data.coord.lon;
            lat = data.coord.lat;
            console.log(lon);
            console.log(lat);

            var myApiKey = '2dc0f96b8109c931e6f8ead21fdf1052';
            var newfetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${myApiKey}`; 
            console.log(newfetchUrl);

            return fetch(newfetchUrl).then(function (response) {
                return response.json();
            })
            .then(function(data){
                console.log(data.daily);
                $cityUV.text(data.current.uvi);

                console.log($5DayForcastContainer); 

                $5DayForcastContainer.each( function( index ) {
                    var dayEl = $5DayForcastContainer[index];
                    var iconcode = data.daily[index].weather[0].icon;
                    console.log("the icon code is: " + iconcode);
                    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                    $iconSelector.attr('src', iconUrl);
                    console.log($iconSelector[index]);
                   
                    // createIcon.attributes

                    // console.log(dayEl.children)
                    // dayEl.children[1].appendChild()
                    dayEl.children[2].innerText = data.daily[index].temp.day;
                    dayEl.children[3].innerText = data.daily[index].wind_speed;
                    dayEl.children[4].innerText = data.daily[index].humidity;

                    

                    
                    // var getDayInfo = data.daily[index];

                    // var getDayName = getDayInfo.
                    // var getDayTemp = getDayInfo.

                    // var dayName = dayEl.children('h3');
                    // var dayTemp = dayEl.children('p')[0];
                    // var dayWind = dayEl.children('p')[1];
                    // var dayHumidity = dayEl.children('p')[2];

                    // dayName = 
                })

                // var testForcastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${testCity}&cnt=5&appid=58a84a20333ae501fe46a570a111a3d7`;

                // return fetch(testForcastUrl).then(function(response){
                //    return response.json();
                // })
                // .then(function(data){
                //     console.log(data);
                // })
            })
        })   
}

function getUvByCoord(lon, lat){

    
    
}

testButton.addEventListener('click', testApi);
