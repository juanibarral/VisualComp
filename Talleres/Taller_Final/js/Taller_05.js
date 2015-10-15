var renderer;
var scene;
var camera;
var controls;

var planetNode;
var planetObject;

var density = 512;

var canvas;
var textCanvas;

var status = 0;

var directionalLight;
var lightDirX = 1;
var lightDirZ = 0;
var lightTheta = 0;


function createScene()
{
	if (window.File && window.FileReader) {
		document.getElementById('files').addEventListener('change', loadFile, false);
		document.getElementById('textures').addEventListener('change', loadTexture, false);
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
	
	canvas = document.getElementById('myCanvas');
	textCanvas = document.getElementById('textureCanvas');
	canvas.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('click', onMouseClick);
	
	scene = new THREE.Scene();
	
	scene.fog = new THREE.Fog(0xff0000, 500, 1500);
	
	camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
		// camera.position.x = 15;
	// camera.position.z = 30;
	// camera.position.y = 1;
	
	// camera.position.x = 5;
	camera.position.z = 100;
	// camera.position.y = 7;
	
	camera.lookAt( new THREE.Vector3(0,0,0));
	
	controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', render);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( 500, 500 );
	document.getElementById("div_canvas").appendChild( renderer.domElement );
	
	directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
	directionalLight.position.set( lightDirX, 0, lightDirZ);
	scene.add( directionalLight );
	

	var light = new THREE.AmbientLight( 0x404040 );
	scene.add( light );
	
	
	//Planet
	planetObject = new Planet({
		radius : 50, 
		latitudeBands : density, 
		longitudeBands : density,
		material : new THREE.MeshPhongMaterial({ color : 0xff0000}),
		// material : new THREE.MeshBasicMaterial({ color : 0xff0000, wireframe : true}),
		name : 'planet1',
		maxHeight : 0.5
	});
	planetNode = planetObject.create();
	scene.add(planetNode);

	render();
}

function render()
{
	requestAnimationFrame( render );
	//planetNode.rotation.y -= 0.001;
	lightTheta -= 0.01;
	lightDirX = Math.cos(lightTheta);
	lightDirZ = Math.sin(lightTheta);
	directionalLight.position.set( lightDirX, 0, lightDirZ);
	
	renderer.render( scene, camera );
}

function loadFile(evt)
{
	var side = density;
	
	var context = canvas.getContext('2d');
	var files = evt.target.files;

	var fr = new FileReader();
	
	fr.onload = function(e) {
		var heightMatrix = [];
		//var minHeight = 5;
		//var maxHeight = 6;
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
				// var value = minHeight + ((maxHeight - minHeight) * avg);
				var value = avg;
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
	var textContext = textCanvas.getContext('2d');
	fr.onload = function(e) {
		
		textureSrc = e.target.result;
		var selectedObject = scene.getObjectByName(planetNode.name);
		scene.remove(selectedObject);
		
		var texture = THREE.ImageUtils.loadTexture( e.target.result );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		
		planetObject.material = new THREE.MeshPhongMaterial({ 
			map : texture,
			shininess : 10
		});
		
		planetNode = planetObject.create();
		planetObject.createUvs();
		scene.add(planetNode);
		
		var text = new Image();
		text.onload = function(e){
			textContext.drawImage(e.target, 0, 0);
		};
		text.src = e.target.result;
		
	};

	fr.readAsDataURL(files[0]); 
}

function onMouseMove(evt)
{
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	console.log(x + "," + y);
}

function onMouseClick(evt)
{
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	console.log(x + "," + y);
	
	var point = planetObject.getXYZFromPixel(x,y, 1.2);
	
	var geometry = new THREE.SphereGeometry( 0.2, 8, 8 );
	var material = new THREE.MeshPhongMaterial( {color: 0x00ffff} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = point[0];
	sphere.position.y = point[1];
	sphere.position.z = point[2];
	// planetNode.add( sphere );	
	
	camera.position.x = point[0];
	camera.position.y = point[1];
	camera.position.z = point[2];
	
	camera.lookAt( new THREE.Vector3(0,0,0));
}
