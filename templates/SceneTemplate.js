var Scene = function(){
	
	this.File = "scenename.xml";
	this.Id = "scenename";
	
	this.RenderingFunction = function(now, lasttime){
		
	};
	
	this.BindCanvasEvents = function(){
		console.log("binding scene events")
	};
		
	this.CreateApplication = function(canvastex){
		var Obj = new GLGE.Object();
		
		
		var Group = new GLGE.Group();
		Group.addChild(Obj);
		
		var customobj = {
			object: Obj,
			group: Group,
			
		}
		
		
		
		Lively3D.GLGE.document.getElement("scenename").addObject(Group);
		return customobj;
	};

	this.Resources = {};
	this.ResourceHandlers = {};
	this.ResourcePath = 'scenes/Resources/scenename';
	this.ResourcesLoaded = function(resource){
		console.log('scene done with resource: ' + resource);
		Lively3D.LoadCompleted();
	}
	
	this.Open = function(app, scene){
		
	}
	
	this.Close = function(app, scene){

	}	
}

var model = new Scene();
Lively3D.AddScene(model);
