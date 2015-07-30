function Plane(width, height) {
	this.width = width;
	this.height = height;

	this.offsetX = width / 2 - 0.5;
	this.offsetY = height / 2 - 0.5;
	this.initPlane();

}

Plane.prototype.initPlane = function() {
	var geometry = new THREE.PlaneGeometry(this.width, this.height);
	var material = new THREE.MeshBasicMaterial({
		color: 0x0,
		side: THREE.DoubleSide
	});
	this.plane = new THREE.Mesh(geometry, material);
	this.plane.rotation.x = Math.PI / 2;
	this.plane.position.set(0, 0, 0);
	this.initLines();
};

Plane.prototype.initLines = function() {
	var material = new THREE.LineBasicMaterial({
		// color: 0x00344C
		color: 0x00FFFF
	});

	var geometry = new THREE.Geometry();
	var z = -0.001;

	var x1 = -0.5 - this.offsetX,
		x2 = this.width - this.offsetX - 0.5,
		y1 = -0.5 - this.offsetY,
		y2 = this.height - this.offsetY - 0.5;

	// Horizontal lines
	for (var x = 0 - this.offsetX; x < this.width - this.offsetX; x++) {
		geometry.vertices.push(
			new THREE.Vector3(x, y1, z),
			new THREE.Vector3(x, y2, z)
		);
	}

	// Vertical lines
	for (var y = 0 - this.offsetY; y < (this.height - this.offsetY); ++y) {
		geometry.vertices.push(
			new THREE.Vector3(x1, y, z),
			new THREE.Vector3(x2, y, z)
		);
	}

	var line = new THREE.Line(geometry, material, THREE.LinePieces);
	this.plane.add(line);
};


Plane.prototype.addCube = function(x, y, color) {
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({
		color: color
	});
	cube = new THREE.Mesh(geometry, material);
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(x - this.offsetX, y - this.offsetY, -0.5);
	this.plane.add(cube);
};

Plane.prototype.getMesh = function() {
	return this.plane;
};