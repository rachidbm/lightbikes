
var WIDTH = 640;
var HEIGHT = 480;

var camera, scene, renderer, cube;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.setClearColor( 0xFAF7EC );
	var $world = $('#world');
	$('#world').replaceWith( renderer.domElement );
	// document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 1, 1000 );
	camera.position.z = 500;

	scene = new THREE.Scene();

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 ).normalize();
	scene.add(light);

	// Cube
	var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	var material = new THREE.MeshPhongMaterial( {color: 0x1f77b4} );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );


	stats = new Stats();
	$('#stats').replaceWith( stats.domElement );
}


function animate() {
	requestAnimationFrame( animate );
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.005;

	renderer.render( scene, camera );

	stats.update();
}