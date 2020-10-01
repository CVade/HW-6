var apiKey = "79a8a48bb56352d1877343ca1adaab77"
var cityName = "Chicago"
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
        console.log('data from onecall api')
        console.log(data)
    })

})