//Texts in the game world (player's score etc.)

var TextTypes = {"STATUS_SCORE":0, "STATUS_SCORE_TEXT":1,
  "START":2, "END":3};

//Constructor
var WorldText = function(textContent, camera, offsetX,
  offsetY, offsetZ, type, id, color, size) {
  //Constants
  this.DEFAULT_FONT_ = "tahoma";
  
  this.glgeText_ = new GLGE.Text();
  this.glgeText_.setId(id);
  this.glgeText_.setText(textContent);
  this.glgeText_.setColor(color);
  this.glgeText_.setSize(size);
  this.glgeText_.setFont(this.DEFAULT_FONT_);
  this.type_ = type;
  
  this.glgeText_.setRot(camera.getRotX(), 
    camera.getRotY()+Math.PI, camera.getRotZ());
    
  this.glgeText_.setLoc(camera.getLocX()+offsetX, 
    camera.getLocY()+offsetY, camera.getLocZ()+offsetZ);
  
  /*
  //These should be based on canvas size and 3rd person camera's positioning
  //from the object, so these magic numbers need to be replaced at some point.
  this.displacementY = //Math.PI/12;
  this.displacementXZ = //Math.PI/2;
  this.displacementFactorXZ = //2;
  */
  
  //Get text's type
  this.getType = function() {
    return this.type_;
  }
  
  //Set text's type
  this.setType = function(type) {
    this.type_ = type;
  }
  
  //Updates player's score text's content and location.
  //Parameters: score = player's score.
  //Postconditions: -
  //Preconditions: Player's score text's content and location
  //are up to date.
  this.updateText = function(score){
    this.glgeText_.setText(score);
    
    /*
    this.glgeText_.setRot(0,0,0);
    this.glgeText_.setLoc(0,0,0);
    this.glgeText_.setRot(-1*camera.getRotX(),camera.getRotY()+Math.PI, camera.getRotZ());
    
    //Give the score text camera's location.
    this.glgeText_.setLoc(camera.getPosX(),
    camera.getPosY(),
    camera.getPosZ());

    //Displacements' of the score text.
    //The dislocation X depends on camera's rotX and rotY.
    var scoreDLocX = Math.sin(camera.getRotY())*(camera.TPR_-camera.TPR_*
    Math.cos(camera.getRotX()+this.displacementY))+
    this.displacementFactorXZ*Math.sin(camera.getRotY()+this.displacementXZ);
    
    //The dislocation Y depends on camera's rotX
    var scoreDLocY = camera.TPR_*Math.sin(camera.getRotX()+
    this.displacementY)+camera.TPROTY_;
    
    //The dislocation Z depends on camera's rotX and rotY
    var scoreDLocZ = Math.cos(camera.getRotY())*(camera.TPR_-camera.TPR_*
    Math.cos(camera.getRotX()+this.displacementY))+
    this.displacementFactorXZ*Math.cos(camera.getRotY()+this.displacementXZ);
    
    //Displace the text to top right corner
    this.glgeText_.setDLoc(scoreDLocX, scoreDLocY, scoreDLocZ);
    */
  }
}