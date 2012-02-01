var Tasohyppely = function(){

  //Constants for player's status window which holds player's score
  //GETTING THE 3D LOC BASED ON 2D COORDS WORKS SOMEWHAT, BUT NOT
  //PERFECTLY.
  /*var SCORE_LOC_X = 130;
  var SCORE_LOC_Y = 475;
  var SCORETEXT_LOC_X = 70;
  var SCORETEXT_LOC_Y = 478;
  var SCORE_TEXT_CONTENT = "score:";

  //Factors for the ray xyz-values. Used in initStatusScene()
  var RAY_FACTOR_X = -5;
  var RAY_FACTOR_Y = 5;
  var RAY_FACTOR_Z = -5;

  //Start and end message constants
  var GAME_OVER_TEXT = "Game over!";
  var START_GAME_TEXT = "Press 'enter' to start!";
  var START_OFFSET_X = 0;
  var START_OFFSET_Y = 0;
  var START_OFFSET_Z = -5;
  var END_OFFSET_X = 0;
  var END_OFFSET_Y = 0;
  var END_OFFSET_Z = -5;*/

  var canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  //var DEFAULT_FOG_COLOR = "#3F3F3F";
  //var EFFECT_FOG_COLOR = "#DCFCCC";

  /*var SCORE_TEXT_COLOR = "#D0F0C0";
  var SCORE_TEXT_SIZE = 10;
  var STATE_TEXT_COLOR = "#D0F0C0";//"#ffdd00";
  var STATE_TEXT_SIZE = 17;*/

  //Objects have the word 'movable' in their id if they are affected by the physics library
  //var MOVABLE = "movable";

  //jiglib body types in strings
  //var BODY_TYPES = ["SPHERE", "BOX","CAPSULE", "PLANE"];
  //enums for indexing BODY_TYPES
  //var BodyValues = {"SPHERE":0, "BOX":1, "CAPSULE":2, "PLANE":3};
  
  var testScene;

  //Function that is called from body onload
  //Precondition: 1. GLGE library is included
  //2. there is xml file named testScene.xml
  //Postcondition: when document has loaded, init is called
  this.loader = function(){
    
    //document.body.appendChild(canvas);

    var doc = new GLGE.Document();

    //doc.load("../xml/testScene.xml");
    doc.load(testScene);
    
    doc.onLoad = function() {
      initGame(canvas, doc);
    }
  }

  //Initializes scene after documents has been loaded, calls mainLoop
  //Parameters: canvas = canvas element, doc = document that contains scene
  //Precondition: 1. loader has to be called first
  //2. GLGE library is included
  //Postcondition: Scene, renderer, keyInput and
  //player objects are initialized, mainLoop is called
  var initGame = function(canvas, doc){
    //setting up the scene
    var renderer = new GLGE.Renderer(canvas);
    var scene = new GLGE.Scene();
    scene = doc.getElement("mainScene");
   
    //set the fog
    var sceneFog = new SceneFog( scene );
    sceneFog.setFogColor(DEFAULT_FOG_COLOR);
    sceneFog.setFogFar(95);
    sceneFog.setFogNear(10);
    
    //jigLib physics system
    var system = new jigLib.PhysicsSystem.getInstance();

    //Links hold the links between jiglib bodies and glge objects
    system.links = [];
    //Holds the information of every object in the world (except player)
    var worldObjects = [];
    var worldTexts = [];
    
    var playerLinks = initPhysics(system, scene, worldObjects);

    //playercharacter
    var player = new Player(playerLinks);
    
    var glgeCam = scene.getCamera();
    var worldCam = new WorldCam(glgeCam, player.getLimitMaxY(),
    player.getX(), player.getY(), player.getZ(), player.getRotX(), 
    player.getRotY(), player.getRotZ());

    //Scene that has all the GLGE.Text objects.
    var statusScene = initStatusScene(worldTexts, player, renderer, worldCam);
    
    //Scene that holds start and end messages.
    var textScene = initTextScene(worldTexts);
    
    //setting up keyhandler
    var keys = new GLGE.KeyInput();
    
    var state = new StateMachine();
    
    var sceneChildren = scene.getChildren();
    var sky = sceneChildren[sceneChildren.length-2];

    //starts the game
    startGame(player, keys, scene, renderer, system, worldCam, state, 
              worldObjects, worldTexts, statusScene, textScene, sky, sceneFog);
  }

  //Initialize the system and links between system bodies and scene objects
  //Parameters: system = jiglib physics system, scene = glge scene,
  //Precondition: jigLib library is included, scene has been initialized
  //Postcondition: system has been initialized
  var initPhysics = function(system, scene, worldObjects) {
    
    //1 == normal solver
    system.setSolverType(1);
    //gravity is downwards (-y)
    system.setGravity([0,-8,0,0]);
    var sceneChildren = scene.getChildren();
    
    //Give physical attributes to every object
    for (var i = 0; i < sceneChildren.length; ++i) {
      //Don't give object physical attributes if it's id has "no-collision" in it
      if (sceneChildren[i].id.search("light") == -1) {
        //newBody can be found from collision.js
        newBody(system, sceneChildren[i]);
        //Add all objects and bodies to the worldObjects array (except player)
        if (i > 0) {
          var newWorldObject = new WorldObject(system.links[i].glge,
            system.links[i].jig);
          worldObjects.push(newWorldObject);
        }
      }
    }

    return system.links[0];
  }

  //Initialize the status scene, which holds player's score, life etc.
  //Parameters: worldTexts = array whichs holds the world's GLGE text objects,
  //player = Player object, renderer = GLGE.Rendeder
  //Precondition: -
  //Postcondition: The scene which holds player's status info has been initialized.
  var initStatusScene = function(worldTexts, player, renderer, worldCam) {
    var statusScene = new GLGE.Scene();
    var statusCamera = new GLGE.Camera("statusCamera");
    statusCamera.setLoc(worldCam.getPosX(), worldCam.getPosY(), worldCam.getPosZ());
    statusCamera.setRot(worldCam.getRotX(), worldCam.getRotY(), worldCam.getRotZ());
    
    //Gives the projection matrix, it's needed in makeRay
    statusCamera.getViewProjection();
    //Needed in makeRay
    statusCamera.updateMatrix();
    statusScene.renderer = renderer;
    statusScene.setCamera(statusCamera);
    
    //Give the ray 2D-coordinates where to place something.
    var ray = statusScene.makeRay(SCORE_LOC_X, SCORE_LOC_Y);
    statusScene.setBackgroundColor("#000000");

    //score holds player's score
    var score = new WorldText(player.getScore(), statusCamera, RAY_FACTOR_X*ray.coord[0], 
      RAY_FACTOR_Y*ray.coord[1], RAY_FACTOR_Z*ray.coord[2],
      TextTypes.STATUS_SCORE, worldTexts.length, SCORE_TEXT_COLOR, SCORE_TEXT_SIZE);
    statusScene.addChild(score.glgeText_);
    worldTexts.push(score);
    
    ray = statusScene.makeRay(SCORETEXT_LOC_X, SCORETEXT_LOC_Y);
    
    //scoreText holds the text "score" and it's next to player's score amount.
    var scoreText = new WorldText(SCORE_TEXT_CONTENT, statusCamera, RAY_FACTOR_X*ray.coord[0], 
      RAY_FACTOR_Y*ray.coord[1], RAY_FACTOR_Z*ray.coord[2],
      TextTypes.STATUS_SCORE_TEXT, worldTexts.length, SCORE_TEXT_COLOR, SCORE_TEXT_SIZE);
    statusScene.addChild(scoreText.glgeText_);
    worldTexts.push(scoreText);
    
    return statusScene;
  }

  //Initialize the scene, which holds the start and ending messages.
  //Parameters: worldTexts = array whichs holds the world's GLGE text objects
  //Precondition: -
  //Postcondition: The scene whichs holds the start and ending messages
  //has been initialized.
  var initTextScene = function(worldTexts) {
    var textScene = new GLGE.Scene();
    var textCamera = new GLGE.Camera("textCamera");
    textScene.setCamera(textCamera);
    textScene.setBackgroundColor("#303030");
    
    //Start message
    var startMessage = new WorldText(START_GAME_TEXT, textCamera, START_OFFSET_X,
      START_OFFSET_Y, START_OFFSET_Z, TextTypes.START, worldTexts.length,
      STATE_TEXT_COLOR, STATE_TEXT_SIZE);
    textScene.addChild(startMessage.glgeText_);
    worldTexts.push(startMessage);
    
    //End message
    var endMessage = new WorldText(GAME_OVER_TEXT, textCamera, END_OFFSET_X,
      END_OFFSET_Y, END_OFFSET_Z, TextTypes.END, worldTexts.length,
      STATE_TEXT_COLOR, STATE_TEXT_SIZE);
    //End message won't be added to the textScene yet. It will be added when player
    //dies.
    worldTexts.push(endMessage);
    
    return textScene;
  }

  //Adds new physics body to the world and binds it with the given object.
  //Parameters: system = jigLib.PhysicsSystem, takes care of physics stuff.
  //            object = 3D object which needs physical body
  //Precondition: Object has been initialized, system has been initialized
  //Postcondition: Given object has a physical model bound to it
  var newBody = function(system, object) {
    //Object's id holds information about the movability and type
    //of the object (check the .xml-file)
    var id = object.id;
    //Player is in a group and it's a scene-child so the group is given as
    //object to this function. Player's real object must be taken from it.
    if (id.search("group") != -1) {
      object = object.getChildren()[0];
      id = object.id
    }
    //RegExp which looks for a digit from the id
    var findDigit = /\d/;
    //Location of a digit in the object's id
    var digitLocation
    //jigLib body
    var body;
    //limits has the min and max values of object's X, Y and Z limits in an array
    var limits = object.getMesh(0).getBoundingVolume().limits;
    //Min and max X values
    var width = calculateSize(limits[0], limits[1]) * object.getScaleX();
    //Min and max Y values
    var height = calculateSize(limits[2], limits[3]) * object.getScaleY();
    //Min and max Z values
    var depth = calculateSize(limits[4], limits[5]) * object.getScaleZ();

    var bodyValue = -1;
    for (var i = 0; i < BODY_TYPES.length; ++i) {
      bodyValue = id.search(BODY_TYPES[i]);
      if (bodyValue != -1) {
        bodyValue = BODY_TYPES[i];
        break;
      }
    }
    
    //Create new body based on the id's type name
    switch(bodyValue) {
      case BODY_TYPES[BodyValues.BOX]:
        body = new jigLib.JBox(null, width, depth, height);
        break;
      case BODY_TYPES[BodyValues.PLANE]:
        body = new jigLib.JPlane(null, [0,1,0,0]);
        break;
      default:
        body = new jigLib.JBox(null, width, depth, height);
        break;
    }
    
    //Rotate the body so it matches the object.
    //Don't rotate planes.
    if (bodyValue != BODY_TYPES[BodyValues.PLANE]) {
      body.set_rotationX(-object.getRotX());
      body.set_rotationY(-object.getRotY());
      body.set_rotationZ(-object.getRotZ());
    }
    
    //Give the jigLib body location and mass. Then add it to the system
    // and bind it with the object.
    //Some weird jigLib bug: When giving xyz-locations, you can't 
    // give "object.getLocZ()" etc. cause it returns apparently a string.
    body.moveTo([(parseFloat(object.getLocX())),(parseFloat(object.getLocY())),
      (parseFloat(object.getLocZ())),0]);
      
    //console.log(id+" location "+body.get_x()+" "+body.get_y()+" "+body.get_z());
    
    body.set_mass(1);
    //Make the object static if it doesn't have 'movable' in its id.
    if (object.id.search(MOVABLE) == -1) {
      body._movable = false;
    }
    body.enableCollisions(body);
    //Add the body to the system, activate it and link the glge object
    //and the jiglib body together
    system.addBody(body);
    system.activateObject(body);
    system.links.push({glge:object,jig:body});
  }


  /*var calculateSize = function(side1, side2){
    if(side2 == side1){
      return 0;
    }
    else if(side2 < 0.0 && side1 >= 0.0){
      return(Math.abs(side2) + side1);
    }
    else if(side1 < 0.0 && side2 >= 0.0){
      return(Math.abs(side1) + side2);
    }
    else if(side1 >= 0.0 && side2 >= 0.0 && side1 > side2){
      return(side1-side2);
    }
    else if(side1 >= 0.0 && side2 >= 0.0 && side2 > side1){
      return(side2-side1);
    }
    else if(side1 < 0.0 && side2 < 0.0 && Math.abs(side1) > Math.abs(side2)){
      return(Math.abs(side1)-Math.abs(side2));
    }
    else if(side1 < 0.0 && side2 < 0.0 && Math.abs(side2) > Math.abs(side1)){
      return(Math.abs(side2)-Math.abs(side1));
    }
  }*/

  //LIVELY 3D API FUNCTIONS
  this.GetCanvas = function(){
    return canvas;
  }
  
  var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
  
  this.Resources = {
		textures: ['textures/3056dome_pow2.jpg', 'textures/cartman.jpg', 'textures/coin_back.png',
      'textures/grass.png', 'textures/jumpcolor.png', 'textures/lavatexture.jpg',
      'textures/redrock.png', 'textures/skydome.png'],
      
		scripts: ['scripts/requestAnimFrame.js', 'scripts/jiglibjs.0.9.0.2.combined.js',
      'scripts/helpper.js','scripts/player.js', 'scripts/worldCam.js', 'scripts/states.js',
      'scripts/main.js', 'scripts/worldObj.js', 'scripts/worldText.js'],
      
    xml: ['xml/testScene.xml', 'xml/level1_meshes.xml', 'xml/level1_materials.xml',
      'xml/skydome_meshes.xml', 'xml/skydome_materials.xml']
	};
	
	this.ResourcePath = 'Resources/Tasohyppely/';
  //En nyt vielä oikein tiedä, mitä textuurien ja kaikkien
  //xml:ien lataus hyödyttää. niitä urleja käytetään itse
  //xml tiedostoissa ja sinne näitä muuttujia ei oikein saa välitettyä
  //vaan hakemistopolut pitää olla oikein, mistä en nyt ole ihan varma
  var textures = [];
  var xml = [];
  this.ResourceHandlers = {
		textures: function(resources){
			for ( var i in resources ){
				textures.push(resources[i]);
			}
		},
		
		scripts: function(resources){
			var index = 0;
			LoadScript(resources, index);
		},
    
    xml: function(resources){
      testScene = resources[0];
      for ( var i in resources ){
				xml.push(resources[i]);
			}
		}
	};
  
  var unloadedScripts = 9;
  var LoadScript = function(scripts, index){
		console.log("loading script " + scripts[index]);
		$.getScript(scripts[index], function(){
			--unloadedScripts;
			++index;
			if (unloadedScripts != 0 ){
				LoadScript(scripts, index);
			}
			else{
				scriptsDone();
			}
		});
	}
  
  var unloadedResources = { xml: true, textures: true, scripts: true };
	
	this.ResourcesLoaded = function(resource){
		console.log('Resource ' + resource +' Loaded');
		unloadedResources[resource] = false;
		var AllResourcesLoaded = true;
		for ( var i in unloadedResources ){
			if (unloadedResources[i] == true){
				AllResourcesLoaded = false;
			}
		}
		
		if ( AllResourcesLoaded == true ){
			
			resourcesDone();
		}
		
	}
	
	var ready = { resources: false, scripts: false};
	var that = this;
	var init = function(){
		if ( ready.resources == true && ready.scripts == true ){
			that.loader();
			if ( LivelyApp ){
				LivelyApp.StartApp();
			}
			else{
				console.log('could not start livelyapp');
			}
		}
	}
	
	var resourcesDone = function(){
		ready.resources = true;
		init();
	}
	
	var scriptsDone = function(){
		ready.scripts = true;
		init();
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
}

var tasohyppelyInit = function(Tasohyppely){
	var peli = new Tasohyppely();
	
	Lively3D.LoadResources(peli);
	
	return peli;
}
				
Lively3D.AddApplication('Tasohyppely', Tasohyppely, tasohyppelyInit);
