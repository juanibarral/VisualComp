var renderer;
var scene;
var camera;
var controls;

var surfaceObject;
var nurbsSurface;



var canvas;
var textCanvas;

var status = 0;

var directionalLight;
var lightDirX = 1;
var lightDirZ = 0;
var lightTheta = 0;


function createScene()
{
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
	
	// surfaceObject = new Surface();
	// surfaceObject.createYZCurve([
		// new THREE.Vector3( 0, 0, 0 ),
		// new THREE.Vector3( 0, 10, 10 ),
		// new THREE.Vector3( 0, 0, 20 ),
		// new THREE.Vector3( 0, 10, 30 ),
	// ]);
// 	
	// surfaceObject.createXYCurve([
		// new THREE.Vector3( 0, 0, 0 ),
		// new THREE.Vector3( 10, 5, 0 ),
		// new THREE.Vector3( 20, 3, 0 ),
		// new THREE.Vector3( 30, 8, 0 ),
		// new THREE.Vector3( 40, 0, 0 ),
	// ]);
// 	
	// surfaceObject.createMesh();
// 
	// scene.add(surfaceObject.node);
	
	var bezierSurface = new THREE_BezierSurfaceGeometry();
	bezierSurface.subdivisionsU = 30;
	bezierSurface.subdivisionsV = 10;
	bezierSurface.controlPoints = [
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
	
	bezierSurface.createMesh();
	
	var controlPoints = new THREE_Surface({
		vertices : bezierSurface.controlPoints,
		material : new THREE.LineBasicMaterial({color: 0x000000})
	});
	controlPoints.createLines();
	scene.add(controlPoints.node);
	
	var mesh = new THREE_Surface({
		vertices : bezierSurface.vertices,
		material : new THREE.MeshPhongMaterial({color: 0xffff00, wireframe : true})
		// material : new THREE.LineBasicMaterial({color: 0xffff00})
	});
	mesh.create();
	scene.add(mesh.node);

	
	// var bezierCurve = new THREE_BezierCurveGeometry();
	// bezierCurve.subdivisions = 10;
	// bezierCurve.controlPoints = [
		// new THREE.Vector3( 0, 0, 0 ),
		// new THREE.Vector3( 0, 5, 10 ),
		// new THREE.Vector3( 0, 5, 20 ),
		// new THREE.Vector3( 0, 0, 30 ),
	// ];
// 	
	// bezierCurve.calculate();
// 	
	// var controlGeometry = new THREE.Geometry();
	// controlGeometry.vertices = bezierCurve.controlPoints;
	// var controlLine = new THREE.Line(controlGeometry, new THREE.LineBasicMaterial({color: 0x000000}));
	// scene.add(controlLine);
// 	
	// var bezierGeometry = new THREE.Geometry();
	// bezierGeometry.vertices = bezierCurve.vertices;
	// var bezierLine = new THREE.Line(bezierGeometry, new THREE.LineBasicMaterial({color: 0xffff00}));
	// scene.add(bezierLine);
	

	
	
	render();
}

function render()
{
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

