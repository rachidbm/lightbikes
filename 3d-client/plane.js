
function Plane(width, height) {
	var geometry = new THREE.PlaneGeometry(width, height);
	var material = new THREE.MeshBasicMaterial({
		color: 0xD5D5D5,
		side: THREE.DoubleSide
	});
	this.plane = new THREE.Mesh(geometry, material);
	this.plane.rotation.x = Math.PI / 2;
	this.plane.position.set(0, 0, 0);
	this.offsetX = width / 2 - 0.5;
	this.offsetY = height / 2 - 0.5;
}

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