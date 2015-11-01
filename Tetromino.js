var Tetromino = function()
{	
	/**
	 * construct tetris elements with triangles
	 * we want to have the vertices only on the corners of the block in order to have aligned objects
	 * round the vector values pushed to vertices to achive that
	 */
	function spawnO(vertices, relativeCoordinates)
	{
		var O = [
				vec2.fromValues(-1, -1), vec2.fromValues(-1, 1), vec2.fromValues(1, -1),
				vec2.fromValues(-1, 1), vec2.fromValues(1, -1), vec2.fromValues(1, 1) ];	
		
		for( var i = 0; i < O.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(O[i][j]);
		
		// relative coordinates refer to the center of each block
		// by this it will be easier to perform rotations by a simple multiplication with a rotation matrix
		relativeCoordinates.push(vec2.fromValues(-0.5, -0.5));
		relativeCoordinates.push(vec2.fromValues(-0.5, 0.5));
		relativeCoordinates.push(vec2.fromValues(0.5, -0.5));
		relativeCoordinates.push(vec2.fromValues(0.5, 0.5));
	}

	function spawnI(vertices, relativeCoordinates)
	{	
		var I = [
				vec2.fromValues(-2, 0), vec2.fromValues(2, 0), vec2.fromValues(-2, 1),
				vec2.fromValues(2, 0), vec2.fromValues(-2, 1), vec2.fromValues(2, 1) ];
		for( var i = 0; i < I.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(I[i][j]);
		
		relativeCoordinates.push(vec2.fromValues(-1.5,0.5));
		relativeCoordinates.push(vec2.fromValues(-0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(1.5,0.5));
	}

	function spawnT(vertices, relativeCoordinates)
	{	
		var T = [
				vec2.fromValues(-1,-1), vec2.fromValues(-1, 0), vec2.fromValues(2, -1),
				vec2.fromValues(-1, 0), vec2.fromValues(2, -1), vec2.fromValues(2, 0),
				vec2.fromValues(0, 0), vec2.fromValues(0, 1), vec2.fromValues(1, 0),
				vec2.fromValues(0, 1), vec2.fromValues(1, 0), vec2.fromValues(1, 1) ];

		for( var i = 0; i < T.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(T[i][j]);

		relativeCoordinates.push(vec2.fromValues(-0.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(1.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,0.5));	
	}

	function spawnS(vertices, relativeCoordinates)
	{
		var S = [
				vec2.fromValues(-1, -1), vec2.fromValues(-1, 0), vec2.fromValues(1, -1),
				vec2.fromValues(-1, 0), vec2.fromValues(1, -1), vec2.fromValues(1, 0),
				vec2.fromValues(0, 0), vec2.fromValues(0, 1), vec2.fromValues(2, 0),
				vec2.fromValues(0, 1), vec2.fromValues(2, 0), vec2.fromValues(2, 1) ];
		
		for( var i = 0; i < S.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(S[i][j]);
		
		relativeCoordinates.push(vec2.fromValues(-0.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(1.5,0.5));	
	}
	
	function spawnZ(vertices, relativeCoordinates)
	{
		var Z = [
				vec2.fromValues(0, -1), vec2.fromValues(0, 0), vec2.fromValues(2, -1),
				vec2.fromValues(0, 0), vec2.fromValues(2, -1), vec2.fromValues(2, 0),
				vec2.fromValues(-1, 0), vec2.fromValues(-1, 1), vec2.fromValues(1, 0),
				vec2.fromValues(-1, 1), vec2.fromValues(1, 0), vec2.fromValues(1, 1) ];
		
		for( var i = 0; i < Z.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(Z[i][j]);
		
		relativeCoordinates.push(vec2.fromValues(0.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(1.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(-0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,0.5));	
	}


	function spawnL(vertices, relativeCoordinates)
	{
		var L = [
				vec2.fromValues(-1, -1), vec2.fromValues(-1, 1), vec2.fromValues(0, -1),
				vec2.fromValues(-1, 1), vec2.fromValues(0, -1), vec2.fromValues(0, 1),
				vec2.fromValues(0, 0), vec2.fromValues(0, 1), vec2.fromValues(2, 0),
				vec2.fromValues(0, 1), vec2.fromValues(2, 0), vec2.fromValues(2, 1) ];

		for( var i = 0; i < L.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(L[i][j]);

		relativeCoordinates.push(vec2.fromValues(-0.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(-0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(1.5,0.5));	
	}

	function spawnJ(vertices, relativeCoordinates)
	{
		var J = [
				vec2.fromValues(0, -1), vec2.fromValues(0, 1), vec2.fromValues(1, -1),
				vec2.fromValues(0, 1), vec2.fromValues(1, -1), vec2.fromValues(1, 1),
				vec2.fromValues(-2, 0), vec2.fromValues(-2, 1), vec2.fromValues(0, 0),
				vec2.fromValues(-2, 1), vec2.fromValues(0, 0), vec2.fromValues(0, 1) ];

		for( var i = 0; i < J.length; i++ )
			for( var j = 0; j < DIMENSIONS; j++ )
				vertices.push(J[i][j]);

		relativeCoordinates.push(vec2.fromValues(0.5,-0.5));
		relativeCoordinates.push(vec2.fromValues(-1.5,0.5));
		relativeCoordinates.push(vec2.fromValues(-0.5,0.5));
		relativeCoordinates.push(vec2.fromValues(0.5,0.5));	
	}

	function spawnRandom(vertices, relativeCoordinates )
	{
		var random = Math.floor(Math.random() * 7);
		
		switch(random)
		{
			case 0: spawnO(vertices, relativeCoordinates);
					break;
			case 1:	spawnI(vertices, relativeCoordinates);
					break;
			case 2: spawnT(vertices, relativeCoordinates);
					break;
			case 3: spawnS(vertices, relativeCoordinates);
					break;
			case 4: spawnZ(vertices, relativeCoordinates);
					break;
			case 5: spawnL(vertices, relativeCoordinates);
					break;
			case 6: spawnJ(vertices, relativeCoordinates);
					break;
		}
		
		// add always the same texture to the same kind of tetromino, could be randomized as well
	}
	
	function addColor(vertices)
	{
		// i simply want to have onecolored tetrominos
		// -> assign each vertex the same color value
		// for some fancy rainbowcolor effects assign different colors to the vertices but I was told rainbowcolor is bad ;)
		// should not be to bright or dark -> use only random values between 50 and 200
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
	
//	this.textureImage = new Image();
//	this.textureImage.onload = function() { configureTexture( this.textureImage ) };
//	textureImage.src = "textures/tex0.gif";
	
	spawnRandom(this.vertices, this.relativeCoordinates);
	
	this.color = addColor(this.vertices);

	this.modelViewMatrix = [];
}

Tetromino.prototype.addVertexBuffer = function( gl, vertexBuffer )
{
	this.vertexBuffer = vertexBuffer;
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );
}

Tetromino.prototype.addColorBuffer = function( gl, colorBuffer )
{
	this.colorBuffer = colorBuffer;
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW );
}

Tetromino.prototype.addTextureBuffer = function( gl, textureBuffer )
{
	var textureArray = [
				vec2.fromValues(0, 0), vec2.fromValues(0, 1), vec2.fromValues(1, 1),
				vec2.fromValues(0, 0), vec2.fromValues(1, 1), vec2.fromValues(1, 0) ];
	
	this.textureBuffer = textureBuffer;
	gl.bindBuffer( gl.ARRAY_BUFFER, this.textureBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW );
}

Tetromino.prototype.renderTetromino = function( gl, vPosition, vColor, vTexCoord, texture, modelViewMatrixLoc )
{	
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
	gl.vertexAttribPointer( vPosition, DIMENSIONS, gl.FLOAT, false, 0, 0 );		/// TODO Do something about DIMENSIONS and COLORDIMENSIONS
		
	gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
	gl.vertexAttribPointer( vColor, COLORDIMENSIONS, gl.FLOAT, false, 0, 0 );		/// TODO Do something about DIMENSIONS and COLORDIMENSIONS
	
	gl.bindBuffer( gl.ARRAY_BUFFER, this.textureBuffer );
	gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );		// 2 dimensional texture position
	
//	gl.activeTexture(gl.TEXTURE0);
//    gl.bindTexture(gl.TEXTURE_2D, texture);
//    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
		
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(this.modelViewMatrix));
		
	gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length/DIMENSIONS );
}
