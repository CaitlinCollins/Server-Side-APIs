var inputCity = $("textarea");

// Event listener to grab the name of the city on click.
$("button").on("click", function (event) {
	event.preventDefault();
	// Storing the city name.
	var inputCity = $("textarea");
	var city = inputCity.val().trim();
	// Running the searchCity function passing in the city as an argument.
	searchCity(city);
});

function searchCity(city) {
	var queryURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&appid=e90f89da353464dd1dc479b73a3a777e";

	console.log(city);

	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		console.log(response);

		// Clear the local weather article.
		$("article").empty();

		// Add the city name and date to the H2.
		var cityName = response.name;
		var today = moment().format("(M/D/YY)");
		var newH2 = $("<h2>");
		var icon = response.weather[0].main;
		newH2.text(cityName + " " + today + " " + icon);
		$("article").append(newH2);

		// Add the current temerature to the first <p> tag.
		var tempK = response.main.temp;
		var tempF = (tempK - 273.15) * 1.8 + 32;
		var pTemp = $("<p>");
		var fahranheit = "\xB0F";
		pTemp.attr("class", "today");
		pTemp.text("Temperature: " + tempF.toFixed(1) + " " + fahranheit);
		$("article").append(pTemp);

		// Add the current humidity to the second <p> tag.
		var humidity = response.main.humidity;
		var pHum = $("<p>");
		pHum.attr("class", "today");
		pHum.text("Humidity: " + humidity + "%");
		$("article").append(pHum);

		// Add the current wind speed to the third <p> tag.
		var windSpeed = response.wind.speed;
		var pWind = $("<p>");
		pWind.attr("class", "today");
		pWind.text("Wind Speed: " + windSpeed.toFixed(1) + " MPH");
		$("article").append(pWind);

		// Add the current UV Index to the fourth <p> tag.
		var latitude = response.coord.lat;
		console.log(latitude);
		var longitude = response.coord.lon;
		console.log(longitude);

		// New ajax call
		oneCall(latitude, longitude);
	});

	function oneCall(latitude, longitude) {
		var queryURL =
			"https://api.openweathermap.org/data/2.5/onecall?lat=" +
			latitude +
			"&lon=" +
			longitude +
			"&exclude={part}&appid=e90f89da353464dd1dc479b73a3a777e";

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			console.log(response);
		});
	}
}
