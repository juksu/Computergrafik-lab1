var Block = function(modelViewMatrix, color)
{
	this.vertices = [];
	this.modelViewMatrix = modelViewMatrix;
	this.color = color;
	
	var square = [
			vec2.fromValues(0, 0), vec2.fromValues(0, 1), vec2.fromValues(1, 0),
			vec2.fromValues(0, 1), vec2.fromValues(1, 0), vec2.fromValues(1, 1) ];	
	
	for( var i = 0; i < square.length; i++ )
		for( var j = 0; j < DIMENSIONS; j++ )
			this.vertices.push(square[i][j]);			
}

Block.prototype.addVertexBuffer = function( gl, vertexBuffer )
{
	this.vertexBuffer = vertexBuffer;
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );
}

Block.prototype.addColorBuffer = function( gl, colorBuffer )
{
	this.colorBuffer = colorBuffer;
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW );
}

Block.prototype.renderBlock = function( gl, vPosition, vColor, modelViewMatrixLoc )
{
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );		/// TODO Do something about DIMENSIONS and COLORDIMENSIONS
		
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer );
	gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );		/// TODO Do something about DIMENSIONS and COLORDIMENSIONS
		
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(this.modelViewMatrix));
		
	gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length/DIMENSIONS );		/// TODO Do something about DIMENSIONS and COLORDIMENSIONS
}
