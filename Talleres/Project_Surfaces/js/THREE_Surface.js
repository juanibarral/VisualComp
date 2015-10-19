var THREE_Surface = function(params){
	this.vertices = params.vertices;
	this.material = params.material;
	this.node = new THREE.Object3D();
	this.geometry = new THREE.Geometry();
};

THREE_Surface.prototype.create = function()
{

	var uSize = this.vertices.length;
	var vSize = this.vertices[0].length;
	for (var i = 0; i < uSize; i++) {
		for (var j = 0; j < vSize; j++) {
			this.geometry.vertices.push(this.vertices[i][j]);
		}
	}
	
	
	for (var i = 0; i < uSize - 1; i++) {
		for (var j = 0; j < vSize - 1; j++) {
			var first = (i * vSize) + j;
			var second = first + vSize;
			
			this.geometry.faces.push(new THREE.Face3(first, second, first + 1));
			this.geometry.faces.push(new THREE.Face3(first + 1, second, second + 1));
		}
	}

	this.geometry.computeFaceNormals();
	
	var mesh = new THREE.Mesh( this.geometry, this.material );
	this.node.add(mesh);

};

THREE_Surface.prototype.createLines = function()
{
	var uSize = this.vertices.length;
	var vSize = this.vertices[0].length;
	
	for(var i = 0; i < uSize; i ++)
	{
		var geometry = new THREE.Geometry();
		for(var j = 0; j < vSize; j ++)
		{
			geometry.vertices.push(this.vertices[i][j]);	
		}
		var lineMesh = new THREE.Line(geometry, this.material);
		this.node.add(lineMesh);
	};
	
	for(var j = 0; j < vSize; j ++)
	{
		var geometry = new THREE.Geometry();
		for(var i = 0; i < uSize; i ++)
		{
			geometry.vertices.push(this.vertices[i][j]);	
		}
		var lineMesh = new THREE.Line(geometry, this.material);
		this.node.add(lineMesh);
	};
};
