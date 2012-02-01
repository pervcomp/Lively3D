//Shader tests by Anna-Liisa Mattila

//WebGL code based on Learning webGL -tutorial
//http://learningwebgl.com/blog/

//Shaders based on flower shader on shaderToy
//http://www.iquilezles.org/apps/shadertoy/
var SpiralDemo = function(){
  var spiralProgram;

  var timeNow = 0;
  var elapsed = 0;
  var startTime;// = new Date().getTime();

  var cubeVertexPositionBuffer;
  var cubeVertexIndexBuffer;
  var mvMatrix; //= mat4.create();
  var mvMatrixStack = [];
  var pMatrix; //= mat4.create();
  
  var canvas = document.createElement("canvas");
  canvas.id = "shadertest";
  canvas.width = 512.0;
  canvas.height = 512.0;
  var resolution = [canvas.width, canvas.height];

  var initGL = function(canvas){
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }
  }

  var initBuffers = function(){
    //CUBE
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
      // Front face
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0,
       1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 4;
    
    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [0, 1, 2,      0, 2, 3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 6;
  }

  var getShader = function(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
  }

  var initShaders = function() {
    var fragmentShader = getShader(gl, "fragment-spiral");
    var vertexShader = getShader(gl, "shader-vs");
    
    spiralProgram = gl.createProgram();
    gl.attachShader(spiralProgram, vertexShader);
    gl.attachShader(spiralProgram, fragmentShader);
    gl.linkProgram(spiralProgram);
    
    if (!gl.getProgramParameter(spiralProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    
    gl.useProgram(spiralProgram);
    
    spiralProgram.vertexPositionAttribute = gl.getAttribLocation(spiralProgram, "aVertexPosition");
    gl.enableVertexAttribArray(spiralProgram.vertexPositionAttribute);
    
    spiralProgram.pMatrixUniform = gl.getUniformLocation(spiralProgram, "uPMatrix");
    spiralProgram.mvMatrixUniform = gl.getUniformLocation(spiralProgram, "uMVMatrix");
    
    spiralProgram.timeFrag = gl.getUniformLocation(spiralProgram, "timeFrag");
    spiralProgram.resolution = gl.getUniformLocation(spiralProgram, "resolution");
  }

  var uniforms = function(reso){  
    gl.uniformMatrix4fv(spiralProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(spiralProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniform2fv(gl.getUniformLocation(spiralProgram, "resolution"), reso);
    gl.uniform1f(gl.getUniformLocation(spiralProgram, "timeFrag"), (elapsed/1000.0));
  }

  var mvPushMatrix = function() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
  }

  var mvPopMatrix = function() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
  }

  var animate = function(){
    timeNow = new Date().getTime();
    elapsed = timeNow-startTime;
  }

  var tick = function(){
    requestAnimFrame(tick);
    animate();
    drawScene();
  }

  var drawScene = function(){
    //Size
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    //Clear scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //Perspective, frontface and backface
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    
    //seting identity
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -1.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(spiralProgram.vertexPositionAttribute,
      cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    
    uniforms(resolution);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)

  }

  this.webGLStart = function(){
	mvMatrix = mat4.create();
    pMatrix = mat4.create();
    
    initGL(canvas);
    initShaders();
    initBuffers();
    
    //Setting color buffer bit and depth buffer bit
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    startTime = new Date().getTime();
    tick();
  }

  
  //Lively3D API functions
  this.GetCanvas = function(){
    return canvas;
  }
  
  this.ResourceHandlers = {
    scripts: function(resources){
			var index = 0;
			LoadScript(resources, index);
		},
    shaders: function(resources){
    
			var fragment = document.createElement('script');
			fragment.type = "x-shader/x-fragment"
			fragment.id = "fragment-spiral";
			
			$.get(resources[0], function(data){
				fragment.innerHTML = data;
				document.head.appendChild(fragment);
			});
			
			
			var vertex = document.createElement('script');
			vertex.type = "x-shader/x-vertex"
			vertex.id = "shader-vs";
			
			$.get(resources[1], function(data){
				vertex.innerHTML = data;
				document.head.appendChild(vertex);
			});
			
		}
  };
  
  var LoadScript = function(scripts, index){
		console.log("loading script " + scripts[index]);
		$.getScript(scripts[index], function(){
			--unloadedScripts;
			++index;
			if (unloadedScripts != 0 ){
				LoadScript(scripts, index);
			}
			else{
				scriptsDone();
			}
		});
		
	}
  
  this.Resources = {
		scripts: ['scripts/glMatrix-0.9.5.min.js', 'scripts/webgl-utils.js'],
    
		shaders: [ 'shaders/spiral.shader', 'shaders/vs.shader']
	}
  
  this.ResourcePath = 'Resources/SpiralDemo/';
  
  var unloadedResources = {scripts: true, shaders: true};
	var unloadedScripts = 2;
	
	this.ResourcesLoaded = function(resource){
		console.log('Resource ' + resource +' Loaded');
		unloadedResources[resource] = false;
		var AllResourcesLoaded = true;
		for ( var i in unloadedResources ){
			if (unloadedResources[i] == true){
				AllResourcesLoaded = false;
			}
		}
		if ( AllResourcesLoaded == true ){
			resourcesDone();
		}
	}
  
  var ready = { resources: false, scripts: false};
	var that = this;
	var init = function(){
		if ( ready.resources == true && ready.scripts == true ){
			that.webGLStart();
			if ( LivelyApp ){
				LivelyApp.StartApp();
			}
			else{
				console.log('could not start livelyapp');
			}
		}
	}
  
  var resourcesDone = function(){
		ready.resources = true;
		init();
	}
	
	var scriptsDone = function(){
		ready.scripts = true;
		init();
	}
	
	var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
}

var spiralDemoInit = function(SpiralDemo){
	var spiral = new SpiralDemo();
	
	Lively3D.LoadResources(spiral);
	
	return spiral;
}
Lively3D.AddApplication('SpiralDemo', SpiralDemo, spiralDemoInit);




