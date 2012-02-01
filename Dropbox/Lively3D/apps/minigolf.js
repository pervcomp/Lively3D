var golf = function(){
	var canvas = document.createElement("canvas");
	canvas.setAttribute("style", "display:none");
	canvas.id = "3d_canvas";
	canvas.width = 512;
	canvas.height = 512;
		
	//document.body.appendChild(canvas);
		
	
	  var gl;
	  function initGL(canvas) {
		try {
		  gl = canvas.getContext("experimental-webgl");
		  gl.viewportWidth = canvas.width;
		  gl.viewportHeight = canvas.height;
		} catch(e) {
		}
		if (!gl) {
		  alert("Could not initialise WebGL, sorry :-(");
		}
	  }
	 
	 
	  function getShader(gl, id) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) {
		  return null;
		}
		
		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
		  if (k.nodeType === 3) {
			str += k.textContent;
		  }
		  k = k.nextSibling;
		}
	 
		var shader;
		if (id == "per-fragment-lighting-fs") {
		  shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (id == "per-fragment-lighting-vs") {
		  shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
		  alert("huuhaa");
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
	 
	 
	  var shaderProgram;
	  function initShaders() {
		var fragmentShader = getShader(gl, "per-fragment-lighting-fs");
		var vertexShader = getShader(gl, "per-fragment-lighting-vs");
	 
		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
	 
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		  alert("Could not initialise shaders");
		}
	 
		gl.useProgram(shaderProgram);
	 
		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	 
		shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	 
		shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
		gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	 
		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
		shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
		shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
		shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(shaderProgram, "uShowSpecularHighlights");
		shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures");
		shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
		shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
		shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
		shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
		shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
	  }
	 
	 
	  function handleLoadedTexture(texture) {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	 
		gl.bindTexture(gl.TEXTURE_2D, null);
	  }
	 
	 
	  var earthTexture;
	  var galvanizedTexture;
	  var grassTexture;
	  var woodTexture;
	  var grassHoleTexture;
	  var golfTexture;
	  var goldenTexture;
	  var blueMetalTexture;
	  var mikkoTexture;
	  var targetTexture;
	  
	  var textures = []
	  function initTextures() {
		earthTexture = gl.createTexture();
		earthTexture.image = new Image();
		earthTexture.image.onload = function() {
		  handleLoadedTexture(earthTexture);
		}
		earthTexture.image.crossOrigin = '';
		//earthTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/earth.jpg";
		earthTexture.image.src = textures[10];
	 
		galvanizedTexture = gl.createTexture();
		galvanizedTexture.image = new Image();
		galvanizedTexture.image.onload = function() {
		  handleLoadedTexture(galvanizedTexture);
		}
		galvanizedTexture.image.crossOrigin = '';
		//galvanizedTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/arroway.de_metal+structure+06_d100_flat.jpg";
		galvanizedTexture.image.src = textures[11];
		
		
		grassTexture = gl.createTexture();
		grassTexture.image = new Image();
		grassTexture.image.onload = function() {
		  handleLoadedTexture(grassTexture);
		}
		grassTexture.image.crossOrigin = '';
		//grassTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/grass01.jpg";
		grassTexture.image.src = textures[0];
		
		
		woodTexture = gl.createTexture();
		woodTexture.image = new Image();
		woodTexture.image.onload = function() {
		  handleLoadedTexture(woodTexture);
		}
		woodTexture.image.crossOrigin = '';
		//woodTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/wood01.jpg";
		woodTexture.image.src = textures[1];
		
		grassHoleTexture = gl.createTexture();
		grassHoleTexture.image = new Image();
		grassHoleTexture.image.onload = function() {
		  handleLoadedTexture(grassHoleTexture);
		}
		grassHoleTexture.image.crossOrigin = '';
		//grassHoleTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/grasshole.jpg";
		grassHoleTexture.image.src = textures[2];
		
		
		golfTexture = gl.createTexture();
		golfTexture.image = new Image();
		golfTexture.image.onload = function() {
		  handleLoadedTexture(golfTexture);
		}
		golfTexture.image.crossOrigin = '';
		//golfTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/golfball.jpg";
		golfTexture.image.src = textures[3];
		
		
		goldenTexture = gl.createTexture();
		goldenTexture.image = new Image();
		goldenTexture.image.onload = function() {
		  handleLoadedTexture(goldenTexture);
		}
		goldenTexture.image.crossOrigin = '';
		//goldenTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/golden.jpg";
		goldenTexture.image.src = textures[4];
		
		
		blueMetalTexture = gl.createTexture();
		blueMetalTexture.image = new Image();
		blueMetalTexture.image.onload = function() {
		  handleLoadedTexture(blueMetalTexture);
		}
		blueMetalTexture.image.crossOrigin = '';
		//blueMetalTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/bluemetal.jpg";
		blueMetalTexture.image.src = textures[5];
		
		
		tutTexture = gl.createTexture();
		tutTexture.image = new Image();
		tutTexture.image.onload = function() {
		  handleLoadedTexture(tutTexture);
		}
		tutTexture.image.crossOrigin = '';
		//tutTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/tut.jpg";
		tutTexture.image.src = textures[6];
		
		
		metalTexture = gl.createTexture();
		metalTexture.image = new Image();
		metalTexture.image.onload = function() {
		  handleLoadedTexture(metalTexture);
		}
		metalTexture.image.crossOrigin = '';
		//metalTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/metal.jpg";
		metalTexture.image.src = textures[7];
		
		
		mikkoTexture = gl.createTexture();
		mikkoTexture.image = new Image();
		mikkoTexture.image.onload = function() {
		  handleLoadedTexture(mikkoTexture);
		}
		mikkoTexture.image.crossOrigin = '';
		//mikkoTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/mikko.jpg";
		mikkoTexture.image.src = textures[8];
		
		
		targetTexture = gl.createTexture();
		targetTexture.image = new Image();
		targetTexture.image.onload = function() {
		  handleLoadedTexture(targetTexture);
		}
		targetTexture.image.crossOrigin = '';
		//targetTexture.image.src = "http://www.eucfutsal2011.com/webgl/minigolf/textures/target.jpg";
		targetTexture.image.src = textures[9];
	  }
	  
	  var arrowVertexNormalBuffer;
	  var arrowVertexTextureCoordBuffer;
	  var arrowVertexIndexBuffer;
	  var squareVertexPositionBuffer;
	  var cubeVertexPositionBuffer;
	  var cubeVertexNormalBuffer;
	  var cubeVertexTextureCoordBuffer;
	  var cubeVertexIndexBuffer;
	  var sphereVertexPositionBuffer;
	  var sphereVertexNormalBuffer;
	  var sphereVertexTextureCoordBuffer;
	  var sphereVertexIndexBuffer;
	  function initBuffers() {
		arrowVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, arrowVertexPositionBuffer);
		vertices = [
		  // Front face
		  -0.1, -0.1,  0.0,
		   0.1, -0.1,  0.0,
		   0.1,  0.1,  0.0,
		  -0.1,  0.1,  0.0,
	 
		  // Back face
		  -0.1, -0.1, -4.0,
		  -0.1,  0.1, -4.0,
		   0.1,  0.1, -4.0,
		   0.1, -0.1, -4.0,
	 
		  // Top face
		  -0.1,  0.1, -4.0,
		  -0.1,  0.1,  0.0,
		   0.1,  0.1,  0.0,
		   0.1,  0.1, -4.0,
	 
		  // Bottom face
		  -0.1, -0.1, -4.0,
		   0.1, -0.1, -4.0,
		   0.1, -0.1,  0.0,
		  -0.1, -0.1,  0.0,
	 
		  // Right face
		   0.1, -0.1, -4.0,
		   0.1,  0.1, -4.0,
		   0.1,  0.1,  0.0,
		   0.1, -0.1,  0.0,
	 
		  // Left face
		  -0.1, -0.1, -4.0,
		  -0.1, -0.1,  0.0,
		  -0.1,  0.1,  0.0,
		  -0.1,  0.1, -4.0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		arrowVertexPositionBuffer.itemSize = 3;
		arrowVertexPositionBuffer.numItems = 24;
	 
		arrowVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, arrowVertexNormalBuffer);
		var vertexNormals = [
		  // Front face
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
	 
		  // Back face
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
	 
		  // Top face
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
	 
		  // Bottom face
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
	 
		  // Right face
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
	 
		  // Left face
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
		arrowVertexNormalBuffer.itemSize = 3;
		arrowVertexNormalBuffer.numItems = 24;
	 
		arrowVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, arrowVertexTextureCoordBuffer);
		var textureCoords = [
		  // Front face
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
	 
		  // Back face
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,
	 
		  // Top face
		  0.0, 1.0,
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
	 
		  // Bottom face
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,
		  1.0, 0.0,
	 
		  // Right face
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,
	 
		  // Left face
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		arrowVertexTextureCoordBuffer.itemSize = 2;
		arrowVertexTextureCoordBuffer.numItems = 24;
	 
		arrowVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, arrowVertexIndexBuffer);
		var arrowVertexIndices = [
		  0, 1, 2,      0, 2, 3,    // Front face
		  4, 5, 6,      4, 6, 7,    // Back face
		  8, 9, 10,     8, 10, 11,  // Top face
		  12, 13, 14,   12, 14, 15, // Bottom face
		  16, 17, 18,   16, 18, 19, // Right face
		  20, 21, 22,   20, 22, 23  // Left face
		];
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrowVertexIndices), gl.STATIC_DRAW);
		arrowVertexIndexBuffer.itemSize = 1;
		arrowVertexIndexBuffer.numItems = 36;
	  
	  
	  
	  
		squareVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
		vertices = [
			 2.0,  1.0,  0.0,
			-2.0,  1.0,  0.0,
			 2.0, -1.0,  0.0,
			-2.0, -1.0,  0.0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		squareVertexPositionBuffer.itemSize = 3;
		squareVertexPositionBuffer.numItems = 4;
		
		
	  
		cubeVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
		vertices = [
		  // Front face
		  -0.5, -0.5,  0.5,
		   0.5, -0.5,  0.5,
		   0.5,  0.5,  0.5,
		  -0.5,  0.5,  0.5,
	 
		  // Back face
		  -0.5, -0.5, -0.5,
		  -0.5,  0.5, -0.5,
		   0.5,  0.5, -0.5,
		   0.5, -0.5, -0.5,
	 
		  // Top face
		  -0.5,  0.5, -0.5,
		  -0.5,  0.5,  0.5,
		   0.5,  0.5,  0.5,
		   0.5,  0.5, -0.5,
	 
		  // Bottom face
		  -0.5, -0.5, -0.5,
		   0.5, -0.5, -0.5,
		   0.5, -0.5,  0.5,
		  -0.5, -0.5,  0.5,
	 
		  // Right face
		   0.5, -0.5, -0.5,
		   0.5,  0.5, -0.5,
		   0.5,  0.5,  0.5,
		   0.5, -0.5,  0.5,
	 
		  // Left face
		  -0.5, -0.5, -0.5,
		  -0.5, -0.5,  0.5,
		  -0.5,  0.5,  0.5,
		  -0.5,  0.5, -0.5
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		cubeVertexPositionBuffer.itemSize = 3;
		cubeVertexPositionBuffer.numItems = 24;
	 
		cubeVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
		vertexNormals = [
		  // Front face
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
	 
		  // Back face
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
	 
		  // Top face
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
	 
		  // Bottom face
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
	 
		  // Right face
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
	 
		  // Left face
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
		cubeVertexNormalBuffer.itemSize = 3;
		cubeVertexNormalBuffer.numItems = 24;
	 
		cubeVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
		textureCoords = [
		  // Front face
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
	 
		  // Back face
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,
	 
		  // Top face
		  0.0, 1.0,
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
	 
		  // Bottom face
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,
		  1.0, 0.0,
	 
		  // Right face
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,
	 
		  // Left face
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		cubeVertexTextureCoordBuffer.itemSize = 2;
		cubeVertexTextureCoordBuffer.numItems = 24;
	 
		cubeVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
		var cubeVertexIndices = [
		  0, 1, 2,      0, 2, 3,    // Front face
		  4, 5, 6,      4, 6, 7,    // Back face
		  8, 9, 10,     8, 10, 11,  // Top face
		  12, 13, 14,   12, 14, 15, // Bottom face
		  16, 17, 18,   16, 18, 19, // Right face
		  20, 21, 22,   20, 22, 23  // Left face
		];
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
		cubeVertexIndexBuffer.itemSize = 1;
		cubeVertexIndexBuffer.numItems = 36;
	 
	 
		var latitudeBands = 30;
		var longitudeBands = 30;
		var radius = 0.5;
	 
		var vertexPositionData = [];
		var normalData = [];
		var textureCoordData = [];
		for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
		  var theta = latNumber * Math.PI / latitudeBands;
		  var sinTheta = Math.sin(theta);
		  var cosTheta = Math.cos(theta);
	 
		  for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);
	 
			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1 - (longNumber / longitudeBands);
			var v = 1 - (latNumber / latitudeBands);
	 
			normalData.push(x);
			normalData.push(y);
			normalData.push(z);
			textureCoordData.push(u);
			textureCoordData.push(v);
			vertexPositionData.push(radius * x);
			vertexPositionData.push(radius * y);
			vertexPositionData.push(radius * z);
		  }
		}
	 
		var indexData = [];
		for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
		  for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			indexData.push(first);
			indexData.push(second);
			indexData.push(first + 1);
	 
			indexData.push(second);
			indexData.push(second + 1);
			indexData.push(first + 1);
		  }
		}
	 
		sphereVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
		sphereVertexNormalBuffer.itemSize = 3;
		sphereVertexNormalBuffer.numItems = normalData.length / 3;
	 
		sphereVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
		sphereVertexTextureCoordBuffer.itemSize = 2;
		sphereVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;
	 
		sphereVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
		sphereVertexPositionBuffer.itemSize = 3;
		sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;
	 
		sphereVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STREAM_DRAW);
		sphereVertexIndexBuffer.itemSize = 1;
		sphereVertexIndexBuffer.numItems = indexData.length;
	  }
	 
	 
	  var mvMatrix;
	  var mvMatrixStack = [];
	 
	  function mvPushMatrix(m) {
		if (m) {
		  mvMatrixStack.push(m.dup());
		  mvMatrix = m.dup();
		} else {
		  mvMatrixStack.push(mvMatrix.dup());
		}
	  }
	 
	  function mvPopMatrix() {
		if (mvMatrixStack.length == 0) {
		  throw "Invalid popMatrix!";
		}
		mvMatrix = mvMatrixStack.pop();
		return mvMatrix;
	  }
	 
	  function loadIdentity() {
		mvMatrix = Matrix.I(4);
	  }
	 
	 
	  function multMatrix(m) {
		mvMatrix = mvMatrix.x(m);
	  }
	  
	  function mvScale(x, y, z) {
		var m = Matrix.I(4);
		m.elements[0][0] = x;
		m.elements[1][1] = y;
		m.elements[2][2] = z;
		multMatrix(m);
	  }
	 
	 
	  function mvTranslate(v) {
		var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
		multMatrix(m);
	  }
	 
	 
	  function createRotationMatrix(angle, v) {
		var arad = angle * Math.PI / 180.0;
		return Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
	  }
	 
	 
	  function mvRotate(angle, v) {
		multMatrix(createRotationMatrix(angle, v));
	  }
	 
	 
	  var pMatrix;
	  function perspective(fovy, aspect, znear, zfar) {
		pMatrix = makePerspective(fovy, aspect, znear, zfar);
	  }
	 
	 
	  function setMatrixUniforms() {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(pMatrix.flatten()));
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(mvMatrix.flatten()));
	 
		var normalMatrix = mvMatrix.inverse();
		normalMatrix = normalMatrix.transpose();
		gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, new Float32Array(normalMatrix.flatten()));
	  }
	  
	  var currentlyPressedKeys = Object();

	  this.handleKeyDown = function(event) {
		currentlyPressedKeys[event.keyCode] = true;
	  }

	  this.handleKeyUp = function(event) {
		currentlyPressedKeys[event.keyCode] = false;
		
		if (canvasHasFocus === true) {
		  if (event.keyCode === 32) {
			// Space bar
			if (stroking) {
			  // Stroke the ball.
			  stroking = false;
			  
			  // Save the current ball position.
			  ball.lastPosition = new jigLib.Vector3D(ball.get_x(), ball.get_y(), ball.get_z());
			  
			  // Convert the angle to radians.
			  var radAngle = strokeAngle * Math.PI / 180;
			  
			  var strokeX = Math.sin(radAngle) * strokePower * -0.4;
			  var strokeY = Math.cos(radAngle) * strokePower * -0.4;
			  
			  ball.setActive();
			  ball.setVelocity(new jigLib.Vector3D(strokeX,0,strokeY));
			  physicsSystem.integrate(0.001);
			  strokePower = 0;
			}
		  }
		}
	  }

	  var pitch = 0;
	  var pitchRate = 0;

	  var yaw = 0;
	  var yawRate = 0;

	  var zoom = 0;
	  
	  var newStroke = true;
	  var stroking = false;
	  var strokeAngle = 0;
	  var strokePower = 0;
	  
	  var canvasHasFocus = true;
	  var courseComplete = false;
	  
	  function getCanvasFocus() {
		canvasHasFocus = true;
	  }
	  
	  function loseCanvasFocus() {
		canvasHasFocus = false;
	  }

	  var holes = [];
	  function handleKeys() {
		if (canvasHasFocus === false)
		{
		  pitchRate = 0;
		  yawRate = 0;
		  return;
		}
		if (currentlyPressedKeys[37]) {
		  // Left Arrow
		  strokeAngle += 1;
		} else if (currentlyPressedKeys[39]) {
		  // Right Arrow
		  strokeAngle -= 1;
		} else if (currentlyPressedKeys[38]) {
		  // Up Arrow
		  zoom += 2;
		} else if (currentlyPressedKeys[40]) {
		  // Down Arrow
		  zoom -= 2;
		} else if (currentlyPressedKeys[32]) {
		  // Space bar
		  if (stroking) {
			if (strokePower < 100) {
			  strokePower += 2;
			}

		  } else if (newStroke && !holeComplete) {
			stroking = true;
			newStroke = false;
			strokePower = 4;
		  }
		} else if (currentlyPressedKeys[13]) {
		  // Enter
		  if (nextHole) {
			nextHole = false;
			strokesUsed = 1;
			holeComplete = false;
			stroking = false;
			pitch = 0;
			yaw = 0;
			zoom = 0;
			strokeAngle = 0;
			holeObjects = [];
			physicsSystem.removeAllBodys();

			ball = null;
			if (currentHole === 1) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_02.txt");
			  loadHole(holes[4]);
			} /*else if (currentHole === 2) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_03.txt");
			  loadHole(holes[2]);
			} else if (currentHole === 3) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_04.txt");
			  loadHole(holes[3]);
			} else if (currentHole === 4) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_05.txt");
			  loadHole(holes[4]);
			  
			} else if (currentHole === 5) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_06.txt");
			  loadHole(holes[5]);
			} else if (currentHole === 6) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_07.txt");
			  loadHole(holes[6]);
			} else if (currentHole === 7) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_08.txt");
			  loadHole(holes[7]);
			} else if (currentHole === 8) {
			  //loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_09.txt");
			  loadHole(holes[8]);
			} else if (currentHole === 9) {
			  // Game over.
			  if (totalScore > 26)
			  {

			  } else {

			  }
			  
			  courseComplete = true;
			} */else if (currentHole === 2) {
			  courseComplete = true;
			  Lively3D.UI.ShowMessage("You finished the game with " + totalScore + " strokes!");
			}
			currentHole += 1;
		  }
		} else if (currentlyPressedKeys[78]) {
		  // N
		  if (courseComplete) {
			courseComplete = false;
			currentHole = 1;
			holeScores = [];
			totalScore = 0;
			//loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_01.txt");
			loadHole(holes[0]);
		  }
		} else if (currentlyPressedKeys[66]) {
		  // B
		  if (courseComplete && currentHole === 10)
		  {
			courseComplete = false;
			//loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/hidden.txt");
			loadHole(holes[9]);
		  }
		}
		/*else if (currentlyPressedKeys[87]) {
		  // W
				
		  ball.setActive();
		  ball.setVelocity(new jigLib.Vector3D(0,0,-10));
		} else if (currentlyPressedKeys[83]) {
		  // S
		  
		  ball.setActive();
		  ball.setVelocity(new jigLib.Vector3D(0,0,10));
		} else if (currentlyPressedKeys[65]) {
		  // A
		  
		  ball.setActive();
		  ball.setVelocity(new jigLib.Vector3D(-10,0,0));
		} else if (currentlyPressedKeys[68]) {
		  // D
		  
		  ball.setActive();
		  ball.setVelocity(new jigLib.Vector3D(10,0,0));
		}*/

	  }
	  
	  var mouseDown = false;
	  var lastMouseX = null;
	  var lastMouseY = null;
	 
	  var cameraRotationMatrix = "foo";
		
		this.initMatrix = function(){
			cameraRotationMatrix = Matrix.I(4);
		}
	  this.handleMouseDown = function(event) {
		mouseDown = true;
		lastMouseX = event.coord[0];
		lastMouseY = event.coord[1];
		//lastMouseX = event.clientX;
		//lastMouseY = event.clientY;
	  }
	 
	  this.handleMouseUp = function(event) {
		mouseDown = false;
	  }
	 
	  var yaw = 0;
	  var pitch = 0;
	  this.handleMouseMove = function(event) {
		if (!mouseDown) {
		  return;
		}
		
		newX = event.coord[0];
		newY = event.coord[1];
		
		//var newX = event.clientX;
		//var newY = event.clientY;
		
		yaw += (newX - lastMouseX) * 0.5;
		pitch += (newY - lastMouseY) * 0.5;
	 
		lastMouseX = newX;
		lastMouseY = newY;
	  }
	  
	  this.handleMouseWheel = function(event) {
		if (!canvasHasFocus) {
		  return;
		}
		
		if (event.wheelDelta) {
		  zoom += event.wheelDelta/40;
		} else if (event.detail) { /** Mozilla case. */
		  zoom += -event.detail;
		}
	  }
	  
	  function drawArrow(texture) {
		gl.bindBuffer(gl.ARRAY_BUFFER, arrowVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, arrowVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, arrowVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, arrowVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, arrowVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, arrowVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, arrowVertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, arrowVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	  }
	  
	  function drawCube(textureString) {
		var texture;
		if (textureString === "grassTexture") {
		   texture = grassTexture;
		} else if (textureString === "woodTexture") {
		   texture = woodTexture;
		} else if (textureString === "goldenTexture") {
		   texture = goldenTexture;
		} else if (textureString === "grassHoleTexture") {
		   texture = grassHoleTexture;
		} else if (textureString === "blueMetalTexture") {
		   texture = blueMetalTexture;
		} else if (textureString === "tutTexture") {
		   texture = tutTexture;
		} else if (textureString === "mikkoTexture") {
		   texture = mikkoTexture;
		} else if (textureString === "targetTexture") {
		   texture = targetTexture;
		}
	  
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.uniform1f(shaderProgram.materialShininessUniform, 32.0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	  }
	  
	  function drawSphere(texture) {
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	  }
	  
	  function drawTeapot(texture) {
		gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	 
		gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	  }
	 
	  function drawScene() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	 
		perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);
	 
		var specularHighlights = true;
		gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, specularHighlights);
	 
		var lighting = true;
		gl.uniform1i(shaderProgram.useLightingUniform, lighting);
		if (lighting) {
		  gl.uniform3f(shaderProgram.ambientColorUniform, 0.5, 0.5, 0.5); 
		  gl.uniform3f(shaderProgram.pointLightingLocationUniform, 0.0, 10.0, -20.0);
		  gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);
		  gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
		}
	 
		var texture = grassTexture;
		gl.uniform1i(shaderProgram.useTexturesUniform, texture != "none");
	 
		loadIdentity();
		mvTranslate([0, 0, zoom]);
		mvTranslate([0, 0, -50]);
		mvRotate(20, [1, 0, 0]);
		mvRotate(pitch, [1, 0, 0]);
		mvRotate(yaw, [0, 1, 0]);

		mvPushMatrix();
		
		// Draw physic objects.
		for (var i = 0; i < holeObjects.length; i += 1) {
		  if (holeObjects[i].data.type === "box") {
			mvTranslate([holeObjects[i].jig.get_currentState().position.x, holeObjects[i].jig.get_currentState().position.y, holeObjects[i].jig.get_currentState().position.z]);
			mvRotate(holeObjects[i].jig.get_rotationX(), [1, 0, 0]);
			mvRotate(holeObjects[i].jig.get_rotationY(), [0, 1, 0]);
			mvRotate(holeObjects[i].jig.get_rotationZ(), [0, 0, 1]);
		  
			mvScale(parseFloat(holeObjects[i].data.width), parseFloat(holeObjects[i].data.height), parseFloat(holeObjects[i].data.depth));
		  } else if (holeObjects[i].data.type === "plane" || holeObjects[i].data.type === "teapot") {
			mvTranslate([parseFloat(holeObjects[i].data.xCoord), parseFloat(holeObjects[i].data.zCoord), parseFloat(holeObjects[i].data.yCoord)]);
			mvRotate(parseFloat(holeObjects[i].data.xRot), [1, 0, 0]);
			mvRotate(parseFloat(holeObjects[i].data.zRot), [0, 1, 0]);
			mvRotate(parseFloat(holeObjects[i].data.yRot), [0, 0, 1]);
		  
			mvScale(parseFloat(holeObjects[i].data.width), parseFloat(holeObjects[i].data.height), parseFloat(holeObjects[i].data.depth));
		  }
		  
		  if (holeObjects[i].data.type === "teapot") {
			drawTeapot(metalTexture);
		  } else {
			drawCube(holeObjects[i].data.texture);
		  }
		  mvPopMatrix();
		  mvPushMatrix();
		}
		
		if (!holeComplete && ball) {
		  // Draw ball.
		  mvTranslate([ball.get_currentState().position.x, ball.get_currentState().position.y, ball.get_currentState().position.z]);
		  mvScale(0.5, 0.5, 0.5);
		  drawSphere(golfTexture);
		
		  // Draw pointing arrow.
		  if (newStroke) {
			mvRotate(strokeAngle, [0, 1, 0]);
			drawArrow(earthTexture);
		  }
		}
		mvPopMatrix();
		
		// Draw hole.
		mvPushMatrix();
		mvTranslate([holeX, holeZ, holeY]);
		mvRotate(holeXrot, [1, 0, 0]);
		//mvRotate(holeZrot, [0, 1, 0]);
		//mvRotate(holeYrot, [0, 0, 1]);
		mvScale(0.5, 0.5, 0.5);
		drawCube("grassHoleTexture");
		mvPopMatrix();

	  }
	  
	  // Initialize the physics engine.  
	  var physicsSystem;
	  this.initPhysics = function(){
		physicsSystem = jigLib.PhysicsSystem.getInstance();
		physicsSystem.setGravity(new jigLib.Vector3D(0,-9.8,0));
		}
	  var lastTime = 0;
	  var lastX = 0;
	  var lastY = 0;
	  var lastZ = 0;
	  var strokesUsed = 1;
	  var currentHole = 1;
	  var holeScores = [];
	  var totalScore = 0;
	  var holeComplete = false;
	  var nextHole = false;
	  function animate() {
		var timeNow = new Date().getTime();
		if (lastTime != 0) {
		  var elapsed = timeNow - lastTime;
		  physicsSystem.integrate(elapsed/1000);
		  
		  if (!nextHole) {
			// Check if ball is in the hole.
			if (ball && ((ball.get_x() > holeX - 0.25) && (ball.get_x() < holeX + 0.25))) {
			  if ((ball.get_z() > holeY - 0.25) && (ball.get_z() < holeY + 0.25)) {
				if ((ball.get_y() > holeZ - 0.5) && (ball.get_y() < holeZ + 0.5)) {
				  ball.setActive();
				  ball.setVelocity(new jigLib.Vector3D(0,0,0));
				  holeComplete = true;
				
				  holeScores.push({name:holeName, par:holePar, score:strokesUsed});
				
				  // Show scoreboard.
				  totalScore += strokesUsed;
				
				  for (var j = 1; j <= holeScores.length; j += 1)
				  {
				
				  }

				  nextHole = true;
				}
			  }
			}
		  }
		  
		  // Check if ball has fallen down.
		  if (ball && (ball.get_y() < -10.0))
		  {
			ball.moveTo(ball.lastPosition);
		  }
		  
		  // Handle stroke.
		  if (!newStroke && !stroking) {
			if (lastX === ball.get_x() && lastY === ball.get_y() && lastZ === ball.get_z()) {
			   newStroke = true;
			   if (!holeComplete) {
				 strokesUsed += 1;
				 strokePower = 0;
				 
				 if (strokesUsed > 9)
				 {
				   // Maximum amount of strokes used.
				   ball.moveTo(new jigLib.Vector3D(holeX, holeZ, holeY));
				   newStroke = false;
				 }
			   }
			}
		  }
		  if (ball)
		  {
			lastX = ball.get_x();
			lastY = ball.get_y();
			lastZ = ball.get_z();
		  }
		}
		lastTime = timeNow;
	  }

	  function tick() {
		handleKeys();
		drawScene();
		animate();
	  }

	  var holeObjects = [];
	  var holeName = "";
	  var holePar = 0;
	  var holeX, holeY, holeZ, holeXrot, holeYrot, holeZrot;
	  var startX = 0;
	  var startY = 0;
	  var startZ = 0;
	  var ball;
	  function handleLoadedHole(hole) {
		var holeData = JSON.parse(hole);
		
		for (var i = 0; i < holeData.length; i += 1) {
		  // Create physics-objects.
		  if (holeData[i].type === "info") {
			holeName = holeData[i].name;
			holePar = holeData[i].par;
		  } else if (holeData[i].type === "start") {
			// Save start-coordinates.
			startX = parseFloat(holeData[i].xCoord);
			startY = parseFloat(holeData[i].yCoord);
			startZ = parseFloat(holeData[i].zCoord);
			
			// Create ball.
			ball = new jigLib.JSphere(null,0.25);
			ball.set_mass(0.25*0.25*0.25*Math.PI);
			ball.set_friction(0);
			ball.set_linVelocityDamping(new jigLib.Vector3D(0.99, 0.99, 0.99));
			ball.set_rotVelocityDamping(new jigLib.Vector3D(0, 0, 0));
	  
			physicsSystem.addBody(ball);
			ball.moveTo(new jigLib.Vector3D(startX, startZ + 1.5, startY));
			ball.lastPosition = new jigLib.Vector3D(startX, startZ + 1.5, startY);
			
		  } else if (holeData[i].type === "hole") {
			// Save hole coordinates.
			holeX = parseFloat(holeData[i].xCoord);
			holeY = parseFloat(holeData[i].yCoord);
			holeZ = parseFloat(holeData[i].zCoord);
			holeXrot = parseFloat(holeData[i].xRot);
			holeYrot = parseFloat(holeData[i].yRot);
			holezrot = parseFloat(holeData[i].zRot);
		  } else if (holeData[i].type === "plane") {
			  var plane = new jigLib.JPlane(null, new jigLib.Vector3D(0, 1, 0.4));
			  plane.set_friction(0);
			  plane.set_restitution(1);
			  physicsSystem.addBody(plane);
			  holeObjects.push({data:holeData[i], jig:plane});
		  } else if (holeData[i].type === "teapot") {
			holeObjects.push({data:holeData[i], jig:null});
		  } else {
			  var box = new jigLib.JBox(null, parseFloat(holeData[i].width), parseFloat(holeData[i].height), parseFloat(holeData[i].depth)); 
			  box.set_mass(100);
			  box.get_material().set_friction(1);
			  box.get_material().set_restitution(1);
			  box.set_movable(false);
			  box.moveTo(new jigLib.Vector3D(holeData[i].xCoord, holeData[i].zCoord, holeData[i].yCoord));

			  physicsSystem.addBody(box);
			
			  box.set_rotationX(parseFloat(holeData[i].xRot));
			  box.set_rotationY(parseFloat(holeData[i].zRot));
			  box.set_rotationZ(parseFloat(holeData[i].yRot));
			  box.updateObject3D();
			
			  holeObjects.push({data:holeData[i], jig:box});
		  }
		  
		  physicsSystem.integrate(0.001);
		}

		newStroke = true;
	  }
	  
	  function loadHole(hole) {
		nextHole = false;
		strokesUsed = 1;
		holeComplete = false;
		stroking = false;
		pitch = 0;
		yaw = 0;
		zoom = 0;
		strokeAngle = 0;
		holeObjects = [];
		physicsSystem.removeAllBodys();
		ball = null;

		var request = new XMLHttpRequest();
		request.open("GET", hole, true);
		request.onreadystatechange = function() {
		  if (request.readyState == 4) {
			handleLoadedHole(request.responseText);
		  }
		}
		request.send();
	  }
	  
	  var teapotVertexPositionBuffer;
	  var teapotVertexNormalBuffer;
	  var teapotVertexTextureCoordBuffer;
	  var teapotVertexIndexBuffer;
	  function handleLoadedTeapot(teapotData) {
		teapotVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
		teapotVertexNormalBuffer.itemSize = 3;
		teapotVertexNormalBuffer.numItems = teapotData.vertexNormals.length / 3;

		teapotVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexTextureCoords), gl.STATIC_DRAW);
		teapotVertexTextureCoordBuffer.itemSize = 2;
		teapotVertexTextureCoordBuffer.numItems = teapotData.vertexTextureCoords.length / 2;

		teapotVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
		teapotVertexPositionBuffer.itemSize = 3;
		teapotVertexPositionBuffer.numItems = teapotData.vertexPositions.length / 3;

		teapotVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotData.indices), gl.STREAM_DRAW);
		teapotVertexIndexBuffer.itemSize = 3;
		teapotVertexIndexBuffer.numItems = teapotData.indices.length;
	  }
	  
	  function loadTeapot() {
		
		var request = new XMLHttpRequest();
		request.open("GET", "http://www.eucfutsal2011.com/webgl/minigolf/teapot.json");
		request.onreadystatechange = function() {
		  if (request.readyState == 4) {
			handleLoadedTeapot(JSON.parse(request.responseText));
		  }
		}
		request.send();
	  }
	 
	 
	  this.webGLStart = function() {

		
		initGL(canvas);
		initShaders();
		initBuffers();
		initTextures();
		//loadTeapot();
		currentHole = 1;
		//loadHole("http://www.eucfutsal2011.com/webgl/minigolf/holes/simple_01.txt");
		loadHole(holes[0]);
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
	 
		gl.clearDepth(1.0);
	 
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
		//document.onkeydown = handleKeyDown;
		//document.onkeyup = handleKeyUp;
		//canvas.onmousedown = handleMouseDown;
		//document.onmouseup = handleMouseUp;
		//document.onmousemove = handleMouseMove;
		//document.onmousewheel = handleMouseWheel;
		if (window.addEventListener) {
			/** DOMMouseScroll is for mozilla. */
			window.addEventListener('DOMMouseScroll', this.handleMouseWheel, false);
		}
	 
		setInterval(tick, 10);
	  }
	  
	this.GetCanvas = function(){
		return canvas;
	};
	
	
	this.ResourceHandlers = {
		holes: function(resources){
			for ( var i in resources ){
				holes.push(resources[i]);
			}
		},
		textures: function(resources){
			for ( var i in resources ){
				textures.push(resources[i]);
			}
		},
		
		scripts: function(resources){
			var index = 0;
			LoadScript(resources, index);
		},
		
		shaders: function(resources){
			var fragment = document.createElement('script');
			fragment.type = "x-shader/x-fragment"
			fragment.id = "per-fragment-lighting-fs";
			
			$.get(resources[0], function(data){
				fragment.innerHTML = data;
				document.head.appendChild(fragment);
			});
			
			
			var vertex = document.createElement('script');
			vertex.type = "x-shader/x-vertex"
			vertex.id = "per-fragment-lighting-vs";
			
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
		holes: [ 'holes/simple_01.txt','holes/simple_02.txt','holes/simple_03.txt','holes/simple_04.txt',
				'holes/simple_05.txt', 'holes/simple_06.txt', 'holes/simple_07.txt', 'holes/simple_08.txt',
				'holes/simple_09.txt', 'holes/hidden.txt'],
		
		textures: ['textures/grass01.jpg', 'textures/wood01.jpg', 'textures/grasshole.jpg', 'textures/golfball.jpg',
					'textures/golden.jpg', 'textures/bluemetal.jpg', 'textures/tut.jpg', 'textures/metal.jpg',
					'textures/mikko.jpg', 'textures/target.jpg', 'textures/earth.jpg', 'textures/arroway.de_metal+structure+06_d100_flat.jpg'],
		
		scripts: [  'scripts/json2.js', 'scripts/sylvester.js', 'scripts/glUtils.js', 'scripts/jiglib.js', 'scripts/jconfig.js', 'scripts/vector3d.js', 'scripts/matrix3d.js', 
					'scripts/jmatrix3d.js', 'scripts/jnumber3d.js', 'scripts/jmaths3d.js', 'scripts/contactdata.js', 'scripts/edgedata.js',
					'scripts/planedata.js', 'scripts/spandata.js', 'scripts/iskin3d.js','scripts/jaabox.js', 'scripts/bodypair.js', 
					'scripts/cachedimpluse.js',  'scripts/materialproperties.js', 'scripts/physicscontroller.js', 'scripts/physicsstate.js', 
					'scripts/rigid_body.js', 'scripts/hingejoint.js','scripts/jbox.js', 'scripts/jcapsule.js', 'scripts/jplane.js',
					'scripts/jray.js', 'scripts/jsegment.js', 'scripts/jsphere.js', 'scripts/jterrain.js',  'scripts/collpointinfo.js', 
					'scripts/collisioninfo.js', 'scripts/colldetectinfo.js', 'scripts/colldetectfunctor.js',  
					'scripts/colldetectboxbox.js','scripts/colldetectboxplane.js', 'scripts/colldetectboxterrain.js',
					'scripts/colldetectcapsulebox.js', 'scripts/colldetectcapsulecapsule.js', 'scripts/colldetectcapsuleplane.js', 
					'scripts/colldetectcapsuleterrain.js', 'scripts/colldetectspherebox.js', 'scripts/colldetectspherecapsule.js', 
					'scripts/colldetectsphereplane.js', 'scripts/colldetectspheresphere.js', 'scripts/colldetectsphereterrain.js',
					'scripts/collisionsystem.js', 'scripts/jconstraint.js', 'scripts/jconstraintmaxdistance.js', 'scripts/jconstraintpoint.js',   
					'scripts/physicssystem.js'],
					
		shaders: [ 'shaders/fragment.shader', 'shaders/vertex.shader']
	
	};
	
	this.ResourcePath = 'Resources/MiniGolf/';
	
	var unloadedResources = { holes: true, textures: true, scripts: true, shaders: true };
	var unloadedScripts = 51;
	
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
			that.initMatrix();
			that.initPhysics();
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
	
	this.Open = function(){
		courseComplete = false;
		currentHole = 1;
		holeScores = [];
		totalScore = 0;
		loadHole(holes[0]);
	}
	
}

var golfInit = function(Golf){
	var golf = new Golf();
	
	Lively3D.LoadResources(golf);
	
	golf.EventListeners = { "mousedown": golf.handleMouseDown, "mouseup": golf.handleMouseUp, "mousemove": golf.handleMouseMove, "keydown": golf.handleKeyDown, "keyup": golf.handleKeyUp, "mousewheel": golf.handleMouseWheel };
	
	return golf;
}
				
Lively3D.AddApplication('MiniGolf', golf, golfInit);
