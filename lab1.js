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
var transitionTime = 250;	// the time a transition (movement or rotation) should occupy (in ms)
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

var worldCoordinates;

var tetrominoHolder = [];

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
	// since the perspective matrix stays the same throughout it only needs to be set once
	gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));
			
	controls();
	timeStart = Date.now();
	lastFall = timeStart;
	
	render();
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );

	// instead of tetrominoHolder draw worldCoordinates
	worldCoordinates.renderWorld(gl, vPosition, vColor, modelViewMatrixLoc );


/*	for( var i = 0; i < tetrominoHolder.length - 1; i++ )
	{		
		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferHolder[i] );
		gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferHolder[i] );
		gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(tetrominoHolder[i].modelViewMatrix));
//		gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));
		
		gl.drawArrays( gl.TRIANGLES, 0, tetrominoHolder[i].vertices.length/DIMENSIONS );
	}
*/
	timeStopp = Date.now();
/*	if( timeStopp - lastFall > gravity )
	{
		moveDown = true;
		yTranslate -= 1;
		lastFall = timeStopp;
	}
*/	
	
	/// TODO if moveWorld moveWorld(), else if( rotate...) moveActive()
	/// mutually exclusive
	//
	if( rotateCounterClockWise || rotateClockWise || moveLeft || moveRight || moveUp || moveDown )
		move();
		
	timeStart = timeStopp;

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
//	gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));
	
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
	//event listener in case of button press
	document.addEventListener("keydown", function(event) {
				
				/// TODO: check in all events if collision is happening
				switch(event.keyCode)
				{
					case 76:	// l
					case 37:	// arrow left
							if( !checkCollision(tetrominoHolder[tetrominoHolder.length - 1], 
									xTranslate - 1, yTranslate) )
							{
								if( !moveLeft )
									xTranslate -= 1;
								moveLeft = true;
								moveRight = false;
								// console.log("pressed left");
							}
							break;							
					case 85:	// u
					case 38:	// arrow up
							if( !checkCollision(tetrominoHolder[tetrominoHolder.length - 1],
									xTranslate, yTranslate + 1) )
							{
								if( !moveUp )
									yTranslate += 1;
								moveUp = true;
								moveDown = false;
								// console.log("pressed up");
							}
							break;
					case 82:	// r
					case 39:	// arrow right
							if( !checkCollision(tetrominoHolder[tetrominoHolder.length - 1], 
									xTranslate + 1, yTranslate) )
							{
								if( !moveRight )
									xTranslate += 1;
								moveRight = true;
								moveLeft = false;
								// console.log("pressed right");
							}
							break;
					case 68:	// d
					case 40: 	// arrow down
							if( !checkCollision(tetrominoHolder[tetrominoHolder.length - 1], 
									xTranslate, yTranslate - 1) )
							{
								if( !moveDown )
									yTranslate -= 1;
								moveDown = true;
								moveUp = false;
								// console.log("pressed down");
							}
							break;
					case 49: 	// 1
							/// TODO: checkCollision as before but this time provide also an rotation Matrix
							/// If the rotation can be performed the relative coordinates have to be updated to the new rotation
							if( !checkCollision(tetrominoHolder[tetrominoHolder.length - 1], 
									xTranslate, yTranslate, -1) )
							{
								if( !rotateCounterClockWise )
								{
									theta += Math.PI/2;
									var temp;
									// if we have a rotation we need to save the new relative coordinates
									for( var i = 0; i < 4; i++ )
									{
										temp = tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][0];
										tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][0] = 
												-tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][1];
										tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][1] = temp;
									}
								}
								rotateCounterClockWise = true;
								rotateClockWise = false;
								// console.log("pressed 1");
							}
							break;
					case 51:	// 3
							if( !checkCollision(tetrominoHolder[tetrominoHolder.length - 1], 
									xTranslate, yTranslate, 1) )
							{
								if( !rotateClockWise )
								{
									theta -= Math.PI/2;
									var temp;
									// if we have a rotation we need to save the new relative coordinates
									for( var i = 0; i < 4; i++ )
									{
										temp = tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][0];
										tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][0] = 
												tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][1];
										tetrominoHolder[tetrominoHolder.length - 1].relativeCoordinates[i][1] = -temp;
									}
									
								}
								rotateClockWise = true;
								rotateCounterClockWise = false;
								// console.log("pressed 3");
							}
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

	// clear playfield and worldCoordinates and add a new tetromino
	// because of weird aspect ratio the yDim can be a float -> Solution: ceil
	worldCoordinates = new WorldCoordinates(sliderValue, Math.ceil(sliderValue/aspectRatio));		
	console.log("xDim " + worldCoordinates.xDim + ", yDim " + worldCoordinates.yDim );		///TODO remove

	// calculate new perspectiveMatrix
	perspectiveMatrix = mat4.create();
	mat4.scale(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(-1/scalar, -1/(scalar*aspectRatio), 0));
	gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));

	tetrominoHolder = [];
	vertexBufferHolder = [];
	addTetromino();
}

function addTetromino()
{	
	// copy the modelViewMatrix into the tetrominoholder
	if( tetrominoHolder.length > 0 )
		tetrominoHolder[tetrominoHolder.length-1].modelViewMatrix = mat4.clone(modelViewMatrix);
		
	/// TODO: copy the Blocks of the old Tetromino into the worldCoordinates
	/// xTranslate and yTranslate hold the position from which the relative position is calculated
	if( tetrominoHolder.length > 0 )	/// TODO: change if tetrominoHolder is removed
	{
		for( var i = 0; i < 4; i++ )		// 4 = numOfBlocks = always 4
		{
			var bl = new Block( mat4.create(), tetrominoHolder[tetrominoHolder.length-1].color );
			mat4.translate(bl.modelViewMatrix, bl.modelViewMatrix, 
					vec3.fromValues(
							Math.floor(xTranslate + tetrominoHolder[tetrominoHolder.length-1].relativeCoordinates[i][0]),	//x
							Math.floor(yTranslate + tetrominoHolder[tetrominoHolder.length-1].relativeCoordinates[i][1]),	//y
							0));
			bl.addVertexBuffer( gl, gl.createBuffer() );
			bl.addColorBuffer( gl, gl.createBuffer() );
					
			console.log(xTranslate + tetrominoHolder[tetrominoHolder.length-1].relativeCoordinates[i][0]);
			console.log(yTranslate + tetrominoHolder[tetrominoHolder.length-1].relativeCoordinates[i][1]);
			worldCoordinates.addBlock( 
					Math.floor(xTranslate + tetrominoHolder[tetrominoHolder.length-1].relativeCoordinates[i][0]),
					Math.floor(yTranslate + tetrominoHolder[tetrominoHolder.length-1].relativeCoordinates[i][1]),
					bl );
					
//			bl.renderBlock( gl, vPosition, vColor, modelViewMatrixLoc );
		}	
	}
	
	worldCoordinates.printWorldCoordinates();
		
	
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
	
	deltaXTranslate = xTranslate = 5;
	deltaYTranslate = yTranslate = 3;
	
	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(xTranslate, yTranslate, 0));
	
	// get new tetromino and push it into tetrominoHolder
//	tetrominoHolder.push(new Tetromino(spawnRandom(), modelViewMatrix));
	tetrominoHolder.push(new Tetromino());
	console.log(tetrominoHolder[tetrominoHolder.length-1].vertices.toString());
//	.Tetromino.vertices.toString());
		
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
	/// TODO: i have to remember the rotation of the tetromino OR change the relativeCollisionCoordinates
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

function checkCollision(tetromino, xTrans, yTrans, rotationMatrix)
{
	// if a rotationMatrix is provided perform a rotation on the relativeCoordinates
	if( rotationMatrix === -1 )		// -1 for counterclockwise rotation
	{
		for( var i = 0; i < 4; i++ )
		{			
			if( worldCoordinates.checkCollision(
					Math.floor(-tetromino.relativeCoordinates[i][1]) + xTrans, 
					Math.floor(tetromino.relativeCoordinates[i][0]) + yTrans) )
				return true;
		}
	}
	else if( rotationMatrix === 1 )		// -1 for counterclockwise rotation
	{
		for( var i = 0; i < 4; i++ )
		{			
			if( worldCoordinates.checkCollision(
					Math.floor(tetromino.relativeCoordinates[i][1]) + xTrans, 
					Math.floor(-tetromino.relativeCoordinates[i][0]) + yTrans) )
				return true;
		}
	}	
	else
	{
		for( var i = 0; i < 4; i++ )
		{
//			console.log(tetromino.relativeCoordinates[i]);
			if( worldCoordinates.checkCollision(
					Math.floor(tetromino.relativeCoordinates[i][0]) + xTrans, 
					Math.floor(tetromino.relativeCoordinates[i][1]) + yTrans ) )
				return true;
		}
	}
	return false;	
}


