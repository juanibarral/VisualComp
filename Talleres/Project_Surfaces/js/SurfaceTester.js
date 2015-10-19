var renderer;
var scene;
var camera;
var controls;

var directionalLight;
var lightDirX = 1;
var lightDirZ = 0;
var lightTheta = 0;

var BEZIER = 'Bezier';
var BSPLINE = 'B-Spline';
var surfaceControl;
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

var WIREFRAME = false;


var mouse = new THREE.Vector2();
var rayCaster = new THREE.Raycaster();

var pickeables = [];
var picked;
var draggeables = [];

var dragging = false;
var draggingPos = {
	x : 0,
	y : 0	
};

var relocating = false;
var relocatingHandle;

window.onload = function(){
	window.addEventListener('click', onMouseClicked, false);
	window.addEventListener('mousedown', function(evt){
		if(picked)
		{
			dragging = true; 
		}
		draggingPos.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		draggingPos.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	}, false);
	window.addEventListener('mouseup', function(evt){
		if(picked)
		{
			dragging = false; 
			controls.enableRotate = true;
			changing = false;
			relocatingHandle = null;
		}
	}, false);
	window.addEventListener('mousemove', onMouseMove, false);
};

var SurfaceControl = function()
{
	this.params = {
		type : BEZIER,
		subdivisionsU : 10,
		subdivisionsV : 10,
		degree : 3,
		controlPoints : true,
		wireframe : false
	};
	
	this.type = BEZIER;
	this.subdivisionsU = 10;
	this.subdivisionsV = 10;
	this.degree = 3;
	this.drawControlPoints = true;
	this.drawWireframe = false;
	
	this.controlPoints = [
		[	new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, 0, 10 ),
			new THREE.Vector3( 0, 0, 20 ),
			new THREE.Vector3( 0, 0, 30 ),
			new THREE.Vector3( 0, 0, 40 ),
			new THREE.Vector3( 0, 0, 50 ),
		],
		[	new THREE.Vector3( 10, 0, 0 ),
			new THREE.Vector3( 10, -10, 10 ),
			new THREE.Vector3( 10, -10, 20 ),
			new THREE.Vector3( 10, -10, 30 ),
			new THREE.Vector3( 10, -10, 40 ),
			new THREE.Vector3( 10, 0, 50 ),
		],
		[	new THREE.Vector3( 20, 0, 0 ),
			new THREE.Vector3( 20, -10, 10 ),
			new THREE.Vector3( 20, 20, 20 ),
			new THREE.Vector3( 20, 20, 30 ),
			new THREE.Vector3( 20, -10, 40 ),
			new THREE.Vector3( 20, 0, 50 ),
		],
		[	new THREE.Vector3( 30, 0, 0 ),
			new THREE.Vector3( 30, -10, 10 ),
			new THREE.Vector3( 30, 20, 20 ),
			new THREE.Vector3( 30, 20, 30 ),
			new THREE.Vector3( 30, -10, 40 ),
			new THREE.Vector3( 30, 0, 50 ),
		],
		[	new THREE.Vector3( 40, 0, 0 ),
			new THREE.Vector3( 40, -10, 10 ),
			new THREE.Vector3( 40, -10, 20 ),
			new THREE.Vector3( 40, -10, 30 ),
			new THREE.Vector3( 40, -10, 40 ),
			new THREE.Vector3( 40, 0, 50 ),
		],
		[	new THREE.Vector3( 50, 0, 0 ),
			new THREE.Vector3( 50, 0, 10 ),
			new THREE.Vector3( 50, 0, 20 ),
			new THREE.Vector3( 50, 0, 30 ),
			new THREE.Vector3( 50, 0, 40 ),
			new THREE.Vector3( 50, 0, 50 ),
		],
	];
};

SurfaceControl.prototype.update = function()
{
	var selectedObject = scene.getObjectByName("controlPoints");
    scene.remove( selectedObject );
    selectedObject = scene.getObjectByName("surface");
    scene.remove( selectedObject );
	if(surfaceControl.params.type == BEZIER)
	{
		testBezier();
	}
	else if(surfaceControl.params.type == BSPLINE)
	{
		//testBSpline();
	}
};

function createScene()
{
	document.body.appendChild( stats.domElement );
	surfaceControl = new SurfaceControl();
	var gui = new dat.GUI();
	var controllerType = 	gui.add(surfaceControl, 'type', [BEZIER, BSPLINE]);
	var controllerSubU = 	gui.add(surfaceControl, 'subdivisionsU', 5, 50);
	var controllerSubV = 	gui.add(surfaceControl, 'subdivisionsV', 5, 50);
	var controllerDeg = 	gui.add(surfaceControl, 'degree');
	var controllerCPoints = gui.add(surfaceControl, 'drawControlPoints');
	var controllerWire = 	gui.add(surfaceControl, 'drawWireframe');
	
	controllerType.onChange(function(value){
		surfaceControl.params.type = value;
		surfaceControl.update();
	});
	controllerSubU.onChange(function(value){
		surfaceControl.params.subdivisionsU = value;
		surfaceControl.update();
	});
	controllerSubV.onChange(function(value){
		surfaceControl.params.subdivisionsV = value;
		surfaceControl.update();
	});
	controllerCPoints.onChange(function(value){
		surfaceControl.params.controlPoints = value;
		surfaceControl.update();
	});
	controllerWire.onChange(function(value){
		surfaceControl.params.wireframe = value;
		surfaceControl.update();
	});
	
	
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75,  window.innerWidth / window.innerHeight, 0.1, 1000 );
	
	camera.position.x = 100;
	camera.position.y = 100;
	camera.position.z = 100;
	// camera.position.y = 7;
	
	camera.lookAt( new THREE.Vector3(0,0,0));
	
	controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', render);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xAAAAAA);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById("div_canvas").appendChild( renderer.domElement );
	
	directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
	directionalLight.position.set( lightDirX, 0, lightDirZ);
	scene.add( directionalLight );
	

	var light = new THREE.AmbientLight( 0x404040 );
	scene.add( light );
	
	scene.add(new Axis(10));
	
	
	
	testBezier();
	

	
	render();
}

function render()
{
	
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	stats.update();
}

function testBezier()
{
	var bezierSurface = new THREE_BezierSurfaceGeometry();
	bezierSurface.subdivisionsU = surfaceControl.params.subdivisionsU;
	bezierSurface.subdivisionsV = surfaceControl.params.subdivisionsV;
	bezierSurface.controlPoints = surfaceControl.controlPoints;
	bezierSurface.createMesh();
	
	if(surfaceControl.params.controlPoints)
	{
		renderControlPoints();
	}
	
	var mesh = new THREE_Surface({
		vertices : bezierSurface.vertices,
		material : new THREE.MeshPhongMaterial({color: 0xffff00, wireframe : surfaceControl.params.wireframe})
	});
	mesh.create();
	mesh.node.name = 'surface';
	scene.add(mesh.node);
}

function renderControlPoints()
{
	var controlPoints = new THREE_Surface({
		vertices : surfaceControl.controlPoints,
		material : new THREE.LineBasicMaterial({color: 0x000000})
	});
	controlPoints.createLines();
	controlPoints.node.name = 'controlPoints_Line';
	scene.add(controlPoints.node);
	
	var cPoints = new THREE.Object3D();
	cPoints.name = 'controlPoints_Controllers';
	for(i in surfaceControl.controlPoints)
	{
		var controlPoints = surfaceControl.controlPoints[i];
		for(j in controlPoints)
		{
			var cPoint = new THREE.BoxGeometry(0.5, 0.5, 0.5);
			var cPointMesh = new THREE.Mesh(cPoint, new THREE.MeshPhongMaterial({color : 0xAAAAAA}));
			cPointMesh.position.x = controlPoints[j].x;
			cPointMesh.position.y = controlPoints[j].y;
			cPointMesh.position.z = controlPoints[j].z;
			cPointMesh.name = "cpoint_"+ i + "_" + j;
			cPoints.add(cPointMesh);	
			cPointMesh.userData = {
				picked : false
			};
			pickeables.push(cPointMesh);
		}
	}
	scene.add(cPoints);
	
}

function onMouseClicked(evt)
{
	
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	
	rayCaster.setFromCamera(mouse, camera);	

	var intersects = rayCaster.intersectObjects( pickeables );

	for ( var i = 0; i < intersects.length; i++ ) {

		addLocalController(intersects[0].object);
	}
}

function onMouseMove(evt)
{
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	if(dragging)
	{
		if(mouse.x < draggingPos.x )
		{
			//console.log("moving negative");
			
			//relocatingHandle.position[relocatingHandle.name] -= 0.1;
		}
		else if(mouse.x > draggingPos.x )
		{
			//console.log("moving positive");
			//relocatingHandle.position[relocatingHandle.name] += 0.1;
		}
		
		draggingPos.x = mouse.x;
		draggingPos.y = mouse.y;
		
		
	}
	
	if(picked)
	{
		rayCaster.setFromCamera(mouse, camera);	
		
		var intersects = rayCaster.intersectObjects( draggeables );
		
		for ( var i = 0; i < intersects.length; i++ ) 
		{
			relocating = true;
			controls.enableRotate = false;
			if(!relocatingHandle)
				relocatingHandle = intersects[0].object;
		}
	}
}


function addLocalController(object)
{
	if(picked)
	{
		var selectedObject = picked.getObjectByName("localController");
    	picked.remove( selectedObject );
    	if(picked.name == object.name)
    	{
    		object.userData.picked = true;
    	}
    	else
    	{
    		object.userData.picked = false;
    	}
    	picked = null;
	}
	
	if(object.userData.picked)
	{
		object.userData.picked = false;
		var selectedObject = object.getObjectByName("localController");
    	object.remove( selectedObject );
	}
	else
	{
		picked = object;
		object.userData.picked = true;
		var cPgX = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		var controlX = new THREE.Mesh(cPgX, new THREE.MeshPhongMaterial({color : 0xFF0000}));
		controlX.name = 'x';
		controlX.position.x = 1.0;
		
		var cPgY = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		var controlY = new THREE.Mesh(cPgY, new THREE.MeshPhongMaterial({color : 0x00FF00}));
		controlY.name = 'y';
		controlY.position.y = 1.0;
		
		var cPgZ = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		var controlZ = new THREE.Mesh(cPgZ, new THREE.MeshPhongMaterial({color : 0x0000FF}));
		controlZ.name = 'z';
		controlZ.position.z = 1.0;
		
		var controller = new THREE.Object3D();
		controller.name = 'localController';
		controller.add(controlX);
		controller.add(controlY);
		controller.add(controlZ);
		
		object.add(controller);
		
		draggeables = [];
		draggeables.push(controlX);
		draggeables.push(controlY);
		draggeables.push(controlZ);
	}
	
}
