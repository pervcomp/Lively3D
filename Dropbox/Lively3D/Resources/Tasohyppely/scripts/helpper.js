//Init

var CANVAS_WIDTH = 512;
var CANVAS_HEIGHT = 512;

var MOVABLE = "movable";

//jiglib body types in strings
var BODY_TYPES = ["SPHERE", "BOX","CAPSULE", "PLANE"];
//enums for indexing BODY_TYPES
var BodyValues = {"SPHERE":0, "BOX":1, "CAPSULE":2, "PLANE":3};

var SCORE_LOC_X = 130;
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
var END_OFFSET_Z = -5;

var DEFAULT_FOG_COLOR = "#3F3F3F";
var EFFECT_FOG_COLOR = "#DCFCCC";

var SCORE_TEXT_COLOR = "#D0F0C0";
var SCORE_TEXT_SIZE = 10;
var STATE_TEXT_COLOR = "#D0F0C0";//"#ffdd00";
var STATE_TEXT_SIZE = 17;

var calculateSize = function(side1, side2){
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
}