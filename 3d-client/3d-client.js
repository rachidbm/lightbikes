$(function() {

var $window = $(window);
var $body = $('body');
var $border = $('#border');

var camera, scene, renderer, plane, controls;

var offsetX, offsetY;
var grid; 

var materials = [];

var COLORS = [
	'#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', 
	'#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', 
	'#01B9FF', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
	'#e21400', '#91580f', '#f8a700', '#f78b00', '#58dc00', '#287b00', 
	'#a8f07a', '#4ae8c4', '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
 ];
var currentColorIndex = 0;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	// renderer.setClearColor( 0xFAF7EC );
	renderer.setClearColor( 'black' );
	onWindowResize();	// Sets size of renderer
	document.getElementById('world').appendChild( renderer.domElement );
	stats = new Stats();
	document.getElementById('stats').appendChild( stats.domElement );	
	initScene();
}

function initScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

	camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.y = 80;
	camera.position.z = 100;
	scene.add(camera);

	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 ).normalize();
  camera.add(light);

	initBackground();

	window.addEventListener( 'resize', onWindowResize, false );
}

var BG_PARTICLES = 10000,
	BG_SIZE = 2000;

function initBackground() {

	geometry = new THREE.Geometry();

	for ( i = 0; i < BG_PARTICLES; i ++) {
		var x = Math.random() * BG_SIZE - (BG_SIZE/2),
		y = Math.random() * BG_SIZE - (BG_SIZE/2),
		z = Math.random() * BG_SIZE - (BG_SIZE/2);
		geometry.vertices.push( new THREE.Vector3(x, y, z));
	}
	sizes = [1, 2, 3, 4];

	// for ( i = 0; i < sizes.length; i ++ ) {
	for ( i = 0; i < COLORS.length; i ++ ) {
		var size = i % sizes.length;
		materials[i] = new THREE.PointCloudMaterial( { size: size, color: getRandomColor()} );
		particle = new THREE.PointCloud( geometry, materials[i] );
		particle.rotation.x = Math.random() * 6;
		particle.rotation.y = Math.random() * 6;
		particle.rotation.z = Math.random() * 6;
		scene.add( particle );
	}

}


function getRandomColor() {
	return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getNextColor() {
	currentColorIndex++;
	return COLORS[currentColorIndex % COLORS.length];
}


function onWindowResize( event ) {
	var width = window.innerWidth;
	if(window.innerWidth > window.innerHeight * 1.3) { 
		// var width = window.innerHeight * 1.3;
	}
	renderer.setSize(width - 20, window.innerHeight - 115);
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();
	stats.update();
	updateBackground();
}

function updateBackground() {
	var time = Date.now() * 0.000005;
	for ( i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		if ( object instanceof THREE.PointCloud ) {
			object.rotation.y = Date.now() * 0.00001;
		}
	}

	
}

function setupWorld(world) {
	initScene();
	var geometry = new THREE.PlaneGeometry(world.tiles_width, world.tiles_height);
	var material = new THREE.MeshBasicMaterial( {color: 0xD5D5D5, side: THREE.DoubleSide} );
	plane = new THREE.Mesh( geometry, material );
	plane.rotation.x = Math.PI/2; //-90 degrees around the xaxis 
	plane.position.set(0, 0, 0);
	scene.add( plane );

	offsetX = world.tiles_width/2 - 0.5;
	offsetY = world.tiles_height/2 - 0.5;

	resetGrid(world);
	updateGrid(world);
}


function updateGrid(world) {
  for(var x = 0; x < world.tiles_width; x++) {
    for(var y = 0; y < world.tiles_height; y++) {
      if(world.grid[x][y] != null && grid[x][y] == null) {
      	addCube(x, y, world.grid[x][y]);
      }
    }
  }
}


function resetGrid(world) {
	grid = new Array([world.tiles_width]); 
	for(var x = 0; x < world.tiles_width; x++) {
		grid[x] = new Array([world.tiles_height]);
		for(var y = 0; y < world.tiles_height; y++) {
			grid[x][y] = null;
		}
	}
	console.log("Created new grid of", world.tiles_width, "x", world.tiles_height, "tiles");
}


function addCube(x, y, color) {
	if(grid[x][y] != null) {
		console.log("Skip", x, y, " already cube with color: ", grid[x][y].toString(16));
		return;
	}
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial( {color: color} );
	cube = new THREE.Mesh( geometry, material );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(x - offsetX, y - offsetY, -0.5);
	plane.add(cube);
	grid[x][y] = color;
}


// Keyboard events
$window.keydown(function (event) {
  var newDirection = 0;
  var step = 1;
  switch(event.keyCode) {
  case 67: // c
  	controls.reset();		// Reset camera position
    break;
  case 82: // r
  	// initScene();
  	socket.emit("restart");
    break;
  case 32: // SPACE
  	socket.emit("toggle pause");
    break;
  case 37: // LEFT
    newDirection = 4;
    break;
  case 38: // UP
  	newDirection = 1;
    break;
  case 39: // RIGHT 
  	newDirection = 2;
    break;    
  case 40: // DOWN
  	newDirection = 3;
    break;
  }
  if(newDirection > 0) {
    socket.emit("change direction", newDirection);
  }

});




/*

Connection with Server
*/

var $host = $('#host');

var socket;

var host = 'ws://' + $host.val() + ':3000';
// var host = 'ws://localhost:3000';

connect();

function connect() {
  // host = 'ws://' + $host.val() + ':3000';
  console.log("Connecting to:", host);
  socket = io(host);
  showConnectionStatus();
}


function showConnectionStatus() {
  if(socket.connected) {
    $body.css("background-color", "#F6FAFC");
  } else {
    $body.css("background-color", "#FFD9D9");
  }
}


socket.on('connected', function (data) {
  console.log("Connected to server, got ID: ", data.id);
  showConnectionStatus();
  console.log("I am: ", data.world.players[data.id]);
  setupWorld(data.world);
});

socket.on('restart', function (data) {
	console.log("Restarted by ", data.player);
	initScene();
  setupWorld(data.world);
});

socket.on('render', function (data) {
  updateGrid(data.world);
});

socket.on('connect_error', function (error) {
  console.log('Failed connecting to:', host, error);
});

socket.on("disconnect", function(){
  console.log("Disconnected from server");
  showConnectionStatus();
});



});