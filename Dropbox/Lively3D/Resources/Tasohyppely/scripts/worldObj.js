//World objects: ground, enemies, powerups etc.

//When object is destroyed/collected/deleted, it will be taken to this location
var AWAY_X = 0;
var AWAY_Y = -100;
var AWAY_Z = 0;

//Constructor
var WorldObject = function(object, body) {
  var that_ = this;
  
  this.EffectType_ = {"COLORCHANGE":0, "JUMPBOOST":1, "COLLECT":2, "DEATH":3, "NOEFFECT":-1};
  this.POSSIBLE_EFFECTS_ = ["colorchange", "jumpboost", "collect", "death"];
  
  this.glgeObject_ = object;
  this.glgeObject_.setRotOrder(GLGE.ROT_YXZ);
  this.jiglibBody_ = body;
  this.startLocation_ = [body.get_x(), body.get_y(), body.get_z()];
  this.startRotation_ = [body.get_rotationX(), body.get_rotationY(), body.get_rotationZ()];
  this.originalMaterial_ = object.getMaterial(0);
  this.effects_ = [];
  
  this.collected_ = false;
  
  this.glgeObject_.setLoc(body.get_x(), body.get_y(), body.get_z());
  this.glgeObject_.setRot(body.get_rotationX(), body.get_rotationY(), body.get_rotationZ());
  
  //Get width from the glge object's mesh
  this.width_ = calculateSize(this.glgeObject_.getMesh(0).getBoundingVolume().limits[0],
    this.glgeObject_.getMesh(0).getBoundingVolume().limits[1]) * this.glgeObject_.getScaleX();
  
  //Get height from the glge object's mesh
  //NOTE: BECAUSE THE OBJECT HAS BEEN ROTATED, Z-COORDINATE LIMITS ARE BEING USED.    
  this.height_ = calculateSize(this.glgeObject_.getMesh(0).getBoundingVolume().limits[4],
    this.glgeObject_.getMesh(0).getBoundingVolume().limits[5]) * this.glgeObject_.getScaleZ();
  
  //Get depth from the glge object's mesh
  //NOTE: BECAUSE THE OBJECT HAS BEEN ROTATED, Y-COORDINATE LIMITS ARE BEING USED.
  this.depth_ = calculateSize(this.glgeObject_.getMesh(0).getBoundingVolume().limits[2],
    this.glgeObject_.getMesh(0).getBoundingVolume().limits[3]) * this.glgeObject_.getScaleY();
  
  //Finds effects that object has and puts then into effects_ table
  //IS CALLED WHEN OBJECT IS CREATED (IS PAR OF A CONSTRUCTOR!!!)
  //preconditions: -
  //postcondition: objects effects list is updated
  this.findEffects = function(){
    for(var i = 0; i < this.POSSIBLE_EFFECTS_.length; ++i){
      var effect = this.glgeObject_.id.search(this.POSSIBLE_EFFECTS_[i]);
      if(effect != this.EffectType_.NOEFFECT){
        this.effects_.push(i);
      }
    }
  }
  //DON'T REMOVE INIT FUNCTION NEEDS TO BE CALLED HERE
  this.findEffects();
  
  //returns if the object has certain effect
  this.hasEffect = function(effect){
    for(var i = 0; i < this.effects_.length; ++i){
      if(this.effects_[i] === effect){
        return true;
      }
    }
    return false;
  }
  
  this.getWidth = function() {
    return this.width_;
  }
  
  this.getHeight = function() {
    return this.height_;
  }
  
  this.getDepth = function() {
    return this.depth_;
  }
  
  
  //Returns objects location
  this.getX = function(){
    return this.jiglibBody_.get_x();
  }
  
  this.getY = function(){
    return this.jiglibBody_.get_y();
  }
  
  this.getZ = function(){
    return this.jiglibBody_.get_z();
  }
  
  //Sets default values of worldObject
  //parameters: -
  //preconditions: -
  //postconditions: object is in it's original state
  this.setDefaults = function(){
    //others
    this.glgeObject_.setMaterial(that_.originalMaterial_);
    
    this.jiglibBody_.setActive();
    //rotation
    this.jiglibBody_.set_rotationX(this.startRotation_[0]);
    this.jiglibBody_.set_rotationY(this.startRotation_[1]);
    this.jiglibBody_.set_rotationZ(this.startRotation_[2]);
    this.glgeObject_.setRot(this.jiglibBody_.get_rotationX(),
      this.jiglibBody_.get_rotationY(), this.jiglibBody_.get_rotationZ());
    
    //position
    this.jiglibBody_.moveTo([parseFloat(this.startLocation_[0]),
      parseFloat(this.startLocation_[1]), parseFloat(this.startLocation_[2]), 0]);
      
    this.glgeObject_.setLoc(this.jiglibBody_.get_x(),
      this.jiglibBody_.get_y(), this.jiglibBody_.get_z());
  }
  
  //When game is started over are collected items added to scene
  //when this is done function setCollected gets called and it
  //returns collectable objects flag back to normal
  //Precondition: Object is collected and game has ended
  //Postcondition: Object can be collected again and collisions work again
  this.resetCollected = function(player){
    this.jiglibBody_.enableCollisions(player.jiglibBody_);
    this.collected_ = false;
  }
  
  //updates glge position same as jiglib position
  this.updateState = function(){
    this.glgeObject_.setRot(-this.jiglibBody_.get_rotationX(),
      -this.jiglibBody_.get_rotationY(), -this.jiglibBody_.get_rotationZ());
    this.glgeObject_.setLoc(this.jiglibBody_.get_x(),
      this.jiglibBody_.get_y(), this.jiglibBody_.get_z());
  }
  
  //TODO: CHANGE THIS TO SOMETHING REASONABLE!!
  //if the object has change color effect this is called when collision happens
  //precondition: -
  //postconditions: objects material is changed
  this.changeColor = function(player) {
    this.glgeObject_.setMaterial(player.glgeObject_.getMaterial(0), 0);
  }
  
  //Moves object to desired destination
  //parameters: x,y,z = coordinates of the new destination
  //preconditions: x,y,z has to be numbers
  //postcondition: object is moved
  this.moveTo = function(x, y, z) {
    this.glgeObject_.setLocX(x);
    this.glgeObject_.setLocY(y);
    this.glgeObject_.setLocZ(z);
    this.jiglibBody_.moveTo([parseFloat(x), parseFloat(y), parseFloat(z)]);
  }

  //Objects reaction to collision
  //parameters: collisionType = player.CollisionType_ value which tells
  //where collision came from (possible values ABOVE:0 BELOW:1 SIDEWAYS:2)
  //player = player object
  //precondition: findEffects() function has to be called
  //and player has to be inited
  //postcondition: possible collision effect is adapted
  //NOTE: EFFECT_FOG_COLOR and DEFAULT_FOG_COLOR are const strings decleard in init.js
  this.reactToCollision = function(collisionType, player, scene, worldObjects){
    var effect = function(){
      scene.setFogColor(DEFAULT_FOG_COLOR);
    }
    
    for(var i = 0; i < this.effects_.length; ++i){
      switch(this.effects_[i]){
        case this.EffectType_.COLORCHANGE:
          this.changeColor(player);
          break;
          
        case this.EffectType_.JUMPBOOST:
          if(collisionType == player.CollisionType_.ABOVE){
            player.jumpBoost();
          }
          break;
        
        case this.EffectType_.COLLECT:
          player.increaseScore();
          this.collected_ = true;
          this.jiglibBody_.disableCollisions(player.jiglibBody_);
          scene.removeChild(that_.glgeObject_);
          scene.setFogColor(EFFECT_FOG_COLOR);
          setTimeout(effect, 1000/10);
          break;
          
        case this.EffectType_.DEATH:
          player.decreaseLife(player.getLife());
          break;
          
        default:
          break;
      }
    }
  }
}