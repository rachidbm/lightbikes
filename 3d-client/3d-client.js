$(function() {

	var $window = $(window);
	var $body = $('body');
	var $border = $('#border');

	var camera, scene, renderer, plane, controls;

	var offsetX, offsetY;
	var grid;

	init();
	animate();

	function init() {
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		// renderer.setClearColor( 0xFAF7EC );
		renderer.setClearColor('black');
		onWindowResize(); // Sets size of renderer
		window.addEventListener('resize', onWindowResize, false);

		document.getElementById('world').appendChild(renderer.domElement);
		stats = new Stats();
		document.getElementById('stats').appendChild(stats.domElement);

		initScene();
	}

	function initScene() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.y = 80;
		camera.position.z = 100;
		scene.add(camera);

		controls = new THREE.TrackballControls(camera);
		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;
		controls.keys = [65, 83, 68];

		light = new THREE.DirectionalLight(0xffffff);
		light.position.set(0, 0, 1).normalize();
		camera.add(light);

		// Background
		var geometry = new THREE.SphereGeometry(90, 32, 32);
		var url = 'node_modules/threex.oimo/examples/bower_components/threex.planets/images/galaxy_starfield.png';
		var material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture(url),
			side: THREE.BackSide
		});
		var starSphere = new THREE.Mesh(geometry, material);
		scene.add(starSphere);

	}

	function onWindowResize(event) {
		var width = window.innerWidth;
		if (window.innerWidth > window.innerHeight * 1.3) {
			// var width = window.innerHeight * 1.3;
		}
		renderer.setSize(width - 20, window.innerHeight - 115);
	}

	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
		controls.update();
		stats.update();
	}

	function setupWorld(world) {
		initScene();
		var geometry = new THREE.PlaneGeometry(world.tiles_width, world.tiles_height);
		var material = new THREE.MeshBasicMaterial({
			color: 0xD5D5D5,
			side: THREE.DoubleSide
		});
		plane = new THREE.Mesh(geometry, material);
		plane.rotation.x = Math.PI / 2; //-90 degrees around the xaxis 
		plane.position.set(0, 0, 0);
		scene.add(plane);

		offsetX = world.tiles_width / 2 - 0.5;
		offsetY = world.tiles_height / 2 - 0.5;

		resetGrid(world);
		updateGrid(world);
	}


	function updateGrid(world) {
		for (var x = 0; x < world.tiles_width; x++) {
			for (var y = 0; y < world.tiles_height; y++) {
				if (world.grid[x][y] !== null && grid[x][y] === null) {
					addCube(x, y, world.grid[x][y]);
				}
			}
		}
	}


	function resetGrid(world) {
		grid = new Array([world.tiles_width]);
		for (var x = 0; x < world.tiles_width; x++) {
			grid[x] = new Array([world.tiles_height]);
			for (var y = 0; y < world.tiles_height; y++) {
				grid[x][y] = null;
			}
		}
		console.log("Created new grid of", world.tiles_width, "x", world.tiles_height, "tiles");
	}


	function addCube(x, y, color) {
		if (grid[x][y] !== null) {
			console.log("Skip", x, y, " already cube with color: ", grid[x][y].toString(16));
			return;
		}
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshPhongMaterial({
			color: color
		});
		cube = new THREE.Mesh(geometry, material);
		var cube = new THREE.Mesh(geometry, material);
		cube.position.set(x - offsetX, y - offsetY, -0.5);
		plane.add(cube);
		grid[x][y] = color;
	}


	// Keyboard events
	$window.keydown(function(event) {
		var newDirection = 0;
		var step = 1;
		switch (event.keyCode) {
			case 67: // c
				controls.reset(); // Reset camera position
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
		if (newDirection > 0) {
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
		if (socket.connected) {
			$body.css("background-color", "#F6FAFC");
		} else {
			$body.css("background-color", "#FFD9D9");
		}
	}


	socket.on('connected', function(data) {
		console.log("Connected to server, got ID: ", data.id);
		showConnectionStatus();
		console.log("I am: ", data.world.players[data.id]);
		setupWorld(data.world);
	});

	socket.on('restart', function(data) {
		console.log("Restarted by ", data.player);
		initScene();
		setupWorld(data.world);
	});

	socket.on('render', function(data) {
		updateGrid(data.world);
	});

	socket.on('connect_error', function(error) {
		console.log('Failed connecting to:', host, error);
	});

	socket.on("disconnect", function() {
		console.log("Disconnected from server");
		showConnectionStatus();
	});



});