"use strict";

var DIMENSIONS = 2;		// dimension of vertices
var COLORDIMENSIONS = 4;	// dimension of color vectors
var aspectRatio;		// aspect ratio of canvas

var gl;
var modelViewMatrixLoc;
var perspectiveMatrixLoc;
var modelViewMatrix = [];
var perspectiveMatrix = [];

var rotateCounterClockWise = false;
var rotateClockWise = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;	

var timeStart;
var timeStopp;
var transitionTime = 500;	// the time a transition (movement or rotation) should occupy (in ms)
var gravity = 2000;		// the time after which a tetromino falls one block (in ms)
var lastFall;

var scalar;		// initial value, scalar is changed with size of playing field
var theta = 0;			// rotation
var deltaTheta = 0;
var xTranslate = 0;		// move along x-axis
var deltaXTranslate = 0;
var yTranslate = 0;		// move along y-axis
var deltaYTranslate = 0;

var vPosition;
var vertexBufferHolder = [];
var vColor;
var colorBufferHolder = [];

var collisionMatrix;

var tetrominoHolder = [];
function tetromino( vertices, modelViewMatrix )	///TODO local collision coordinates
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

	setScalar(10);	// 10 is the standard size

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
	perspectiveMatrixLoc = gl.getUniformLocation(program, "perspectiveMatrix");
	
	perspectiveMatrix = mat4.create();
	mat4.scale(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));
//mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(-1/scalar, -1/(scalar*aspectRatio), 0));
			
	controls();
	timeStart = Date.now();
	lastFall = timeStart;
	
	render();
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );

	for( var i = 0; i < tetrominoHolder.length - 1; i++ )
	{		
		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferHolder[i] );
		gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferHolder[i] );
		gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(tetrominoHolder[i].modelViewMatrix));
		gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));
		
		gl.drawArrays( gl.TRIANGLES, 0, tetrominoHolder[i].vertices.length/DIMENSIONS );
	}

	timeStopp = Date.now();
/*	if( timeStopp - lastFall > gravity )
	{
		moveDown = true;
		yTranslate -= 1;
		lastFall = timeStopp;
	}
*/	
	if( rotateCounterClockWise || rotateClockWise || moveLeft || moveRight || moveUp || moveDown )
		move();
		
	timeStart = timeStopp;

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
	gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));
	
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferHolder[vertexBufferHolder.length-1] );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferHolder[colorBufferHolder.length-1] );
	gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );
	
	gl.drawArrays( gl.TRIANGLES, 0, tetrominoHolder[tetrominoHolder.length-1].vertices.length/DIMENSIONS );	
	
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
					case 76:	// l
					case 37:	// arrow left
							if( !moveLeft )
								xTranslate -= 1;
							moveLeft = true;
							moveRight = false;
							// console.log("pressed left");
							break;							
					case 85:	// u
					case 38:	// arrow up
							if( !moveUp )
								yTranslate += 1;
							moveUp = true;
							moveDown = false;
							// console.log("pressed up");
							break;
					case 82:	// r
					case 39:	// arrow right
							if( !moveRight )
								xTranslate += 1;
							moveRight = true;
							moveLeft = false;
							// console.log("pressed right");
							break;
					case 68:	// d
					case 40: 	// arrow down					
							if( !moveDown )
								yTranslate -= 1;
							moveDown = true;
							moveUp = false;
							// console.log("pressed down");
							break;
					case 49: 	// 1
							if( !rotateCounterClockWise )
								theta += Math.PI/2;
							rotateCounterClockWise = true;
							rotateClockWise = false;
							// console.log("pressed 1");
							break;
					case 51:	// 3
							if( !rotateClockWise )
								theta -= Math.PI/2;
							rotateClockWise = true;
							rotateCounterClockWise = false;
							// console.log("pressed 3");
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

	// clear playfield and collisionMatrix and add a new tetromino
	collisionMatrix = new CollisionMatrix(sliderValue, sliderValue*aspectRatio);
	console.log("xDim " + collisionMatrix.xDim + ", yDim " + collisionMatrix.yDim );
	console.log(collisionMatrix.isOccupied(1,1));

	tetrominoHolder = [];
	vertexBufferHolder = [];
	addTetromino();
}

function addTetromino()
{	
	// copy the modelViewMatrix into the tetrominoholder
	if( tetrominoHolder.length > 0 )
		tetrominoHolder[tetrominoHolder.length-1].modelViewMatrix = mat4.clone(modelViewMatrix);
	
	rotateCounterClockWise = rotateClockWise = false;
	moveLeft = 	moveRight = false;
	moveUp = moveDown = false;

	mat4.identity(modelViewMatrix);
///	mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));	
	// spawn at random position
	xTranslate = Math.floor(Math.random()/scalar) - 1;
	yTranslate = Math.floor(Math.random()/scalar*aspectRatio) - 1;
	
	switch( Math.floor(Math.random()*4) )
	{
		case 1:	xTranslate *= -1;
				break;
		case 2:	yTranslate *= -1;
				break;
		case 3: xTranslate *= -1;
				yTranslate *= -1;
	}
	
	deltaXTranslate = xTranslate;
	deltaYTranslate = yTranslate;
	deltaTheta = theta = 0;
	
	deltaXTranslate = xTranslate = 0;
	deltaYTranslate = yTranslate = 0;
	
//	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate, yTranslate, 0));
	
	// get new tetromino and push it into tetrominoHolder
	tetrominoHolder.push(new tetromino(spawnRandom(), modelViewMatrix));
		
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

function move()
{
	// calculate delta value for rotation
	var rotation = (Math.PI/2) * (timeStopp - timeStart) / transitionTime;
	
	if( rotateClockWise )
	{
		deltaTheta -= rotation;
		if( deltaTheta <= theta )
		{
			deltaTheta = theta;
			rotateClockWise = false;
		}
	}
	
	if( rotateCounterClockWise)
	{
		deltaTheta += rotation;
		if( deltaTheta >= theta )
		{
			deltaTheta = theta;
			rotateCounterClockWise = false;
		}
	}
	
	// calculate delta value for movement
	var movement = (timeStopp - timeStart) / transitionTime;
	
	if( moveLeft )
	{
		deltaXTranslate -= movement;
		if( deltaXTranslate <= xTranslate )
		{
			deltaXTranslate = xTranslate;
			moveLeft = false;
		}
	}
	
	if( moveRight )
	{
		deltaXTranslate += movement;
		if( deltaXTranslate >= xTranslate )
		{
			deltaXTranslate = xTranslate;
			moveRight = false;
		}
	}
	
	if( moveUp )
	{
		deltaYTranslate += movement;
		if( deltaYTranslate >= yTranslate )
		{
			deltaYTranslate = yTranslate;
			moveUp = false;
		}
	}
	
	if( moveDown )
	{
		deltaYTranslate -= movement;
		if( deltaYTranslate <= yTranslate )
		{
			deltaYTranslate = yTranslate;
			moveDown = false;
		}
	}
	
	// calculate a new modelViewMatrix containing changes
	mat4.identity(modelViewMatrix);
///	mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(deltaXTranslate,deltaYTranslate,0));
	mat4.rotateZ(modelViewMatrix, modelViewMatrix, deltaTheta);
	
	if( !(rotateCounterClockWise || rotateClockWise || moveLeft || moveRight || moveUp || moveDown) )
	{
		deltaTheta = theta;
		deltaXTranslate = xTranslate;
		deltaYTranslate = yTranslate;
	}
}


