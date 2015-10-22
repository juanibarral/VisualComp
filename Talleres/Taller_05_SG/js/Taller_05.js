var renderer;
var scene;
var camera;
var link_1;
var link_2;
var link_3;

var gamepadId = -1;
window.onload = function()
{
	window.addEventListener('gamepadconnected', function(e){
		console.log("gamepad connected " + e.gamepad.index + ". Buttons: " + e.gamepad.buttons.length + ". axes: " + e.gamepad.axes.length);
		gamepadId = e.gamepad.index;
	}, false);
};

function createScene()
{
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( 500, 500 );
	renderer.setClearColor(0xAAAAAA);
	document.getElementById("div_canvas").appendChild( renderer.domElement );
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 1);
	scene.add( directionalLight );

	var light = new THREE.AmbientLight( 0x404040 );
	scene.add( light );
	
	//Axes
	scene.add(createAxis(10));
	//Base del Robot
	var base = createBase();
	scene.add(base);
	
	link_1 = createLink();
	link_1.position.y = 0.25;
	base.add(link_1);
	
	link_2 = createLink2();
	link_2.position.y = 3.5;
	link_1.add(link_2);
	
	link_3 = createLink3();
	link_3.position.y = 2.25;
	link_2.add(link_3);

	camera.position.x = 5;
	camera.position.z = 5;
	camera.position.y = 10;
	
	camera.lookAt( new THREE.Vector3(0,4,0));
	
	
	
	render();
	
	
}

function render()
{
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	
	controllerLoop();
}

function controllerLoop()
{
	if(gamepadId != -1)
	{
		var gamepadWithInfo = navigator.getGamepads()[gamepadId];
		var buttons = gamepadWithInfo.buttons;
		for(var i in buttons)
		{
			if(buttons[i].pressed)
			{
				console.log("Button " + i + " pressed");
			}
		}
		var axes = gamepadWithInfo.axes;
		var values = '';
		for(var i in axes)
		{
			values += axes[i] + " ";
		}
		
		// console.log(values);
		// console.log(axes[1]);
		
		var angle1 = parseInt(axes[5] *10);
		//console.log(angle1);
		var rads1 = -angle1 / 10 * Math.PI / 4;
		link_1.rotation.y = rads1;
		document.getElementById("p_rot_1").value = rads1 * 180 / Math.PI;
		
		
		var angle2 = parseInt(axes[0] *10);
		var rads2 = -angle2 / 10 * Math.PI / 2;
		link_2.rotation.z = rads2;
		document.getElementById("p_rot_2").value = rads2 * 180 / Math.PI;
		
		
		var angle3 = parseInt(axes[1] *10);
		var rads3 = angle3 / 10 * Math.PI / 2;
		link_3.rotation.x = rads3;
		document.getElementById("p_rot_3").value = rads3 * 180 / Math.PI;
	}
}

function createBase()
{
	var geometry = new THREE.BoxGeometry( 3, 0.5, 3 );
	var material = new THREE.MeshLambertMaterial( { color : 0xAAAAAA } );
	var base = new THREE.Mesh( geometry, material );
	
	return base;
}

function createLink()
{
	var node = new THREE.Object3D();
	node.add(createAxis(5));
	
	var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 16 );
	var material = new THREE.MeshLambertMaterial( { color : 0xFF0000 } );
	var base = new THREE.Mesh( geometry, material );
	node.add( base );
	
	var geomBody = new THREE.CylinderGeometry( 0.75, 0.75, 3, 16 );
	var matBody = new THREE.MeshLambertMaterial( { color : 0xFF0000 } );
	var body = new THREE.Mesh( geomBody, matBody );
	body.position.y = 1.75;
	node.add(body);
	
	return node;
}

function createLink2()
{
	var node = new THREE.Object3D();
	node.add(createAxis(5));
	var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 2, 16 );
	var material = new THREE.MeshLambertMaterial( { color : 0x00FF00 } );
	var base = new THREE.Mesh( geometry, material );
	base.rotation.x = Math.PI / 2;
	node.add( base );
	
	var geomBody = new THREE.CylinderGeometry( 0.5, 0.5, 2, 16 );
	var matBody = new THREE.MeshLambertMaterial( { color : 0x00FF00 } );
	var body = new THREE.Mesh( geomBody, matBody );
	body.position.y = 1;
	node.add(body);
	
	return node;
}

function createLink3()
{
	var node = new THREE.Object3D();
	node.add(createAxis(5));
	var geometry = new THREE.CylinderGeometry( 0.25, 0.25, 1, 16 );
	var material = new THREE.MeshLambertMaterial( { color : 0x0000FF } );
	var base = new THREE.Mesh( geometry, material );
	base.rotation.z = Math.PI / 2;
	node.add( base );
	
	var geomBody = new THREE.CylinderGeometry( 0.25, 0.25, 2, 16 );
	var matBody = new THREE.MeshLambertMaterial( { color : 0x0000FF } );
	var body = new THREE.Mesh( geomBody, matBody );
	body.position.y = 1;
	node.add(body);
	
	return node;
}

function createAxis(length)
{
	var node = new THREE.Object3D;
	var red = new THREE.LineBasicMaterial({
		color: 0xff0000
	});
	var green = new THREE.LineBasicMaterial({
		color: 0x00ff00
	});
	var blue = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});

	var geomX = new THREE.Geometry();
	geomX.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( length, 0, 0 )
	);
	
	var xAxis = new THREE.Line( geomX, red );
	node.add(xAxis);
	
	var geomY = new THREE.Geometry();
	geomY.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, length, 0 )
	);
	var yAxis = new THREE.Line( geomY, green );
	node.add(yAxis);
	
	var geomZ = new THREE.Geometry();
	geomZ.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, 0, length )
	);
	var zAxis = new THREE.Line( geomZ, blue );
	node.add(zAxis);
	
	return node;
}

function change_rot_eje1(value)
{
	var rads = parseInt(value) / 100 * Math.PI;
	link_1.rotation.y = rads;
	document.getElementById("p_rot_1").value = rads * 180 / Math.PI;
}

function change_rot_eje2(value)
{
	var rads = parseInt(value) / 100 * Math.PI / 2;
	link_2.rotation.z = rads;
	document.getElementById("p_rot_2").value = rads * 180 / Math.PI;
}

function change_rot_eje3(value)
{
	var rads = parseInt(value) / 100 * Math.PI / 2;
	link_3.rotation.x = rads;
	document.getElementById("p_rot_3").value = rads * 180 / Math.PI;
}
