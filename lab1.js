"use strict";

var DIMENSIONS = 2;
var aspectRatio = 1;
var gl;
//var vertices = [];

var modelViewMatrixLoc;
var modelViewMatrix;
var scalar = 2/10;
var theta = 0;
var xTranslate = 0;
var yTranslate = 0;

var vPosition;
var bufferHolder = [];
var tetrominoHolder = [];

function tetromino( vertices, modelViewMatrix )
{
	this.vertices = vertices;
//	this.verticesLength = vertices.length/DIMENSIONS;
	this.modelViewMatrix = modelViewMatrix;
}

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

	aspectRatio = canvas.width/canvas.height;

	/**
	 * Load shaders and initialize attribute buffers
	 */
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );	

	/**
	 * add first object
	 */
	addTetromino();

	/**
	 * Associate out shader variables with our data buffer
	 */
	vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
			
	controls();
	
	render();
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );
//    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


	modelViewMatrix = mat4.create();	
	mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate,yTranslate,0));
	mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
	
	/// TODO different approach, instead of calculating the modelViewMatrix from identity all the time, only calculate the change to the previous one
	/// TODO color!
	
	tetrominoHolder[tetrominoHolder.length - 1].modelViewMatrix = modelViewMatrix;

	for( var i = 0; i < tetrominoHolder.length; i++ )
	{
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferHolder[i] );
		gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(tetrominoHolder[i].modelViewMatrix));
	
		gl.drawArrays( gl.TRIANGLES, 0, tetrominoHolder[i].vertices.length/DIMENSIONS );	
	}

/*
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferHolder[bufferHolder.length - 1] );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
//	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(tetrominoHolder[tetrominoHolder.length-1].vertices), gl.STATIC_DRAW );

	// modelView transformations (scale, translate and rotate around z axis) 
	modelViewMatrix = mat4.create();	
	mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate,yTranslate,0));
	mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
	
	gl.drawArrays( gl.TRIANGLES, 0, tetrominoHolder[tetrominoHolder.length - 1].vertices.length/DIMENSIONS );	
*/
	
	/**
	 * request browser to display the rendering the next time it wants to refresh the display
	 * and then call the render function recorsively
	 */
	requestAnimFrame(render);
}

function controls()
{
	/**
	 * event listener in case of button press
	 */
	document.addEventListener("keydown", function(event) {
				switch(event.keyCode)
				{
					case 37:	// arrow left
							xTranslate -= 1;
							console.log("pressed left");
							break;							
					case 38:	// arrow up
							yTranslate += 1;
							break;
					case 39:	// arrow right
							xTranslate += 1;
							console.log("pressed right");
							break;
					case 40: 	// arrow down					
							yTranslate -= 1;
							break;	
					case 49: 	// 1
							theta += Math.PI/2;
							break;
					case 51:	// 3
							theta -= Math.PI/2;
							break;
					case 13:	// enter
							addTetromino();
				}
			} );	
}

function setScalar(sliderValue)
{
	scalar = 2/(sliderValue);
	document.getElementById("scalarSliderValue").innerHTML = sliderValue;

	tetrominoHolder = [];
	bufferHolder = [];

	theta = 0;
	xTranslate = 0;
	yTranslate = 0;
	addTetromino();	
}

function addTetromino()
{
	// a new tetromino is added. however only the newest tetromino is active (can be moved)
	// calculate a final modelViewMatrix for the old tetromino so that it stays in its state and we save calculations
	///TODO if scale, translate and rotate only always express change in it (see idea in render), this part is unnecessar 
	if( tetrominoHolder.length != 0 )
	{
		modelViewMatrix = mat4.create();	
		mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(scalar,scalar*aspectRatio,1));
		mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate,yTranslate,0));
		mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
		
		tetrominoHolder[tetrominoHolder.length-1].modelViewMatrix = modelViewMatrix;
	}
	
	tetrominoHolder.push(new tetromino(spawnRandom(), mat4.create()));
	console.log("tetrominoHolder.length: " + tetrominoHolder.length );
	console.log("tetrominoHolder[" + (tetrominoHolder.length-1) + "].vertices.length: " + tetrominoHolder[tetrominoHolder.length-1].vertices.length );							
	
	/**
	 * Load the data into the GPU
	 */
	bufferHolder.push(gl.createBuffer());
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferHolder[bufferHolder.length - 1] );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(tetrominoHolder[tetrominoHolder.length-1].vertices), gl.STATIC_DRAW );	
}


