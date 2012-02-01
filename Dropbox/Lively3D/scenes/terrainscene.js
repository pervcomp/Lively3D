var Terrainscene = function(){
	this.File = "terrain.xml";
	this.Id = "terrainscene";
	this.Cameras = [ "terraincamera" ];
	var pos = [0,0,0];
	var heightmap; 
	var keys = Lively3D.GetKeys();
	var mouse = Lively3D.GetMouse();
	var SceneMoveable = true;
	this.canvas;
	this.RenderingFunction = function (now, lasttime){
		if ( SceneMoveable == true ){
			mouselook(now, lasttime);
			checkkeys(now, lasttime);
		}
		MoveObjects(now, lasttime);
		
	}
	
	var MoveObjects = function(now, lasttime){
		var PassedTimeInSeconds = (now - lasttime) / 1000;
		var SpeedInUnitsPerSecond = 250;
		var Speed = SpeedInUnitsPerSecond * PassedTimeInSeconds;
		
		var apps = Lively3D.GetApplications();
		for( var i in apps){
			if ( apps.hasOwnProperty(i) ){
				
				var obj = apps[i].GetAppObject(Lively3D.GetCurrentSceneIndex());
				var direction = [ obj.target.x - obj.object.getLocX(), obj.target.y - obj.object.getLocY() ];
				var distance = Math.sqrt(direction[0]*direction[0]+direction[1]*direction[1]);
				if ( distance < 1 ){
					var target = {
						x: Math.floor(Math.random()*10000) - 5000,
						y: Math.floor(Math.random()*10000) - 5000
					}
					
					obj.target = target;
				}
				else{
					var ratio = Speed / distance;
					var newLoc = [ direction[0]*ratio, direction[1]*ratio ]
					var loc = {
						x: obj.object.getLocX() + newLoc[0],
						y: obj.object.getLocY() + newLoc[1]
					};
					loc.z = heightmap.getHeightAt(loc.x, loc.y) + 10;
					
					obj.object.setLoc(loc.x, loc.y, loc.z);
				}
			}
		}
		
	}
	
	var checkkeys = function(now,lasttime){
		var camera = Lively3D.GetCurrentScene().GetScene().getCamera();
		camerapos=camera.getPosition();
		var mat=camera.getRotMatrix();
		var trans=GLGE.mulMat4Vec4(mat,[0,0,-1,1]);
		var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
		trans[0]=trans[0]/mag;
		trans[1]=trans[1]/mag;
		var yinc=0;
		var xinc=0;
		
		
		if(keys.isKeyPressed(GLGE.KI_W)){
			yinc=yinc+parseFloat(trans[1]);
			xinc=xinc+parseFloat(trans[0]);
		}
		if(keys.isKeyPressed(GLGE.KI_S)){
			yinc=yinc-parseFloat(trans[1]);
			xinc=xinc-parseFloat(trans[0]);
		}
		if(keys.isKeyPressed(GLGE.KI_A)){
			yinc=yinc+parseFloat(trans[0]);
			xinc=xinc-parseFloat(trans[1]);
		}
		if(keys.isKeyPressed(GLGE.KI_D)){
			yinc=yinc-parseFloat(trans[0]);
			xinc=xinc+parseFloat(trans[1]);
		}
		
		if(xinc!=0 || yinc!=0){
			camera.setLocY(camerapos.y+yinc*0.4*(now-lasttime));
			camera.setLocX(camerapos.x+xinc*0.4*(now-lasttime));
			var height = heightmap.getHeightAt(camera.getLocX(), camera.getLocY());
			if ( !isNaN(height)){
				camera.setLocZ(heightmap.getHeightAt(camera.getLocX(), camera.getLocY()) + 50);
			}
			else{
				camera.setLocY(camerapos.y);
				camera.setLocX(camerapos.x);
			}
		}
		
		if(keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {
			var turn=0.001*(now-lasttime);
			camera.setRotY(camera.getRotation().y+turn);
		}
		
		if(keys.isKeyPressed(GLGE.KI_RIGHT_ARROW) ) {
			var turn=0.001*(now-lasttime);
			camera.setRotY(camera.getRotation().y-turn);
		}
		
		if (keys.isKeyPressed(GLGE.KI_ENTER) ){
			console.log("Camera loc: " + camera.getLocX() + ", " +  camera.getLocY());
			console.log("Height: " + heightmap.getHeightAt(camera.getLocX(), camera.getLocY()));
		}
	}
	var mouselook = function(now, lasttime){
		var mousepos=mouse.getMousePosition();
		
		
		mousepos.x=mousepos.x-document.getElementById("container").offsetLeft;
		mousepos.y=mousepos.y-document.getElementById("container").offsetTop;
		var scene = Lively3D.GetCurrentScene().GetScene();	
		var camera=scene.camera;
		camerarot=camera.getRotation();
		inc=(mousepos.y-(document.getElementById('canvas').offsetHeight/2))/500;

		var trans=GLGE.mulMat4Vec4(camera.getRotMatrix(),[0,0,-1,1]);
		var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
		trans[0]=trans[0]/mag;
		trans[1]=trans[1]/mag;
		camera.setRotX(1.56-trans[1]*inc);
		camera.setRotZ(-trans[0]*inc);
		var width=document.getElementById('canvas').offsetWidth;
		if(mousepos.x<width*0.3){
			var turn=Math.pow((mousepos.x-width*0.3)/(width*0.3),2)*0.005*(now-lasttime);
			camera.setRotY(camerarot.y+turn);
		}

		if(mousepos.x>width*0.7){
			var turn=Math.pow((mousepos.x-width*0.7)/(width*0.3),2)*0.005*(now-lasttime);
			camera.setRotY(camerarot.y-turn);
		}

	}
	
	
	this.BindCanvasEvents = function(canvas){
		SceneMoveable = true;
		this.canvas = canvas;
		console.log("binding terrain events")
		canvas.onmousemove = function(){
		}
		canvas.onclick = function(){
		}
		//canvas.ondblclick = function(e){
			
		//}
		canvas.onmousewheel = function(){
		}
		canvas.onmousedown = function(){
		}
		canvas.onmouseup = function(){
		}
	};

	this.CreateApplication = function(){
	
		var sphere = new GLGE.Object();
		sphere.setMesh(Lively3D.GLGE.document.getElement('TerrainSphere'));
		sphere.setMaterial(Lively3D.GLGE.document.getElement('appmat'));
		sphere.setScale(50);
		var location = {
			x: Math.floor(Math.random()*10000) - 5000,
			y: Math.floor(Math.random()*10000) - 5000
		}
		location.z = heightmap.getHeightAt(location.x, location.y) + 10;
		sphere.setLoc(location.x, location.y, location.z);
		
		var target = {
			x: Math.floor(Math.random()*10000) - 5000,
			y: Math.floor(Math.random()*10000) - 5000
		}
		
		var group = new GLGE.Group().addChild(sphere);
		
		var Terrain = {
			object: sphere,
			group: group,
			target: target
		};
		
		Lively3D.GLGE.document.getElement("terrainscene").addObject(group);
		return Terrain;
	}
	
	this.AppVariable = "Terrain";
	this.GLGEObject = "Terrain.object";
	this.GLGEGroup = "Terrain.group";
	
	this.Resources = {
		images: ['images/realmap.png'],
		DocResources: ['images/terrain0.jpg']
		
	};
	this.ResourceHandlers = {
		images: function(imageURLs){
			heightmap = new GLGE.HeightMap(imageURLs[0], 522, 521, 5000, -5000, -5000, 5000, 0, 3000, true);
		},
		
		DocResources: function(resources){
			DocReady.resources = true;
			DocResources = resources;
			initScene();
		}
	};
	
	var DocReady = { document: false, resources: false }
	var DocResources;
	var initScene = function(){
		if ( DocReady.document == true && DocReady.resources == true ){
			var material = Lively3D.GLGE.document.getElement('terrainmaterial');
			var tex = new GLGE.Texture().setSrc(DocResources[0], true);
			var layer = new GLGE.MaterialLayer().setMapinput(GLGE.UV1).setMapto(GLGE.M_COLOR).setTexture(tex).setScaleY(10).setScaleX(10);
			material.addTexture(tex).addMaterialLayer(layer);
			
			Lively3D.LoadCompleted();
		}
	}
	
	this.ResourcePath = 'scenes/Resources/Terrain/';
	this.ResourcesLoaded = function(resource){
		console.log('terrainscene done with resource: ' + resource);
	}
	
	this.DocumentDone = function(){
		DocReady.document = true;
		initScene();
	}
	
	this.Open = function(app, scene){
		//app.window.setRotZ(camera.getRotY() - Math.PI / 2 ).setRotX(0);
		//var scene = Lively3D.GetCurrentScene().scene;
		
		app.GetWindowObject().setLookat(scene.camera);
		var ray = scene.makeRay(window.innerWidth/2, window.innerHeight/2);
		var FrontOfCamera = [];
			FrontOfCamera = [ray.origin[0] - ray.coord[0]*11,
				ray.origin[1] - ray.coord[1]*11,
				ray.origin[2] - ray.coord[2]*11];
			
		app.GetWindowObject().setLoc(FrontOfCamera[0],FrontOfCamera[1],FrontOfCamera[2]);
		app.GetWindowObject().setScale(1);
		
		DisableSceneMovement();
		BindAppEvents(this.canvas);
	}
	
	var DisableSceneMovement = function(){
		SceneMoveable = false;
	}
	var EnableSceneMovement = function(){
		SceneMoveable = true;
	}
	
	this.Close = function(){
		EnableSceneMovement();
		if(this.canvas){
			this.BindCanvasEvents(this.canvas);
		}
	}
	
	var BindAppEvents = function(canvas){
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
						if ( !app.isClosed() ){
							Lively3D.FireEvent('mousedown', app, loc.texture, loc.object);
						}
					}
				}
			}
		}
		
		canvas.onmousemove = function(e){
			var loc = Lively3D.PickLocation(this, e);
			if ( loc != null ){
				var app = Lively3D.GetApplication(loc.object.parent);
					if ( app != null && !app.isClosed() ){
						Lively3D.FireEvent('mousemove', app, loc.texture, loc.object);
				}
			}
		}
		
		
		canvas.onmouseup = function(e){
			var loc = Lively3D.PickLocation(this, e);
			if ( loc != null ){
				var app = Lively3D.GetApplication(loc.object.parent);
				if ( app != null && !app.isClosed() ){
					Lively3D.FireEvent('mouseup', app, loc.texture, loc.object);
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

}
var model = new Terrainscene();
Lively3D.AddScene(model); 