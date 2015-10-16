var Axis = function(pLength){
	var length = pLength ? pLength : 10;
	var node = new THREE.Object3D;
	var red = new THREE.LineBasicMaterial({
		color : 0xff0000
	});
	var green = new THREE.LineBasicMaterial({
		color : 0x00ff00
	});
	var blue = new THREE.LineBasicMaterial({
		color : 0x0000ff
	});
	var geomX = new THREE.Geometry();
	geomX.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0));
	var xAxis = new THREE.Line(geomX, red);
	node.add(xAxis);
	var geomY = new THREE.Geometry();
	geomY.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0));
	var yAxis = new THREE.Line(geomY, green);
	node.add(yAxis);
	var geomZ = new THREE.Geometry();
	geomZ.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length));
	var zAxis = new THREE.Line(geomZ, blue);
	node.add(zAxis);
	return node;
};

