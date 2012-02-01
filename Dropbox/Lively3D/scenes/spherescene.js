var SphereScene = function(){

	var Phi = 180;
	var Theta = 90.0;
	var Radius = 10;
	
	
	this.File = "sphere.xml";
	this.Id = "spherescene";
	this.Cameras = [ "spherecamera" ];
	this.RenderingFunction = function(now, lasttime){
		var turn = (now - lasttime) / 6000 * 50; 
		var Applications = Lively3D.GetApplications();
		for ( var i in Applications){
			var app = Applications[i].GetAppObject(Lively3D.GetCurrentSceneIndex());
			if ( Applications[i].isClosed() ){
				
				app.phi += turn;
				app.theta += turn * 5;
				
				var phi = app.phi;
				var theta = app.theta;
				
				var r = app.radius;
				var x = r * Math.sin(theta * Math.PI/180) * Math.cos(phi * Math.PI/180);
				var y = r * Math.sin(theta * Math.PI/180) * Math.sin(phi * Math.PI/180);
				var z = r * Math.cos(theta * Math.PI/180);
				
				var obj = app.object;
				obj.setLocX(x);
				obj.setLocY(y);
				obj.setLocZ(z);
				
				app.moves += 1;
				if ( app.moves >= 5){
					app.moves = 0;
					var positions = app.line.getMesh().positions;
					positions.push(positions[positions.length-3]);
					positions.push(positions[positions.length-3]);
					positions.push(positions[positions.length-3]);
					positions.push(x);
					positions.push(y);
					positions.push(z);
					
					if ( positions.length >= 50*6 ){
						positions.splice(0,6);
					}
					
					var newMesh = (new GLGE.Mesh).setPositions(positions);
					app.line.setMesh(newMesh);
				}
			}
			else{
				var positions = app.line.getMesh().positions;
				if ( positions.length > 0 ){
					positions.splice(0,6);
					var newMesh = (new GLGE.Mesh).setPositions(positions);
					app.line.setMesh(newMesh);
				}
			}
		}
	};
	
	this.BindCanvasEvents = function(){
		console.log("binding sphere events")
	};
		
	this.CreateApplication = function(canvastex){
		var sphereObj = new GLGE.Object();
		sphereObj.setScale(1.5);
		sphereObj.setMesh(Lively3D.GLGE.document.getElement('SphereMesh'));
		sphereObj.setMaterial(canvastex);
		sphereObj.setRotX(-1.56);
		
		var sphereGroup = new GLGE.Group();
		sphereGroup.addChild(sphereObj);
		var traceline = (new GLGE.Object).setDrawType(GLGE.DRAW_LINES);
		traceline.setMesh((new GLGE.Mesh).setPositions([]));
		traceline.setMaterial(Lively3D.GLGE.document.getElement('trace'));
		sphereGroup.addChild(traceline);
		var Sphere = {
			object: sphereObj,
			group: sphereGroup,
			radius: Radius,
			theta: Theta,
			phi: Phi,
			line: traceline,
			moves: 0
		}
		
		Radius += 1;
		Theta += 20;
		Phi += 30;
		
		Lively3D.GLGE.document.getElement("spherescene").addObject(sphereGroup);
		return Sphere;
	},

	this.AppVariable = "Sphere";
	this.GLGEObject = "Sphere.object";
	this.GLGEGroup = "Sphere.group";
	/*	
		"AppLively": "Sphere",
		"AppObject": "Sphere.object",
		"Group": "Sphere.group"
	*/
	
	this.Resources = {};
	this.ResourceHandlers = {};
	this.ResourcePath = 'scenes/Resources/Sphere/';
	this.ResourcesLoaded = function(resource){
		console.log('spherescene done with resource: ' + resource);
		Lively3D.LoadCompleted();
	}
	
	this.Open = function(app, camera){
		app.GetWindowObject().setRotZ(0).setRotX(0).setRotY(Math.PI);
		//app.window.setLookat(Lively3D.GetCurrentScene().scene.camera);
		app.GetWindowObject().setScale(3,3,3);
		if ( app.GetWindowObject().getLocX() == 0 && app.GetWindowObject().getLocY() == 0 ){
					app.GetWindowObject().setLoc(30,10,0);
		}
	}
	
}

var model = new SphereScene();
Lively3D.AddScene(model);