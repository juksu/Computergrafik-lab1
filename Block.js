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
