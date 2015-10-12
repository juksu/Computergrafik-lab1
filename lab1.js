"use strict";


var DIMENSIONS = 2;
var gl;
var vertices = [];
var modelViewMatrixLoc;
var modelViewMatrix;

var theta = 0;

function webGLstart()
{

	var canvas = document.getElementById( "glCanvas" );
	
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl )
		alert( "WebGL is not available" );
	
	/**
	 * Configure Webgl
	 */
	gl.viewport( 0, 0, canvas.width, canvas.height );
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

	/**
	 * Load shaders and initialize attribute buffers
	 */
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );	
		
	/**
	 * construct tetris elements with triangles
	 */
/*	var square = [
			vec2.fromValues(-1, -1), vec2.fromValues(-1, 1), vec2.fromValues(1, -1),
			vec2.fromValues(-1, 1), vec2.fromValues(1, -1), vec2.fromValues(1, 1) ];	
	for( var i = 0; i < square.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(square[i][j]);
*/	
//	for( var i = 0; i < vertices.length; i++ )
//		console.log("vertices[" + i + "]: " + vertices[i] );
		
/*	var iBlock = [
			vec2.fromValues(-0.5, -2), vec2.fromValues(-0.5, 2), vec2.fromValues(0.5, -2),
			vec2.fromValues(-0.5, 2), vec2.fromValues(0.5, -2), vec2.fromValues(0.5, 2) ];
	for( var i = 0; i < iBlock.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(iBlock[i][j]);
*/	
	var podium = [
			vec2.fromValues(-1.5,-1), vec2.fromValues(-1.5, 0), vec2.fromValues(1.5, -1),
			vec2.fromValues(-1.5, 0), vec2.fromValues(1.5, -1), vec2.fromValues(1.5, 0),
			vec2.fromValues(-0.5, 0), vec2.fromValues(-0.5, 1), vec2.fromValues(0.5, 0),
			vec2.fromValues(-0.5, 1), vec2.fromValues(0.5, 0), vec2.fromValues(0.5, 1) ];	
	for( var i = 0; i < podium.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(podium[i][j]);
	
/*	var zBlock = [
			vec.fromValues2(-1.5, -1), vec2.fromValues(-1.5, 0), vec2.fromValues(0.5, -1),
			vec2.fromValues(-1.5, 0), vec2.fromValues(0.5, -1), vec2.fromValues(0.5, 0),
			vec2.fromValues(-0.5, 0), vec2.fromValues(-0.5, 1), vec2.fromValues(1.5, 0),
			vec2.fromValues(-0.5, 1), vec2.fromValues(1.5, 0), vec2.fromValues(1.5, 1) ];
	for( var i = 0; i < zBlock.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(zBlock[i][j]);
*/
/*	var lBlock = [
			vec2.fromValues(-1, -1.5), vec2.fromValues(-1, 1.5), vec2.fromValues(0, -1.5),
			vec2.fromValues(-1, 1.5), vec2.fromValues(0, -1.5), vec2.fromValues(0, 1.5),
			vec2.fromValues(0, -1.5), vec2.fromValues(0, -0.5), vec2.fromValues(1, -1.5),
			vec2.fromValues(0, -0.5), vec2.fromValues(1, -1.5), vec2.fromValues(1, -0.5) ];
	for( var i = 0; i < lBlock.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(lBlock[i][j]);
*/	

	/**
	 * Load the data into the GPU
	 */
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );

	
	/**
	 * Model view matrix
	 */
//	mat4.identity(mvMatrix);
//	mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);


	/**
	 * Associate out shader variables with our data buffer
	 */
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );



	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

	/**
	 * modelView transformations (scale, and translate)
	 */

	
	/**
	 * event listener in case of button press
	 */
	document.addEventListener("keydown", function(event) {
				switch(event.keyCode)
				{
					case 37:	// arrow left
							theta += Math.PI/2;
							console.log("pressed left");
							break;							
					case 38:	// arrow up
							break;
					case 39:	// arrow right
							theta -= Math.PI/2;
							console.log("pressed right");
							break;
					case 40: 	// arrow down					
							break;
				}
			} );
			
//	modelViewMatrix = mat4.create();	
//	mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(0.1,0.1,1));
//	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-4,0,0));
//	mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
	
	
	document.getElementById( "xButton" ).onclick = function () 
	{
		theta = 0.05; 
	};
			
	
	render();
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );
	

	/**
	 * modelView transformations (rotate around z axis) 
	 * -> the transformation here causes a constant spinning
	 */
//	mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);

	modelViewMatrix = mat4.create();	
	mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(0.1,0.1,1));
	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-4,0,0));
	mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
	

	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
	
//	gl.drawArrays( gl.TRIANGLES, 0, verticesLength );
	/// TODO: noch einen weg finden das die verticesLength hier übergeben wird ohne in funktion zu übergeben
	gl.drawArrays( gl.TRIANGLES, 0, 12 );
	
	/**
	 * request browser to display the rendering the next time it wants to refresh the display
	 * and then call the render function recorsively
	 */
	requestAnimFrame(render);
}
