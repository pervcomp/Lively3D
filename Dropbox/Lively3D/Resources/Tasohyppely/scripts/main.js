//MAINMODULE

//Constant table for keys that are used
var KEYCODES = [87/*w*/, 83/*s*/, 68/*d*/, 65/*a*/,
  73/*i*/, 75/*k*/, 76/*l*/, 74/*j*/, 67/*c*/,
  32/*space*/, 13/*enter*/, 77/*m*/];

//enum for indexing KEYCODES table
var Control = {"FORWARD":0, "BACKWARD":1, "RIGHT":2,
  "LEFT":3, "ROTUP":4, "ROTDOWN":5, "ROTRIGHT":6,
  "ROTLEFT":7, "CAMERA":8, "JUMP":9, "START":10,
  "TOGGLEFOG":11};

var STATUSSCENE_DIVIDER = 10;

//Main scene's offsets. Used in drawScene()
var MAINSCENE_OFFSET_X = 0;
var MAINSCENE_OFFSET_Y = 0;

//Startfunction that polls keystates and calls mainLoop
//when start command has been given
//Parameters: player = player object, keys = GLGE key handler object,
//scene = GLGE scene object, renderer = GLGE renderer object,
//system = jigLib system, camera = WorldCam object,
//state = StateMachine object
//Precondition: all objects that are given to parameters has to be initialized!
//PostCondition: when enter is pressed, mainLoop is called
//if state is OVER -> calls set text and draw to draw game over text
var startGame = function(player, keys, scene, renderer, system, camera, 
                        state, worldObjects, worldTexts, statusScene,
                        textScene, sky, sceneFog ){
  var stateNow = state.getState();
  //Draw scene here because it makes it load. If this is left out, the player's fall
  //in the beginning is really fast and doesn't look good.
  draw(renderer, scene);
  //should we draw game over text?
  if(stateNow === state.States.OVER){
    //Clear the textScene
    var textSceneChildren = textScene.getChildren();
    for (var i = textSceneChildren.length-1; i >= 0; --i) {
      textScene.removeChild(textScene.getChildren()[i]);
    }
    
    //Get the ending message from worldTexts and add it to the textScene
    for (var i = 0; i < worldTexts.length; ++i) {
      if (worldTexts[i].getType() == TextTypes.END) {
        textScene.addChild(worldTexts[i].glgeText_);
      }
    }
    draw(renderer, textScene);
    player.setDefaults();
    camera.setDefaults(player);
    resetWorldObjects(worldObjects);
    resetScene(scene, worldObjects, player);
  }
  else if(stateNow === state.States.BEGIN){
    draw(renderer, textScene);
  }
  //function that does actuall polling
  var checkState = function(){
    checkKeys(player, keys, camera, state, sceneFog);
    stateNow = state.getState();
    if(stateNow === state.States.ON){
      mainLoop(player, keys, scene, renderer, system, camera,
              state, worldObjects, worldTexts, statusScene,
              textScene, sky, sceneFog);
    }
    else{
      setTimeout(checkState, 1000/30);
    }
  }
  checkState();
}


//"main function" the loop that calls anim and draw, uses requestAnimFrame -callback
//Parameters: player = Player object, keys = GLGE key handler object,
//scene = GLGE scene object, renderer = GLGE renderer object,
//camera = WorldCam object, system = jigLib system,
//state = StateMachine object that takes care of game states
//Precondition: 1.requestAnimFrame -callback is included
//2. all objects given as parameters are initialized
//Postcondition: checkKeys, physics update, anim and draw is called
var mainLoop = function(player, keys, scene, renderer, system, camera, 
                        state, worldObjects, worldTexts, statusScene,
                        textScene, sky, sceneFog){
  var startTime = new Date().getTime();
  var TICKS_PER_SECOND = 30;
  var SKIP_TICKS = 1000/TICKS_PER_SECOND;
  var MAX_FRAMESKIP = 10;
  
  var getTickCount = function(){
    return new Date().getTime() - startTime;
  }
  var nextGameTick = getTickCount();
  var tick = function(){
    if(state.isOver(player.getLife())){
      startGame(player, keys, scene, renderer, system, camera, state, 
        worldObjects, worldTexts, statusScene, textScene, sky, sceneFog);
    }
    else if(state.getState() === state.States.ON){
      var loops = 0;
      while(getTickCount() > nextGameTick && loops < MAX_FRAMESKIP){
        checkKeys(player, keys, camera, state, sceneFog);
        statusSceneUpdate(worldTexts, player, statusScene);
        physicsUpdate(worldObjects, player, system);
        player.checkCollisions(worldObjects, scene);
        anim(camera, player, scene, sky);
        nextGameTick += SKIP_TICKS;
        loops++;
      }
      drawScenes(renderer, scene, statusScene);
      requestAnimFrame(tick);
    }
  }
  tick();
}

//Adds collected objects back to scene when game ends
//Parameters: scene = glge scene where objects are added,
//worldObjects = list of worldObject objects
//Precondition: game has ended
//Postcondition: all items in worldObject are in scene and
// all collectable items can be collected again
var resetScene = function(scene, worldObjects, player){
  for(var i = 0; i < worldObjects.length; ++i){
    if(worldObjects[i].collected_){
      worldObjects[i].resetCollected(player);
      scene.addChild(worldObjects[i].glgeObject_);
    }
  }
}

//Resets all worldObjects to their original state
//Parameters: worldObjects = all the other objects except player.
//Precondition: Game is over.
//Postconditions: world objects are in original state.
var resetWorldObjects = function(worldObjects){
  for (var i = 0; i < worldObjects.length; ++i) {
    worldObjects[i].setDefaults();
  }
}

//Draw all the scenes.
//Parameters: rendere = glge renderer, scene = glge scene which holds all
//the worldObejcts and player, statusScene = glge scene which holds the player
//score and other possible texts.
//Preconditions: -
//Postconditions: All the scenes have been rendererd.
var drawScenes = function(renderer, scene, statusScene) {
  
  //Draw the main scene
  renderer.setViewportWidth(CANVAS_WIDTH);
  renderer.setViewportHeight(CANVAS_HEIGHT);
  
  renderer.setViewportOffsetX(MAINSCENE_OFFSET_X);
  renderer.setViewportOffsetY(MAINSCENE_OFFSET_Y);
  
  draw(renderer, scene);
  
  //Draw text scene on top of the main scene
  renderer.setViewportWidth(CANVAS_WIDTH);
  renderer.setViewportHeight(CANVAS_HEIGHT);
  
  var textOffsetY = (CANVAS_HEIGHT-CANVAS_HEIGHT/STATUSSCENE_DIVIDER);
  
  renderer.setViewportOffsetY(textOffsetY);
  draw(renderer, statusScene);
  //Make sure that renderer viewport is default after this function
  renderer.setViewportWidth(CANVAS_WIDTH);
  renderer.setViewportHeight(CANVAS_HEIGHT);
  
  renderer.setViewportOffsetX(MAINSCENE_OFFSET_X);
  renderer.setViewportOffsetY(MAINSCENE_OFFSET_Y);
  
}

//Updates the statusScene info.
//Parameters: worldTexts = holds all the texts of the world,
//player = Player object
//Preconditions: -
//Postconditions: statusScene texts and possible pictures have been
//updated.
var statusSceneUpdate = function(worldTexts, player, statusScene) {
  var sceneChildren = statusScene.getChildren();
  for (var i = 0; i < sceneChildren.length; ++i) {
    //GLGE.Text's id is the same as the index of the text in worldTexts array
    if (worldTexts[ sceneChildren[i].getId() ].getType() == TextTypes.STATUS_SCORE) {
      worldTexts[ sceneChildren[i].getId() ].updateText(player.getScore());
    }
  }
}

//Updates the physical models.
//Parameters: system = jiglib physical system,
//player = Player object
//Preconditions: system and player has been initilized
//Postconditions: system has been integrated forward, links between jiglib 
//bodies and glge objects have been updated.
var physicsUpdate = function(worldObjects, player, system) {
  system.integrate(30/1000);

  //Update the links between physical bodies and glge-objects
  for(var i = 0; i < worldObjects.length; ++i){
    worldObjects[i].updateState();
  }
  //Update player's camera coordinates so it matches the jigLib body
  player.updateState();

}

//draws scene
//Parameters: renderer = GLGE renderer object, 
//scene = GLGE scene object
//Precondition: scene and renderer has to be initialized first
//Postcondition: scene is drawn to the screen
var draw = function(renderer, scene){
  renderer.setScene(scene);
  renderer.render();
}

//Moves worlds camera around allso includes other animations if we have some
//Parameters: camera = WorldCam object, player = player object
//Precondition: camera and player has to be initialized first
var anim = function(camera, player, scene, sky){
  camera.setPos(player.getX(), player.getY(), player.getZ(),
    camera.baseRotX_, player.getRotY(), player.getRotZ());
    
    sky.setLocX( player.getX() );
    sky.setLocY( player.getY() );
    sky.setLocZ( player.getZ() );
}

//checks if control keys are pressed
//calls move function key responce which prosess keys pressed
//Parameters: player = player object,
//keys = GLGE key handlerer object,
//camera = WorldCam object
//Returns: the time when function was called (long int)
//Precondition: player, keyhandlerer and camera has to be initialized
//Postcondition: if key is pressed, the corresponding functionality is done
var checkKeys = function(player, keys, camera, state, sceneFog){
  for(var i = 0; i < KEYCODES.length; ++i){
    if(keys.isKeyPressed(KEYCODES[i])){
      keyResponse(player, i, camera, state, sceneFog);
    }
  }
}

//Called from checkKeys if keys are pressed
//Reacts for keypresses
//Parameters: player = player object,
//key = index of the key in the KEYCODE-table,
//camera = WorldCam object
//Pretcondition: player and camera are initialized,
//key is in range of 0..8 and elapsed >= 0
//Postcondition: players move functions are called or
//change perspective is called
var keyResponse = function(player, key, camera, state, sceneFog){  
  switch(key){
    case Control.FORWARD:
      if(state.getState() === state.States.ON){
        player.moveForward();
      }
      break;
      
    case Control.BACKWARD:
      if(state.getState() === state.States.ON){
        player.moveBackward();
      }
      break;
      
    case Control.RIGHT:
      if(state.getState() === state.States.ON){
        player.moveRight();
      }
      break;
      
    case Control.LEFT:
      if(state.getState() === state.States.ON){
        player.moveLeft();
      }
      break;
      
    case Control.JUMP:
      if(state.getState() === state.States.ON){
        player.jump();
      }
      break;
    
    case Control.ROTUP:
      if(state.getState() === state.States.ON){
        camera.lookUp();
      }
      break;
    
    case Control.ROTDOWN:
      if(state.getState() === state.States.ON){
        camera.lookDown();
      }
      break;
    
    case Control.ROTRIGHT:
      if(state.getState() === state.States.ON){
        player.rotateRight();
      }
      break;
    
    case Control.ROTLEFT:
      if(state.getState() === state.States.ON){
        player.rotateLeft();
      }
      break;
    
    case Control.CAMERA:
      if(state.getState() === state.States.ON){
        camera.changePerspective(player.getX(), player.getY(), player.getZ(),
          player.getRotX(), player.getRotY(), player.getRotZ());
      }
      break;
      
    case Control.START:
      if(state.getState() === state.States.BEGIN ||
        state.getState() === state.States.OVER){
        
        state.setOn();
      }
      break;
    
    case Control.TOGGLEFOG:
      if(state.getState() === state.States.ON){
        //Turn fog on/off
        sceneFog.toggleFog();
      }
      break;
      
    default:
      break;
  }
}

//Converts radians to degrees and returns the value.
//Parameters: rad = radians
//Preconditions: -
//Preconditions: radians have been converted to degrees and the
//converted value has been returned.
var radToDeg = function(rad) {
  return (rad*180/Math.PI);
}


//Abstraction for fog used in scene
//Parameters: scene - GLGE scene-object
var SceneFog = function( scene ){
  var that_ = this;
  
  //Holds the GLGE scene object given as parameter
  this.scene_ = scene;
  
  //Current state of fog
  this.fogState_ = scene.getFogType();
  
  //Makes sure that change of fog type can't be done too fast
  this.lastTimeChanged_ = new Date().getTime();
  this.TIMELIM_ = 100;
  
  
  //Changes fog type between NONE (1) and LINEAR (2). QUADRATIC (3) is a third option,
  //but it is not used this time.
  //Parameters: -
  //Preconditions: fog is on or off
  //Postconditions: fog is changed on or off depending from last state
  this.toggleFog = function(){
    
    var timeNow = new Date().getTime();
    var elapsed = timeNow - this.lastTimeChanged_;
    if( elapsed > this.TIMELIM_ ){
      //Is the fog turned off (NONE)?
      if( this.fogState_ == 1 ){
        this.fogState_ = 2;
        scene.setFogType(2);
      }
      
      //Or is it on (LINEAR)?
      else if( this.fogState_ == 2 ){
        this.fogState_ = 1;
        scene.setFogType(1);
      }
      this.lastTimeChanged_ = timeNow;
    }
  }
  
  this.setFogColor = function(color){
    scene.setFogColor(DEFAULT_FOG_COLOR);
  }
  
  this.setFogFar = function(distanceFar){
    scene.setFogFar(distanceFar);
  }
  
  this.setFogNear = function(distanceNear){
    scene.setFogNear(distanceNear);
  }
    
}