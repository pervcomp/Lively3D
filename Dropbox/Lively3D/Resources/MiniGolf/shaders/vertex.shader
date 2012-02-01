 attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;
 
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 uNMatrix;
 
  varying vec2 vTextureCoord;
  varying vec4 vTransformedNormal;
  varying vec4 vPosition;
  
 
  void main(void) {
    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * vPosition;
    vTextureCoord = aTextureCoord;
    vTransformedNormal = uNMatrix * vec4(aVertexNormal, 1.0);
  }