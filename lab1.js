"use strict";

var DIMENSIONS = 2;		// dimension of vertices
var COLORDIMENSIONS = 4;	// dimension of color vectors
var aspectRatio;		// aspect ratio of canvas

var gl;
var modelViewMatrixLoc;
var perspectiveMatrixLoc;
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

var scalar;		// scalar is changed with size of playing field
var theta = 0;			// rotation
var deltaTheta = 0;
var xTranslate = 0;		// move along x-axis
var deltaXTranslate = 0;
var yTranslate = 0;		// move along y-axis
var deltaYTranslate = 0;

var vPosition;
var vColor;

var worldCoordinates;
var tetromino;

function webGLstart()
{

	var canvas = document.getElementById( "glCanvas" );
	
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl )
		alert( "WebGL is not available" );
	

	// Configure Webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

	aspectRatio = canvas.width/canvas.height;

	//Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );	

	setScalar(10);	// 10 is the standard size

	// Associate out shader variables with our data buffer
	vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	perspectiveMatrixLoc = gl.getUniformLocation(program, "perspectiveMatrix");

	// since the perspective matrix stays the same throughout it only needs to be set once
	perspectiveMatrix = mat4.create();
	mat4.scale(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(-1/scalar, -1/(scalar*aspectRatio), 0));
	gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));
			
	controls();
	timeStart = Date.now();
	lastFall = timeStart;
	
	render();
}

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );

	worldCoordinates.renderWorld(gl, vPosition, vColor, modelViewMatrixLoc );
	
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
	if( rotateCounterClockWise || rotateClockWise || moveLeft || moveRight || moveUp || moveDown )
		move();
		
	timeStart = timeStopp;
	
	tetromino.renderTetromino( gl, vPosition, vColor, modelViewMatrixLoc );
		
	// request browser to display the rendering the next time it wants to refresh the display
	// and then call the render function recorsively
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
						if( !checkCollision( tetromino, xTranslate - 1, yTranslate) )
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
						if( !checkCollision(tetromino,	xTranslate, yTranslate + 1 ) )
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
						if( !checkCollision(tetromino, xTranslate + 1, yTranslate) )
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
						if( !checkCollision(tetromino, xTranslate, yTranslate - 1) )
						{
							if( !moveDown )
								yTranslate -= 1;
							moveDown = true;
							moveUp = false;
							// console.log("pressed down");
						}
						break;
					case 49: 	// 1
						if( !checkCollision(tetromino, xTranslate, yTranslate, -1) )
						{
							if( !rotateCounterClockWise )
							{
								theta += Math.PI/2;
								var temp;
								// a rotation changes also the relative coordinates
								// therefore they need to be changed if we have a rotation
								for( var i = 0; i < 4; i++ )
								{
									temp = tetromino.relativeCoordinates[i][0];
									tetromino.relativeCoordinates[i][0] = -tetromino.relativeCoordinates[i][1];
									tetromino.relativeCoordinates[i][1] = temp;
								}
							}
							rotateCounterClockWise = true;
							rotateClockWise = false;
							// console.log("pressed 1");
						}
						break;
					case 51:	// 3
						if( !checkCollision(tetromino, xTranslate, yTranslate, 1) )
						{
							if( !rotateClockWise )
							{
								theta -= Math.PI/2;
								var temp;
								// a rotation changes also the relative coordinates
								// therefore they need to be changed if we have a rotation
								for( var i = 0; i < 4; i++ )
								{
									temp = tetromino.relativeCoordinates[i][0];
									tetromino.relativeCoordinates[i][0] = tetromino.relativeCoordinates[i][1];
									tetromino.relativeCoordinates[i][1] = -temp;
								}
								
							} rotateClockWise = true;
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

	// calculate new perspectiveMatrix
	perspectiveMatrix = mat4.create();
	mat4.scale(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(-1/scalar, -1/(scalar*aspectRatio), 0));
	gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));

	// clear playfield and worldCoordinates and add a new tetromino
	// because of weird aspect ratio the yDim can be a float -> Solution: ceil
	worldCoordinates = new WorldCoordinates(sliderValue, Math.ceil(sliderValue/aspectRatio));		
	tetromino = null;

	addTetromino();
}

function addTetromino()
{	
	if( tetromino )		// returns true if tetromino is not null or undefined
	{
		for( var i = 0; i < 4; i++ )		// numOfBlocks is always 4
		{
			var bl = new Block( mat4.create(), tetromino.color );
			mat4.translate(bl.modelViewMatrix, bl.modelViewMatrix, 
					vec3.fromValues(
							Math.floor(xTranslate + tetromino.relativeCoordinates[i][0]),	//x
							Math.floor(yTranslate + tetromino.relativeCoordinates[i][1]),	//y
							0));
			bl.addVertexBuffer( gl, gl.createBuffer() );
			bl.addColorBuffer( gl, gl.createBuffer() );
					
			console.log(xTranslate + tetromino.relativeCoordinates[i][0]);
			console.log(yTranslate + tetromino.relativeCoordinates[i][1]);

			worldCoordinates.addBlock( 
					Math.floor(xTranslate + tetromino.relativeCoordinates[i][0]),
					Math.floor(yTranslate + tetromino.relativeCoordinates[i][1]),
					bl );
		}	
	}
	
	worldCoordinates.printWorldCoordinates();
			
	rotateCounterClockWise = rotateClockWise = false;
	moveLeft = 	moveRight = false;
	moveUp = moveDown = false;

	// spawn at random position
/*	xTranslate = Math.floor(Math.random()/scalar) - 1;
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
*/
	deltaTheta = theta = 0;	
	deltaXTranslate = xTranslate = 5;
	deltaYTranslate = yTranslate = 3;

	tetromino = new Tetromino();
	mat4.identity(tetromino.modelViewMatrix);
	mat4.translate(tetromino.modelViewMatrix, tetromino.modelViewMatrix,
			vec3.fromValues(xTranslate, yTranslate, 0));

	tetromino.addVertexBuffer( gl, gl.createBuffer() );
	tetromino.addColorBuffer( gl, gl.createBuffer() );
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
	mat4.identity(tetromino.modelViewMatrix);
	mat4.translate(tetromino.modelViewMatrix, tetromino.modelViewMatrix,
			vec3.fromValues(deltaXTranslate,deltaYTranslate,0));
	mat4.rotateZ(tetromino.modelViewMatrix, tetromino.modelViewMatrix, deltaTheta);
	
	if( !(rotateCounterClockWise || rotateClockWise || moveLeft || moveRight || moveUp || moveDown) )
	{
		deltaTheta = theta;
		deltaXTranslate = xTranslate;
		deltaYTranslate = yTranslate;
	}
}

function checkCollision( tetromino, xTrans, yTrans, rotationMatrix )
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
	else if( rotationMatrix === 1 )		// 1 for clockwise rotation
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
			if( worldCoordinates.checkCollision(
					Math.floor(tetromino.relativeCoordinates[i][0]) + xTrans, 
					Math.floor(tetromino.relativeCoordinates[i][1]) + yTrans ) )
				return true;
		}
	}
	return false;	
}
