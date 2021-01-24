$(document).ready(function () {
	var inputCity = $("textarea");
	var pastSearches = $("#pastSearches");

	if (localStorage.length == 0) {
	} 
	else {
		getSearches();
	}

	// Event listener to grab the name of the city on click.
	$("button").on("click", function (event) {
		event.preventDefault();
		// Storing the city name.
		var city = inputCity.val().trim();
		// Running the searchCity function passing in the city as an argument.
		searchCity(city);
		prependSearch(city);
	});

	// Add searched cities to .searches div.
	function prependSearch(city) {
		var searches = $("<div>");
		searches.attr("class", "searches");
		searches.text(city);
		pastSearches.prepend(searches);
		storeSearches(searches);
	}

	var searchHist = JSON.parse(localStorage.getItem("history")) || [];
	// Store searches
	function storeSearches(searches) {
		// Add the recent search to the array.
		for (var i = 0; i < searches.length; i++) {
			console.log(searches.text());
			var city = searches.text();
			searchHist.push(city);
		}
		localStorage.setItem("history", JSON.stringify(searchHist));
		getSearches();
	}

	// Get searches from local storage and render them to the page.
	function getSearches() {
		// get scores from local storage
		var storedSearches = JSON.parse(localStorage.getItem("history"));
		console.log(storedSearches);
		renderSearches(storedSearches);
	}

	function renderSearches(storedSearches) {
		pastSearches.empty();

		for (var i = 0; i < storedSearches.length; i++) {
			console.log(storedSearches[i]);
			var searches = $("<div>");
			searches.attr("class", "searches");
			searches.text(storedSearches[i]);
			pastSearches.prepend(searches);
		}
	}

	function searchCity(city) {
		var queryURL =
			"http://api.openweathermap.org/data/2.5/weather?q=" +
			city +
			"&appid=e90f89da353464dd1dc479b73a3a777e";

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			// Clear the local weather article.
			$("article").empty();

			// Add the city name and date to the H2.
			var cityName = response.name;
			var today = moment().format("(M/D/YY)");
			var newH2 = $("<h2>");
			var icon = response.weather[0].icon;
			var iconEl = $("<img>");
			iconEl.attr("class", "mainIcon");
			iconEl.attr("src", "http://openweathermap.org/img/wn/" + icon + ".png");
			newH2.html(cityName + " " + today + " ");
			$("article").append(newH2);
			$("article").append(iconEl);
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
				var sectionEl = $("#5DayForecast");
				sectionEl.empty();

				// Add the current UV Index to the fourth <p> tag.
				var uvIndex = response.current.uvi;
				var pIndex = $("<p>");
				var pUV = $("<p>");
				pUV.attr("class", "today uv");
				pIndex.attr("class", "today  uv uvBox");
				// pIndex.attr("id", "uvIndex");
				pUV.text("UV Index: ");
				pIndex.text(uvIndex.toFixed(1));
				$("article").append(pUV);
				$("article").append(pIndex);

				// Create an array of the 5 day forecast.
				var daily = [];
				daily.push(response.daily[1]);
				daily.push(response.daily[2]);
				daily.push(response.daily[3]);
				daily.push(response.daily[4]);
				daily.push(response.daily[5]);

				// Cylce through the array and gather information.
				for (var i = 0; i < daily.length; i++) {
					// Create a div to house the information.
					var dailyDiv = $("<div>");
					dailyDiv.attr("class", "fiveDay");
					// Get the date.
					var dateEl = $("<p>");
					dateEl.attr("class", "dates");
					var newDate = moment()
						.add(i + 1, "days")
						.format("M/D/YYYY");
					dateEl.text(newDate);
					// Get the icon.
					var icon = daily[i].weather[0].icon;
					var iconEl = $("<img>");
					iconEl.attr("class", "dailyIcon");
					iconEl.attr(
						"src",
						"http://openweathermap.org/img/wn/" + icon + ".png"
					);
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
					humEl.text("Humidity: " + hum + "%");
					// Append everything to the page.
					dailyDiv.append(dateEl);
					dailyDiv.append(iconEl);
					dailyDiv.append(tempEl);
					dailyDiv.append(humEl);
					sectionEl.append(dailyDiv);
				}
			});
		}
	}
});
