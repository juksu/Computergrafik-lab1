"use strict";

var DIMENSIONS = 2;		// dimension of vertices
var COLORDIMENSIONS = 4;	// dimension of color vectors
var aspectRatio;		// aspect ratio of canvas

var score = 0;

var gl;
var renderID;

var modelViewMatrixLoc;
var perspectiveMatrixLoc;
var perspectiveMatrix = [];

var rotateCounterClockWise = false;
var rotateClockWise = false;
var moveLeft = false;
var moveRight = false;
var moveDown = false;
var moveDownFast = false;

var timeStart;
var timeStopp;
var deltaTime;
var transitionTime = 150;	// the time a transition (movement or rotation) should occupy (in ms)
var transitionTimeFast = 25; 	// the time a fast transition (moving a tetromino down) should occupy per block (in ms)

var isGravity = true;
var gravity = 1000;		// the time after which a tetromino falls one block (in ms)
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
	gl.viewport( 0, 0, canvas.width, canvas.height );		/// TODO viewport: one for playingfield and a second viewport (in the same canvas) for the preview 
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
	timeStart = 0;
	lastFall = timeStart;
	
	renderID = requestAnimFrame(render);
}

function render(now)	// requestAnimationFrame passes us the time since the page was loaded
						// use this to calculate framerateindependent animations
{
//	console.log("render()");
	renderID = requestAnimFrame(render);
	gl.clear( gl.COLOR_BUFFER_BIT );

	worldCoordinates.renderWorld(gl, vPosition, vColor, modelViewMatrixLoc );
	deltaTime = now - timeStart;
	
	if( isGravity && !moveDownFast )
	{
		
		
		if( now - lastFall > gravity )
		{
			if( !checkCollision(tetromino, xTranslate, yTranslate - 1) ) 	/// TODO don't check collision in advance but instead with the fall that would cause the actual collision.
																			/// if this is the case -> endOfTurn
			{
				if( !moveDown )
					yTranslate -= 1;
				moveDown = true;
				lastFall = now;
			}
			else
			{
				// render tetromino to avoid graphical glitch where the tetromino would dissappear for a frame
				tetromino.renderTetromino( gl, vPosition, vColor, modelViewMatrixLoc );
				endOfTurn();
			}
		}	
	}
	
	if( rotateCounterClockWise || rotateClockWise || moveLeft || moveRight || moveDown || moveDownFast )
		moveTetromino();	
	timeStart = now;
	
	tetromino.renderTetromino( gl, vPosition, vColor, modelViewMatrixLoc );
}

function renderRowRemovement(now)
{
	gl.clear( gl.COLOR_BUFFER_BIT );
//	timeStopp = Date.now();
	
	
	deltaTime = now - timeStopp;
	timeStopp = now;
	var deltaY = deltaTime/(transitionTime*5);
//	console.log("deltaY " + deltaY );

	
	if( now - timeStart < transitionTime*5 )
	{
		renderID = requestAnimFrame(renderRowRemovement);
		
		// deltaY can give very different values -> problems with scale
		// -> give hardcoded value but this makes it not framerateindependent
		/// TODO: find better approach
		worldCoordinates.removeRowAnimation(gl, vPosition, vColor, modelViewMatrixLoc, 0.75);
	}
	else if( now - timeStart < transitionTime*10 )
	{
		renderID = requestAnimFrame(renderRowRemovement);	
		worldCoordinates.dropWorldAnimation(gl, vPosition, vColor, modelViewMatrixLoc, -deltaY);
	}
	else
	{
		worldCoordinates.removeRowsAndMoveDown();
		worldCoordinates.rebuildModelViewMatrices();
		worldCoordinates.renderWorld(gl, vPosition, vColor, modelViewMatrixLoc);
		addTetromino();
		requestAnimFrame(render);
	}
}

function renderGameOver()
{
	gl.clearColor( 1.0, 0.0, 0.0, 0.9 );
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	worldCoordinates.renderWorld(gl, vPosition, vColor, modelViewMatrixLoc );
	tetromino.renderTetromino( gl, vPosition, vColor, modelViewMatrixLoc );
}

function controls()
{
	//event listener in case of button press
	document.addEventListener("keydown", function(event) {
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
					isGravity = false;
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
					if( isGravity )		// gravity is in place.
					{
						moveDownFast = true;
						moveDown = false;
						for( var i = 0; i < worldCoordinates.yDim; i++ )
						{
							if( checkCollision(tetromino, xTranslate, yTranslate - i ) )
							{
								yTranslate -= (i-1);
								break;
							}
						}
					}
					else
						isGravity = true;	// reinstate gravity
					// console.log("pressed down");
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

	// calculate new perspectiveMatrix
	perspectiveMatrix = mat4.create();
	mat4.scale(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(scalar,scalar*aspectRatio,1));
	mat4.translate(perspectiveMatrix, perspectiveMatrix, vec3.fromValues(-1/scalar, -1/(scalar*aspectRatio), 0));
	gl.uniformMatrix4fv(perspectiveMatrixLoc, false, new Float32Array(perspectiveMatrix));

	// clear playfield and worldCoordinates and add a new tetromino
	// because of weird aspect ratio the yDim can be a float -> Solution: ceil
	// we want to extend the world a bit beyond to spawn a tetromino above visible area
	// -> add 2 to y-dimension
	worldCoordinates = new WorldCoordinates(sliderValue, Math.ceil(sliderValue/aspectRatio) + 2);		
	tetromino = null;

	addTetromino();
}

function addTetromino()
{	
	console.log(worldCoordinates.printWorldCoordinates());
			
	rotateCounterClockWise = rotateClockWise = false;
	moveLeft = 	moveRight = false;
	moveDown = moveDownFast = false;
	isGravity = true;

	// spawn new tetromino at the top middle
	deltaXTranslate = xTranslate = worldCoordinates.xDim / 2;
	deltaYTranslate = yTranslate = worldCoordinates.yDim - 4;
	deltaTheta = theta = 0;

	tetromino = new Tetromino();
	mat4.identity(tetromino.modelViewMatrix);
	mat4.translate(tetromino.modelViewMatrix, tetromino.modelViewMatrix,
			vec3.fromValues(xTranslate, yTranslate, 0));
			
	tetromino.addVertexBuffer( gl, gl.createBuffer() );
	tetromino.addColorBuffer( gl, gl.createBuffer() );

	lastFall = timeStart;

	// if the tetromino has a collision on spawn the game is over
	if( checkCollision(tetromino, xTranslate, yTranslate) )
	{
		cancelAnimFrame(renderID);
		renderGameOver();
	}
}

function moveTetromino()
{
	// calculate delta value for rotation
	var rotation = (Math.PI/2) * (deltaTime) / transitionTime;
	
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
	var movement = (deltaTime) / transitionTime;
	
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
	
	if( moveDown )
	{
		deltaYTranslate -= movement;
		if( deltaYTranslate <= yTranslate )
		{
			deltaYTranslate = yTranslate;
			moveDown = false;
		}
	}
	
	if( moveDownFast )
	{
		//console.log("moveDownFast = true");
		deltaYTranslate -= (deltaTime) / transitionTimeFast;
		//console.log("deltaYTranslate " + deltaYTranslate );
		if( deltaYTranslate <= yTranslate )
		{
			deltaYTranslate = yTranslate;
			moveDownFast = false;
			
			// we reached collision -> end of turn
			// render tetromino once more to avoid glitch were the tetromino would vanish for a frame
			tetromino.renderTetromino( gl, vPosition, vColor, modelViewMatrixLoc );
			endOfTurn();
		}
	}
	
	// calculate a new modelViewMatrix containing changes
	mat4.identity(tetromino.modelViewMatrix);
	mat4.translate(tetromino.modelViewMatrix, tetromino.modelViewMatrix,
			vec3.fromValues(deltaXTranslate,deltaYTranslate,0));
	mat4.rotateZ(tetromino.modelViewMatrix, tetromino.modelViewMatrix, deltaTheta);
	
	if( !(rotateCounterClockWise || rotateClockWise || moveLeft 
			|| moveRight || moveDown || moveDownFast) )
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


function endOfTurn()
{
	copyTetrominoIntoWorldCoordinates();
	var rows = checkRowsComplete();
	// send the rows to remove to the worldcoordinates so it knows which one to animate
	worldCoordinates.rowsToRemove = rows;
	score += rows.length;
	
	if( rows.length > 0 )
	{
		cancelAnimFrame(renderID);
		requestAnimFrame(renderRowRemovement);
	}
	else
	{
		addTetromino();
	}
}

function copyTetrominoIntoWorldCoordinates()
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

			worldCoordinates.addBlock( 
					Math.floor(xTranslate + tetromino.relativeCoordinates[i][0]),	// x
					Math.floor(yTranslate + tetromino.relativeCoordinates[i][1]),	// y
					bl );
		}	
	}
}

function checkRowsComplete()
{
	var rows = [];
	for( var i = 0; i < 4; i++ )
	{
		// check if the row is complete, if it is and the row is not yet in the array push it there
		if( worldCoordinates.isRowComplete( yTranslate + Math.floor(tetromino.relativeCoordinates[i][1]) ) )
			if( rows.indexOf( (yTranslate + Math.floor(tetromino.relativeCoordinates[i][1]))) == -1 )
				rows.push( yTranslate + Math.floor(tetromino.relativeCoordinates[i][1]) );
	}
	
	// sort in ascending order to have it later easier with removing rows (requires order)
	// Weird javascript sorts only by string value therefore:
	rows.sort(function(a, b){return a-b});
	
	return rows;
}
