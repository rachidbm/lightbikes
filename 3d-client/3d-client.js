
var WIDTH = 640;
var HEIGHT = 480;

var camera, scene, renderer, mesh;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	var $world = $('#world');
	$('#world').replaceWith( renderer.domElement );
	// document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 1, 1000 );
	camera.position.z = 500;

	scene = new THREE.Scene();

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 ).normalize();
	scene.add(light);

	var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	var material = new THREE.MeshPhongMaterial( {color: 0x1f77b4} );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}


function animate() {
	requestAnimationFrame( animate );

	// mesh.rotation.x += 0.005;
	// mesh.rotation.y += 0.01;
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.005;

	renderer.render( scene, camera );
}