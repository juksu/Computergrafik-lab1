"use strict";

function webGLstart()
{
	var DIMENSIONS = 2;
	var canvas;
	var vertices = [];
	var gl;
	
	canvas = document.getElementById( "glCanvas" );
	
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl )
		alert( "WebGL is not available" );
		
	/**
	 * construct tetris elements with triangles
	 */
	var square = [
			vec2.fromValues(-1, -1), vec2.fromValues(-1, 1), vec2.fromValues(1, -1),
			vec2.fromValues(-1, 1), vec2.fromValues(1, -1), vec2.fromValues(1, 1) ];	
	for( var i = 0; i < square.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(square[i][j]);
//	{
//		vertices.push(square[i]);
//		vertices.push(square[i][0]);
//		vertices.push(square[i][1]);
//		console.log("square i: " + square[i] ); 
//	}
	
/*	vertices = [
			-1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
			-1.0, 1.0, 1.0, -1.0, 1.0, 1.0
			];
*/	
	for( var i = 0; i < vertices.length; i++ )
	{
		console.log("vertices[" + i + "]: " + vertices[i] );
//		console.log("vertices[" + i + "][1]: " + vertices[i][1] );
	}
		
/*	var iBlock = [
			vec2(-0.5, -2), vec2(-0.5, 2), vec2(0.5, -2),
			vec2(-0.5, 2), vec2(0.5, -2), vec2(0.5, 2) ];
*/
//	for( var i = 0; i < iBlock.length; i++ )
//		vertices.push(iBlock[i]);
	
/*	var podium = [
			vec2(-1.5,-1), vec2(-1.5, 0), vec2(1.5, -1),
			vec2(-1.5, 0), vec2(1.5, -1), vec2(1.5, 0),
			vec2(-0.5, 0), vec2(-0.5, 1), vec2(0.5, 0),
			vec2(-0.5, 1), vec2(0.5, 0), vec2(0.5, 1) ];	
*/
//	for( var i = 0; i < podium.length; i++ )
//		vertices.push(podium[i]);
	
/*	var zBlock = [
			vec2(-1.5, -1), vec2(-1.5, 0), vec2(0.5, -1),
			vec2(-1.5, 0), vec2(0.5, -1), vec2(0.5, 0),
			vec2(-0.5, 0), vec2(-0.5, 1), vec2(1.5, 0),
			vec2(-0.5, 1), vec2(1.5, 0), vec2(1.5, 1) ];
*/
//	for( var i = 0; i < zBlock.length; i++ )
//		vertices.push(zBlock[i]);
		
/*	var lBlock = [
			vec2(-1, -1.5), vec2(-1, 1.5), vec2(0, -1.5),
			vec2(-1, 1.5), vec2(0, -1.5), vec2(0, 1.5),
			vec2(0, -1.5), vec2(0, -0.5), vec2(1, -1.5),
			vec2(0, -0.5), vec2(1, -1.5), vec2(1, -0.5) ];			
*/
//	for( var i = 0; i < lBlock.length; i++ )
//		vertices.push(lBlock[i]);
	
	/**
	 * Configure Webgl
	 */
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	
	/**
	 * Load shaders and initialize attribute buffers
	 */
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    /**
     * Load the data into the GPU
     */
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
    
    
	/**
	 * Associate out shader variables with our data buffer
	 */
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    render(gl, vertices, square.length);
}

function render(gl, vertices, verticesLength)
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, verticesLength );
}
