var renderer;
var scene;
var camera;
var controls;


var planet;

var minHeight = 5;
var maxHeight = 5.2;
var heightMatrix;
var density = 512;
var textureSrc;

function createScene()
{
	if (window.File && window.FileReader) {
		document.getElementById('files').addEventListener('change', loadFile, false);
		document.getElementById('textures').addEventListener('change', loadTexture, false);
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
	
	scene = new THREE.Scene();
	
	scene.fog = new THREE.Fog(0xffffff, 100, 600);
	
	camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
		// camera.position.x = 15;
	// camera.position.z = 30;
	// camera.position.y = 1;
	
	// camera.position.x = 5;
	camera.position.z = 10;
	// camera.position.y = 7;
	
	camera.lookAt( new THREE.Vector3(0,0,0));
	
	//controls = new THREE.OrbitControls(camera);
	//controls.addEventListener('change', render);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( 500, 500 );
	document.getElementById("div_canvas").appendChild( renderer.domElement );
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 1);
	scene.add( directionalLight );

	//var light = new THREE.AmbientLight( 0x404040 );
	//scene.add( light );
	
	
	//Base del Robot
	planet = createPlanet(5, density,density);
	// planet = createFlatPlanet(1, density,density);
	scene.add(planet);


	
	render();
}

function render()
{
	requestAnimationFrame( render );
	planet.rotation.y -= 0.01;
	renderer.render( scene, camera );
}


function createPlanet(radius, latitudeBands, longitudeBands) {
	
	var geom = new THREE.Geometry();
	var vertCounter = 0;
	var faceCounter = 0;
	
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
	
	var faceIndex = 0;
	var textCellSize = 1.0 / density;
			
	for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			
			geom.faces.push(new THREE.Face3(first + 1, second, first));
			if(textureSrc)
			{
				var v1 = geom.vertices[first + 1];
				var v2 = geom.vertices[second];
				var v3 = geom.vertices[first]; 
				
				var radiusV1 = Math.sqrt((v1.x * v1.x) + (v1.y * v1.y) + (v1.z * v1.z));
				var radiusV2 = Math.sqrt((v2.x * v2.x) + (v2.y * v2.y) + (v2.z * v2.z));
				var radiusV3 = Math.sqrt((v3.x * v3.x) + (v3.y * v3.y) + (v3.z * v3.z));
				
				var textCoord1 = (radiusV1 - minHeight) / (maxHeight - minHeight);
				var textCoord2 = (radiusV2 - minHeight) / (maxHeight - minHeight);
				var textCoord3 = (radiusV3 - minHeight) / (maxHeight - minHeight);
				
				
				var textUV1 = new THREE.Vector2(0,textCoord1);
				var textUV2 = new THREE.Vector2(1,textCoord2);
				var textUV3 = new THREE.Vector2(0,textCoord3);
				
				geom.faceVertexUvs[0][faceIndex] = [ textUV1, textUV2, textUV3];
				faceIndex++;
			}
			
			geom.faces.push(new THREE.Face3(first + 1, second + 1, second));
			if(textureSrc)
			{
				var v1 = geom.vertices[first + 1];
				var v2 = geom.vertices[second + 1];
				var v3 = geom.vertices[second]; 
				
				var radiusV1 = Math.sqrt((v1.x * v1.x) + (v1.y * v1.y) + (v1.z * v1.z));
				var radiusV2 = Math.sqrt((v2.x * v2.x) + (v2.y * v2.y) + (v2.z * v2.z));
				var radiusV3 = Math.sqrt((v3.x * v3.x) + (v3.y * v3.y) + (v3.z * v3.z));
				
				var textCoord1 = (radiusV1 - minHeight) / (maxHeight - minHeight);
				var textCoord2 = (radiusV2 - minHeight) / (maxHeight - minHeight);
				var textCoord3 = (radiusV3 - minHeight) / (maxHeight - minHeight);
				
				
				var textUV1 = new THREE.Vector2(0,textCoord1);
				var textUV2 = new THREE.Vector2(1,textCoord2);
				var textUV3 = new THREE.Vector2(0,textCoord3);
				geom.faceVertexUvs[0][faceIndex] = [textUV1, textUV2, textUV3];
				
				faceIndex++;
			}
			// geom.faces.push(new THREE.Face3(first, second, first + 1));
			// geom.faces.push(new THREE.Face3(second, second + 1, first + 1));

		}
	}

	geom.computeFaceNormals();
	
	var mesh;
	//var mesh = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({ color : 0xff0000, wireframe : true}) );
	
	if(textureSrc)
	{
		var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(textureSrc)} );
		mesh = new THREE.Mesh( geom, material );
	}
	else
	{
		mesh = new THREE.Mesh( geom, new THREE.MeshLambertMaterial({ color : 0xff0000}) );
	}
	//mesh = new THREE.Mesh( geom, new THREE.MeshLambertMaterial({ color : 0xff0000}) );
	
	var node = new THREE.Object3D();
	node.name = "planet";
	node.add(createAxis(5));
	node.add(mesh);
	
	return node;
}

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


function createAxis(length) {
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
}

function loadFile(evt)
{
	var side = density;
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var files = evt.target.files;

	var fr = new FileReader();
	
	fr.onload = function(e) {
		heightMatrix = [];
		img = new Image();
		img.onload = function(e) {
			context.drawImage(e.target, 0, 0);
			var imageData = context.getImageData(0, 0, side, side);
			var data = imageData.data;
			var row = -1;
			
			for (var i = 0, n = data.length; i < n; i += 4) {
				var red = data[i];
				var green = data[i + 1];
				var blue = data[i + 2];
				var alpha = data[i + 3];
				
				var avg = ((red + green + blue) / 3) / 255;
				var value = minHeight + ((maxHeight - minHeight) * avg);
				var r = i % side;
				if((i/4) % side == 0)
				{
					row++;
					heightMatrix.push([]);
				}
				heightMatrix[row].push(value);
			}
			// console.log(heightMatrix);
			var selectedObject = scene.getObjectByName("planet");
			scene.remove(selectedObject);
			planet = createPlanet(5, density,density);
			// planet = createFlatPlanet(1, density,density);
			scene.add(planet);
			
		};
		img.src = e.target.result;
	};

	fr.readAsDataURL(files[0]); 

	
	
}

function loadTexture(evt)
{
	var files = evt.target.files;

	
	var fr = new FileReader();
	
	fr.onload = function(e) {
		textureSrc = e.target.result;
		var selectedObject = scene.getObjectByName("planet");
		scene.remove(selectedObject);
		planet = createPlanet(5, density,density);
		scene.add(planet);
	};

	fr.readAsDataURL(files[0]); 

	
	
}
