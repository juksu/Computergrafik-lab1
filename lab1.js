"use strict";

var DIMENSIONS = 2;		// dimension of vertices
var COLORDIMENSIONS = 4;	// dimension of color vectors

var aspectRatio;		// aspect ratio of canvas

var gl;
var modelViewMatrixLoc;

var modelViewMatrix;

var rotate = false;
var rotateLeft = false;
var translate = false;	

var scalar = 2/10;		// initial value, scalar is changed with size of playing field
var theta = 0.1;			// rotation
var deltaTheta = 0;
var xTranslate = 0;		// move along x-axis
var deltaXTranslate = 0;
var yTranslate = 0;		// move along y-axis
var deltaYTranslate = 0;

var vPosition;
var vertexBufferHolder = [];
var vColor;
var colorBufferHolder = [];

var tetrominoHolder = [];
function tetromino( vertices, modelViewMatrix )
{
	this.vertices = vertices;
	this.modelViewMatrix = modelViewMatrix;
	var col = [];
	
	// i simply want to have onecolored tetrominos
	// -> assign each vertex the same color value
	// for some fancy rainbowcolor effects assign different colors to the vertices but I was told rainbowcolor is bad ;)
	// should not be to bright or dark -> use only random values between 50 and 200
	var col1 = (Math.floor(Math.random()*150)+50)/256;
	var col2 = (Math.floor(Math.random()*150)+50)/256;
	var col3 = (Math.floor(Math.random()*150)+50)/256;
		
	for (var i=0; i < vertices.length/DIMENSIONS; i++)
		col = col.concat( [col1, col2, col3, 1.0 ] );
    
    this.color = col;
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

	vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
			
	controls();
	
	render();
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );
//    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


//	modelViewMatrix = mat4.create();	
//	mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(scalar,scalar*aspectRatio,1));
//	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate,yTranslate,0));
//	mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
	
	/// TODO different approach, instead of calculating the modelViewMatrix from identity all the time, only calculate the change to the previous one
	
//	tetrominoHolder[tetrominoHolder.length - 1].modelViewMatrix = modelViewMatrix;

	

	for( var i = 0; i < tetrominoHolder.length - 1; i++ )
	{		
		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferHolder[i] );
		gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferHolder[i] );
		gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(tetrominoHolder[i].modelViewMatrix));
		
		gl.drawArrays( gl.TRIANGLES, 0, tetrominoHolder[i].vertices.length/DIMENSIONS );
	}
	
	
	// do the last tetromino
	if( rotateLeft == true )
	{
		deltaTheta += 0.01;
		var tempMV = [];
		if( deltaTheta <= theta )
		{
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, 
					new Float32Array(mat4.rotateZ(
							tempMV, tetrominoHolder[i].modelViewMatrix, deltaTheta)));
		}
		// rotation ended, calculate new modelViewMatrix, use theta to avoid errors
		else
		{
			mat4.rotateZ(tetrominoHolder[i].modelViewMatrix, tetrominoHolder[i].modelViewMatrix, theta);
			rotate = false;
			deltaTheta = 0;
		}
	}
	
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferHolder[tetrominoHolder.length-1] );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferHolder[tetrominoHolder.length-1] );
	gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(tetrominoHolder[tetrominoHolder.length-1].modelViewMatrix));
	
	gl.drawArrays( gl.TRIANGLES, 0, tetrominoHolder[tetrominoHolder.length-1].vertices.length/DIMENSIONS );	
	
		
		
		
//	if( translate == true )
	
	
	
	
	
	

/*
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferHolder[vertexBufferHolder.length - 1] );
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
							rotateLeft = true;
							theta += Math.PI/2;
							break;
					case 51:	// 3
							rotate = true;
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
	vertexBufferHolder = [];

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
/*	if( tetrominoHolder.length != 0 )
	{
		modelViewMatrix = mat4.create();	
		mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(scalar,scalar*aspectRatio,1));
		mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate,yTranslate,0));
		mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
		
		tetrominoHolder[tetrominoHolder.length-1].modelViewMatrix = modelViewMatrix;
	}
*/	
	
	// spawn at random position
	var modelViewMatrix = [];
	mat4.scale(modelViewMatrix, mat4.create(), vec3.fromValues(scalar,scalar*aspectRatio,1));
//	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate,yTranslate,0));
//	mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta);
	
	var xrand = Math.floor(Math.random()/scalar);
	var yrand = Math.floor(Math.random()/scalar*aspectRatio);
	
	switch( Math.floor(Math.random()*4) )
	{
		case 1:	xrand *= -1;
				break;
		case 2:	yrand *= -1;
				break;
		case 3: xrand *= -1;
				yrand *= -1;
	}
	
	
	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xrand, yrand, 0));
	
	tetrominoHolder.push(new tetromino(spawnRandom(), modelViewMatrix));
//	console.log("tetrominoHolder.length: " + tetrominoHolder.length );
//	console.log("tetrominoHolder[" + (tetrominoHolder.length-1) + "].vertices.length: " + tetrominoHolder[tetrominoHolder.length-1].vertices.length );							
//	console.log("tetrominoHolder[" + (tetrominoHolder.length-1) + "].color.length: " + tetrominoHolder[tetrominoHolder.length-1].color.length );							
	
	// spawn area
		
	/**
	 * Load the data into the GPU
	 */
	vertexBufferHolder.push(gl.createBuffer());
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferHolder[vertexBufferHolder.length - 1] );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(tetrominoHolder[tetrominoHolder.length-1].vertices), gl.STATIC_DRAW );	
	
	colorBufferHolder.push(gl.createBuffer());
	gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferHolder[colorBufferHolder.length - 1] );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(tetrominoHolder[tetrominoHolder.length-1].color), gl.STATIC_DRAW );
}


