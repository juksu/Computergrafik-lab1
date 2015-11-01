var WorldCoordinates = function( xDim, yDim )
{
	// Coordinates always refer to the lower left corner of a block
	// Example a value of x = 0, y = 0, would refer to the block 0 <= x < 1, 0 <= y < 1.
	this.xDim = xDim;
	this.yDim = yDim;
	this.rowsToRemove = [];
	
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

WorldCoordinates.prototype.isRowComplete = function( y )
{
	for( var i = 0; i < this.xDim; i++ )	
		if( !(this.checkCollision( i, y )) )
			return false;
	
	return true;
}

WorldCoordinates.prototype.removeRow = function( y )
{
	for( var i = 0; i < this.xDim; i++ )
		this.removeBlock( i, y );
}

WorldCoordinates.prototype.removeRowsAndMoveDown = function()
{	
	// start from highest row
	for( var k = this.rowsToRemove.length -1 ; k >= 0; k-- )
	{
		for( var j = this.rowsToRemove[k]; j < this.yDim-1; j++ )
		{
			for( var i = 0; i < this.xDim; i++ )
			{
				this.coordinates[i][j] = this.coordinates[i][j+1];
			}
			// add empty top row
			for( var i = 0; i < this.xDim; i++ )
				this.coordinates[i][this.yDim-1] = false;
		}	
	}
}

// use this to perfectly align the drawn position of the blocks with their worldcoordinates position
WorldCoordinates.prototype.rebuildModelViewMatrices = function()
{
	for( var i = 0; i < this.xDim; i++ )
		for( var j = 0; j < this.yDim; j++ )
		{
			if( this.coordinates[i][j] !== false )
			{
				mat4.identity(this.coordinates[i][j].modelViewMatrix);
				mat4.translate(this.coordinates[i][j].modelViewMatrix, 
						this.coordinates[i][j].modelViewMatrix, 
						vec4.fromValues(i,j,0));
			}
		}
}

WorldCoordinates.prototype.printWorldCoordinates = function()
{
	var string = "";
	
	for( var i = 0; i < this.xDim + 2; i++ )
		string += "-";
	string += "\n";
	
	for( var j = this.yDim - 1; j >= 0; j-- )
	{
		string += "|";
		for( var i = 0; i < this.xDim; i++ )
		{
			if( this.checkCollision( i, j ) )
				string += "x";
			else
				string += ".";
		}
		string += "|\n";
	}
	
	for( var i = 0; i < this.xDim + 2; i++ )
		string += "-";

	return string;
}

WorldCoordinates.prototype.renderWorld = function( gl, vPosition, vColor, modelViewMatrixLoc )
{
	/// TODO: render grid as well
	
	for( var i = 0; i < this.xDim; i++ )
		for( var j = 0; j < this.yDim; j++ )
		{
			if( this.coordinates[i][j] !== false )
				this.coordinates[i][j].renderBlock( gl, vPosition, vColor, modelViewMatrixLoc );
		}	
}

WorldCoordinates.prototype.removeRowAnimation = function( gl, vPosition, vColor, modelViewMatrixLoc, deltaY )
{
	// scale the rows out of existance
	for( var k = 0; k < this.rowsToRemove.length; k++ )
	{
		for( var i = 0; i < this.xDim; i++ )
		{
			mat4.scale(this.coordinates[i][this.rowsToRemove[k]].modelViewMatrix, 
					this.coordinates[i][this.rowsToRemove[k]].modelViewMatrix, 
					vec3.fromValues(deltaY,deltaY,1));
		}
	}
	this.renderWorld(gl, vPosition, vColor, modelViewMatrixLoc);
}


WorldCoordinates.prototype.dropWorldAnimation = function( gl, vPosition, vColor, modelViewMatrixLoc, deltaY )		/// TODO: call this function in function for animateWorld
{
	// a row > rowsToRemove[k] and row < rowsToRemove[k+1] drops by deltaY * (k+1)  (zero based)
	var k = 0;
	for( ; k < this.rowsToRemove.length - 1; k++ )
		for( var j = this.rowsToRemove[k]; j < this.rowsToRemove[k+1]; j++ )
			for( var i = 0; i < this.xDim; i++ )
			{
				if( this.coordinates[i][j] !== false )
				{
					mat4.translate(this.coordinates[i][j].modelViewMatrix, 
						this.coordinates[i][j].modelViewMatrix, 
						vec4.fromValues(0,deltaY*(k+1),0));
				}
			}

			
	// rows above the highest rowToRemove	
	for( var j = this.rowsToRemove[k]; j < this.yDim; j++ )
			for( var i = 0; i < this.xDim; i++ )
			{
				if( this.coordinates[i][j] !== false )
				{
					mat4.translate(this.coordinates[i][j].modelViewMatrix, 
						this.coordinates[i][j].modelViewMatrix, 
						vec4.fromValues(0,deltaY*(k+1),0));
				}
			}
	
	this.renderWorld(gl, vPosition, vColor, modelViewMatrixLoc);
}
