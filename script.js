var inputCity = $("textarea");

// Event listener to grab the name of the city on click.
$("button").on("click", function () {
	var city = inputCity.val().trim();
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
	});

	// if city doesn't exist
});
