// Original game from
// http://billmill.org/static/canvastutorial/

var Arkanoid = function(){
	var x = 25;
	var y = 250;
	var dx = 1.5;
	var dy = -4;
	var ce;
	var ctx;
	var WIDTH;
	var HEIGHT;
	var paddlex;
	var paddleh = 10;
	var paddlew = 75;
	var rightDown = false;
	var leftDown = false;
	var canvasMinX = 0;
	var canvasMaxX = 0;
	var intervalId = 0;
	var bricks;
	var NROWS = 5;
	var NCOLS = 5;
	var BRICKWIDTH;
	var BRICKHEIGHT = 15;
	var PADDING = 1;

	
	this.init = function(canvasElement) {
		if (!canvasElement) {
			canvasElement = document.createElement("canvas");
			canvasElement.setAttribute("style", "display: none");
			canvasElement.id = "arkanoid_canvas";
			//document.body.appendChild(canvasElement);
		}
		ce = canvasElement;
		ce.width = 512;
		ce.height = 512;

	  ctx = ce.getContext("2d");
	  WIDTH = ce.width;
	  HEIGHT = ce.height;
	  paddlex = WIDTH / 2;
	  BRICKWIDTH = (WIDTH/NCOLS) - 1;
	  canvasMinX = ce.offsetLeft;
	  canvasMaxX = canvasMinX + WIDTH;
	  
	}
	
	this.Open = function(){
		intervalId = setInterval(draw, 10);
		return intervalId;
	}
	
	function circle(x,y,r) {
	  ctx.beginPath();
	  ctx.arc(x, y, r, 0, Math.PI*2, true);
	  ctx.closePath();
	  ctx.fill();
	}

	function rect(x,y,w,h) {
	  ctx.beginPath();
	  ctx.rect(x,y,w,h);
	  ctx.closePath();
	  ctx.fill();
	}

	function clear() {
	  ctx.clearRect(0, 0, WIDTH, HEIGHT);
	  rect(0,0,WIDTH,HEIGHT);
	}

	this.onKeyDown = function(evt) {
	  if (evt.keyCode == 39) rightDown = true;
	  else if (evt.keyCode == 37) leftDown = true;
	}

	this.onKeyUp = function(evt) {
	  if (evt.keyCode == 39) rightDown = false;
	  else if (evt.keyCode == 37) leftDown = false;
	}

	//$(document).keydown(onKeyDown);
	//$(document).keyup(onKeyUp);

	/*
	function onMouseMove(evt) {
	  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
		paddlex = Math.max(evt.pageX - canvasMinX - (paddlew/2), 0);
		paddlex = Math.min(WIDTH - paddlew, paddlex);
	  }
	}

	$(document).mousemove(onMouseMove);
	*/

	this.initbricks = function() {
		bricks = new Array(NROWS);
		for (i=0; i < NROWS; i++) {
			bricks[i] = new Array(NCOLS);
			for (j=0; j < NCOLS; j++) {
				bricks[i][j] = 1;
			}
		}
	}

	function drawbricks() {
	  for (i=0; i < NROWS; i++) {
		ctx.fillStyle = rowcolors[i];
		for (j=0; j < NCOLS; j++) {
		  if (bricks[i][j] == 1) {
			rect((j * (BRICKWIDTH + PADDING)) + PADDING, 
				 (i * (BRICKHEIGHT + PADDING)) + PADDING,
				 BRICKWIDTH, BRICKHEIGHT);
		  }
		}
	  }
	}

	var ballr = 10;
	var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
	var paddlecolor = "#FFFFFF";
	var ballcolor = "#FFFFFF";
	var backcolor = "#000000";

	function draw() {
	  ctx.fillStyle = backcolor;
	  clear();
	  ctx.fillStyle = ballcolor;
	  circle(x, y, ballr);

	  if (rightDown) paddlex += 5;
	  else if (leftDown) paddlex -= 5;
	  ctx.fillStyle = paddlecolor;
	  rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);

	  drawbricks();

	  //want to learn about real collision detection? go read
	  // http://www.metanetsoftware.com/technique/tutorialA.html
	  rowheight = BRICKHEIGHT + PADDING;
	  colwidth = BRICKWIDTH + PADDING;
	  row = Math.floor(y/rowheight);
	  col = Math.floor(x/colwidth);
	  //reverse the ball and mark the brick as broken
	  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
		dy = -dy;
		bricks[row][col] = 0;
	  }

	  if (x + dx + ballr > WIDTH || x + dx - ballr < 0)
		dx = -dx;

	  if (y + dy - ballr < 0)
		dy = -dy;
	  else if (y + dy + ballr > HEIGHT - paddleh) {
		if (x > paddlex && x < paddlex + paddlew) {
		  //move the ball differently based on where it hit the paddle
		  dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
		  dy = -dy;
		}
		else if (y + dy + ballr > HEIGHT)
		  clearInterval(intervalId);
	  }

	  x += dx;
	  y += dy;
	}
	
	this.GetCanvas = function(){
		return ce;
	}
	
	var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
	
}

var ArkanoidInit = function(Arkanoid){
	var arkanoid = new Arkanoid();
	arkanoid.init();
	arkanoid.initbricks();
	arkanoid.EventListeners = { "keydown": arkanoid.onKeyDown, "keyup": arkanoid.onKeyUp };
	return arkanoid;
}


var app = Lively3D.AddApplication('Arkanoid', Arkanoid, ArkanoidInit);

app.StartApp();