var WorldCoordinates = function( xDim, yDim )
{
	// Coordinates always refer to the lower left corner of a block
	// Example a value of x = 0, y = 0, would refer to the block 0 <= x < 1, 0 <= y < 1.
	this.xDim = xDim;
	this.yDim = yDim;
	this.lowestYAnimation = 0;
	
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

WorldCoordinates.prototype.isRowComplete = function( y )
{
	console.log("is Row " + y + " complete");
	for( var i = 0; i < this.xDim; i++ )
	{		
		console.log("check collision for (" + i + "," + y + ")");
		if( !(this.checkCollision( i, y )) )
		{
			console.log("no row!");
			return false;
		}
	}
	
	return true;
}

WorldCoordinates.prototype.removeRow = function( y )
{
	for( var i = 0; i < this.xDim; i++ )
		this.removeBlock( i, y );
}

WorldCoordinates.prototype.removeRowsAndMoveDown = function( y )		/// instead provide here array -> array.length will be rows to move down
{
	console.log( "removeRowAndMoveDown " + y );
	
	/// TODO maybe array here
	//this.lowestYAnimation = y;

	if( y < this.yDim - 1 )
	{
		for( ; y < this.yDim - 1; y++ )
		{	
			for( var i = 0; i < this.xDim; i++ )
			{
				this.coordinates[i][y] = this.coordinates[i][y+1];

				if( this.coordinates[i][y] )
				{
					mat4.translate(this.coordinates[i][y].modelViewMatrix, 
							this.coordinates[i][y].modelViewMatrix, 
							vec4.fromValues(0,-1,0));
				}
			}
		}
	}
	for( var i = 0; i < this.xDim; i++ )
			this.coordinates[i][this.yDim - 1] = false;		
	
	/// TODO: after this play the rowRemoveAnimation
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
	for( var i = 0; i < this.xDim; i++ )
		for( var j = 0; j < this.yDim; j++ )
		{
			if( this.coordinates[i][j] !== false )
				this.coordinates[i][j].renderBlock( gl, vPosition, vColor, modelViewMatrixLoc );
		}	
}

WorldCoordinates.prototype.rowRemoveAnimation = function( gl, vPosition, vColor, modelViewMatrixLoc )		/// TODO: call this function in function for animateWorld
{
	deltaY = 0.02;
	
	for( var i = 0; i < this.xDim; i++ )
		for( var j = 0; j < this.lowestYAnimation; j++ )
		{
			if( this.coordinates[i][j] !== false )
				this.coordinates[i][j].renderBlock( gl, vPosition, vColor, modelViewMatrixLoc );
		}
	
	// change the model View Matrix for the Movement
	for( var i = 0; i < this.xDim; i++ )
		for( var j = this.lowestYAnimation; j < this.yDim; j++ )
		{
			if( this.coordinates[i][j] )
			{
				mat4.translate(this.coordinates[i][j].modelViewMatrix, 
						this.coordinates[i][j].modelViewMatrix, 
						vec4.fromValues(0,deltaY,0));
			}
		}
	
	for( var i = 0; i < this.xDim; i++ )
		for( var j = this.lowestYAnimation; j < this.yDim; j++ )
		{
			if( this.coordinates[i][j] !== false )
				this.coordinates[i][j].renderBlock( gl, vPosition, vColor, modelViewMatrixLoc );
		}
}
