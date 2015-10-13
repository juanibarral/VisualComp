function createFlatPlanet(cellSize,latitudeBands, longitudeBands) {
	
	var geom = new THREE.Geometry();
	
	for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var x = (cellSize * latNumber) - ((cellSize * latitudeBands) / 2);
			var z = (cellSize * longNumber) - ((cellSize * latitudeBands) / 2);
			var y = 0;
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
				y = (radius - 5)/(maxHeight - minHeight) * 2;
			}		
			
			geom.vertices.push(new THREE.Vector3(x, y, z));	
		}
	}
	

	for (var latNumber = 0; latNumber < latitudeBands - 1; latNumber++) {
		for (var longNumber = 0; longNumber < longitudeBands - 1; longNumber++) {
			var first = latNumber + (longNumber * latitudeBands);
			var second = first + longitudeBands;

			geom.faces.push(new THREE.Face3(first + 1, second, first));
			geom.faces.push(new THREE.Face3(second + 1, second, first + 1));

		}
	}

	geom.computeFaceNormals();
	
	var mesh = new THREE.Mesh( geom, new THREE.MeshLambertMaterial({ color : 0xff0000}) );
	// var mesh = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({ color : 0xff0000, wireframe : true}) );
	
	var node = new THREE.Object3D();
	node.name = "planet";
	node.add(createAxis(5));
	node.add(mesh);
	
	return node;
}