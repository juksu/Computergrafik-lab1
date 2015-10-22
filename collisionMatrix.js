var collisionMatrix = function(xDim, yDim)
{
	this.xDim = xDim;
	this.yDim = yDim;
	
	// create the collision matrix
	var matrix = new Array(xDim);
	for (var i = 0; i < xDim; i++)
		matrix[i] = new Array(yDim);
		
	// initialize Array with false = not occupied
	for( var i = 0; i < xDim; i++ )
		for( var j = 0; j < yDim; j++ )
			matrix[i][j] = false;
}

/**
 * ask if place in matrix is occupied
 */
collisionMatrix.prototype.isOccupied(x, y)
{
	return this.matrix[x][y];
}

/**
 * x and y represent the coordinates where the new object should be placed
 * localCollisionCoordinates is an array containing the collision coordinates [x,y] of the added object
 */
collisionMatrix.prototype.addObject( x, y, localCollisionCoordinates )
{
	for( var i = 0; i < localCollisionCoordinates.length; i++ )
	{
		this.matrix[x + localCollisionCoordinates[i][0]][y + localCollisionCoordinates[i][1]] = true;
	}
}

collisionMatrix.prototype.makeFree(x, y)
{
	this.matrix[x][y] = false;
}

