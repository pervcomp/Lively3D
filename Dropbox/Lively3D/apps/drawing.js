var Drawing = function(){
	var drawingCanvas = document.createElement("canvas");
	drawingCanvas.setAttribute("style", "display:none");
	drawingCanvas.id = "drawing_canvas";
	drawingCanvas.width = 256;
	drawingCanvas.height = 256;
		
	//document.body.appendChild(drawingCanvas);

	var drawingContext = drawingCanvas.getContext('2d');
	drawingContext.fillStyle = "#fff";
	drawingContext.fillRect(0,0,256,256);
	drawingCanvas.drawing = false;
	
	this.GetCanvas = function(){
		return drawingCanvas;
	}
	
	
	var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
}	

var DrawingInit = function(drawing){
	
	var drawingApp = new drawing();
	
	var mousedownFunc = function(data){
		var drawingContext = data.canvas.getContext('2d');
		drawingContext.beginPath();
		drawingContext.moveTo(data.coord[0], data.coord[1]);
		data.canvas.drawing = true;
	}
					
	var mouseupFunc = function(data){
		if ( data.canvas.drawing ){
			data.canvas.drawing = false;
		}
	}
					
	var mousemoveFunc = function(data){
		if ( data.canvas.drawing ){
			var drawingContext = data.canvas.getContext('2d');
			drawingContext.lineTo(data.coord[0], data.coord[1]);
			drawingContext.stroke();
		}
	}
	
	drawingApp.EventListeners = { "mousedown": mousedownFunc, "mouseup": mouseupFunc, "mousemove": mousemoveFunc };
	return drawingApp;
}				

var app = Lively3D.AddApplication('Drawing', Drawing, DrawingInit);
app.StartApp();
