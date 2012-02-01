var MouseGame = function(){
    
	
	var javascriptSrc = [];
	var pictureSrc = [];
	
	//Canvaksen luonti
    var canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
  
    var ctx = canvas.getContext("2d");


    var world;
	var ctx;
	var canvasElm;
	var canvasWidth;
	var canvasHeight;
	var canvasTop;
	var canvasLeft;
    var lisaannytaan = 0;
	var boxCount = 0;
	var removeArray = new Array();
	var cheese = new Image();
    
	var mousePicture = new Image();
	
	var cat = new Image();
	
	cheeseLisays = 0;
	
	
	var heart = new Image();
	heart.crossOrigin = "";
	
	var fatMouse = new Image();
	fatMouse.crossOrigin = "";
	
	var iphone = new Image();
	iphone.crossOrigin = "";
	
	var elop = new Image();
	elop.crossOrigin = "";
	
	var cash = new Image();
	cash.crossOrigin = "";
	
	var nokia = new Image();
	nokia.crossOrigin = "";
	
	var fail = new Image();
	fail.crossOrigin = "";
	
	var mouseCheese = new Image();
	mouseCheese.crossOrigin = "";
	
	var timeOut;
	
	var start = true;
	var pushStart = false;
	
	cheeseCount = 0;
	var mouse = 0;
	
	var leftSide = true;
	
	//hiiren liikuttelu
	var myStage = null;
    var eventDisplay = "";
   
	var pos_x = 0;
	var pos_y = 0;
	var canvasHight = 500;
	var canvasWidth = 800;
	var imageHight = 50;
	var imageWidth = 50;
	var end = false;
	
	//törmäys
	
	var mouseWidth = 60;
	var mouseHeight = 60;
	
	var catHeight = 40;
	var catWidth = 60;
	
	var cheeseHeight = 20;
	var cheeseWidth = 20;
	
	var score = 0;
	var mouseLifes = 3;
	
	var gameOver = false;
	var nokiaMode = false;
	
	var enemyCollision = false;
	var collisionEffect = 0;
	var enemyCollisionCounter = 0;
	
	//pos_x:n ja pos_y:n päivittäminen
	//vanhat hiirifunktiot pois?
	//Näppäinpainallukset eventteihin vai niin kuin ne nyt ovat?
	
	
	var initPictures = function (){
	
	  cheese.src = pictureSrc[0];
      mousePicture.src = pictureSrc[1];
      cat.src = pictureSrc[2];
      heart.src = pictureSrc[3];
      fatMouse.src = pictureSrc[4];
      iphone.src = pictureSrc[5];
      elop.src = pictureSrc[6];
      cash.src = pictureSrc[7];
      nokia.src = pictureSrc[8];
      fail.src = pictureSrc[9];
      mouseCheese.src = pictureSrc[10]; 
	
	
	
	
	}
	
	this.updateMousePosition = function (event){
	
	  pos_x = event.coord[0];

	  pos_y = event.coord[1];

	  
	
	
	}
	
	var drawEventDisplay = function (body){
        ctx.font = "18pt Calibri";
        ctx.fillStyle = "black";
		
		if( pos_y >=  canvasHight - imageHight){
		
		  pos_y =  canvasHight - imageHight;
		
		}
		if ( pos_x >= canvasWidth - imageWidth){
		
		  pos_x = canvasWidth - imageWidth;
		
		}
		if(!end){
         
		  if(nokiaMode){
		  
		  if(enemyCollision){
            
            if(collisionEffect < 6 ){ 
            ctx.drawImage(iphone,pos_x,pos_y,imageWidth+10,90);

            }
            collisionEffect++;
            if(collisionEffect == 12){

              collisionEffect = 0;
            } 
          }
          else{
             
			ctx.drawImage(iphone,pos_x,pos_y,imageWidth+10,90); 

          }  
		  }
		  
		  else{
		    if(enemyCollision){
			
			  if(collisionEffect < 6){
		         ctx.drawImage(mousePicture,pos_x,pos_y,imageWidth,imageHight);
		         /*console.log("piirto");*/
		
		  }
		      collisionEffect++;
			  
			  if(collisionEffect == 12){

              collisionEffect = 0;
            } 
		  }
		  else{
		    
			ctx.drawImage(mousePicture,pos_x,pos_y,imageWidth,imageHight);
			
		  }
		}
		
		
		}
		}
	
    var drawWorld = function (world, context) {
		for (var j = world.m_jointList; j; j = j.m_next) {
			drawJoint(j, context);
		}
		for (var b = world.m_bodyList; b; b = b.m_next) {
		    
		    
			for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			     
				 
				
				if(s.m_type == b2Shape.e_circleShape ){
				  
				  var vector = b.GetLinearVelocity();
				  
				  if( (vector.x > 0 && vector.x < 40) || (vector.y > 0 && vector.y < 20) ){
			         
					vector.x = 20;
					vector.y = 20;
					
					var mass = 10;
					
					vector.Multiply(mass);
					b.SetLinearVelocity(vector);
					
				  
			        //removeArray.push(b);
			        //console.log(b.GetLinearVelocity.length);
			        //console.log("poistettavaksi");
			      
			
			}
				  
				}
				
				var vector = b.GetLinearVelocity();
				
			    if(s.m_type == b2Shape.e_polyShape &&  ((vector.x > 0 && vector.x > 200) || (vector.x < 0 && vector.x < -200) )){
				    
					
				    vector.x = 10;
					vector.y = 10;
					
					var mass = 10;
					
					vector.Multiply(mass);
					b.SetLinearVelocity(vector);
					
				  
				  }
				
				if( s.m_type == b2Shape.e_polyShape &&   ((vector.x > 0 && vector.x < 10) || (vector.y > 0 && vector.y < 10)) ){
				
				  vector.x = 10;
					vector.y = 10;
					
					var mass = 10;
					
					vector.Multiply(mass);
					b.SetLinearVelocity(vector);
				  
				}
				drawShape(s, context);
			}
		}
 
		//ctx.font = 'bold 18px arial';
		//ctx.textAlign = 'center';
		//ctx.fillStyle = 'pink';
		//ctx.fillText("Click the screen to add more objects",0, 20);
		//ctx.font = 'bold 14px arial';
		//ctx.fillText("Performance will vary by browser", 200, 40);
 
	}  

    var drawJoint = function (joint, context) {
		var b1 = joint.m_body1;
		var b2 = joint.m_body2;
		var x1 = b1.m_position;
		var x2 = b2.m_position;
		var p1 = joint.GetAnchor1();
		var p2 = joint.GetAnchor2();
		context.strokeStyle = '#00eeee';
		context.beginPath();
		switch (joint.m_type) {
		case b2Joint.e_distanceJoint:
			context.moveTo(p1.x, p1.y);
			context.lineTo(p2.x, p2.y);
			break;
 
		case b2Joint.e_pulleyJoint:
			// TODO
			break;
 
		default:
			if (b1 == world.m_groundBody) {
				context.moveTo(p1.x, p1.y);
				context.lineTo(x2.x, x2.y);
			}
			else if (b2 == world.m_groundBody) {
				context.moveTo(p1.x, p1.y);
				context.lineTo(x1.x, x1.y);
			}
			else {
				context.moveTo(x1.x, x1.y);
				context.lineTo(p1.x, p1.y);
				context.lineTo(x2.x, x2.y);
				context.lineTo(p2.x, p2.y);
			}
			break;
		}
		context.stroke();
	}
 
	var drawShape = function (shape, context) {
		context.strokeStyle = 'black';
		if (shape.density == 1.0) {
			context.fillStyle = "black";
		} else {
			context.fillStyle = "black";
		}
		context.beginPath();
		switch (shape.m_type) {
		case b2Shape.e_circleShape:
			{
				var circle = shape;
				var pos = circle.m_position;
				var r = circle.m_radius;
				var segments = 16;
				var theta = 0;
				var dtheta = 2.0 * Math.PI / segments;
 
				// draw circle
				context.moveTo(pos.x + r, pos.y);
				for (var i = 0; i < segments; i++) {
					var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
					var v = b2Math.AddVV(pos, d);
					context.lineTo(v.x, v.y);
					theta += dtheta;
				}
				context.lineTo(pos.x + r, pos.y);
				context.drawImage(sprite,pos.x - r,pos.y -r,40,40);
 
				// draw radius
				//context.moveTo(pos.x, pos.y);
				//var ax = circle.m_R.col1;
				//var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
				//context.lineTo(pos2.x, pos2.y);
			}
			break;
		case b2Shape.e_polyShape:
			{
			    var poly = shape;				
			    
				if(poly.GetUserData() != 0 ){
				   
				   var body = poly.GetBody();
				   var picture;
				   
				   /*if(poly.GetUserData() != 3) {*/
				   var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
				   //console.log(tV + tV.x + tV.y);
				   context.moveTo(tV.x, tV.y);
				   
				   for (var i = 0; i < poly.m_vertexCount; i++) {
					   var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
					   context.lineTo(v.x, v.y);
				    }
					
				   
				   context.lineTo(tV.x, tV.y);
				   //}
				   
				   
				   var temp = poly.GetPosition();
				   
				   if(poly.GetUserData() == 1 ){
				   
				     if(nokiaMode){
				   
				       context.drawImage(elop,temp.x-30,temp.y-30, 80,80);
				     }
				     else{
				       context.drawImage(cat,temp.x-30,temp.y-30, 60,60);
					   
					   }
					   
				       picture = "cat";
				       isCollision(body, picture);
				   
				   
				   }
				   else if(poly.GetUserData() == 2){
				    
					
					 if(nokiaMode){
					   
					   context.drawImage(cash,temp.x-30,temp.y-30, 80,80);
					 
					 }
					 
					 else{
					 
					 context.drawImage(cheese,temp.x-30,temp.y-30, 60,60);
					 
					 }
				     picture = "cheese";
					 isCollision(body, picture);
				   }
				   
				   else if(poly.GetUserData() == 3){
				     
					 
					 //console.log(body.GetCenterPosition());
					 //if(pos_x != null && pos_y != null && pos_x > 0 && pos_y > 0) {
						//var vectori = new b2Vec2(pos_x, pos_y);
						//body.SetCenterPosition(vectori);
						//console.log("center position set to " + vectori.x + " " + vectori.y);
					 //}
					 //drawEventDisplay(body);
				   
				   }
				}
				
				
				else{
				var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
				context.moveTo(tV.x, tV.y);
				for (var i = 0; i < poly.m_vertexCount; i++) {
					var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
					context.lineTo(v.x, v.y);
				}
				context.lineTo(tV.x, tV.y);
				}
				
			}
			break;
		}
		
		if( shape.GetUserData() == 0 ){
		context.fill();
		context.stroke();
		
		}
	}
	
	
	var createWorld = function () {
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(-1000, -1000);
		worldAABB.maxVertex.Set(1000, 1000);
		var gravity = new b2Vec2(0, 10);
		var doSleep = true;
		world = new b2World(worldAABB, gravity, doSleep);
		//createGround(world, 400, 500);
		//createGround(world, 400, 0);

		//createBox(world, canvasWidth,canvasHeight , 1, canvasHeight, true);
		
		return world;
	}
	
	var createGround = function (world, position_x, position_y) {
		var groundSd = new b2BoxDef();
		groundSd.extents.Set(400, 0);
		groundSd.restitution = 1.0;
		var groundBd = new b2BodyDef();
		groundBd.AddShape(groundSd);
		groundBd.position.Set(position_x, position_y);
		return world.CreateBody(groundBd);
	}
 
	var createBall = function (world, x, y) {
		var ballSd = new b2CircleDef();
		ballSd.density = 1.0;
		ballSd.radius = 20;
		ballSd.restitution = 1;
		ballSd.friction = 0;
		var ballBd = new b2BodyDef();
		ballBd.AddShape(ballSd);
		ballBd.position.Set(x,y);
		
		//b2Vec2 currentDirection = ballBd.GetLinearVelocity();
        //currentDirection.Normalize();
        //ballBd.SetLinearVelocity( 10 * currentDirection );
		
		return world.CreateBody(ballBd);
	}
 
    var createBox = function (world, x, y, width, height, fixed, name) {
		if (typeof(fixed) == 'undefined') fixed = true;
		var boxSd = new b2BoxDef();
		if (!fixed) boxSd.density = 2.0; 
		boxSd.restitution = 1.0;
		boxSd.friction = 0;
		boxSd.userData = name;
		boxSd.extents.Set(width, height);
		var boxBd = new b2BodyDef();
		boxBd.AddShape(boxSd);
		boxBd.position.Set(x,y);
		return world.CreateBody(boxBd);
	}
	
	
	
    var drawBackRound = function (){

if(nokiaMode){


  ctx.drawImage(nokia,0,0,canvasWidth, canvasHeight);

}

else{
var my_gradient = ctx.createLinearGradient(0, 0, 0, 225);
my_gradient.addColorStop(0,"yellow");
my_gradient.addColorStop(1, "pink");
ctx.fillStyle = my_gradient;
ctx.fillRect(0, 0, 800, 500);
}

ctx.strokeRect(0,0, 800, 500);

if(!gameOver && !start){
if( mouseLifes > 0 ){
ctx.drawImage(heart,10,10,25,25);
}
if(mouseLifes > 1){

  ctx.drawImage(heart,35,10,25,25);

}

if( mouseLifes > 2){
 
  ctx.drawImage(heart,60,10,25,25);


}
//ctx.shadowOffsetX = 2;
//ctx.shadowOffsetY = 2;
//ctx.shadowBlur = 2;
//ctx.shadowColor = "grey";
  

ctx.fillStyle = "Black";
ctx.fillText(" Score: " + score , 100, 30);
}
if(gameOver){


//ctx.shadowOffsetX = 2;
//ctx.shadowOffsetY = 2;
//ctx.shadowBlur = 2;
//ctx.shadowColor = "red";

if(nokiaMode){

  ctx.fillStyle = 'white';
  ctx.fillRect(280, 280, 250 , 465);

}
  
ctx.font = "22px Times New Roman";
ctx.fillStyle = "Black";
ctx.fillText(" Game Over"  , 300, 380);
ctx.fillText(" Your Score: " + score  , 300, 425);
ctx.fillText(" Press Enter To Continue "  , 300, 465);


if(!nokiaMode){
ctx.drawImage(fatMouse,225,80, 350,250);
}
else{

ctx.drawImage(fail,225,0, 350,350);

}


}

if(start){

 
 ctx.font = "22px Times New Roman";
 ctx.fillStyle = "Black";
 ctx.fillText(" Help mouse to find cheese"  , 270, 400);
 ctx.fillText(" Push shift to start"  , 310, 450);

 ctx.drawImage(mouseCheese,225,30, 350,330);
 
}

}	




var collisionFunction = function (avatarPosition_x, avatarPosition_y, targetPosition_x, targetposition_y, avatarWidth,
                          avatarHeight, targetWidth, targetHeight){
	
	var collision = true;
	
	if (!((avatarPosition_x + avatarWidth) >= targetPosition_x )) {

         collision = false;     
		 
		 
    }
		 
	if (!(avatarPosition_x <= (targetPosition_x + targetWidth)))   {  

       collision = false;
	   
    }     
  
  if (!((avatarPosition_y + avatarHeight) >= targetposition_y)) {        

        collision = false;    
	    
	  
	  }     
  
  
  
  if (!(avatarPosition_y <= (targetposition_y + targetHeight))) {    


        collision = false;    
        
    }

    					  
	return collision;					  







}

	
var isCollision = function (body, picture){

if( picture == "cat"){


  
  
  var catPosition = body.GetCenterPosition();
  var temp1 = catPosition.x;
  var temp2 = catPosition.y;
  
  temp1 = temp1 - 10;
  temp2 = temp2 - 10; 
   
  var mousePosition_x = pos_x +30;
  var mousePosition_y = pos_y +20;
  
  if( nokiaMode){
  
   var iphoneWidth = 60;
   var iphoneHeight = 80;
   var elopWidth = 80;
   var elopHeight = 80;
   var collision = collisionFunction(mousePosition_x,mousePosition_y, temp1, temp2, iphoneWidth, iphoneHeight, elopWidth, elopHeight  );
  
  }
  else{
  
    mouseWidth = 50;
    mouseHeight = 50;
    var collision = collisionFunction(mousePosition_x,mousePosition_y, temp1, temp2, mouseWidth, mouseHeight, catWidth, catHeight  );
  }
  
  
  

 	 
  if (collision){
  
      if(!enemyCollision){
       mouseLifes--;
	   
	   //console.log("vähennetään hiiren elämää");
	   
       //removeArray.push(body);
	   //boxCount--;
	   enemyCollision = true;
	   
	   if(mouseLifes == 0 ){
	   
	     gameOver = true;
	   
	   }
	   }
    }   
	 
	 
}

if(picture == "cheese"){


  var collision = true;
  var cheesePosition = body.GetCenterPosition();
  var temp1 = cheesePosition.x;
  var temp2 = cheesePosition.y;
  
  temp1 = temp1 - 10;
  temp2 = temp2 - 10; 
   
  var mousePosition_x = pos_x + 30;
  var mousePosition_y = pos_y + 20;
  
  
  if( nokiaMode){
  
   var iphoneWidth = 60;
   var iphoneHeight = 90;
   var cashWidth = 80 ;
   var cashHeight = 80;
   var collision = collisionFunction(mousePosition_x,mousePosition_y, temp1, temp2,iphoneWidth , iphoneHeight, cashWidth , cashHeight  );
  
  }
  else{
  
    mouseWidth = 50;
    mouseHeight = 50;
	var cheeseWidth = 60 ;
	var cheeseHeight =60 ;
	
	//tänne parametrit
    var collision = collisionFunction(mousePosition_x,mousePosition_y, temp1, temp2, mouseWidth, mouseHeight, cheeseWidth, cheeseHeight  );
  }
  
 	 
  if (collision){
  
      
       removeArray.push(body);
       cheeseCount--;
	    score = score + 10;
	   
	   var catRemoved = false;
	   
	   if(!(catRemoved)){
	   
	   for (var b = world.m_bodyList; b; b = b.m_next) {
	   
	     if(b.GetUserData() == 1){
		 
		   removeArray.push(b);
		   boxCount--;
		   break;
		 
		 
		  }
	   
	   }
	   }
	   
    }   
	 
}




}	

		 
		  

var ending = function (){


drawGameOver();

//Delete bodies
 for (var b = world.m_bodyList; b; b = b.m_next) {
	   
		 
		   removeArray.push(b);

}

for( i = 0 ;removeArray.length > 0; i ){
				  
		    world.DestroyBody(removeArray[0]);
			removeArray.shift();
		    
			}



lisaannytaan = 0;
boxCount = 0;
cheeseLisays = 0;
cheeseCount = 0;
mouse = 0;
leftSide = true;
myStage = null;
eventDisplay = "";
pos_x = 0;
pos_y = 0;
score = 0;
enemyCollisionCounter = 0;
gameOver = false;
enemyCollision = false;
collisionEffect = 0;


}


var drawGameOver = function (){

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBackRound();
  mouseLifes = 3;
  
  
}




this.keydown = function (e) {
  
  if(end){
  if(e.keyCode == 13) {
      end = false;
      init();
	  
  

  }  
}


  if(e.keyCode == 78){
    
	if(nokiaMode){
	
	  nokiaMode = false;
	  //console.log("eikö nokiamode");
	}

    else{
  
      nokiaMode = true;
      //console.log("nokiamode");
    }

   
}
   if((e.keyCode == 16)  && (start == true ) ){
   
      start = false;
      init();
	 
	 }


} 


var step = function (cnt) {
		
		var stepping = false;
		var timeStep = 1.0/60;
		var iteration = 1;
		world.Step(timeStep, iteration);
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		drawBackRound();
		
		
		
		/*
		myStage = new Kinetic.Stage(canvas);
        console.log("onload");
        canvas.onmouseout = function(){
		
		    console.log("menikö onmouseouttiin");
            eventDisplay = "Mouseover me!";
            myStage.clearCanvas();
            myStage.drawStage();
			
			console.log("onmouseout");
        };
 
        myStage.setDrawStage(function(){
            var mousePos = myStage.getMousePos();
 
            if (mousePos != null) {
                eventDisplay = "Mouse position: " + mousePos.x +
                "," +
                mousePos.y;
				
				pos_x = mousePos.x; 
				pos_y = mousePos.y; 
            }
 
            drawEventDisplay();
			
			console.log("setDrawStage");
        });
 
        eventDisplay = "Mouseover me!";
        drawEventDisplay();
		console.log("loppu");
		*/

		drawEventDisplay();
		
		drawWorld(world, ctx);
		

		
		lisaannytaan++;
		
		if( lisaannytaan == 200 && boxCount < 20){
					//console.log("boxCount on");
					//console.log(boxCount);
					var xKoord;
					var yKoord = 100;
					
					
					if(leftSide == true){
					
					  xKoord = 100;
					  leftSide = false;
					
					}
					
					else{
					
					  xKoord = 700;
					  leftSide = true;
					
					}
					//console.log("uusi kissa");
					var box = createBox(world, xKoord, yKoord, 20, 20, false, 1);
			        
					var directionVec = box.GetLinearVelocity();
					
					directionVec.x = 40;
					directionVec.y = 20;
					
					var mass = 15;
					
					directionVec.Multiply(mass);
					box.WakeUp();
					box.SetLinearVelocity(directionVec);

					boxCount++;
					lisaannytaan = 0;
					//console.log("uusi boxi");
					//console.log(box.GetLinearVelocity());
				}
		
		cheeseLisays++;
        if( cheeseLisays == 50 && cheeseCount < 4){
		   
		   var cheeseX = Math.floor((700-4)*Math.random()) + 100;
		   var cheeseY = Math.floor((440-4)*Math.random()) + 40;
		   
		   
		   var box = createBox(world, cheeseX , cheeseY, 20, 15, true, 2);
		   cheeseCount++;
		   cheeseLisays == 0;
		
		}
		
		if( cheeseLisays > 50){
		 
		  cheeseLisays = 0;
		
		}
				
	   for( i = 0 ;removeArray.length > 0; i ){
				  
		    world.DestroyBody(removeArray[0]);
			//console.log("cheeseCount on");
			//console.log(cheeseCount);
			//console.log("poistettu");
			//console.log(removeArray.length);
			//console.log(i);
			removeArray.shift();
		    
			
			}
		

        if(enemyCollision){
		
		  enemyCollisionCounter++;
		  //console.log(enemyCollisionCounter);
		  if(enemyCollisionCounter >= 100){
		  
		    enemyCollisionCounter = 0;
            enemyCollision = false;
            //console.log("enemyCollision on false"); 
		  }
		
		}		
	    
		if(!gameOver){
		
		  //timeOut = setTimeout('step(' + (cnt || 0) + ')', 20);
		timeOut = setTimeout(step, 15);
		
		}
		else {
		 
		   clearTimeout( timeOut);
		   //console.log("game over");
		   end = true;
		   ending();
		   
		}
	
	    
	}
	

	
	// main entry point
	var startGame = function() {
	   
	   
	   //canvas = document.getElementById('mousecanvas');
	   ctx = canvas.getContext('2d');
	   //canvasElm = document.getElementById('mousecanvas');

	   //window.onkeydown = keydown;
	   end = false;
	   
	   
	   drawBackRound();
	  
	}
		
		
	var init = function (){	
		
		world = createWorld();
		
		end = false;
	   
		ctx.font = "17px Times New Roman";
		canvasWidth = parseInt(canvas.width);
		canvasHeight = parseInt(canvas.height);
		canvasTop = parseInt(canvas.style.top);
		canvasLeft = parseInt(canvas.style.left);
 
				createBox(world, 0, canvasHeight, 1 , canvasHeight, true, 0);
				createBox(world, canvasWidth, canvasHeight, 1 , canvasHeight, true, 0);
				createBox(world, 0, 0, canvasWidth , 1, true, 0);
				createBox(world, 0, canvasHeight, canvasWidth , 1, true, 0);
                
				
				
				mouse = createBox(world, 400, 250, 20, 20, true, 3);
				
				var box = createBox(world, 100, 100, 20, 20, false, 1);
				boxCount++;
				var directionVec = box.GetLinearVelocity();
				    //console.log(box.GetLinearVelocity());
					directionVec.x = 40;
					directionVec.y = 40;
					
					var mass = 15;
					
					directionVec.Multiply(mass);
					
					box.WakeUp();
					box.SetLinearVelocity(directionVec);
                    //console.log(box.GetLinearVelocity());
				    
					
					var box = createBox(world, 400, 300, 20, 20, true, 2);
		            cheeseCount++;
					
					
					
		//window.onkeydown = keydown;
				//ball.SetLinearVelocity(400);
				
		//Event.observe('canvas', 'click', function(e) {
				
				
		//});
        
        //hiiridemon hiiren liikutus		
		//canvas.onmousemove = follow;
		
		
		step();
	}  
	
	//Hiiridemon hiiren liikutus
	/*var mouseX = function (evt) {
	if (!evt) evt = window.event; 
	if (evt.pageX) 
	return evt.pageX; 
	else if (evt.clientX)
	return evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft); 
	else return 0;
	}*/

/*var mouseY = function (evt) {
	if (!evt) evt = window.event; 
	if (evt.pageY) return evt.pageY; 
	else if (evt.clientY)
	return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop); 
	else return 0;
	}*/

/*var follow = function (evt) {
	pos_x = (parseInt(mouseX(evt)));
	pos_y = (parseInt(mouseY(evt)));
	}
	*/



	this.GetCanvas = function(){
		return canvas;
	}
	
	this.GetState = function(){
		var state = {};
		
		return state;
	}
	
	this.SetState = function(state){
	
	}
	
	
	var LoadScript = function(javascriptSrc, index){
		console.log("loading script " + javascriptSrc[index]);
		$j = jQuery.noConflict();
		$j.getScript(javascriptSrc[index], function(){
			console.log("loaded");
			--unloadedScripts;
			++index;
			if (unloadedScripts != 0 ){
				LoadScript(javascriptSrc, index);
			}
			else{
				scriptsDone();
			}
		});
		
	}
	
	
	
	this.ResourcePath = 'Resources/Mouse/';
  
  this.ResourceHandlers = {
		pictures: function(resources){
      for ( var i in resources ){
        pictureSrc.push(resources[i]);
      }
		
	
		},
		javascripts: function(resources){
			var index = 0;
			LoadScript(resources, index);
	}

	
	}
	
		this.Resources = {
		
		 pictures: ['pictures/cheese-871.gif', 'pictures/lemmling_Simple_cartoon_mouse[1].png', 'pictures/black_cat.png', 
		            'pictures/heart.png', 'pictures/work.png', 'pictures/iphone.png', 
					'pictures/elop.png', 'pictures/cash.png', 'pictures/nokia.png', 'pictures/YouFail.png', 
					'pictures/cartoon_mouse_on_top_of_a_cheese.png'],
		 
		 
		 //Laita näille oma funktio lataamiseen resourcehandlerssiin, kopsaa minigolffista!
		 javascripts: [ 'javascripts/prototype-1.6.0.2.js', 'javascripts/b2Settings.js', 'javascripts/b2Vec2.js',
		               'javascripts/b2Mat22.js', 'javascripts/b2Math.js', 
					   'javascripts/b2AABB.js','javascripts/b2Bound.js',
                       'javascripts/b2BoundValues.js', 'javascripts/b2Pair.js', 
					   'javascripts/b2PairCallback.js', 'javascripts/b2BufferedPair.js', 
					   'javascripts/b2PairManager.js', 'javascripts/b2BroadPhase.js', 
					   'javascripts/b2Collision.js', 'javascripts/Features.js', 
                       'javascripts/b2ContactID.js', 'javascripts/b2ContactPoint.js', 
					   'javascripts/b2Distance.js', 'javascripts/b2Manifold.js', 
					   'javascripts/b2OBB.js', 'javascripts/b2Proxy.js', 
					   'javascripts/ClipVertex.js', 'javascripts/b2Shape.js',
					   'javascripts/b2ShapeDef.js', 'javascripts/b2BoxDef.js', 
					   'javascripts/b2CircleDef.js', 'javascripts/b2CircleShape.js', 
					   'javascripts/b2MassData.js', 'javascripts/b2PolyDef.js', 
					   'javascripts/b2PolyShape.js', 'javascripts/b2Body.js', 
					   'javascripts/b2BodyDef.js', 'javascripts/b2CollisionFilter.js',
                       'javascripts/b2Island.js', 'javascripts/b2TimeStep.js',
                       'javascripts/b2ContactNode.js', 'javascripts/b2Contact.js',
                       'javascripts/b2ContactConstraint.js', 'javascripts/b2ContactConstraintPoint.js', 
					   'javascripts/b2ContactRegister.js', 'javascripts/b2ContactSolver.js',
                       'javascripts/b2CircleContact.js', 'javascripts/b2Conservative.js',
					   'javascripts/b2NullContact.js', 'javascripts/b2PolyAndCircleContact.js',
                       'javascripts/b2PolyContact.js', 'javascripts/b2ContactManager.js',
                       'javascripts/b2World.js', 'javascripts/b2WorldListener.js',
                       'javascripts/b2JointNode.js', 'javascripts/b2Joint.js',
                       'javascripts/b2JointDef.js', 'javascripts/b2DistanceJoint.js',
                       'javascripts/b2DistanceJointDef.js', 'javascripts/b2Jacobian.js',
                       'javascripts/b2GearJoint.js', 'javascripts/b2GearJointDef.js',
					   'javascripts/b2MouseJoint.js', 'javascripts/b2MouseJointDef.js',
                       'javascripts/b2PrismaticJoint.js', 'javascripts/b2PrismaticJointDef.js',
                       'javascripts/b2PulleyJoint.js', 'javascripts/b2PulleyJointDef.js',
                       'javascripts/b2RevoluteJoint.js','javascripts/b2RevoluteJointDef.js'
                        ]

};
   var unloadedResources = {pictures: true, javascripts: true};
   var unloadedScripts = 64;
  
  this.ResourcesLoaded = function(resource){
    
		unloadedResources[resource] = false;
    var AllResourcesLoaded = true;
    for (var i in unloadedResources){
      if (unloadedResources[i] == true){
        AllResourcesLoaded = false;
      }
    }
    if (AllResourcesLoaded == true){
        ready.resources = true;
		initgame();
    }
	}



		//kun kaikki resurssit ladattu
		//app.init();
	
	



    var ready = { resources: false, scripts: false};
	var that = this;
	var initgame = function(){
		if ( ready.resources == true && ready.scripts == true ){
		
		    //sleep(10000);
			console.log("slept");
			initPictures();
			startGame();
			console.log("start game");
			if ( LivelyApp ){
				LivelyApp.StartApp();
			}
			else{
				console.log('could not start livelyapp');
			}
		}
	}






var scriptsDone = function(){
		ready.scripts = true;
		initgame();
	}

var LivelyApp;
	this.SetLivelyApp = function(app){
	LivelyApp = app;
	}	
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}

var sleep = function (ms)
	{
		var dt = new Date();
		dt.setTime(dt.getTime() + ms);
		while (new Date().getTime() < dt.getTime());
	}

}


//Init funktio
var MouseInit = function(MouseGame){
	Lively3D.UI.ShowMessage("This application overwrites jQuery, since the physics-library loads prototype-library. This breaks the Lively3D, so please refresh the browser after testing.");
		
	var mouse = new MouseGame();
	Lively3D.LoadResources(mouse);

								
	
	mouse.EventListeners = {"keydown": mouse.keydown, "mousemove": mouse.updateMousePosition };
	return mouse;
}



Lively3D.AddApplication("Mouse", MouseGame, MouseInit);
