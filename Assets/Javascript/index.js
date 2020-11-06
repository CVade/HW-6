$(document).ready(function() {
    
    var cityArr;
    var currentDay = moment().format('L');
    //console.log(JSON.parse(localStorage.getItem("favoriteCities"))[0]);
    if(localStorage.getItem("favoriteCities")){getWeather(JSON.parse(localStorage.getItem("favoriteCities"))[0]);}

    function getWeather(cityName){
        $("#five-day-forecast").html("");
        var apiKey = "79a8a48bb56352d1877343ca1adaab77"
    
        var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
        
        $.ajax({
            method: "GET",
            url: queryUrl
        }).then(function(res){
            var lat = res.coord.lat
            var lon = res.coord.lon
            var city = res.name1996
        
            var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=${apiKey}`
        
            $.get(oneCallUrl).then(function(data){
                var colorUVI = "";
                if (data.current.uvi <= 2) {
                    colorUVI = "greenUVI";
                }
                else if (data.current.uvi <= 5) {
                    colorUVI = "yellowUVI";
                }
                else if (data.current.uvi <= 7) {
                    colorUVI = "orangeUVI";
                }
                else {
                    colorUVI = "redUVI";
                }

                $("#today-data").html(`
                    <h4 class="card-title">${cityName} (${currentDay}) <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt='weather icon' width='90' height='90' margin='auto'"/></h4>
                    <div class="card-text">
                        <ul>
                            <li>Temperature: ${data.current.temp} °F</li>
                            <li>Ηumidity: ${data.current.humidity}%</li>
                            <li>Wind Speed: ${data.current.wind_speed} MPH</li>
                            <li>UV Index: <span class="${colorUVI}">${data.current.uvi}</span></li>
                        </ul>
                    </div>`)
                
                for (var i = 1; i < 6; i++) {
                    var date = new Date(data.daily[i].dt * 1000);
                    $("#five-day-forecast").append(`
                    <div class="col-2">
                        <h6 class="card-title">${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</h4>
                        <div class="card-text">
                            <ul>
                                <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt='weather icon' width='75' height='75' margin='auto'"/>
                                <li>T-Max: ${data.daily[i].temp.max} °F</li>
                                <li>T-Min: ${data.daily[i].temp.min} °F</li>
                                <li>Ηumidity: ${data.daily[i].humidity}%</li>
                            </ul>
                        </div>
                    </div>`)
                }
            })
        })
    }

    $("#search-btn").click(function(event){
        event.preventDefault();
        var cityInput = $("#inlineFormInputCity").val();
        var favoriteCity = localStorage.getItem("favoriteCities");
        
        if (favoriteCity === null) {
            localStorage.setItem('favoriteCities', '[]');
            favoriteCity = localStorage.getItem('favoriteCities');
        }

        cityArr = JSON.parse(favoriteCity);

        if (!cityArr.includes(cityInput)) {
            cityArr.push(cityInput);
        }
            else {
                alert("City added already.")
            }
        getWeather(cityInput);
        favoriteCity = localStorage.setItem('favoriteCities', JSON.stringify(cityArr));
        updateRecent();
    })

    function updateRecent() {
        let faveCities = JSON.parse(localStorage.getItem("favoriteCities"));
        $("#search-history").empty();
        for (var j = 0; j < faveCities.length; j++) {
            $("#search-history").append("<div class='citySearch'>" + faveCities[j] + "</div>");
        }
    }

    updateRecent();

    $("#search-history").on("click", "div", function() {
        getWeather($(this).text());
    });
})