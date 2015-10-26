var WorldCoordinates = function( xDim, yDim )
{
	// Coordinates always refer to the lower left corner of a block
	// Example a value of x = 0, y = 0, would refer to the block 0 <= x < 1, 0 <= y < 1.
	this.xDim = xDim;
	this.yDim = yDim;
	
	// create the world coordinates
	// coordinates will have either false if not occupied or an Block object if occupied
	this.coordinates = new Array( xDim );		
	for ( var i = 0; i < xDim; i++ )
		this.coordinates[i] = new Array( yDim );
		
	// initialize Array with false = not occupied
	for( var i = 0; i < xDim; i++ )
		for( var j = 0; j < yDim; j++ )
			this.coordinates[i][j] = false;
}

WorldCoordinates.prototype.checkCollision = function( x, y )
{
//	console.log("check for x = " + x + ", y = " + y );
	if( x < 0 || x >= this.xDim )
		return true;
	
	if( y < 0 || y >= this.yDim )
		return true;
	
	if( this.coordinates[x][y] !== false )
		return true;
	
	return false;
}

WorldCoordinates.prototype.addBlock = function( x, y, block )
{
	this.coordinates[x][y] = block;
}

WorldCoordinates.prototype.removeBlock = function( x, y )
{
	this.coordinates[x][y] = false;
}

WorldCoordinates.prototype.isRowFull = function( y )
{
	for( var i = 0; i < this.xDim; i++ )
		if( !(this.checkCollision( i, y )) )
			return true;
	
	return false;
}

WorldCoordinates.prototype.removeRow = function( y )
{
	for( var i = 0; i < this.xDim; i++ )
		this.removeBlock( i, y );
}

WorldCoordinates.prototype.moveDownAbove = function( y, moveDownBy )
{
	// move all rows above y down by the given units
	var j = y;
	for( var i = 0; i < this.xDim; i++ )
		for( ; j < this.yDim-moveDownBy; j++ )
			this.coordinates[i][j] = this.coordinates[i][j+moveDownBy];
			
	// add empty top row(s)
	for( var i = 0; i < this.xDim; i++ )
		for( ; j < this.yDim; j++ )
			this.coordinates[i][j] = false;
}

WorldCoordinates.prototype.printWorldCoordinates = function()
{
	for( var j = this.yDim - 1; j >= 0; j-- )
	{
		var str = "";
		for( var i = 0; i < this.xDim; i++ )
		{
			if( this.checkCollision( i, j ) )
				str = str + "x";
			else
				str = str + ".";
		}
		console.log(str);
	}
}

WorldCoordinates.prototype.renderWorld = function( gl, vPosition, vColor, modelViewMatrixLoc )
{
	for( var i = 0; i < this.xDim; i++ )
		for( var j = 0; j < this.yDim; j++ )
		{
			if( this.coordinates[i][j] !== false )
				this.coordinates[i][j].renderBlock( gl, vPosition, vColor, modelViewMatrixLoc );
		}	
}
