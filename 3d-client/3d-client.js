
var WIDTH = 640;
var HEIGHT = 480;


var camera, scene, renderer, cube, controls;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.setClearColor( 0xFAF7EC );
	var $world = $('#world');
	$('#world').replaceWith( renderer.domElement );
	stats = new Stats();
	$('#stats').replaceWith( stats.domElement );
	
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 10, WIDTH / HEIGHT, 1, 1000 );
	camera.position.y = 75;
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
	// controls.addEventListener( 'change', render );
	
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 ).normalize();
  camera.add(light);

	// Cube
	var geometry = new THREE.BoxGeometry(WORLD.tileSize, WORLD.tileSize, WORLD.tileSize);
	var material = new THREE.MeshPhongMaterial( {color: 0x1f77b4} );
	cube = new THREE.Mesh( geometry, material );
	scene.add(cube);

	var size = 10;
	var geometry = new THREE.Geometry();
	for ( var i = 0; i <= size; i ++ ) {
		geometry.vertices.push( new THREE.Vector3( 0, 0, i ) );
		geometry.vertices.push( new THREE.Vector3( size, 0, i ) );

		geometry.vertices.push( new THREE.Vector3( i, 0, 0) );
		geometry.vertices.push( new THREE.Vector3( i, 0, size ) );
	}

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
	var line = new THREE.Line( geometry, material, THREE.LinePieces );
	scene.add( line );

}


function animate() {
	requestAnimationFrame( animate );
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.005;

	renderer.render( scene, camera );
	controls.update();
	stats.update();
}

