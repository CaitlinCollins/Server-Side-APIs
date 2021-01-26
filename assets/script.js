$(document).ready(function () {
	var inputCity = $("input");
	var pastSearches = $("#historySection");
	var fiveDayForecast = $("#fiveDayForecast");
	var searchHist = JSON.parse(localStorage.getItem("history")) || [];
	var city;
	var lastSearched = searchHist[searchHist.length - 1];

	// Checks to see if there is anything in the local storage.
	if (localStorage.length == 0) {
	} else {
		getSearches();
		// Uses local storage to search the last searched city on page load.
		searchCity(lastSearched);
	}

	// Runs the application if the enter key is pressed.
	inputCity.on("keydown", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			// Storing the city name.
			city = inputCity.val().trim();
			// Show the article and H3
			$("article").show();
			$("h3").show();
			// Running the searchCity function passing in the city as an argument.
			searchCity(city);
		}
	});

	// Runs the application if the search button is clicked.
	$(".citySearch").on("click", function (event) {
		event.preventDefault();
		// Storing the city name.
		city = inputCity.val().trim();
		// Show the article and H3
		$("article").show();
		$("h3").show();
		// Running the searchCity function passing in the city as an argument.
		searchCity(city);
	});

	// Add searched cities to .searches div.
	function prependSearch(city) {
		if (inputCity === null) {
			return;
		} else {
			var searches = $("<div>");
			searches.attr("class", "#historySection");
			searches.text(city);
			pastSearches.prepend(searches);
			storeSearches(searches);
		}
	}

	// Store searches
	function storeSearches(searches) {
		// Add the recent search to the array.
		for (var i = 0; i < searches.length; i++) {
			var city = searches.text();
			if (searchHist.includes(city)) {
				break;
			} else {
				searchHist.push(city);
			}
		}
		localStorage.setItem("history", JSON.stringify(searchHist));
		getSearches();
	}

	// Get searches from local storage and render them to the page.
	function getSearches() {
		// get scores from local storage
		var storedSearches = JSON.parse(localStorage.getItem("history"));
		renderSearches(storedSearches);
	}

	// Render the stored searches to the page.
	function renderSearches(storedSearches) {
		pastSearches.empty();

		for (var i = 0; i < storedSearches.length; i++) {
			var searches = $("<div>");
			searches.attr("class", "searches");
			searches.text(storedSearches[i]);
			pastSearches.prepend(searches);
		}
		// Create a clear searches button.
		var clearSearch = $("<button>");
		clearSearch.attr("class", "clear");
		clearSearch.text("Clear Search History");
		pastSearches.append(clearSearch);
	}
	// Toggle between searches on click.
	$(document).on("click", ".searches", function () {
		var city = $(this).text();
		searchCity(city);
		// Show the article and H3
		$("article").show();
		$("h3").show();
	});

	// // Display the last searched city on the page.
	// function lastSearched()

	//  Use the input to search openweather api for that city.
	function searchCity(city) {
		var queryURL =
			"http://api.openweathermap.org/data/2.5/weather?q=" +
			city +
			"&appid=e90f89da353464dd1dc479b73a3a777e";

		$.ajax({
			url: queryURL,
			method: "GET",
		})
			.then(function (response) {
				// Get the city name
				var cityName = response.name;

				// Get the latitude and longitude.
				var latitude = response.coord.lat;
				var longitude = response.coord.lon;

				// New ajax call
				oneCall(latitude, longitude, cityName);
				prependSearch(cityName);
			})
			// Catch any misspellings or empty inputs.
			.catch(function (error) {
				alert("Please enter a valid city name!");
				return;
			});

		function oneCall(latitude, longitude, cityName) {
			// Get the URL for the onecall api
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
				// Clear the local weather article.
				var articleEl = $("article");
				articleEl.empty();

				// Add the city name and date to the H2.
				var today = moment().format("(M/D/YY)");
				var newH2 = $("<h2>");
				var icon = response.current.weather[0].icon;
				var iconEl = $("<img>");
				iconEl.attr("class", "mainIcon");
				iconEl.attr("src", "http://openweathermap.org/img/wn/" + icon + ".png");
				newH2.html(cityName + " " + today + " ");

				$("article").append(newH2);
				$("article").append(iconEl);

				// Add the current temerature to the first <p> tag.
				var tempK = response.current.temp;
				var tempF = (tempK - 273.15) * 1.8 + 32;
				var pTemp = $("<p>");
				var fahranheit = "\xB0F";
				pTemp.attr("class", "today");
				pTemp.text("Temperature: " + tempF.toFixed(1) + " " + fahranheit);
				$("article").append(pTemp);

				// Add the current humidity to the second <p> tag.
				var humidity = response.current.humidity;
				var pHum = $("<p>");
				pHum.attr("class", "today");
				pHum.text("Humidity: " + humidity + "%");
				$("article").append(pHum);

				// Add the current wind speed to the third <p> tag.
				var windSpeed = response.current.wind_speed;
				var pWind = $("<p>");
				pWind.attr("class", "today");
				pWind.text("Wind Speed: " + windSpeed.toFixed(1) + " MPH");
				$("article").append(pWind);

				// Add the current UV Index to the fourth <p> tag.
				var uvIndex = response.current.uvi;
				var pIndex = $("<p>");
				var pUV = $("<p>");
				pUV.attr("class", "today uv");
				pIndex.attr("class", "today  uv uvBox");
				pIndex.attr("id", "uvIndex");
				// Color code the uvIdex to low, moderate, or high.
				if (uvIndex <= 2) {
					pIndex.attr("id", "low");
				} else if (uvIndex > 2 && uvIndex <= 5) {
					pIndex.attr("id", "mod");
				} else {
					pIndex.attr("id", "high");
				}
				pUV.text("UV Index: ");
				pIndex.text(uvIndex.toFixed(2));
				$("article").append(pUV);
				$("article").append(pIndex);

				// Empty the forecast div.
				fiveDayForecast.empty();

				// Create and append h3 element
				h3El = $("<h3>");
				h3El.text("5-Day Forecast:");
				fiveDayForecast.append(h3El);

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
					fiveDayForecast.append(dailyDiv);
				}
			});
		}
	}
	// Click event for clear searches button that empties local storage.
	$(document).on("click", ".clear", function () {
		localStorage.clear();
		location.reload();
		searchCity(lastSearched);
	});
});
