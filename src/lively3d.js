/*
Copyright (C) 2012 Jari-Pekka Voutilainen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
/**
	@fileOverview Lively3D-library for WebGL.
	@author Jari-Pekka Voutilainen
*/

if (typeof(Lively3D) == 'undefined' ){
	Lively3D = {};
}

/**
	Creates Lively3D Object. Object created automatically when javascript-file is downloaded.
	@constructor
*/
var Lively3D = (function(Lively3D){
	
	var canvasName = "";
	var canvasDefault = "canvas";
	
	/**
		@namespace Holds GLGE related variables.
	*/
	Lively3D.GLGE = {
		/** GLGE Document */
		document: null,
		/** GLGE Renderer */
		renderer: null
	};
	
	var Scenes = [];
	var CurrentScene = 0;
	
	var DefaultScene = {
		Id:'mainscene', 
		BindCanvasEvents: function(){
			console.log("binding room events")
		},
		RenderingFunction: function(){},
		GLGEObject: "DefaultSceneObject.children[0]",
		GLGEGroup: "DefaultSceneObject",
		Open: function(app, camera){
			app.GetWindowObject().setLookat(null);
			app.GetWindowObject().setRotZ(0).setRotX(0).setRotY(Math.PI);
			app.GetWindowObject().setScale(3,3,3);
			app.GetWindowObject().setLoc(app.GetSceneObject(0).getLocX(),app.GetSceneObject(0).getLocY(),app.GetSceneObject(0).getLocZ());
		},
		Close: function(app, camera){
			app.GetSceneObject(0).setLoc(app.GetWindowObject().getLocX(),app.GetWindowObject().getLocY(),app.GetWindowObject().getLocZ());
		}
	};
	

	
	Lively3D.GLGE.draggableObject = null;
	Lively3D.GLGE.hoverObject = null;
	Lively3D.GLGE.clickedObject = null;
	
	/**
		@namespace Permission literals used in the environment.
	*/
	Lively3D.PERMISSIONS = {
		/** 
			Drag object in the environment.
			@constant
		*/
		DRAG: 'drag',
		/** 
			Open application in the environment.
			@constant
		*/
		OPEN: 'open',
		/** 
			Close application in the environment.
			@constant
		*/
		CLOSE: 'close',
		/** 
			Maximize application in the environment.
			@constant
		*/
		MAXIMIZE: 'maximize'
	};
	
	var keys = null;
	var mouse = null;
	
	var Applications = [];
	
	
	/**
		Initializes Lively3D environment.
		@param canvas ID of the canvas-element used for rendering Lively3D. 
	*/
	Lively3D.Init = function(canvas){
		
		var userform = $("<h1>Enter Username</h1>Username: <input type='text' name='username' id='username'/><h3 onclick='Lively3D.UI.EnterUsername()'>Ok</h3>");
		Lively3D.UI.ShowHTML(userform, true);
		
		if ( !canvas ){
			canvasName = canvasDefault;
		}
		else{
			canvasName = canvas;
		}
		this.GLGE.document = new GLGE.Document();
	
		var canvas = document.getElementById(canvasName);
		this.GLGE.document.onLoad = function() {
				
			Lively3D.GLGE.renderer = new GLGE.Renderer(canvas, null, {alpha:true,depth:true,stencil:true,antialias:false,premultipliedAlpha:true, preserveDrawingBuffer: true});
			
			Scenes.push( new Lively3D.Scene().SetScene(Lively3D.GLGE.document.getElement(DefaultScene.Id)).SetModel(DefaultScene));
			
			Lively3D.GLGE.renderer.setScene(Scenes[CurrentScene].GetScene());
		
			var lasttime=0;
			var now;
			
			function animLoop(){
				requestAnimFrame(animLoop, canvas);
				now=parseInt(new Date().getTime());
				
				Scenes[CurrentScene].GetModel().RenderingFunction(now, lasttime);
				
				Lively3D.GLGE.renderer.render();
				lasttime=now;					
			}
					
			animLoop();
			
			Lively3D.GLGE.document.onLoad = SceneLoader;
			
			
		}

		this.GLGE.document.load('lively3d.xml');
		keys = new GLGE.KeyInput();
		mouse = new GLGE.MouseInput(canvas);
		DefaultCanvasEvents(canvas);
		
		$(document).keydown(function(e){
            if ( Lively3D.GLGE.clickedObject != null ){
				Lively3D.GLGE.clickedObject.fireEvent("keydown", e);
            }
        });

        $(document).keyup(function(e){
            if ( Lively3D.GLGE.clickedObject != null ){
                    Lively3D.GLGE.clickedObject.fireEvent("keyup", e);
            }
        });
		
		$(document).keypress(function(e){
            if ( Lively3D.GLGE.clickedObject != null ){
                    Lively3D.GLGE.clickedObject.fireEvent("keypress", e);
            }
        });

	}
	
	/**
		Adds new canvas-application to the Lively3D-environment.
		@param name Name of the application.
		@param AppCode Function which holds the application code.
		@param AppInit Function which initializes the application.
	*/
	Lively3D.AddApplication = function(name, AppCode, AppInit ){

		var livelyapp = new Lively3D.Application();
		Applications.push(livelyapp);
		livelyapp.SetName(name).SetApplicationCode(AppCode).SetInitializationCode(AppInit);
		//run the app code and save app canvas
		
		var app = AppInit(AppCode);
		var canvas = app.GetCanvas();
	
		livelyapp.SetStart(app.StartApp);
	
		//create appcanvas texture
		var tex = new GLGE.TextureCanvas();
		tex.setCanvas(canvas);
		var layer = new GLGE.MaterialLayer().setMapinput(GLGE.UV1).setMapto(GLGE.M_COLOR).setTexture(tex);
		var content = new GLGE.Material().addTexture(tex).addMaterialLayer(layer).setSpecular(0);
		
		AddEventListeners(content, app.EventListeners);
		
		
		//create cube texture
		var Apptex = new GLGE.Texture().setSrc('images/app.png');
		layer = new GLGE.MaterialLayer().setMapinput(GLGE.UV1).setMapto(GLGE.M_COLOR).setTexture(Apptex);
		var newMat = new GLGE.Material().addTexture(Apptex).addMaterialLayer(layer).setSpecular(0);
		
		var progbar = new GLGE.Object();
		progbar.setMesh(this.GLGE.document.getElement('ProgTitleBar'));
		
		var TitleCanvas = document.createElement('canvas');
		
		TitleCanvas.setAttribute("style", "display:none");
		TitleCanvas.height = 64;
		TitleCanvas.width = 512;

		
		var ctx = TitleCanvas.getContext('2d');
		ctx.fillStyle = "#fff";
		ctx.fillRect(0,0,512,164);
		ctx.fillStyle = "#333";
		ctx.font = "bold 50px arial";
		ctx.fillText(name, 5, 50);
		
		var Titletex = new GLGE.TextureCanvas();
		Titletex.setCanvas(TitleCanvas);
		var titleLayer = new GLGE.MaterialLayer().setMapinput(GLGE.UV1).setMapto(GLGE.M_COLOR).setTexture(Titletex);
		var titlemat = new GLGE.Material().addTexture(Titletex).addMaterialLayer(titleLayer).setSpecular(0);
		
		progbar.setMaterial(titlemat);
		
		var closebutton = new GLGE.Object();
		closebutton.setMesh(this.GLGE.document.getElement('ProgCloseButton')).setMaterial(this.GLGE.document.getElement('closebutton'));
		
		var progwindow = new GLGE.Object();
		progwindow.setMesh(this.GLGE.document.getElement('ProgWindow'));
		progwindow.setMaterial(content);
		
		var window = new GLGE.Group();
		window.addChild(progbar).addChild(closebutton).addChild(progwindow);
		
		livelyapp.SetWindowObject(window);
		
		var newObj = new GLGE.Object();
		newObj.setLoc(0, 0, 0);
		newObj.setId('app');
		newObj.setMesh(this.GLGE.document.getElement('cube2'));
		newObj.setMaterial(newMat);
		
		var wrapGroup = new GLGE.Group();
		wrapGroup.addChild(newObj);
		
		
		wrapGroup.addEventListener('mouseover', function(){
			livelyapp.GetCurrentSceneObject().addChild(livelyapp.hoverText);
		});
		
		
		wrapGroup.addEventListener('mouseout', function(){
			livelyapp.GetCurrentSceneObject().removeChild(livelyapp.hoverText);
		});
		
		var sceneObj = {
			group: wrapGroup
		}
		
		livelyapp.AddSceneObject(sceneObj);
		
		
		if ( app.GetState ){
			livelyapp.SetSave(app.GetState);
		}
		
		if ( app.SetState ){
			livelyapp.SetLoad(app.SetState);
		}
		
		if ( app.Open ){
			livelyapp.SetAppOpen(app.Open);
		}
		
		
		if ( app.Close ){
			livelyapp.SetAppClose(app.Close);
		}
	
		livelyapp.hoverText = new GLGE.Text().setText(livelyapp.GetName()).setLoc(livelyapp.GetCurrentSceneObject().getLocX() + 5, livelyapp.GetCurrentSceneObject().getLocY(), livelyapp.GetCurrentSceneObject().getLocZ()).setId('hovertext').setSize(50).setColor('lightblue').setFont('arial').setLookat(Scenes[0].GetScene().camera);
	
		livelyapp.AddPermission(this.PERMISSIONS.DRAG, progbar);
		livelyapp.AddPermission(this.PERMISSIONS.DRAG, newObj);
		livelyapp.AddPermission(this.PERMISSIONS.CLOSE, closebutton);
		livelyapp.AddPermission(this.PERMISSIONS.MAXIMIZE, progbar);
		
		
		for ( var i = 1; i < Scenes.length; ++i ){
			var model = Scenes[i].GetModel().CreateApplication(content);
			livelyapp.AddSceneObject(model);	
		}
		Scenes[0].GetScene().addObject(wrapGroup);
				
		app.SetLivelyApp(livelyapp);
		
		livelyapp.SetCurrentSceneObject(CurrentScene);
		return livelyapp;
	}

	
	var AddEventListeners = function(object, events){
		
		if ( object != null && events != null ){
			$.each(events, function(key, value){
				object.addEventListener(key, value);
			});
		}
	}
	
	var AppIsOpen = false;
	
	/**
		Opens given Lively3D Application in every 3D-scene.
		@param app Lively3D Application
	*/
	Lively3D.Open = function(app){
		
		for ( var i in Scenes ){
			if ( Scenes.hasOwnProperty(i) ){
				Scenes[i].GetScene().removeChild( app.GetSceneObject(i));
			}
		}
		
		Scenes[CurrentScene].GetScene().addChild(app.GetWindowObject());
		Scenes[CurrentScene].GetModel().Open(app, Scenes[CurrentScene].GetScene());
		
		
		app.ToggleWindowObject();
		this.GLGE.clickedObject = app.GetWindowMaterial();
		app.Open();
	
		Lively3D.GLGE.hoverObject = null;
	}

	/**
		Closes given Lively3D Application in every 3D-scene.
		@param app Lively3D Application
	*/
	Lively3D.Close = function(app){

	
		app.GetWindowObject().setScale(1,1,1);
		
		if( app.isMaximized() ){
			Lively3D.Minimize(app);
		}
		
		app.ToggleWindowObject();
		this.GLGE.clickedObject = null;
		app.Close();
		for ( var i in Scenes ){
			if ( Scenes.hasOwnProperty(i) ){
				Scenes[i].GetScene().addChild(app.GetSceneObject(i));
			}
		}
		
		Scenes[CurrentScene].GetScene().removeChild(app.GetWindowObject());
		Scenes[CurrentScene].GetModel().Close(app, Scenes[CurrentScene].GetScene());
		
		
		
	}

	/**
		Maximizes given Lively3D Application in the current scene.
		@param app Lively3D Application 
	*/
	Lively3D.Maximize = function(app){
			
		var scene = Scenes[CurrentScene].GetScene();
		var ray = scene.makeRay(window.innerWidth/2, window.innerHeight/2);
		var FrontOfCamera = [];
		FrontOfCamera = [ray.origin[0] - ray.coord[0]*11,
			ray.origin[1] - ray.coord[1]*11,
			ray.origin[2] - ray.coord[2]*11];
			
		app.OldLocation = [app.GetWindowObject().getLocX(),app.GetWindowObject().getLocY(),app.GetWindowObject().getLocZ()];
		app.GetWindowObject().setLoc(FrontOfCamera[0],FrontOfCamera[1],FrontOfCamera[2]).setScale(1,1,1);
		app.Maximize();	
		this.GLGE.clickedObject = app.GetWindowMaterial();
	}
	
	/**
		Minimizes given Lively3D Application to the original location and size.
		@param app Lively3D Application
	*/
	Lively3D.Minimize = function(app){
		app.GetWindowObject().setLoc(app.OldLocation[0],app.OldLocation[1],app.OldLocation[2]).setScale(3,3,3);
		app.Minimize();
		this.GLGE.clickedObject = app.GetWindowMaterial();
	}
	
	/**
		Get the Lively3D application which presented by given GLGE Object.
		@param glge_object The GLGE Object which represents application in the scene.
		@returns Lively3D application if GLGE Object is bound to a application, otherwise null
	*/
	Lively3D.GetApplication = function(glge_object){
		
		for ( var i in Applications ){
			if ( Applications.hasOwnProperty(i)){
				if ( Applications[i].GetCurrentSceneObject() === glge_object ){
					return Applications[i];
					
				}
			}
		}
		
		return null;	
	}
	
	/**
		Fires given event to given application.
		@param {string} eventname Name of the event for firing.
		@param app Application which is the target of the event.
		@param textureCoordinates x- and y-coordinates in texture of the event.
		@param glge_object The GLGE Object which represents the target application.
		@param event Javascript event-object.
	*/
	Lively3D.FireEvent= function(eventname, app, textureCoordinates,glge_object, event ){
	
		
		if ( textureCoordinates, glge_object ){
			var material;
			material = glge_object.getMaterial();
			
			var tex = material.getLayers()[0].getTexture();
			
			//tex is GLGE.TextureCanvas
			if ( tex.getCanvas ){
				var params;
				if ( eventname != "mousewheel" ){
					var canvas = tex.getCanvas();
					var canvasCoordinates = [ textureCoordinates[0]*canvas.width, (1-textureCoordinates[1])*canvas.height ]; 
					params = { "coord":canvasCoordinates, "canvas":canvas };
				}
				else{
					params = event;
				}
				material.fireEvent(eventname, params);
			}
		}
		else{
			app.GetCurrentSceneObject().fireEvent(eventname);
		}
	}
	
	/**
		Picks mouse location within 3D scene. 
		@param that this context
		@param mouseevent JavasScript mouse event.
		@returns Location object which includes GLGE object of the coordinates, distance of the object, texture coordinates etc.
	*/
	Lively3D.PickLocation = function(that, mouseevent){
		var pos = findPos(that);
		var x = mouseevent.pageX - pos.x;
		var y = mouseevent.pageY - pos.y;
		
		var loc = Scenes[CurrentScene].GetScene().pick(x, y)
		
		return loc;
	}
	
	var findPos = function(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return { x: curleft, y: curtop };
		}
	}
	
	/**
		Gets index of the current scene.
		@returns {integer} Index of the scene.
	*/
	Lively3D.GetCurrentSceneIndex = function(){
		return CurrentScene;
	}
	

	/**
		@namespace Functions for proxying files through serverside PHP.
	*/
	Lively3D.FileOperations = {};
	
	/**
		Gets JavaScript-file from dropbox and creates script element for it.
		@param {string} filename Name of the JavaScript-file.
		@param {string} path Path of the JavaScript file in Dropbox, starting from shared folder root.
	*/
	Lively3D.FileOperations.getScript = function(filename, path){
	
		$.get("getFile.php", {name: filename, path: path}, function(scripturl){
			//$.getScript(scripturl, function(){
			//	console.log("Executed scriptfile: " + filename);
			//});
			
			var script = document.createElement('script');
			script.type = "text/javascript";
			script.src = scripturl;
			document.head.appendChild(script);
		});
	}
	
	/**
		Uploads file to the dropbox folder. Replaces existing.
		@param {string} filename Name of the resulting file.
		@param {string} script Contents of the file.
		@param {string} path Path of the file in dropbox.
	*/
	Lively3D.FileOperations.uploadScript = function(filename, script, path ){
		$.post('uploadfile.php', {name: filename, file: script, path: path}, function(){
			console.log('uploaded script: ' + filename);
		});
	};
	
	/**
		Gets file from dropbox which contains JSON.
		@param {string} filename Name of the file.
		@param {function} JSONParsingFunc Parser for JSON response.
		@param {string} path Path of the file in dropbox.
	*/
	Lively3D.FileOperations.getJSON = function(filename, JSONParsingFunc, path){
		$.get("getFile.php", {name: filename, JSON: true, path: path}, function(jsonURL){
			$.getJSON(jsonURL, JSONParsingFunc);
		});
	};
	
	/**
		Gets array of resources from dropbox.
		@param App Lively3D Application which requires resources
		@param {string} resource Literal for current resource. 
	*/
	Lively3D.FileOperations.LoadResources = function(App, resource){
		$.get("getFileArray.php", {'names[]': App.Resources[resource], path: App.ResourcePath}, function(array){
			var list = JSON.parse(array);
			App.ResourceHandlers[resource](list);
			App.ResourcesLoaded(resource);
		});	
	};
	
	
	/**
		Enables opening of the application for the glge object in the scene.
		@param app Lively3D Application which is ready for usage.
	*/
	Lively3D.AllowAppStart = function(app){
		for ( var i in Scenes ){
			if ( Scenes.hasOwnProperty(i)){
				app.AddPermission(this.PERMISSIONS.OPEN, app.GetSceneObject(i));
			}
		}
		if ( app.StateFromDropbox == true ){
			if ( app.OpenAfterLoad == true){
				Lively3D.Open(app);
			}
			if ( app.MaximizeAfterLoad == true){
				Lively3D.Maximize(app);
			}
		}
		Lively3D.UI.ShowLoadCompleted();
	}
	
	
	var DefaultCanvasEvents = function(canvas){
		canvas.onclick = function(e){
			
			var loc = Lively3D.PickLocation(this,e);
			if (loc != null){
				var app = Lively3D.GetApplication(loc.object.parent);

				if ( app != null ){

					if ( app.CheckPermission(Lively3D.PERMISSIONS.CLOSE, loc.object)){
						Lively3D.Close(app);
					}
					
					if ( !app.isClosed() ){
						Lively3D.FireEvent('click', app, loc.texture, loc.object);
					}
				}
			}
		}
		
		canvas.ondblclick = function(e){
			var loc = Lively3D.PickLocation(this, e);
			console.log("dblclick with loc: " + loc);
			if ( loc != null ){
				var app = Lively3D.GetApplication(loc.object.parent);
					
				if ( app != null){
					
					if ( app.CheckPermission(Lively3D.PERMISSIONS.OPEN, loc.object) ){
						Lively3D.Open(app);
					}
					else if (app.CheckPermission(Lively3D.PERMISSIONS.CLOSE, loc.object) ){
						Lively3D.Close(app);
					}
					
					else if (app.CheckPermission(Lively3D.PERMISSIONS.MAXIMIZE, loc.object)){
						if ( !app.isMaximized() ){
							Lively3D.Maximize(app);
						}
						else{
							Lively3D.Minimize(app);
						}
					}
				}
			}
		}
		
		canvas.onmousedown = function(e){
			
			var loc = Lively3D.PickLocation(this,e);
			if ( loc != null ){
				var app = Lively3D.GetApplication(loc.object.parent);
				
				if ( app != null ){
					if ( e.which == 3 ){
						if ( !app.isClosed() ){
							Lively3D.FireEvent('rightclick', app, loc.texture, loc.object);
						}	
					}
					else{
						if ( app.CheckPermission(Lively3D.PERMISSIONS.DRAG, loc.object) && (app.isClosed() || !app.isMaximized())){
							Lively3D.GLGE.draggableObject = app.GetCurrentSceneObject();
						}
						if ( !app.isClosed() ){
							Lively3D.GLGE.clickedObject = app.GetWindowMaterial();
							Lively3D.FireEvent('mousedown', app, loc.texture, loc.object);
						}
					}
				}
			}
		}
		
		canvas.onmousemove = function(e){
			if( Lively3D.GLGE.draggableObject != null ){
				var pos = findPos(this);
				var x = e.pageX - pos.x;
				var y = e.pageY - pos.y;
					
				var ray = Scenes[CurrentScene].GetScene().makeRay(x, y);
				var location = [ray.origin[0] - ray.coord[0]*120,ray.origin[1] - ray.coord[1]*120,ray.origin[2] - ray.coord[2]*120];
				
				Lively3D.GLGE.draggableObject.setLocX(location[0]);
				Lively3D.GLGE.draggableObject.setLocY(location[1]);
			
				
			}
				
			else{
				
				var loc = Lively3D.PickLocation(this, e);
				if ( loc != null ){
					var app = Lively3D.GetApplication(loc.object.parent);
					
					if ( loc.object && app != Lively3D.GLGE.hoverObject ){
							

						if ( app != null ){ 
							Lively3D.FireEvent('mouseover', app);
						}
						
						if ( Lively3D.GLGE.hoverObject ){
							Lively3D.FireEvent('mouseout', Lively3D.GLGE.hoverObject);
						}
						
						Lively3D.GLGE.hoverObject = app;
					}
					
					if ( app != null && !app.isClosed() ){
						Lively3D.FireEvent('mousemove', app, loc.texture, loc.object);
					}
				}
			}
		};
		
		canvas.onmouseup = function(e){
			if ( Lively3D.GLGE.draggableObject != null ){
				Lively3D.GLGE.draggableObject = null;
			}
			else{
					
				var loc = Lively3D.PickLocation(this, e);
				if ( loc != null ){
					var app = Lively3D.GetApplication(loc.object.parent);
					
					if ( app != null && !app.isClosed() ){
							
						Lively3D.FireEvent('mouseup', app, loc.texture, loc.object);
					}
				}
			}
		};
		
		canvas.onmousewheel = function(e){
			var loc = Lively3D.PickLocation(this, e);
			if ( loc != null ){
				var app = Lively3D.GetApplication(loc.object.parent);
								
				if ( app != null && !app.isClosed() ){
					Lively3D.FireEvent("mousewheel", app, loc.texture, loc.object, e);
				}
			}
		};
	}
	
	var SceneBuffer = [];
	
	/**
		Adds a new scene to the environment.
		@param scene Object which implements Lively3D APIs for 3d scene.
	*/
	Lively3D.AddScene = function(scene){
		console.log("Loading scene..");
		
		SceneBuffer.push(scene);
		scene.Resources['Document'] = 'Document/' + scene.File;
		
		scene.ResourceHandlers['Document'] = function(docURL){
				Lively3D.GLGE.document.loadDocument(docURL[0]);
		};
		
		
		Lively3D.LoadResources(scene);
	}
	
	var SceneLoader = function(url){
		
		var parsedURL = parseUrl(url);
		
		console.log("scene loaded from url: "+ url + " and file is " + parsedURL.file);
		
		var found = false;
		for ( var i in SceneBuffer){
			if ( SceneBuffer.hasOwnProperty(i)){
				if ( SceneBuffer[i].File == parsedURL.file){
					if ( SceneBuffer[i].DocumentDone ){
						SceneBuffer[i].DocumentDone();
					}
					Scenes.push(new Lively3D.Scene().SetScene(Lively3D.GLGE.document.getElement(SceneBuffer[i].Id)).SetModel(SceneBuffer[i]));
					AddAppsToScene(SceneBuffer[i]);
					SceneBuffer.splice(i, 1);
					found = true;
				}
			}
		}
		if ( found == false){
			console.log("error loading scene");
		}
	}
	
	var parseUrl = function(data) {
		var e=/((http|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+\.[^#?\s]+)(#[\w\-]+)?/;

		if (data.match(e)) {
			return  {url: RegExp['$&'],
                protocol: RegExp.$2,
                host:RegExp.$3,
                path:RegExp.$4,
                file:RegExp.$6,
                hash:RegExp.$7};
		}
		else {
			return  {url:"", protocol:"",host:"",path:"",file:"",hash:""};
		}
	}
	
	var AddAppsToScene = function(scene){
		 
		//scene.AppGlobals(Lively3D);
		for (var i in Applications){
			if ( Applications.hasOwnProperty(i)){
				var model = scene.CreateApplication(Applications[i].GetWindowObject().children[2].getMaterial());
				//scene.AddApp();
				//Applications[i][scene.AppVariable] = model;
				Applications[i].AddSceneObject(model);
				Applications[i].AddPermission(Lively3D.PERMISSIONS.OPEN, Applications[i].GetSceneObject(Scenes.length - 1));
			}
		}
	}
	
	/**
		Gets currently shown scene.
		@returns Scene object.
	*/
	Lively3D.GetCurrentScene = function(){
		return Scenes[CurrentScene];
	}
	
	/**
		Gets GLGE KeyInput object.
		@return KeyInput object.
	*/
	Lively3D.GetKeys = function(){
		return keys;
	}
	
	/**
		Gets currently loaded applications.
		@returns Array of applications.
	*/
	Lively3D.GetApplications = function(){
		return Applications;
	}
	
	/**
		Gets GLGE MouseInput object.
		@return MouseInput Object.
	*/
	Lively3D.GetMouse = function(){
		return mouse;
	}
	
	/**
		Switches to the next scene. If current scene is the last scene, switches to the first scene.
	*/
	Lively3D.ChangeScene = function(){
		
		for ( var i in Applications){
			if ( Applications.hasOwnProperty(i)){
				if ( !Applications[i].isClosed() ){
					Lively3D.Close(Applications[i]);
				}
			}
		}
		
		CurrentScene += 1;
		if (CurrentScene == Scenes.length ){
			CurrentScene = 0;
		}
		
		for ( var i in Applications){
			Applications[i].SetCurrentSceneObject(CurrentScene);
		}
				
		Lively3D.GLGE.renderer.setScene(Scenes[CurrentScene].GetScene());
		DefaultCanvasEvents(document.getElementById(canvasName));
		Scenes[CurrentScene].GetModel().BindCanvasEvents(document.getElementById(canvasName));
		
	}
	
	
	/**
		Shows notification about completion of downloading Application or 3D Scene. 
	*/
	Lively3D.LoadCompleted = function(){
		Lively3D.UI.ShowLoadCompleted();
	}
	
	/**
		Syncs dropbox-contents to local filesystem if local node.js application is running.
	*/
	Lively3D.Sync = function(){
		Lively3D.Proxies.Local.CheckAvailability(function(){
			Lively3D.Proxies.Local.Sync();
		});
	}
	
	/**
		Loads Resources for application or scene.
		@param App Lively3D Application or scene.
	*/
	Lively3D.LoadResources = function(App){
		
		for ( var resource in App.Resources ){
			if ( App.Resources.hasOwnProperty(resource)){
				if ( Lively3D.UI.HTTPServers.LOCAL.inUse == true ){
					Lively3D.Proxies.Local.LoadResources(App, resource);
				}
				else if ( Lively3D.UI.HTTPServers.PROXY.inUse == true || Lively3D.UI.HTTPServers.NODE.inUse == true ){
					Lively3D.FileOperations.LoadResources(App, resource);
				}
					
			}
		}
			
	};
	
	var username;
	Lively3D.SetUsername = function(name){
		username = name;
	}
	
	Lively3D.GetUsername = function(){
		return username;
	}

	return Lively3D;
}(Lively3D));
