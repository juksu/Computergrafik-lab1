/*
function Tetromino( vertices, modelViewMatrix, relativeCollisionCoordinates )	///TODO local collision coordinates
{	
	this.vertices = vertices;
	this.modelViewMatrix = modelViewMatrix;
	this.relativeCollisionCoordinates = relativeCollisionCoordinates;
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
    
    
    // relative coordinates of the collision
}
*/


function Tetromino()
{	
	/**
	 * construct tetris elements with triangles
	 * we want to have the vertices only on the corners of the block in order to have aligned objects
	 * round the vector values pushed to vertices to achive that
	 */
	function spawnSquare(vertices, relativeCoordinates)
	{
		var square = [
				vec2.fromValues(-1, -1), vec2.fromValues(-1, 1), vec2.fromValues(1, -1),
				vec2.fromValues(-1, 1), vec2.fromValues(1, -1), vec2.fromValues(1, 1) ];	
		
		for( var i = 0; i < square.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(square[i][j]);
		
		// relative coordinates refer to the center of each block
		// by this it will be easier to perform rotations by a simple multiplication with a rotation matrix
		relativeCoordinates.push(vec2.fromValues(-0.5, -0.5));
		relativeCoordinates.push(vec2.fromValues(-0.5, 0.5));
		relativeCoordinates.push(vec2.fromValues(0.5, -0.5));
		relativeCoordinates.push(vec2.fromValues(0.5, 0.5));
	}

	function spawnIBlock(vertices, relativeCoordinates)
	{	
		var iBlock = [
				vec2.fromValues(-2, 0), vec2.fromValues(2, 0), vec2.fromValues(-2, 1),
				vec2.fromValues(2, 0), vec2.fromValues(-2, 1), vec2.fromValues(2, 1) ];
		for( var i = 0; i < iBlock.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(Math.round(iBlock[i][j]));
		
		relativeCoordinates.push(vec2.fromValues(-1.5,0.5));
		relativeCoordinates.push(vec2.fromValues(-0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(1.5,0.5));
	}

/*	function spawnPodium()
	{	
		var vertices = [];
		
		var podium = [
				vec2.fromValues(-1.5,-1), vec2.fromValues(-1.5, 0), vec2.fromValues(1.5, -1),
				vec2.fromValues(-1.5, 0), vec2.fromValues(1.5, -1), vec2.fromValues(1.5, 0),
				vec2.fromValues(-0.5, 0), vec2.fromValues(-0.5, 1), vec2.fromValues(0.5, 0),
				vec2.fromValues(-0.5, 1), vec2.fromValues(0.5, 0), vec2.fromValues(0.5, 1) ];	

		for( var i = 0; i < podium.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(Math.round(podium[i][j]));

		return vertices;
	}

	function spawnZBlock()
	{
		var vertices = [];
			
		var zBlock = [
				vec2.fromValues(-1.5, -1), vec2.fromValues(-1.5, 0), vec2.fromValues(0.5, -1),
				vec2.fromValues(-1.5, 0), vec2.fromValues(0.5, -1), vec2.fromValues(0.5, 0),
				vec2.fromValues(-0.5, 0), vec2.fromValues(-0.5, 1), vec2.fromValues(1.5, 0),
				vec2.fromValues(-0.5, 1), vec2.fromValues(1.5, 0), vec2.fromValues(1.5, 1) ];
		
		for( var i = 0; i < zBlock.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(Math.round(zBlock[i][j]));
				
		return vertices;
	}

	function spawnLBlock()
	{
		var vertices = [];

		var lBlock = [
				vec2.fromValues(-1, -1.5), vec2.fromValues(-1, 1.5), vec2.fromValues(0, -1.5),
				vec2.fromValues(-1, 1.5), vec2.fromValues(0, -1.5), vec2.fromValues(0, 1.5),
				vec2.fromValues(0, -1.5), vec2.fromValues(0, -0.5), vec2.fromValues(1, -1.5),
				vec2.fromValues(0, -0.5), vec2.fromValues(1, -1.5), vec2.fromValues(1, -0.5) ];

		for( var i = 0; i < lBlock.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(Math.round(lBlock[i][j]));
		
		return vertices;
	}
*/
	function spawnRandom(vertices, relativeCoordinates)
	{
//		var random = Math.floor(Math.random() * 5);
		var random = Math.floor(Math.random() * 2);
		
		switch(random)
		{
			case 0: return spawnSquare(vertices, relativeCoordinates);
			case 1:	return spawnIBlock(vertices, relativeCoordinates);
//			case 2: return spawnPodium();
//			case 3: return spawnLBlock();
//			case 4: return spawnZBlock();
		}
	}
	
	function addColor(vertices)
	{
		var col = [];
		var col1 = (Math.floor(Math.random()*150)+50)/256;
		var col2 = (Math.floor(Math.random()*150)+50)/256;
		var col3 = (Math.floor(Math.random()*150)+50)/256;
			
		for (var i=0; i < vertices.length/DIMENSIONS; i++)
			col = col.concat( [col1, col2, col3, 1.0 ] );
			
		return col;
			
		
	}
	
	this.vertices = [];
	this.relativeCoordinates = [];
	this.modelViewMatrix = [];

	spawnRandom(this.vertices, this.relativeCoordinates);
	this.color = addColor(this.vertices);
	
	// i simply want to have onecolored tetrominos
	// -> assign each vertex the same color value
	// for some fancy rainbowcolor effects assign different colors to the vertices but I was told rainbowcolor is bad ;)
	// should not be to bright or dark -> use only random values between 50 and 200
	
}


