var renderer;
var scene;
var camera;
var controls;

var planetNode;
var planetObject;

var density = 10;


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
	camera.position.z = 7;
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

	var light = new THREE.AmbientLight( 0x404040 );
	scene.add( light );
	
	
	//Planeta
	planetObject = new Planet({
		radius : 5, 
		latitudeBands : density, 
		longitudeBands : density,
		material : new THREE.MeshLambertMaterial({ color : 0xff0000}),
		name : 'planet1'
	});
	planetNode = planetObject.create();
	//planet = createPlanet(5, density,density);
	// planet = createFlatPlanet(1, density,density);
	scene.add(planetNode);

	render();
}

function render()
{
	requestAnimationFrame( render );
	planetNode.rotation.y -= 0.01;
	renderer.render( scene, camera );
}

function loadFile(evt)
{
	var side = density;
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var files = evt.target.files;

	var fr = new FileReader();
	
	fr.onload = function(e) {
		var heightMatrix = [];
		var minHeight = 5;
		var maxHeight = 6;
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
			var selectedObject = scene.getObjectByName(planetObject.name);
			scene.remove(selectedObject);
			
			planetObject.heightMatrix = heightMatrix;
			planetNode = planetObject.create();
			scene.add(planetNode);
			
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
		var selectedObject = scene.getObjectByName(planetNode.name);
		scene.remove(selectedObject);
		
		planetObject.material = new THREE.MeshLambertMaterial({ map : THREE.ImageUtils.loadTexture( e.target.result )});
		planetObject.createUvs();
		planet = planetObject.create();
		scene.add(planet);
	};

	fr.readAsDataURL(files[0]); 
}
