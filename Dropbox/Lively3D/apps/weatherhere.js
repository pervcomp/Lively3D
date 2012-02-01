var WeatherHere = function() {

	var weatherCanvasElement;
	var weatherDrawingContext;
	var weatherWithText = false;

	this.initWeather = function(canvasElement) {
		if (!canvasElement) {
			canvasElement = document.createElement("canvas");
			canvasElement.setAttribute("style", "display: none");
			canvasElement.id = "weather_canvas";
			document.body.appendChild(canvasElement);
		}
		weatherCanvasElement = canvasElement;
		weatherCanvasElement.width = 470;
		weatherCanvasElement.height = 470;
		
		weatherDrawingContext = weatherCanvasElement.getContext("2d");
		weatherDrawingContext.fillStyle = "#F0F0F0";
		weatherDrawingContext.fillRect(0,0,470,470); 
		weatherDrawingContext.fillStyle = '#00f';
		weatherDrawingContext.font = '20px sans-serif';
		weatherDrawingContext.textBaseline = 'top';
		weatherDrawingContext.fillText('Weather Here... requesting weather data', 10, 10+ 20);
		
		navigator.geolocation.getCurrentPosition(
			function(position) {
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				
				var weatherUserName = "arto.salminen";
				$.getJSON('http://api.geonames.org/findNearByWeatherJSON?lat=' + lat + '&lng=' + lng + '&username=' + weatherUserName, 
					function(obj) {
						if(obj.weatherObservation) {
							weatherDrawingContext.fillStyle = "#F0F0F0";
							weatherDrawingContext.fillRect(0,0,512,512); 
							if(weatherWithText) {
								weatherDrawingContext.fillStyle = '#F30';
								weatherDrawingContext.font = '36px sans-serif';
								weatherDrawingContext.textBaseline = 'top';
								weatherDrawingContext.fillText(obj.weatherObservation.stationName, 40, 40);
								weatherDrawingContext.fillText(obj.weatherObservation.datetime, 40, 80);
								weatherDrawingContext.fillText("Temperature: " + obj.weatherObservation.temperature + " C", 40, 140);
								weatherDrawingContext.fillText("Wind speed: " + obj.weatherObservation.windSpeed * 0.51 + " m/s", 40, 180);
								weatherDrawingContext.fillText("Humidity: " + obj.weatherObservation.humidity + " %", 40, 220);
								weatherDrawingContext.fillText("Dew point: " + obj.weatherObservation.dewPoint + " C", 40, 260);
								weatherDrawingContext.fillText("Clouds: " + obj.weatherObservation.clouds, 40, 300);
							} else {
								var clouds = "";
								switch(obj.weatherObservation.clouds) {
									case "few clouds": clouds = "sunny-cloudy"; break;
									case "broken clouds": clouds = "cloudy"; break;
									case "scattered clouds": clouds = "cloudy-sunny"; break;
									case "overcast": clouds = "cloudy-heavy"; break;
									default: clouds = "sunny"; break;
								}
								var imgUrl = "https://chart.googleapis.com/chart?chst=d_weather&chld=taped_y|" + 
									clouds +"|" + 
									obj.weatherObservation.stationName +"|" + 
									obj.weatherObservation.temperature +" C|" +
									obj.weatherObservation.windSpeed * 0.51 + " m/s";
								var img = new Image();
								img.onload = function() {
									weatherDrawingContext.drawImage(this, 128, 128, 256, 256);							
								}
								img.src = imgUrl;
							}
						}
						else {
							weatherDrawingContext.fillStyle = '#00f';
							weatherDrawingContext.font = '42px sans-serif';
							weatherDrawingContext.fillText("ERROR: ", 20, 256);
							weatherDrawingContext.fillText("Can not get weather data.", 20, 300);
						}
					}
				);
			},
			function(err) {
				// alert("Geolocation is not available.\n" + err.code + ": " + err.message);
				weatherDrawingContext.fillStyle = "#F0F0F0";
				weatherDrawingContext.fillRect(0,0,512,512); 
				weatherDrawingContext.fillStyle = '#00f';
				weatherDrawingContext.font = '20px sans-serif';
				weatherDrawingContext.textBaseline = 'top';
				weatherDrawingContext.fillText('Geolocation is not available.',    10, 10+ 20);
				weatherDrawingContext.fillText(err.code + ": " + err.message,    10, 10+50);
			}
			);
	};
	
	this.weatherclickFunc = function(data) {
		weatherWithText = !weatherWithText;
		this.initWeather(weatherCanvasElement);
	};
	
	this.GetCanvas = function(){
		return weatherCanvasElement;
	};
	
	var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.UI.ShowMessage("This application does not work without disabling browser security, this can be done in Chrome with command line flag '--disable-web-security'. Do not forget to re-enable security after testing this application!");
		Lively3D.AllowAppStart(LivelyApp);
	}
}



var WeatherHereInit = function(WeatherHere){
	var weather = new WeatherHere();
	weather.initWeather();
	
	var mouseclickFunc = function(data){
		weather.weatherclickFunc(data);
	};
	
	weather.EventListeners = {"click": mouseclickFunc };
	
	return weather;
};

var name = "Weather Here";

var app = Lively3D.AddApplication(name, WeatherHere, WeatherHereInit);

app.StartApp();
