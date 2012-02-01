//Abstraction for camera and it's movements

//Parameters: camera = GLGE camera object
var WorldCam = function(camera, playersTop, posX, posY, posZ, rotX, rotY, rotZ){
  var that_ = this;
  
  //cameras mode FP = 1st person, TP = 3rd person
  this.Mode_ = {"FP": 0, "TP": 1};
  
  //Holds the GLGE camera object given as parameter
  this.camera_ = camera;
  this.camera_.setRotOrder(GLGE.ROT_YXZ);
  
  //Default setting is 3rd person
  this.perspective_ = this.Mode_.TP;
  
  //how far away 3rd person camera is from player
  this.TPR_ = 8;
  //How high the camera is in 3rd person mode
  this.TPY_ = 2.5;
  this.TPROTY_ = -(25.0*Math.PI)/180;
  
  //How much higher camera is from player in FPS
  this.FPR_ = playersTop + 0.2;
  
  //Makes sure that change of perspective can't be done too fast
  this.lastTimeChanged_ = new Date().getTime();
  this.TIMELIM_ = 100;
  
  this.baseRotX_ = 0.0;
  this.ROTSPEED_ = (1*Math.PI)/180.0;
  this.ROTX_LIM_ = Math.PI / 10.0;
  
  this.setDefaults = function(posX, posY, posZ, rotX, rotY, rotZ){
    this.perspective_ = this.Mode_.TP;
    this.baseRotX_ = 0.0;
    this.setPos(posX, posY, posZ, rotX, rotY, rotZ);
  }
  
  //returns if the camera is 3rd person camera
  this.isTP = function(){
    if(this.perspective_ === this.Mode_.TP){
      return true;
    }
    return false;
  }
  
  //Returns position of the camera
  this.getPosX = function(){
    return this.camera_.getLocX();
  }
  this.getPosY = function(){
    return this.camera_.getLocY();
  }
  this.getPosZ = function(){
    return this.camera_.getLocZ();
  }
  
  //Returns rotation of the gamera
  this.getRotX = function(){
    return this.camera_.getRotX();
  }
  this.getRotY = function(){
    return this.camera_.getRotY();
  }
  this.getRotZ = function(){
    return this.camera_.getRotZ();
  }
  
  this.getRotMatrix = function(){
    return this.camera_.getRotMatrix();
  }
  
  this.setRotY = function(rotY) {
    this.camera_.setRotY(rotY);
  }
  
  
  
  //calculates base rotations which are used to calculate actual
  //camera rotation
  //used to be player functions but are now camera functions
  this.lookUp = function(){
    var rot = this.baseRotX_;
    if(rot < this.ROTX_LIM_){
      rot += this.ROTSPEED_;
      this.baseRotX_ = rot;
    }
  }
  
  this.lookDown = function(){
    var rot = this.baseRotX_;
    if(rot > -this.ROTX_LIM_){
      rot -= this.ROTSPEED_;
      this.baseRotX_ = rot;
    }
  }
  
  //sets position of camera based on players position
  //calls the right function for position dependin on mode
  //Parameters: posXYZ = players position,
  //rotXYZ: players rotation
  //Precondition: 1. rot parameters has to be in radians
  //2. mode has to be set
  //Postcondition: right function is called
  this.setPos = function(posX, posY, posZ, rotX, rotY, rotZ){
    if(this.perspective_ === this.Mode_.TP){
      setTPpos(posX, posY, posZ, rotX, rotY, rotZ, that_.camera_,
        that_.TPR_, that_.TPY_, that_.TPROTY_);
    }
    else{
      setFPpos(posX, posY, posZ, rotX, rotY, rotZ,
        that_.camera_, that_.FPR_);
    }
  }
  
  //Local function that sets position of FP camera based on players position
  //Parameters: posXYZ = players position,
  //rotXYZ= players rotation,
  //cam= GLGE camera object that is bind to worldCam
  //Precondition: 1. rot parameters has to be in radians
  //2. camera has to be initialized
  //Postcondition: cameras position and rotation is set
  var setFPpos = function(posX, posY, posZ, rotX, rotY, rotZ, cam, r){
    cam.setRot(rotX, rotY, rotZ);
    cam.setLoc(posX, posY+r, posZ);
  }
  //sets position of TP camera based on players position
  //Parameters: posXZ = players position,
  //rotY = players y rotation
  //cam= GLGE camera object that is bind to worldCam,
  //r = distance of camera from player,
  //camY = how high the camera is
  //Precondition: 1. rot parameters has to be in radians
  //2. camera has to be initialized,
  //3. r > 0
  //Postcondition: cameras position is set
  var setTPpos = function(posX, posY, posZ, rotX, rotY, rotZ, cam, r, camY, camRotY){
    cam.setRot(rotX, rotY, rotZ);
    cam.setLoc(posX, camY+posY, posZ);
    cam.setDLoc((r * Math.sin(rotY)), camRotY, (r * Math.cos(rotY)));
  }
  
  //changes perspective between 1st and 3rd person
  //Parameters: player = player object
  //Precondition: Mode is set and rotation Y is clear in camera and player
  //Postcondition: Mode is set to opposite mode
  this.changePerspective = function(posX, posY, posZ, rotX, rotY, rotZ){
    var timeNow = new Date().getTime();
    var elapsed = timeNow - this.lastTimeChanged_;
    if(elapsed > this.TIMELIM_){
      switch(this.perspective_){
        case this.Mode_.FP:
          this.perspective_ = this.Mode_.TP;
          this.setPos(posX, posY, posZ, rotX, rotY, rotZ);
          break;
        
        case this.Mode_.TP:
          this.perspective_ = this.Mode_.FP;
          this.camera_.setDLoc(0,0,0);
          this.setPos(posX, posY, posZ, rotX, rotY, rotZ);
          break;
          
        default:
          break;
      }
      this.lastTimeChanged_ = timeNow;
    }
  }
  
  //PART OF CONSTRUCTOR, DON'T MOVE
  this.setDefaults(posX, posY, posZ, rotX, rotY, rotZ);
}