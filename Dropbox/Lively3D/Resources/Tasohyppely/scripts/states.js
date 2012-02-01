//Statemachine

var StateMachine = function(){
  var that = this;
  
  this.States = {"BEGIN":0, "ON":1, "PAUSE":2, "OVER":3};
  
  this.state_ = this.States.BEGIN;
  
  this.getState = function(){
    return this.state_;
  }
  
  this.setOn = function(){
    this.state_ = this.States.ON;
  }
  this.setPause = function(){
    this.state_ = this.States.PAUSE;
  }
  //is game over?
  this.isOver = function(life){
    if(life <= 0){
      this.state_ = this.States.OVER;
      return true;
    }
    return false;
  }
  
}