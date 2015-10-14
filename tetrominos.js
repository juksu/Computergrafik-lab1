	/**
	 * construct tetris elements with triangles
	 * we want to have the vertices only on the corners of the block in order to have aligned objects
	 * round the vector values pushed to vertices to achive that
	 */
function spawnSquare()
{
	var vertices = [];
	
	var square = [
			vec2.fromValues(-1, -1), vec2.fromValues(-1, 1), vec2.fromValues(1, -1),
			vec2.fromValues(-1, 1), vec2.fromValues(1, -1), vec2.fromValues(1, 1) ];	
	
	for( var i = 0; i < square.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(square[i][j]);
			
//	for( var i = 0; i < vertices.length; i++ )
//		console.log("vertices[" + i + "]: " + vertices[i] );
			
	return vertices;
}

function spawnIBlock()
{
	var vertices = [];
	
	var iBlock = [
			vec2.fromValues(-0.5, -2), vec2.fromValues(-0.5, 2), vec2.fromValues(0.5, -2),
			vec2.fromValues(-0.5, 2), vec2.fromValues(0.5, -2), vec2.fromValues(0.5, 2) ];
	for( var i = 0; i < iBlock.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			vertices.push(Math.round(iBlock[i][j]));
	
	return vertices;
}

function spawnPodium()
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

///TODO gespiegeltes L und z fehlen noch!
/// TODO rework tetrominos so that center is always at the corner of a block


function spawnRandom()
{
	var random = Math.floor(Math.random() * 5);
	
	switch(random)
	{
		case 0: return spawnSquare();
		case 1:	return spawnIBlock();
		case 2: return spawnPodium();
		case 3: return spawnLBlock();
		case 4: return spawnZBlock();
	}
}
