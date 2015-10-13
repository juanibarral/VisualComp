var Planet = function(params){
	this.radius = params.radius;
	this.latitudeBands = params.latitudeBands;
	this.longitudeBands = params.longitudeBands;
	this.heightMatrix = params.heightMatrix;
	this.geom;
	this.material = params.material;
	this.name = params.name;
};

Planet.prototype.create = function()
{
	var radius = this.radius;
	var latitudeBands = this.latitudeBands;
	var longitudeBands = this.longitudeBands;
	var heightMatrix = this.heightMatrix;
	this.geom  = new THREE.Geometry();
	var geom = this.geom;
	var material = this.material;
	var name = this.name;
	
	for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
		var theta = latNumber * Math.PI / latitudeBands;	
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);
			
			if(heightMatrix)
			{	
				if(latNumber == density && longNumber == density)
				{
					radius = heightMatrix[0][0];
				}
				else if(latNumber == density)
				{
					radius = heightMatrix[0][density - 1 - longNumber];
				}
				else if(longNumber == density)
				{
					radius = heightMatrix[latNumber][0];
				}
				else
				{
					radius = heightMatrix[latNumber][density - 1 - longNumber];
				}
			}		

			var x = radius * cosPhi * sinTheta;
			var y = radius * cosTheta;
			var z = radius * sinPhi * sinTheta;
			geom.vertices.push(new THREE.Vector3(x, y, z));	
		}
	}
	
	this.createFaces();

	geom.computeFaceNormals();
	
	var mesh = new THREE.Mesh( geom, material );
	
	var node = new THREE.Object3D();
	node.name = name;
	//node.add(createAxis(5));
	node.add(mesh);
	
	return node;
	
};

Planet.prototype.createFaces = function()
{
	var geom = this.geom;
	var latitudeBands = this.latitudeBands;
	var longitudeBands = this.longitudeBands;
	for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			
			geom.faces.push(new THREE.Face3(first + 1, second, first));
			geom.faces.push(new THREE.Face3(first + 1, second + 1, second));
			
		}
	}
};

Planet.prototype.createUvs = function()
{
	var geom = this.geom;
	var faceIndex = 0;
	var minHeight = 5;
	var maxHeight = 6;
	for(faceIndex in geom.faces)
	{
		var v1 = geom.vertices[geom.faces[faceIndex].a];
		var v2 = geom.vertices[geom.faces[faceIndex].b];
		var v3 = geom.vertices[geom.faces[faceIndex].c]; 
		
		var radiusV1 = Math.sqrt((v1.x * v1.x) + (v1.y * v1.y) + (v1.z * v1.z));
		var radiusV2 = Math.sqrt((v2.x * v2.x) + (v2.y * v2.y) + (v2.z * v2.z));
		var radiusV3 = Math.sqrt((v3.x * v3.x) + (v3.y * v3.y) + (v3.z * v3.z));
		
		var textCoord1 = (radiusV1 - minHeight) / (maxHeight - minHeight);
		var textCoord2 = (radiusV2 - minHeight) / (maxHeight - minHeight);
		var textCoord3 = (radiusV3 - minHeight) / (maxHeight - minHeight);
		
		// var textUV1 = new THREE.Vector2(0,textCoord1);
		// var textUV2 = new THREE.Vector2(1,textCoord2);
		// var textUV3 = new THREE.Vector2(0,textCoord3);
		
		var textUV1 = new THREE.Vector2(0,0);
		var textUV2 = new THREE.Vector2(1,0);
		var textUV3 = new THREE.Vector2(1,1);
		
		geom.faceVertexUvs[0][faceIndex] = [ textUV1, textUV2, textUV3];
	}
};
