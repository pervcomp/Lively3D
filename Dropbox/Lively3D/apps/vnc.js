var noVNC = function(){
	var canvas = document.createElement("canvas");
	canvas.setAttribute("style", "display:none");
	canvas.id = "VNC_canvas";
	canvas.width = 524;
	canvas.height = 524;
	canvasDrawingContext = canvas.getContext("2d");
	canvasDrawingContext.fillStyle = "#F0F0F0";
	canvasDrawingContext.fillRect(0,0,524,524); 
	document.body.appendChild(canvas);
	console.log("noVNC: created new canvas with ID:" + document.getElementById('VNC_canvas').id);

	this.GetCanvas = function(){
		return canvas;
	}
	
	this.GetState = function(){
		var state = {};
		
		return state;
	}
	
	this.SetState = function(state){
	
	}
	
	this.Open = function(){
		//ohjelman käynnistys jota kutsutaan kun ohjelma avataan työpöydältä
		console.log("VNC: open, grab keyboard/mouse");
		UI.rfb.get_keyboard().grab();
		UI.rfb.get_mouse().grab();
	}
	
	this.Close = function(){
		//ohjelman sulkeminen jota kutsutaan kun avoin ohjelma suljetaan
		console.log("VNC: close, ungrab keyboard/mouse");
		UI.rfb.get_keyboard().ungrab();
		UI.rfb.get_mouse().ungrab();

	}
	
	this.ResourceHandlers = {
		scripts: function(resources){
			var index = 0;
			LoadScript(resources, index);
		}
	}
	
	var unloadedScripts = 10;
	
		this.Resources = {
		scripts: [
			'scripts/ui.js', 
			'scripts/util.js', 
			'scripts/webutil.js', 
			'scripts/logo.js', 
			'scripts/base64.js',
			'scripts/websock.js', 
			'scripts/des.js', 
			'scripts/input.js', 
			'scripts/display.js', 
			'scripts/rfb.js'
		]
	}
	
	this.ResourcePath = 'Resources/noVNC/';
	
	this.ResourcesLoaded = function(resource){
		console.log('noVNC: Resource "' + resource +'" loaded');
	}
	
	var LoadScript = function(scripts, index){
		console.log("loading script " + scripts[index]);
		$.getScript(scripts[index], function(){
			--unloadedScripts;
			++index
			if (unloadedScripts != 0 ){
				LoadScript(scripts, index);
			}
			else{
				scriptsDone();
			}
		});
		
	}
	
	var scriptsDone = function(){
		console.log("noVNC: scripts loaded, code " + unloadedScripts);
		console.log("noVNC: start loading UI");
		UI.load('VNC_canvas');
		console.log("noVNC: initialization completed");
		if(LivelyApp) {
			console.log("noVNC: Allow app to start: " + LivelyApp.name);
			LivelyApp.StartApp();
		} else {
			console.log("noVNC: LivelyApp can not be started");
		}
		setTimeout("UI.connect();", 2000);
	}
	
	var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.handleMouseDown = function(event) {
		// UI.displayFocus();
		//UI.rfb.get_mouse().onMouseDown(event);
		//onMouseButton(event, 1);
	}
	
	this.handleMouseUp = function(event) {
		// UI.displayBlur();
		//UI.rfb.get_mouse().onMouseUp(event);
		//onMouseButton(event, 0);
	}
	
	this.handleMouseMove = function(event) {
		UI.displayFocus();
		UI.lively3DX = event.coord[0];
		UI.lively3DY = event.coord[1];
	}
	
	this.handleKeyDown = function(event) {
		UI.displayFocus();
	}
	
	this.handleKeyUp = function(event) {
		UI.displayBlur();
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
} 

var noVNCInit = function(noVNC){
	console.log(">> noVNCInit");
	Lively3D.UI.ShowMessage("This application requires configuring noVNC on host computer (http://kanaka.github.com/noVNC/) and configuring host ip-address and port in Resources/noVNC/scripts/ui.js.");
		
	var app = new noVNC();
	
	Lively3D.LoadResources(app);
	
	app.EventListeners = { "mousedown": app.handleMouseDown, "mouseup": app.handleMouseUp, "mousemove": app.handleMouseMove, "keydown": app.handleKeyDown, "keyup": app.handleKeyUp };

	console.log("<< noVNCInit");
	return app;
}

var name = "VNC";

Lively3D.AddApplication(name, noVNC, noVNCInit);

// This does not work with IE < 9 and FF < 4
//Object.defineProperty(Array.prototype, "each", {
//    value: function() {/*blah*/},
//    writable: false,
//    enumerable: false,
//    configurable: false
//});

//Array.prototype.push8 = function (num) {
//    this.push(num & 0xFF);
//};
//
//Array.prototype.push16 = function (num) {
//    this.push((num >> 8) & 0xFF,
//              (num     ) & 0xFF  );
//};
//
//Array.prototype.push32 = function (num) {
//    this.push((num >> 24) & 0xFF,
//              (num >> 16) & 0xFF,
//              (num >>  8) & 0xFF,
//              (num      ) & 0xFF  );
//};

Object.defineProperty(Array.prototype, "push8", {
    value: function(num) {this.push(num & 0xFF);},
    writable: false,
    enumerable: false,
    configurable: false
});

Object.defineProperty(Array.prototype, "push16", {
    value: function(num) {this.push((num >> 8) & 0xFF,(num     ) & 0xFF  );},
    writable: false,
    enumerable: false,
    configurable: false
});

Object.defineProperty(Array.prototype, "push32", {
    value: function(num) {this.push((num >> 24) & 0xFF,
             (num >> 16) & 0xFF,
             (num >>  8) & 0xFF,
             (num      ) & 0xFF  );},
    writable: false,
    enumerable: false,
    configurable: false
});
