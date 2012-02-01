var Jump = function(){

  var gWidth = 255;
  var gHeight = 255;
  var realWidth = 500;
  var realHeight = 500;
  var counterHeight = 15;
  var scaledX = realWidth/gWidth;
  var scaledY = realHeight/gHeight; 
  
  var timer;
  var levelInterval;
  var pointInterval;
  var score = 0;
  var SCOREAMOUNT = 10;
  var scoreList;
  var drawCounter = true;
  
  var gCanvas = document.createElement('canvas');
  gCanvas.width = realWidth;
  gCanvas.height = realHeight;
  
  var gContext = gCanvas.getContext("2d");
  gContext.scale(scaledX, scaledY);
  
  var coin;//graphics
  var coinWidth = 15;
  var coinHeight = 15;
  
  var audioSrc = [];
  var grafSrc = [];
  var Audio = {"BG1":0, "BG2":1, "BOINK1":2, "BOINK2":3,
    "GO1": 4, "GO2":5, "MONEY1":6, "MONEY2":7};
  var Graf = {"TAHTI":0, "COIN" :1};
  
  var bgAudio;//background music
  var jumpAudio;//jump soundeffect
  var pickAudio;//pick item soundeffect
  var gameOverAudio;//Plays when game ends
  var vol = 1;//volume when played
  var mute = false;
  
  var States = {"OVER":0, "ON":1, "BEGIN":2, "PAUSE":3};
  var state = States.BEGIN;
  var animations = true;

  //Parameters for circles and blocks
  var Index = {"WIDTH":0, "HEIGHT":1, "R":2, "ALPHA": 3};//for circles
  var Ba = {"WIDTH":0, "HEIGHT":1, "X":2};//for blocks
  var Ia = {"Y":0, "X":1};//for items
  var IR = 5;

  var MAXR = 10;//for circles maximum radius
  var MAXALPHA = 0.4;//for circles maximum alpha
  var MINALPHA = 0.2;//for circles minimum alpha
  var BLOCKSPEED = 3.0;//starting speed
  var blockSpeedAtm = BLOCKSPEED;//the speed that block has at the moment

  var gAmount = 10;//how many circles there are?
  var gCircles;//list that contanes the circles
  var gBAmount = 3;//how many blocks we create at the start
  var gBlocks;//list that contanes the blocks
  var gItem;//item
  var character;

  //--------------------------CLEAR-------------------------------

  //Rsets the canvas between drawing
  var reset = function(){
    var gradient = gContext.createLinearGradient(0, gCanvas.height, 0, 0);
    
    gradient.addColorStop(0, "#4D4DFF");
    gradient.addColorStop(0.7, "#7A67EE");
    gradient.addColorStop(1, "#836FFF");
    
    gContext.fillStyle = gradient;
    if(state != States.ON){
      gContext.fillRect(0, 0, gCanvas.width, gCanvas.height);
    }
    else{
      gContext.fillRect(0, counterHeight, gCanvas.width, gCanvas.height);
    }
  }

  //--------------------------CIRCLES-------------------------------

  //Initializes the circles
  //creates the circles table
  var initCircles = function(){
    gCircles = [];

    for(var i = 0; i < gAmount; ++i){
      var points = [];
      points.push(Math.random()*gWidth);
      points.push(Math.random()*gHeight-counterHeight);
      points.push(Math.random()*MAXR);
      points.push(Math.random()*MAXALPHA + MINALPHA);
      gCircles.push(points);
    }
  }

  //Draws the circles
  var drawCircles = function(){
    //gContext.strokeStyle = "#303030";
    for(var i = 0; i < gAmount; ++i){
      gContext.fillStyle = "rgba(20,100,150,"+gCircles[i][Index.ALPHA]+")";
      gContext.beginPath();
      gContext.arc(gCircles[i][Index.WIDTH],
                  gCircles[i][Index.HEIGHT],
                  gCircles[i][Index.R], 0,
                  Math.PI*2, false);
      gContext.closePath();
      //gContext.stroke();
      gContext.fill();
    }
  }

  //Moving the circles
  var moveCircles = function(dY){
    for(var i = 0; i < gAmount; ++i){
      //the circle is below the canvas
      if(gCircles[i][Index.HEIGHT]-gCircles[i][Index.R] < counterHeight){
        gCircles[i][Index.WIDTH] = Math.random() * gWidth;
        gCircles[i][Index.HEIGHT] = gHeight-counterHeight + gCircles[i][Index.R]; 
        gCircles[i][Index.R] = Math.random() * MAXR;
        gCircles[i][Index.ALPHA] = Math.random() * MAXALPHA + MINALPHA;
      }
      else {
        gCircles[i][Index.HEIGHT] -= dY;
      }
    }
  }

  //------------------------CHARACTER-------------------------------

  //something that looks like an object maybe
  var Character = function(){
    //Variables
    var that = this;
    
    that.image_ = new Image();
	that.image_.crossOrigin = "";
    that.width_ = 40;
    that.height_ = that.width_;
    that.x_ = 20;//Left side
    that.y_ = 0;//bottom side
    that.isJumping_ = false;
    that.isFalling_ = false;
    that.isOnGround_ = true;
    that.jumpSpeed_ = 0;
    that.fallSpeed_ = 0;
    that.isMovingLeft_ = false;//collisiondetection sets this

    //Some constants for moving
    that.MAXSPEED_ = 15;

    //functions
    that.setPosition = function(x,y){
      that.x_ = x;
      that.y_ = y;
    }
    
    //Returns the begining state
    that.setDefaults = function(){
      that.x_ = 20;
      that.y_ = gHeight-gBlocks[0][Ba.HEIGHT] - character.height_;
      that.isJumping_ = false;
      that.isFalling_ = false;
      that.isOnGround_ = true;
      that.jumpSpeed_ = 0;
      that.fallSpeed_ = 0;
      that.isMovingLeft_ = false;//collisiondetection sets this
    }

    that.draw = function(){
      try{
        gContext.drawImage(that.image_, that.x_,
              that.y_, that.width_, that.height_);
      }
      catch(e){
      };
    }
    
    that.jump = function(){
      if(that.isOnGround_){
        that.fallSpeed_ = 0;
        that.isJumping_ = true;
        that.isOnGround_ = false;
        that.jumpSpeed_ = that.MAXSPEED_;
        jumpAudio.play();
      }
    }
    
    that.checkJump = function(){
      if(that.y_-that.jumpSpeed_ > counterHeight){
        that.setPosition(that.x_, that.y_-that.jumpSpeed_);
        --that.jumpSpeed_;
      }
      else{
        that.setPosition(that.x_, counterHeight);
        that.jumpSpeed_ -= 2;
      }
      if(that.jumpSpeed_ <= 0){
        that.isJumping_ = false;
        that.isFalling_ = true;
        that.fallSpeed_ = 1;
      }
    }

    that.fall = function(){
      that.jumpSpeed_ = 0;
      that.isJumping_ = false;
      that.isOnGround_ = false;
      that.isFalling_ = true;
    }
    
    that.fallStop = function(){
      that.isFalling_ = false;
      that.isOnGround_ = true;
      that.fallSpeed_ = 0;
    }

    that.checkFall = function(){
      that.setPosition(that.x_, that.y_+that.fallSpeed_);
      //Limited fallspeed maximum!!!
      if(that.fallSpeed_ < 20){
        ++that.fallSpeed_;
      }
    }

    that.moveWithBlocks = function(){
      that.setPosition(that.x_ - blockSpeedAtm, that.y_);
    }
  }

  //--------------------------COLLISIONS-------------------------------

  //collision detection
  var checkCollision = function(){
    var onGround = false;
    for(var i = 0; i < gBlocks.length; ++i){
      var fix = false;
      //First we detect collisions that comes from above
      if((!character.isJumping_) &&
        (character.x_ < gBlocks[i][Ba.X] + gBlocks[i][Ba.WIDTH]) &&
        (character.x_ + character.width_ > gBlocks[i][Ba.X]) &&
        (character.y_ + character.height_ >= gHeight-gBlocks[i][Ba.HEIGHT])){

          character.fallStop();

          //If we are in the block we need to fix it
          if(character.y_ + character.height_ > gHeight-gBlocks[i][Ba.HEIGHT]){
            fix = true;
          }
          onGround = true;
      }
      //then we check collisions to the sides
      if(character.x_ + character.width_ >= gBlocks[i][Ba.X] &&
          character.x_ + character.width_ < gBlocks[i][Ba.X]+gBlocks[i][Ba.WIDTH] &&
          character.y_ + character.width_/2  > gHeight-gBlocks[i][Ba.HEIGHT]){

        //Now the character should be setted to move with blocksi to left
        character.isMovingLeft_ = true;
        //and it should fall at the same time
        //Fixing is not needed
        fix = false;
        onGround = false;
      }
      //And then we fix it!
      if(fix){
        character.setPosition(character.x_,
          gHeight-gBlocks[i][Ba.HEIGHT]-character.height_);
      }
    }
    if(!onGround && !character.isJumping_ ){
      character.fall();
    }
  }

  //--------------------------BLOCKS-------------------------------

  //Creating blocks
  var initBlocks = function(){
    gBlocks = []

    for(var i = 0; i < gBAmount; ++i){
      var atributes = []
      atributes.push(Math.random()*gWidth/4 + gWidth/2);

      //The fist block goes to the bottom left corner
      if(i == 0){
        atributes.push(gHeight/2);
        atributes.push(0);
      }
      else{
        atributes.push(Math.random()*gHeight/3 + gHeight/10);
        atributes.push(Math.random()*gWidth/5 +
                      gBlocks[i-1][Ba.X] +
                      gBlocks[i-1][Ba.WIDTH] +
                      character.width_);
      }
      gBlocks.push(atributes);
    }
  }

  var drawBlocks = function(){
    //gContext.fillStyle = "#D9D9D9";
    gContext.fillStyle = "#CDCDCD";
    for(var i = 0; i < gBlocks.length; ++i){
      gContext.fillRect(gBlocks[i][Ba.X],
                        gHeight-gBlocks[i][Ba.HEIGHT],
                        gBlocks[i][Ba.WIDTH],
                        gBlocks[i][Ba.HEIGHT]);
    }
  }

  //ascending order by x
  var sortBlocks = function(blok1, blok2){
    return blok1[Ba.X] - blok2[Ba.X];
  }

  var scrollBlocks = function(){
    for(var i = 0; i < gBlocks.length; ++i){
      gBlocks[i][Ba.X] -= blockSpeedAtm;
      //if block is out from left it's moved to the end
      if(gBlocks[i][Ba.X]+gBlocks[i][Ba.WIDTH] < 0){
        gBlocks[i][Ba.WIDTH] = (Math.random()*gWidth/4 + gWidth/2);
        gBlocks[i][Ba.HEIGHT] = (Math.random()*gHeight/3 + gHeight/10);
        gBlocks[i][Ba.X] = (Math.random()*gHeight/5 +
                            gBlocks[gBlocks.length-1][Ba.X] +
                            gBlocks[gBlocks.length-1][Ba.WIDTH] +
                            character.width_);
      }
    }
    //Sorts blocks by their x-parameters
    gBlocks.sort(sortBlocks); 
  }

  //-----------------------------ITEMS-------------------------------

  var initItem = function(){
      var atributes = []
      atributes.push(gHeight*13/30 - coinHeight);
      atributes.push(gWidth + coinWidth);
      gItem = atributes;
  }

  var drawItem = function(){
    if(!animations){
      gContext.fillStyle = "#FFA500";
      gContext.beginPath();
      gContext.arc(gItem[Ia.X],
                  gItem[Ia.Y],
                  coinWidth/2, 0, Math.PI*2, false);
      gContext.closePath();
      gContext.fill();
    }
    else{
      try{
        gContext.drawImage(coin, gItem[Ia.X], gItem[Ia.Y],
              coinWidth, coinHeight);
      }
      catch(e){
      };
    }
  }

  var placeItem = function(){
    gItem[Ia.X] -= blockSpeedAtm;
    if(gItem[Ia.X]+coinWidth < 0){
      gItem[Ia.X] = gWidth + coinWidth*2;
    }
  }

  var picItem = function(){
    if(gItem[Ia.X] < gWidth/2 &&//We assume that character can't this far
    gItem[Ia.X] <= character.x_ + character.width_ &&
      gItem[Ia.Y] <= character.y_ + character.height_ &&
      gItem[Ia.X]+coinWidth >= character.x_ &&
      gItem[Ia.Y]+coinHeight >= character.y_){
        score += 50;
        pickAudio.play();
        gItem[Ia.X] = gWidth + coinWidth*2;
        drawCounter = true;
    }
      
  }

  //--------------------------HIGH SCORES-----------------------------

  var updateScores = function(){
    if(typeof(localStorage) == undefined){
      return false;
    }
    scoreList = []
    for(var i = 0; i < SCOREAMOUNT; ++i){
      if(localStorage["jump.score"+i] != undefined){
        scoreList.push(parseInt(localStorage["jump.score"+i]));	
      }
    }	
    scoreList.push(score);
    scoreList.sort(sortScores);
    if(scoreList.length > SCOREAMOUNT){
      scoreList.pop();//Deleting last score
    }
    return true;
  }

  //decceding order
  var sortScores = function(score1, score2){
    return score2-score1;
  }

  var storeScores = function(){
    for(var i = 0; i < scoreList.length; ++i){
      localStorage.setItem("jump.score"+i, scoreList[i]);
    }
  }

  //--------------------------GAMESTATE-------------------------------

  var isOver = function(){
    if(state != States.OVER &&
      (character.isMovingLeft_ ||
      character.y_-character.height_ > gHeight)){
      return true;
    }
    else{
      return false;
    }
  }
  
  var defaults = function(){
    blockSpeedAtm = BLOCKSPEED;
    score = 0;
    initBlocks();
    initItem();
    character.setDefaults();
  }
  
  var setTimers = function(){
    levelInterval = setInterval(gainLevel, 1000);
    pointInterval = setInterval(gainPoints, 2000);
    timer = setInterval(gameLoop, 1000/30);
  }
  
  var clearTimers = function(){
    clearInterval(levelInterval);
    clearInterval(pointInterval);
    clearInterval(timer);
  }
  
  var newGame = function(){
    defaults();
    state = States.ON;
    bgAudio.play();
    drawCounter = true;
    setTimers();
  }
  
  var startGame = function(){
    state = States.ON;
    drawCounter = true;
    bgAudio.play();
    setTimers();
  }
  
  var gainLevel = function(){
    if(state === States.ON){
      blockSpeedAtm += 0.05;
    }
  }

  var gainPoints = function(){
    if(state === States.ON){
      score += 10;
      drawCounter = true;
    }
  }
  
  //pauses a game that is on
  var pause = function(){
    state = States.PAUSE;
    drawCounter = false;
    bgAudio.pause();
    drawPause();
    clearTimers();
  }

  //Resumes paused game
  var resume = function(){
    state = States.ON;
    drawCounter = true;
    bgAudio.play();
    setTimers();
  }

  //Is animations on or off
  var animState = function(){
    if(animations){
      animations = false;
    }
    else{
      animations = true;
    }
    
    if(typeof(localStorage != undefined)){
      localStorage.setItem("jump.anim", animations);
    }
  }

  //Mutes/unmutes audio
  var audioState = function(){
    if(mute){
      mute = false;
      bgAudio.volume = vol;
      jumpAudio.volume = vol;
      pickAudio.volume = vol/3;
      gameOverAudio.volume = vol;
    }
    else{
      mute = true;
      bgAudio.volume = 0;
      jumpAudio.volume = 0;
      pickAudio.volume = 0;
      gameOverAudio.volume = 0;
    }
    if(typeof(localStorage != undefined)){
      localStorage.setItem("jump.mute", mute);
    }
  }
  
  
  //-----------------------DRAWING STATES-----------------------------
  var drawFail = function(){
    reset();
    drawCircles();
    gContext.font = "bold 10px Courier New";
    gContext.textAlign = "center";
    gContext.textBaseline = "middle";
    gContext.fillStyle = "#000000";
    gContext.fillText("Your score: " + score, gWidth/2, gHeight/10);
    gContext.fillText("Press 'n' to play again!", gWidth/2, gHeight*8/10);
    
    var lastH = gHeight/5;
    gContext.fillStyle = "#404040";
    gContext.fillText("Your top ten scores:", gWidth/2, lastH);
    gContext.textBaseline = "bottom";
    gContext.fillText("Music: Steam Room Sadhu by Shroomi", gWidth/2, gHeight*9/10);
    gContext.font = "bold 6px Courier New";
    gContext.textAlign = "left";
    lastH += 10;
    for(var i = 0; i < scoreList.length; ++i){
      lastH += 10;
      var index = i+1;
      if(index < 10)
      {
        gContext.fillText(index +".  "+scoreList[i], gWidth*4/9, lastH);
      }
      else{
        gContext.fillText(index +". "+scoreList[i], gWidth*4/9, lastH);
      }
    }
  }
  
  //draws the start screen
  var drawBegin = function(){
    reset();
    drawCircles();
    gContext.font = "bold 10px Courier New";
    gContext.textAlign = "center";
    gContext.textBaseline = "middle";
    gContext.fillStyle = "#404040";
    gContext.fillText("Collect coins and don't fall!", gWidth/2, gHeight/4);
    gContext.font = "bold 7px Courier New";
    gContext.fillText("Press 'z' to jump, 'p' to pause and 'n' to start the game.", gWidth/2, gHeight/2);
  }
  //Draws help text also
  var drawScorecounter = function(){
    drawCounter = false;
    gContext.fillStyle = "#4D4DFF";
    gContext.fillRect(0, 0, gWidth, counterHeight);
    gContext.font = "bold 5px Courier New";
    gContext.textAlign = "left";
    gContext.textBaseline = "top";
    gContext.fillStyle = "#000000";
    gContext.fillText("Score: "+score, 2, 5);
    
    gContext.textAlign = "right";
    gContext.textBaseline = "top";
    gContext.fillText("'z' = jump, 'p' = pause, 'm' = mute/unmute, 'b' = background on/off", gWidth-2, 5);
  }

  //Draws screen that is shown when game is in pause state
  var drawPause = function(){
    reset();
    drawCircles();
    gContext.font = "bold 10px Courier New";
    gContext.textAlign = "center";
    gContext.textBaseline = "middle";
    gContext.fillStyle = "#404040";
    gContext.fillText("Press 'p' to resume the game", gWidth/2, gHeight/4);
  }


  //-------------------------THE GAME-------------------------------
  //The gameloop
  var gameLoop = function(){
    if(isOver()){
      bgAudio.pause();
      gameOverAudio.play();
      if(updateScores()){
        storeScores();
      }
      drawCounter = false;
      clearTimers();
      state = States.OVER;
      drawFail();
    }
    else{
      if(drawCounter/* && state === States.ON*/){
        drawScorecounter();
      }
      reset();
      if(animations){
        drawCircles();
        moveCircles(4);
      }
      if(character.isJumping_){
        character.checkJump();
      }
      if(character.isFalling_){
        character.checkFall();    
      }
      drawBlocks();
      checkCollision();
      if(character.isMovingLeft_){
        character.moveWithBlocks();
      }
      picItem();
      drawItem();
      character.draw();
      scrollBlocks();
      placeItem();
    }
  }

  
  //---------------------------------------------------------------
  //---------------------LIVELY INTERFACE--------------------------
  //---------------------------------------------------------------
  this.ResourcePath = 'Resources/Jump/';
  
  this.ResourceHandlers = {
		graf: function(resources){
      for ( var i in resources ){
        grafSrc.push(resources[i]);
      }
		},
		audio: function(resources){
      for ( var k in resources ){
        audioSrc.push(resources[k]);
      }
		}
	}
  
  this.Resources = {
		graf: ['graf/tahti.png', 'graf/freeCoin.png'],
		audio: ['audio/shroomi_-_steam_room_sadhu.mp3', 'audio/shroomi_-_steam_room_sadhu.ogg',
      'audio/boink_v3.mp3', 'audio/boink_v3.wav',
      'audio/game_over.mp3', 'audio/game_over.wav',
      'audio/money.mp3', 'audio/money.wav']
	}
  
  
  var unloadedResources = {graf: true, audio: true};
  
  this.ResourcesLoaded = function(resource){
		unloadedResources[resource] = false;
    var AllResourcesLoaded = true;
    for (var i in unloadedResources){
      if (unloadedResources[i] == true){
        AllResourcesLoaded = false;
      }
    }
    if (AllResourcesLoaded == true){
      initializeScene();
      LivelyApp.StartApp();
    }
	}
  
  //Controls
  this.keyStates = function(key){
    
    switch(key){
      case 'z':
        if(state === States.ON){
          character.jump();
        }
        break;
        
      case 'n':
        if(state === States.OVER){
          newGame();
        }
        else if(state === States.BEGIN){
          startGame();
        }
        break;
        
      case 'p':
        if(state === States.ON){
          pause();
        }
        else if(state === States.PAUSE){
          resume();
        }
        break;
        
      case 'b':
        if(state === States.ON){
          animState();
        }
        break;
        
      case 'm':
        if(state === States.ON){
          audioState();
        }
        break;
        
      default:
        break;
    }
  }
  
  //Saving state
  this.GetState = function(){
    if(state === States.ON){
      state = States.PAUSE;
    }
    var gameState = {
      charX: character.x_,
      charY: character.y_,
      charJumping: character.isJumping_,
      charFalling: character.isFalling_,
      charOnGround: character.isOnGround_,
      charJumpSpeed: character.jumpSpeed_,
      charFallSpeed: character.fallSpeed_,
      charMovingLeft: character.isMovingLeft_,
      item: gItem,
      blockSpeedAtm: blockSpeedAtm,
      blocks: gBlocks,
      circles: gCircles,
      scoreAtm: score,
      scoreList: scoreList,
      drawCounter: drawCounter,
      mute: mute,
      animations: animations,
      state: state
    };
    return gameState;
  }
  
  //resuming state
  this.SetState = function(gameState){
    character.x_ = gameState.charX;
    character.y_ = gameState.charY;
    character.isJumping_ = gameState.charJumping;
    character.isFalling_ = gameState.charFalling;
    character.isOnGround_ = gameState.charOnGround;
    character.jumpSpeed_ = gameState.charJumpSpeed;
    character.fallSpeed_ = gameState.charFallSpeed;
    character.isMovingLeft_ = gameState.charMovingLeft;
    
    gItem = gameState.item;
    
    blockSpeedAtm = gameState.blockSpeedAtm;
    gBlocks = gameState.blocks;
    
    gCircles = gameState.circles;
    
    score = gameState.scoreAtm;
    scoreList = gameState.scoreList;
    drawCounter = gameState.drawCounter;
    mute = gameState.mute;
    animations = gameState.animations;
    state = gameState.state;
  }
  
  //Get canvas
  this.GetCanvas = function(){
    return gCanvas;
  }
  
  this.Close = function(){
  	console.log("jump.js: close");
    bgAudio.pause();
    clearTimers();
    
    if(state != States.PAUSE){
      drawCounter = false;
      state = States.BEGIN;
      defaults();
    }
  }
  
  this.Open = function(){
	console.log("jump.js: open");
    if(state === States.BEGIN){
      drawBegin();
    }
    else if(state === States.PAUSE){
      drawPause();
    }
    else{
      drawFail();
    }
  }
  
  var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
  
  //---------------------INITIALIZE---------------------------
  
  //Inits that are done before resource loading
  this.preInit = function(){
    character = new Character();
    initBlocks();
    character.setPosition(~~((20)), ~~((gHeight-gBlocks[0][Ba.HEIGHT] - 40)));
    initCircles();
    initItem();
  }
  
  //Initializing the scene
  var initializeScene = function(){
    
    //ITEM
    coin = new Image();
	coin.crossOrigin = "";
    coin.src = grafSrc[Graf.COIN];
    character.image_.src = grafSrc[Graf.TAHTI];
    
    //AUDIOS
    bgAudio = document.createElement('audio');
    bgAudio.setAttribute('src', audioSrc[Audio.BG1]);
    bgAudio.setAttribute('src', audioSrc[Audio.BG2]);
    bgAudio.setAttribute('preload', 'auto');
    bgAudio.addEventListener("ended", function(e){bgAudio.play();}, false);
    
    jumpAudio = document.createElement('audio');
    jumpAudio.setAttribute('src', audioSrc[Audio.BOINK1]);
    jumpAudio.setAttribute('src', audioSrc[Audio.BOINK2]);
    jumpAudio.setAttribute('preload', 'auto');
    
    pickAudio = document.createElement('audio');
    pickAudio.setAttribute('src', audioSrc[Audio.MONEY1]);
    pickAudio.setAttribute('src', audioSrc[Audio.MONEY2]);
    pickAudio.setAttribute('preload', 'auto');
    pickAudio.volume = vol/3;
    
    gameOverAudio = document.createElement('audio');
    gameOverAudio.setAttribute('src', audioSrc[Audio.GO1]);
    gameOverAudio.setAttribute('src', audioSrc[Audio.GO2]);
    gameOverAudio.setAttribute('preload', 'auto');
    
    //STATE
    if(typeof(localStorage) != undefined &&
      localStorage["jump.anim"] != undefined){
      animations = (localStorage["jump.anim"] == "true");
    }
    
    if(typeof(localStorage) != undefined &&
      localStorage["jump.mute"] != undefined){
      mute = (localStorage["jump.mute"] == "true");
      if(mute){
        bgAudio.volume = 0;
        jumpAudio.volume = 0;
        pickAudio.volume = 0;
        gameOverAudio.volume = 0;
      }
    }
  }
}


//Initialising the game
var initJump = function(Jump){
  
  var jumpApp = new Jump();
  jumpApp.preInit();
  Lively3D.LoadResources(jumpApp);
  
  var onkeypressFunc = function(e){
    var key = String.fromCharCode(e.which);
    if(window.event){
      key = String.fromCharCode(e.keyCode);
    }
    jumpApp.keyStates(key);
  }
  
  jumpApp.EventListeners = {"keypress": onkeypressFunc};
  return jumpApp;
}


Lively3D.AddApplication('Jump', Jump, initJump);
