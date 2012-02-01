//Player that moves on the scene

//precondition: player links has to contine link to players glge- and jiglib bodies
var Player = function(playerLinks){
  var that_ = this; //getting the context
  
  this.CollisionType_ = {"ABOVE":0, "BELOW":1, "SIDEWAYS":2, "NONE": -1};
  
  this.glgeObject_ = playerLinks.glge;
  this.glgeObject_.setRotOrder(GLGE.ROT_YXZ);
  this.jiglibBody_ = playerLinks.jig;
  this.startLocationX_ = playerLinks.jig.get_x();
  this.startLocationY_ = playerLinks.jig.get_y();
  this.startLocationZ_ = playerLinks.jig.get_z();
  this.startRotX_ = playerLinks.jig.get_rotationX();
  this.startRotY_ = playerLinks.jig.get_rotationY();
  this.startRotZ_ = playerLinks.jig.get_rotationZ();
  
  this.width_ = calculateSize(this.glgeObject_.getMesh(0).getBoundingVolume().limits[0],
    this.glgeObject_.getMesh(0).getBoundingVolume().limits[1]) * this.glgeObject_.getScaleX();
    
  this.height_ = calculateSize(this.glgeObject_.getMesh(0).getBoundingVolume().limits[2],
    this.glgeObject_.getMesh(0).getBoundingVolume().limits[3]) * this.glgeObject_.getScaleY();
    
  this.depth_ = calculateSize(this.glgeObject_.getMesh(0).getBoundingVolume().limits[4],
    this.glgeObject_.getMesh(0).getBoundingVolume().limits[5]) * this.glgeObject_.getScaleZ();
    
  this.onAir_ = true;
  this.scoreText_ = new GLGE.Text();
  
  //CONSTANTS
  this.START_LIFE_ = 1000;
  this.VELOCITY_ = 4.0;
  this.BOOST_FACTOR_ = 2.0;
  this.JUMP_POWER_ = 8.0;
  this.ROT_ANGLE_ = (1.5*Math.PI)/180.0;
  this.ROTX_LIM_ = Math.PI / 10.0;
  this.START_SCORE_ = 0;
  this.SCORE_TEXT_COLOR_ = "#ffdd00"
  this.SCORE_ADDITION_ = 1;
  
  this.life_ = this.START_LIFE_;
  this.score_ = this.START_SCORE_;
  
  //Sets player back to it's origin state
  this.setDefaults = function(){
    //rotation
    this.jiglibBody_.set_rotationX(this.startRotX_);
    this.jiglibBody_.set_rotationY(this.startRotY_);
    this.jiglibBody_.set_rotationZ(this.startRotZ_);
    this.glgeObject_.setRot(this.jiglibBody_.get_rotationX(),
      this.jiglibBody_.get_rotationY(), this.jiglibBody_.get_rotationZ());
    
    //position
    this.jiglibBody_.moveTo([parseFloat(this.startLocationX_),
      parseFloat(this.startLocationY_), parseFloat(this.startLocationZ_), 0]);
    this.glgeObject_.setLoc(this.jiglibBody_.get_x(),
      this.jiglibBody_.get_y(), this.jiglibBody_.get_z()); 
    
    //others
    this.life_ = this.START_LIFE_;
    this.score_ = this.START_SCORE_;
  };
  
  //updates physics body and glge object to match
  //Parameters: - 
  //Preconditions: -
  //Postcondition: glgeObject has same coordinates as jiglibBody
  this.updateState = function(){
    this.glgeObject_.setRot(this.jiglibBody_.get_rotationX(),
      this.jiglibBody_.get_rotationY(), this.jiglibBody_.get_rotationZ());
    
    this.glgeObject_.setLoc(this.jiglibBody_.get_x(),
      this.jiglibBody_.get_y(), this.jiglibBody_.get_z());
  }
  
  //Returns GLGE text which has player's score information
  this.getScoreText = function() {
    return this.scoreText_;
  }
  
  //returns x position
  this.getX = function(){
    return this.jiglibBody_.get_x();
    
  }
  //returns y position
  this.getY = function(){
    return this.jiglibBody_.get_y();
  }
  //returns z position
  this.getZ = function(){
    return this.jiglibBody_.get_z();
  }
  
  //returns rotation x angle
  this.getRotX = function(){
    return this.jiglibBody_.get_rotationX();
  }
  //returns rotation y angle
  this.getRotY = function(){
    return this.jiglibBody_.get_rotationY();
  }
  //returns rotation z angle
  this.getRotZ = function(){
    return this.jiglibBody_.get_rotationZ();
  }
  
  //returns life at the moment
  this.getLife = function(){
    return this.life_;
  }
  
  //returns player's score
  this.getScore = function(){
    return this.score_;
  }
  
  //Increase player's score.
  //Parameters: value = the amount used to increase player's score.
  //Preconditions: -
  //Postconditions: Player's score has been increased by "value"
  this.increaseScore = function(){
    this.score_ += this.SCORE_ADDITION_;
  }
  
  //Return the length from the center of the player's body to the
  //outer part of its body.
  this.getLimitMinX = function() {
    return this.glgeObject_.getMesh(0).getBoundingVolume().limits[0] *
    this.glgeObject_.getScaleX();
  }
  
  this.getLimitMaxX = function() {
    return this.glgeObject_.getMesh(0).getBoundingVolume().limits[1] *
    this.glgeObject_.getScaleX();
  }
  
  this.getLimitMinY = function() {
    return this.glgeObject_.getMesh(0).getBoundingVolume().limits[2] *
    this.glgeObject_.getScaleY();
  }
  
  this.getLimitMaxY = function() {
    return this.glgeObject_.getMesh(0).getBoundingVolume().limits[3] *
    this.glgeObject_.getScaleY();
  }
  
  this.getLimitMinZ = function() {
    return this.glgeObject_.getMesh(0).getBoundingVolume().limits[4] *
    this.glgeObject_.getScaleZ();
  }
  
  this.getLimitMaxZ = function() {
    return this.glgeObject_.getMesh(0).getBoundingVolume().limits[5] *
    this.glgeObject_.getScaleZ();
  }
  
  //Check if the player has collided with something that could change the
  //player's life or other attributes.
  //Parameters: worldObjects = worldObjects list.
  //Preconditions: The mainLoop-function from main.js has been called.
  //Postconditions: player's all collisions have been checked and necessary
  //changes have been made to player or to the colliding object.
  this.checkCollisions = function(worldObjects, scene) {
    //Check if jiglibBody is in collision with antother body. If it is, check 
    //the other body's pointinfo's Y-coordinate. If 'pointInfo[0].r1[1] == 1', it
    //means that the player is on the highest point of the other object
    if(this.jiglibBody_.collisions.length == 0 && !this.onAir_){
      this.onAir_ = true;
    }
    for (var i = 0; i < this.jiglibBody_.collisions.length; ++i) {
      //The other body of the collision (not player)
      var otherCollider = this.jiglibBody_.collisions[i].objInfo.body1;
      var other = worldObjects[otherCollider._id-1];
      //Player keeps track of the same collision in two ways: body0 = self, body 1 = other
      //and the other one is: body1 = self, body0 = other. We'll only check the first
      //version.
      if (otherCollider != this.jiglibBody_) {
        var colType = this.CollisionType_.ABOVE;
        if (otherCollider.get_type() == BODY_TYPES[BodyValues.BOX]) {
          if(!other.hasEffect(other.EffectType_.COLLECT)){
            this.onAir_ = false;
          }
        }
        other.reactToCollision(colType, that_, scene, worldObjects);
      }
    }//for ends
  }
  

  //Movefunctions has same parameters, pre- and postconditions!
  //Parameters: system = jiglib physics system
  //Preconditions: physics system has to be initialized and
  //physics systems link[0] has to be player
  //Postconditions: player is moved
  this.moveLeft = function(){
    if(!this.onAir_){
      //this.jiglibBody_.setActive();
      
      var rot = this.getRotY();
      
      //Z-coordinate
      this.jiglibBody_._currState.linVelocity[2] = 
        (this.VELOCITY_/1.5) * Math.sin(rot);
        
      //X-coordinate 
      this.jiglibBody_._currState.linVelocity[0] = 
        (-1.0)*(this.VELOCITY_/1.5) * Math.cos(rot);
        
      //Y-coordinate 
      this.jiglibBody_._currState.linVelocity[1] = 0.0;
    }
  };
  
  this.moveRight = function(){
    if(!this.onAir_){
      var rot = this.getRotY();
      
      //Z-coordinate
      this.jiglibBody_._currState.linVelocity[2] = 
        (-1.0)*(this.VELOCITY_) * Math.sin(rot);
        
      //X-coordinate  
      this.jiglibBody_._currState.linVelocity[0] = 
        (this.VELOCITY_) * Math.cos(rot);
      
      //Y-coordinate      
      this.jiglibBody_._currState.linVelocity[1] = 0.0;
    }
  };
  
  this.moveForward = function(){
    if(!this.onAir_){
      var roty = this.getRotY();
      var rotx = this.getRotX();
      
      //Z-coordinate
      this.jiglibBody_._currState.linVelocity[2] = 
        (-1.0)*(this.VELOCITY_) * Math.cos(roty) * Math.cos(rotx);
      
      //X-coordinate
      this.jiglibBody_._currState.linVelocity[0] = 
        (-1.0)*(this.VELOCITY_) * Math.sin(roty) * Math.cos(rotx);
        
      //Y-coordinate
      this.jiglibBody_._currState.linVelocity[1] = 0.0;
    }
  };
  
  this.moveBackward = function(){
    if(!this.onAir_){
      var roty = this.getRotY();
      var rotx = this.getRotX();
      
      //Z-coordinate
      this.jiglibBody_._currState.linVelocity[2] = 
        (this.VELOCITY_) * Math.cos(roty) * Math.cos(rotx);
        
      //X-coordinate
      this.jiglibBody_._currState.linVelocity[0] = 
        (this.VELOCITY_) * Math.sin(roty) * Math.cos(rotx);
      
      //Y-coordinate
      this.jiglibBody_._currState.linVelocity[1] = 0.0;
    }
  };
  
  this.jump = function() {
    //If the player has not jumped since last landing, player can jump.
    if (!this.onAir_) {
      this.jiglibBody_._currState.linVelocity[1] = this.JUMP_POWER_;
      this.onAir_ = true;
    }
  };
  
  //Rotatefunctions has same pre- and postconditions!
  //Preconditions:
  //Postconditions: player's jiglib bodys rotations are set
  this.rotateLeft = function(){
    if(!this.onAir_){
      var rot = this.getRotY();
      rot += this.ROT_ANGLE_;
      if(rot > Math.PI * 2){
        rot -= (Math.PI * 2);
      }
      this.jiglibBody_.set_rotationY(rot);
    }
  };
  
  this.rotateRight = function(){
    if(!this.onAir_){
      var rot = this.getRotY();
      rot -= this.ROT_ANGLE_;
      if(rot < Math.PI * -2){
        rot += (Math.PI * 2);
      }
      this.jiglibBody_.set_rotationY(rot);
    }
  };
  
  //This effect occurs when player collides with certain objects. Player is
  //rocketed to the air.
  this.jumpBoost = function() {
    var roty = this.getRotY();
    var rotx = this.getRotX();
    
    //Z-coordinate
    this.jiglibBody_._currState.linVelocity[2] = 
      (-1)*(this.VELOCITY_ * this.BOOST_FACTOR_) * Math.cos(roty) * Math.cos(rotx);
    //X-coordinate
    this.jiglibBody_._currState.linVelocity[0] = 
      (-1)*(this.VELOCITY_ * this.BOOST_FACTOR_) * Math.sin(roty) * Math.cos(rotx);
    
    //Boost for y-axis
    this.jiglibBody_._currState.linVelocity[1] = this.JUMP_POWER_ * this.BOOST_FACTOR_;
    
    this.onAir_ = true;
  }
  
  //Decrease player's life.
  this.decreaseLife = function(amount) {
    this.life_ -= amount;
  }
}
