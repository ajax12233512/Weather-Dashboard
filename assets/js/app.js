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
var currentDate = document.getElementById('currentDate');
var day1 = document.getElementById('day1');
var day2 = document.getElementById('day2');
var day3 = document.getElementById('day3');
var day4 = document.getElementById('day4');
var day5 = document.getElementById('day5');
var autofillList = document.getElementById('autofill-list');

var m = moment();
var displayCurrentDate = m.format('ddd MMM DD YYYY');
console.log(currentDate);

currentDate.innerText = displayCurrentDate;
currentDate.style.fontSize = '.5em';
currentDate.style.paddingLeft = '1em';

day1.innerText = m.add(1, 'days').format('ddd MMM DD');
day2.innerText = m.add(1, 'days').format('ddd MMM DD');
day3.innerText = m.add(1, 'days').format('ddd MMM DD');
day4.innerText = m.add(1, 'days').format('ddd MMM DD');
day5.innerText = m.add(1, 'days').format('ddd MMM DD');



//Auto Fill Feature
function autofill(){
    autofillList.innerHTML = '';

    var inputString = $searchInput.val();
    console.log(inputString);

    var requestCitiesUrl = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${inputString}`
    fetch(requestCitiesUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            console.log(response.data);
            response.data.forEach(function(element){
                console.log(element.name);
                var newItem = document.createElement('li');
                newItem.innerText = element.name;
                autofillList.appendChild(newItem);

                newItem.addEventListener('click', function(target){
                    $searchInput.val(target.explicitOriginalTarget.innerText);
                    autofillList.innerHTML = '';
                })

            })            
        })

    if(inputString === '')
        autofillList.style.display = 'none';
    else
        autofillList.style.display = 'block';

}       

$searchInput.on('keyup', autofill);

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
            $cityName.append(currentDate);
            

            var tempEl = document.getElementById('todayTemp');
            var windEl = document.getElementById('todayWind');
            var humidityEl = document.getElementById('todayHum');

            var temp = data.main.temp + "F";
            var wind = data.wind.speed + "MPH";
            var humidity = data.main.humidity + "%";

            tempEl.innerText = temp;
            windEl.innerText = wind;
            humidityEl.innerText = humidity;

            $cityTemp.append(tempEl);
            $cityWind.append(windEl);
            $cityHumidity.append(humidityEl);
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
                var uvEl = document.getElementById('todayUv');
                uvEl.innerText = data.current.uvi + "%";
                $cityUV.append(uvEl);

                // console.log($5DayForcastContainer); 

                $5DayForcastContainer.each( function( index ) {
                    var dayEl = $5DayForcastContainer[index];
                    var iconcode = data.daily[index].weather[0].icon;
                    console.log(data.daily[index].weather[0]);
                    console.log(iconcode);

                    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                    console.log(iconUrl);
                    var tempSpanEl = dayEl.children[2].children[0];
                    var windSpanEl = dayEl.children[3].children[0];
                    var humiditySpanEl = dayEl.children[4].children[0];
                    ''
                    
                    var tempSpan = Math.floor(data.daily[index].temp.day) + "F";
                    var windSpan = Math.floor(data.daily[index].wind_speed)+ "MPH";
                    var humiditySpan = Math.floor(data.daily[index].humidity) + "%";

                    tempSpanEl.innerText = tempSpan;
                    windSpanEl.innerText = windSpan;
                    humiditySpanEl.innerText = humiditySpan;

                    $iconSelector[index].setAttribute('src', iconUrl);
                    console.log($iconSelector);
                   
                    dayEl.children[2].innerText = "Temp: ";
                    dayEl.children[2].appendChild(tempSpanEl);

                    dayEl.children[3].innerText = "Wind: ";
                    dayEl.children[3].appendChild(windSpanEl);

                    dayEl.children[4].appendChild(humiditySpanEl);
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

var $themesCtn = $('.themes');
var defaultTheme = $themesCtn.children()[0];

var defaultEl = document.getElementById('Default');
var darkEl = document.getElementById('Dark');
var customEl = document.getElementById('Custom');


defaultEl.addEventListener('change', chooseDefaultTheme);
darkEl.addEventListener('change', chooseDarkTheme);
// customEl.addEventListener('click', chooseTheme);

function chooseDefaultTheme(){
    var customBodyColor = document.getElementsByTagName('body')[0];                 //Background Color
    var customDashboardTop = document.querySelector('.custom-dashboard-top');       //top dashboard background color
    var customDashboardBottom = document.getElementById('five-day-forecast-ctn');   //bottom dashboard background color
    var customBgCtn = document.querySelector('.custom-main-container'); 
    var fiveDay = document.getElementById('five-day-forecast-ctn');

    var fiveDayTextColor = document.querySelectorAll('.forcast-items');
    var fiveDayTextColorArray = Array.from(fiveDayTextColor);
    fiveDayTextColorArray.forEach(function(element){
        element.style.color = 'black';
    });

    fiveDay.style.background = 'linear-gradient(to right bottom, rgba(255, 255, 255, .8), rgba(255, 255, 255, .3))';

    //Targets the lists and makes font color Black
    var lists = document.getElementsByTagName('li');
    var listsArray = Array.from(lists); 
    listsArray.forEach(function(element){
        element.style.color = 'black';
    })          

    //Back background 
    customBgCtn.style.background = 'linear-gradient(to right bottom, rgba(255, 255, 255, .8), rgba(255, 255, 255, .3))';
    customBgCtn.style.color = 'black';

    //Dashboard top
    customDashboardTop.style.background = 'linear-gradient(to right bottom, rgba(255, 255, 255, .9), rgba(255, 255, 255, .1))';
    customDashboardTop.style.color = 'black';

    //Change background to dark blue gradient
    customBodyColor.style.background = 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)';
    console.log(customBodyColor);
}


function chooseDarkTheme(){

    var customBodyColor = document.getElementsByTagName('body')[0];
    var customDashboardTop = document.querySelector('.custom-dashboard-top');       
    var customDashboardBottom = document.getElementById('five-day-forecast-ctn');  
    var customBgCtn = document.querySelector('.custom-main-container');
    var fiveDay = document.getElementById('five-day-forecast-ctn');


    var fiveDayTextColor = document.querySelectorAll('.forcast-items');
    var fiveDayTextColorArray = Array.from(fiveDayTextColor);
    fiveDayTextColorArray.forEach(function(element){
        element.style.color = 'white';
    });

    fiveDay.style.background = 'linear-gradient(to right bottom, rgba(0, 0, 0, .6), rgba(100, 100, 100, .1))';

    //Targets the lists and makes font color Black
    var lists = document.getElementsByTagName('li');
    var listsArray = Array.from(lists); 
    listsArray.forEach(function(element){
        element.style.color = 'white';
    });
    
    //Back black background
    customBgCtn.style.background = 'linear-gradient(to right bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, .1))';
    customBgCtn.style.color = 'white'

    //Dashboard top
    customDashboardTop.style.background = 'linear-gradient(to right bottom, rgba(0, 0, 0, .6), rgba(0, 0, 0, .1))';
    customDashboardTop.style.color = 'white'


    customBodyColor.style.background = 'linear-gradient(315deg, #4c4177 0%, #2a5470 74%)';
    

    
    console.log(fiveDayTextColor);
}

// chooseTheme();

// console.log($themeArrayEl);

