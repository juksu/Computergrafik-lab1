var CollisionMatrix = function(xDim, yDim)
{
	this.xDim = xDim;
	this.yDim = yDim;
	
	// create the collision matrix
	this.matrix = new Array(xDim);
	for (var i = 0; i < xDim; i++)
		this.matrix[i] = new Array(yDim);
		
	// initialize Array with false = not occupied
	for( var i = 0; i < xDim; i++ )
		for( var j = 0; j < yDim; j++ )
			this.matrix[i][j] = false;
}

/**
 * ask if place in matrix is occupied
 */
CollisionMatrix.prototype.isOccupied = function(x, y)
{
	return this.matrix[x][y];
}

/**
 * x and y represent the coordinates where the new object should be placed
 * localCollisionCoordinates is an array containing the collision coordinates [x,y] of the added object
 */
CollisionMatrix.prototype.addObject = function( x, y, localCollisionCoordinates )
{
	for( var i = 0; i < localCollisionCoordinates.length; i++ )
	{
		this.matrix[x + localCollisionCoordinates[i][0]][y + localCollisionCoordinates[i][1]] = true;
	}
}

CollisionMatrix.prototype.makeFree = function(x, y)
{
	this.matrix[x][y] = false;
}

