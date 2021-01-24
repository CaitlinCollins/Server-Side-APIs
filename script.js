$(document).ready(function () {
	var inputCity = $("textarea");

	// Event listener to grab the name of the city on click.
	$("button").on("click", function (event) {
		event.preventDefault();
		// Storing the city name.
		var city = inputCity.val().trim();
		// Running the searchCity function passing in the city as an argument.
		searchCity(city);
		prependSearch(city);
	});

	function prependSearch(city) {
		var pastSearches = $("#pastSearches");
		var searches = $("<div>");
		searches.attr("class", "searches");
		searches.text(city);
		pastSearches.prepend(searches);
	}

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
			var icon = response.weather[0].icon;
			newH2.html(cityName + " " + today + " " + icon);
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

			// Get the latitude and longitude.
			var latitude = response.coord.lat;
			var longitude = response.coord.lon;

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
				var sectionEl = $("#5DayForecast");
				sectionEl.empty();

				// Add the current UV Index to the fourth <p> tag.
				var uvIndex = response.current.uvi;
				var pIndex = $("<p>");
				pIndex.attr("class", "today");
				// pIndex.attr("id", "uvIndex");
				pIndex.text("UV Index: " + uvIndex.toFixed(1));
				$("article").append(pIndex);

				// Create an array of the 5 day forecast.
				var daily = [];
				daily.push(response.daily[1]);
				daily.push(response.daily[2]);
				daily.push(response.daily[3]);
				daily.push(response.daily[4]);
				daily.push(response.daily[5]);

				console.log(daily);

				// Cylce through the array and gather information.
				for (var i = 0; i < daily.length; i++) {
					// Create a div to house the information.
					var dailyDiv = $("<div>");
					dailyDiv.attr("class", "fiveDay");
					// Get the date.
					var dateEl = $("<p>");
					dateEl.attr("class", "today");
					var newDate = moment()
						.add(i + 1, "days")
						.format("M/D/YYYY");
					dateEl.text(newDate);
					// Get the icon.
					var imgIcon = $("<p>");
					imgIcon.attr("class", "days");
					var icon = daily[i].weather.icon;
					imgIcon.html(icon);
					// Get the daily high temp.
					var tempEl = $("<p>");
					tempEl.attr("class", "days");
					var tempK = daily[i].temp.max;
					var tempF = (tempK - 273.15) * 1.8 + 32;
					var fahranheit = "\xB0F";
					tempEl.text("Temp: " + tempF.toFixed(2) + " " + fahranheit);
					// Get the daily humidity.
					var humEl = $("<p>");
					humEl.attr("class", "days");
					var hum = daily[i].humidity;
					humEl.text("Humidity: " + hum + " %");
					// Append everything to the page.
					dailyDiv.append(dateEl);
					dailyDiv.append(imgIcon);
					dailyDiv.append(tempEl);
					dailyDiv.append(humEl);
					sectionEl.append(dailyDiv);
				}
			});
		}
	}
});
