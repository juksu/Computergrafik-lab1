var WorldMatrix = function(xDim, yDim)
{
	// Coordinates always refer to the lower left corner of the matrix
	// Example a value of x = 0, y = 0, would refer to the block 0 <= x < 1, 0 <= y < 1.
	this.xDim = xDim;
	this.yDim = yDim;
	
	// create the world matrix
	// matrix will have either false if not occupied or an Block object if occupied
	this.matrix = new Array(xDim);		
	for (var i = 0; i < xDim; i++)
		this.matrix[i] = new Array(yDim);
		
	// initialize Array with false = not occupied
	for( var i = 0; i < xDim; i++ )
		for( var j = 0; j < yDim; j++ )
			this.matrix[i][j] = false;
}

WorldMatrix.prototype.checkCollision = function(x, y)
{
	console.log("check for x = " + x + ", y = " + y );
	if( x < 0 || x >= this.xDim )
		return true;
	
	if( y < 0 || y >= this.yDim )
		return true;
	
	if( this.matrix[x][y] !== false )		/// TODO: error?
		return true;
	
	return false;
}

WorldMatrix.prototype.addBlock = function(x, y, block)
{
	this.matrix[x][y] = block;
}

WorldMatrix.prototype.removeBlock = function(x, y )
{
	this.matrix[x][y] = false;
}

WorldMatrix.prototype.isRowFull = function( y )
{
	for( var i = 0; i < this.matrix.length; i++ )
		if( !(this.checkCollision(i, y)) )
			return true;
	
	return false;
}

WorldMatrix.prototype.removeRow = function( y )
{
	for( var i = 0; i < this.matrix.length; i++ )
		this.removeBlock( i, y );
}

WorldMatrix.prototype.moveDownAbove = function( y )
{
	// move all rows above y down one unit
	for( var i = 0; i < this.matrix.length; i++ )
		for( var j = y; j < this.yDim-1; j++ )
			this.matrix[i][j] = this.matrix[i][j+1];
			
	// add empty top row
	for( var i = 0; i < this.matrix.length; i++ )
		this.matrix[i][this.yDim-1] = false;
}

WorldMatrix.prototype.printWorldMatrix = function()
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
