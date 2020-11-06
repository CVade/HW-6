$(document).ready(function() {
    
    var cityArr;
    var currentDay = moment().format('L');
    //console.log(JSON.parse(localStorage.getItem("favoriteCities"))[0]);
    if(localStorage.getItem("favoriteCities")){getWeather(JSON.parse(localStorage.getItem("favoriteCities"))[0]);}

    function getWeather(cityName){
        var apiKey = "79a8a48bb56352d1877343ca1adaab77"
    
        var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
        
        $.ajax({
            method: "GET",
            url: queryUrl
        }).then(function(res){
            console.log(res)
            var lat = res.coord.lat
            var lon = res.coord.lon
            var city = res.name1996
        
            var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=${apiKey}`
        
            $.get(oneCallUrl).then(function(data){
                console.log('data from onecall api');
                console.log(data);
                $("#today-data").html(`
                    <h4 class="card-title">${cityName} (${currentDay})</h4>
                    <div class="card-text">
                        <ul>
                            <li>Temperature: ${data.current.temp} °F</li>
                            <li>Ηumidity: ${data.current.humidity}%</li>
                            <li>Wind Speed: ${data.current.wind_speed} MPH</li>
                            <li>UV Index: ${data.current.uvi}</li>
                        </ul>
                    </div>`)
                
                for (var i = 1; i < 6; i++) {
                    var date = new Date(data.daily[i].dt * 1000);
                    $("#five-day-forecast").append(`
                    <div class="col-2">
                        <h6 class="card-title">${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</h4>
                        <div class="card-text">
                            <ul>
                                <li>Temp Range: ${data.daily[i].temp.max}-${data.daily[i].temp.min} °F</li>
                                <hr>
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
        $("#five-day-forecast").html("");
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

        // check if you have localstorage with that name
            // var stringArr =  JSON.stringify(["Chicago", "Denver"])
            // write to localstorage
        // read from localstorage
        // var arr = JSON.parse()
        // Add cityInput to arr
        // write this arr to localstorage
        
        // print this to the page
    })

    function updateRecent() {
        let faveCities = JSON.parse(localStorage.getItem("favoriteCities"));
        $("#search-history").empty();
        for (var j = 0; j < faveCities.length; j++) {
            $("#search-history").append("<div>" + faveCities[j] + "</div>");
        }
    }

    updateRecent();
})