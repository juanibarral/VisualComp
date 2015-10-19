var renderer;
var scene;
var camera;
var controls;

var surfaceObject;
var nurbsSurface;

var density = 512;

var canvas;
var textCanvas;

var status = 0;

var directionalLight;
var lightDirX = 1;
var lightDirZ = 0;
var lightTheta = 0;

var BEZIER = 'BEZIER';
var BSPLINE = 'BSPLINE';
// var curves = BEZIER;
var curves = BSPLINE;


function createScene()
{
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75,  window.innerWidth / window.innerHeight, 0.1, 1000 );
	
	// camera.position.x = 5;
	// camera.position.y = 5;
	camera.position.z = 12;
	
	camera.lookAt( new THREE.Vector3(0,0,0));
	
	//controls = new THREE.OrbitControls(camera);
	//controls.addEventListener('change', render);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xAAAAAA);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById("div_canvas").appendChild( renderer.domElement );
	
	directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
	directionalLight.position.set( lightDirX, 0, lightDirZ);
	scene.add( directionalLight );
	

	var light = new THREE.AmbientLight( 0x404040 );
	scene.add( light );
	
	
	//scene.add(new Axis(10));
	if(curves == BEZIER)
	{
		testBezier();
	}
	else if(curves == BSPLINE)
	{
		testBSpline();
	}
	render();
}

function render()
{
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

function testBezier()
{
	var controlPoints = [
			// new THREE.Vector3( 0, 0, 0 ),
			// new THREE.Vector3( -1, 9, 0 ),
			// new THREE.Vector3( 1, 10, 0 ),
			// new THREE.Vector3( 2, 5, 0 ),
			// new THREE.Vector3( 4, 1, 0 ),
			// new THREE.Vector3( 6, 2, 0 ),
			// new THREE.Vector3( 4, 9, 0 ),
			// new THREE.Vector3( 11, 10, 0 ),
			// new THREE.Vector3( 7, 3, 0 ),
			// new THREE.Vector3( 8, 1, 0 ),
			// new THREE.Vector3( 10, 0, 0 ),
			
			new THREE.Vector3( -4, -5, 0 ),
			new THREE.Vector3( -5, 1, 0 ),
			new THREE.Vector3( 0, 5, 0 ),
			new THREE.Vector3( 4, 1, 0 ),
			new THREE.Vector3( 5, -5, 0 ),
			new THREE.Vector3( 1, -5, 0 ),
			new THREE.Vector3( 0, 1, 0 ),
			new THREE.Vector3( -3, 1, 0 ),
			new THREE.Vector3( -4, -3, 0 ),
			new THREE.Vector3( 0, -5, 0 ),
	];
	
	var bezierCurve = new THREE_BezierCurveGeometry();
	bezierCurve.subdivisions = 50;
	bezierCurve.controlPoints = controlPoints;
	bezierCurve.calculateB();
	
	var curveGeom = new THREE.Geometry();
	curveGeom.vertices = bezierCurve.vertices;
	var curvePoints = new THREE.Line(curveGeom, new THREE.LineBasicMaterial({color: 0xff00ff}));
	scene.add(curvePoints);
	
	var bezierCurveB = new THREE_BezierCurveGeometry();
	bezierCurveB.subdivisions = 50;
	bezierCurveB.controlPoints = controlPoints;
	bezierCurveB.calculateB();
	var curveGeomB = new THREE.Geometry();
	curveGeomB.vertices = bezierCurveB.vertices;
	var curvePointsB = new THREE.Line(curveGeomB, new THREE.LineBasicMaterial({color: 0xffff00}));
	//scene.add(curvePointsB);
	
	var controlGeom = new THREE.Geometry();
	controlGeom.vertices = controlPoints;
	var controlPoints = new THREE.Line(controlGeom, new THREE.LineBasicMaterial({color: 0x000000}));
	scene.add(controlPoints);
}

function testBSpline()
{
	var controlPoints = [
			new THREE.Vector3( -4, -5, 0 ),
			new THREE.Vector3( -5, 1, 0 ),
			new THREE.Vector3( 0, 5, 0 ),
			new THREE.Vector3( 4, 1, 0 ),
			new THREE.Vector3( 5, -5, 0 ),
			new THREE.Vector3( 1, -5, 0 ),
			new THREE.Vector3( 0, 1, 0 ),
			new THREE.Vector3( -3, 1, 0 ),
			new THREE.Vector3( -4, -3, 0 ),
			new THREE.Vector3( 0, -5, 0 ),
	];
	
	var bsplineCurve = new THREE_BSplineCurveGeometry();
	bsplineCurve.subdivisions = 50;
	bsplineCurve.controlPoints = controlPoints;
	bsplineCurve.degree = 2;
	//bsplineCurve.knotVector = [0, 0, 0, 0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.85, 1, 1, 1, 1];
	//bsplineCurve.knotVector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	//bsplineCurve.knotVector = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	bsplineCurve.calculate();
	
	var controlGeom = new THREE.Geometry();
	controlGeom.vertices = controlPoints;
	var controlPoints = new THREE.Line(controlGeom, new THREE.LineBasicMaterial({color: 0x000000}));
	scene.add(controlPoints);
	
	var curveGeom = new THREE.Geometry();
	curveGeom.vertices = bsplineCurve.vertices;
	var curvePoints = new THREE.Line(curveGeom, new THREE.LineBasicMaterial({color: 0xff00ff}));
	scene.add(curvePoints);
	
	
	for(var i in bsplineCurve.knotVector)
	{
		var knot = bsplineCurve.knotVector[i];
		var knotPos = bsplineCurve.getXYZ(knot);
		if(knotPos)
		{
			var sph = new THREE.SphereGeometry(0.2, 5, 5);
			var sphere = new THREE.Mesh(sph, new THREE.MeshPhongMaterial({color : 0xff0000}));
			sphere.position.x = knotPos.x;
			sphere.position.y = knotPos.y;
			sphere.position.z = knotPos.z;
			scene.add(sphere);
		}
		
	}
	
	
}




