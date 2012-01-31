/**
	@lends Lively3D-Application
*/

/**
	Canvas-application which is wrapped in function with Lively3D-interfaces.
*/
var CanvasApplication = function(){
	var canvas;
	
	/** 
		Getter for canvas-element
		Called by Lively3D.
		@returns Canvas-element of the application. 
	*/ 
	this.GetCanvas = function(){
		return canvas;
	}
	
	/** 
		Getter for Application state. State object is defined by application developer.
		Called by Lively3D.
		@returns {object} Custom JavaScript object, which can be parsed in SetState-function. 
	*/
	this.GetState = function(){
		var state = {};
		
		return state;
	}
	
	/** 
		Sets the application to the defined state.
		Called by Lively3D.
		@param {object} state Custom JavaScript object defined in GetState.
	*/
	this.SetState = function(state){
	
	}
	
	/**
		Called when application is opened in the environment. Enables application developer to perform operations like start background music etc. 
		Called by Lively3D.
	*/
	this.Open = function(){
		
	}
	/**
		Called when application is closed in the environment. Enable application developer to perform similar operations as the Open-function.
		Called by Lively3D.
	*/
	this.Close = function(){
		
	}
	
	/**
		Named functions which handle loaded resources with the same name.
		Called by Lively3D.
	*/
	this.ResourceHandlers = {
		
		/** 
			Example resource 1 
			@param resources Array of URLs to the resourcefiles on the server.
		*/
		Resource1: function(resources){
		
		},
		/** 
			Example resource 2 
			@param resources Array of URLs to the resourcefiles on the server.
		*/
		Resource2: function(resources){
		
		}
	}
	
	/**
		Named arrays where each item define path to the resource file, beginning from application resource root.
	*/
	this.Resources = {
		/** Example resource 1 */
		Resource1: [],
		/** Example resource 2 */
		Resource2: []
	}
	
	/** Path to the root of resources in Dropbox folder. */
	this.ResourcePath = 'Resources/App/';
	
	/** 
		Called after array of named resources has been loaded to the server from the dropbox. Enables application developer to initialize application datastructures with resource urls and inform Lively3D that application is initialized.
		Called by Lively3D.
		@param resource name of the loaded resource.
	*/
	this.ResourcesLoaded = function(resource){
		
		/** Inform Lively3D that application is initialized. */
		Lively3D.AllowAppStart(LivelyApp);
	}
	
	var LivelyApp;
	/** 
		Sets the created Lively3D Application object to the variable, so that Lively3D operations can be called from inside the application code.
		Called by Lively3D.
		@param app Lively3D Application
	*/
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}

	/** Specify mouse-events and their listeners. */
	this.EventListeners = {
		"mousemove": mousemoveHandler
	};
}

/**
	Initializes the canvas-application.
	@param CanvasApplication Function which wraps the application with the Lively3D-interfaces.
	@returns Initialized canvas-application.
*/
var AppInit = function(CanvasApplication){
	//create the application
	var app = new CanvasApplication();
	
	//Load Resources for application.
	Lively3D.LoadResources(app);
	return app;
}

//Add the application to Lively3D
var tmp = Lively3D.AddApplication("App", App, AppInit);

//Inform Lively3D that application is initialized. Called here if application doesn't have external resources.
Lively3D.AllowAppStart(tmp);