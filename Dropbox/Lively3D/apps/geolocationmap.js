var GeoLocationMap = function () {

	var mapCanvasElement;
	var mapDrawingContext;
	var mapZoomLevel = 13;

	this.initMap = function(canvasElement) {
		if (!canvasElement) {
			canvasElement = document.createElement("canvas");
			canvasElement.setAttribute("style", "display: none");
			canvasElement.id = "map_canvas";
			document.body.appendChild(canvasElement);
		}
		mapCanvasElement = canvasElement;
		mapCanvasElement.width = 501;
		mapCanvasElement.height = 512;
		
		mapDrawingContext = mapCanvasElement.getContext("2d");
		mapDrawingContext.fillStyle = "#F0F0F0";
		mapDrawingContext.fillRect(0,0,501,512); 
		mapDrawingContext.fillStyle = '#00f';
		mapDrawingContext.font = '20px sans-serif';
		mapDrawingContext.textBaseline = 'top';
		mapDrawingContext.fillText('Geolocation Map... requesting position.',    10, 10+ 20);
		
		navigator.geolocation.getCurrentPosition(
			function(position) {
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				
				// Proxy may be necessary to allow loading content from other domains into the canvas
				// that is later manipulated by GLGE engine
				var imgUrl = "http://maps.google.com/maps/api/staticmap?center=" + lat + "," + lng + 
					"&zoom=" + mapZoomLevel + "&size=512x512&markers=color:blue|label:You|" + lat + "," + lng + "&sensor=false";
				var img = new Image();
				img.onload = function() {
					mapDrawingContext.drawImage(this, 0, 0, 501, 512);
					
					// Zoom buttons
					mapDrawingContext.fillStyle = "#F0F0F0";
					mapDrawingContext.fillRect(5,5,20,20);
					mapDrawingContext.strokeRect(5,5,20,20);
					mapDrawingContext.fillRect(30,5,20,20);
					mapDrawingContext.strokeRect(30,5,20,20);
					
					mapDrawingContext.fillStyle = '#00f'; 				
					mapDrawingContext.font = '36px sans-serif';				
					mapDrawingContext.textBaseline = 'middle';
					mapDrawingContext.fillText('+', 5, 15);
					mapDrawingContext.fillText('-', 34, 15);
					
				}
				img.src = imgUrl;
			},
			function(err) {
				// alert("Geolocation is not available.\n" + err.code + ": " + err.message);
				mapDrawingContext.fillStyle = "#F0F0F0";
				mapDrawingContext.fillRect(0,0,512,512); 
				mapDrawingContext.fillStyle = '#00f';
				mapDrawingContext.font = '20px sans-serif';
				mapDrawingContext.textBaseline = 'top';
				mapDrawingContext.fillText('Geolocation is not available.',    10, 10+ 20);
				mapDrawingContext.fillText(err.code + ": " + err.message,    10, 10+50);
			}
			);
	};
	
	this.mapclickFunc = function(data){
		// When the map is clicked, the canvas is updated
		var x = data.coord[0];
		var y = data.coord[1];
		if(y > 5 && y < 45) {
			if(x > 5 && x < 25) {
				if(mapZoomLevel < 16)
					mapZoomLevel += 1;
			}
			if(x > 30 && x < 50) {
				if(mapZoomLevel > 3)
					mapZoomLevel -= 1;
			}
		}
		this.initMap(mapCanvasElement);
	};
	
	this.GetCanvas = function(){
		return mapCanvasElement;
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

var GeoLocationMapInit = function(GeoLocationMap){
	var locationmap = new GeoLocationMap();
	locationmap.initMap();
	
	var mouseclickFunc = function(data){
		locationmap.mapclickFunc(data);
	};
	
	locationmap.EventListeners = {"click": mouseclickFunc };
	
	return locationmap;
};

var name = "Location Map";

var app = Lively3D.AddApplication(name, GeoLocationMap, GeoLocationMapInit);

app.StartApp();