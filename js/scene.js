function Scene(canvas, gl) {
	this.canvas = canvas;
	this.gl = gl;
	
	this.start();
}

Scene.prototype.start = function() {
	console.log("done!");
	
	var roomSize = [300, 100, 300];
	this.room = new Room(this.gl, roomSize);
	this.particleSystem = new ParticleSystem(this.gl, 500, 5, 900);
	//this.particleSystem = new ParticleSystem(this.gl, 1, 3, 900);
	this.camera = new Camera(this.gl, this.canvas.width / this.canvas.height, roomSize[1] / 6);
};

Scene.prototype.update = function(interval) {
	this.camera.update(interval);
	this.room.update(this.gl, this.camera, this.particleSystem.getLightPosition(), this.particleSystem.getLightColor());
	this.particleSystem.update(this.gl, interval, this.camera);
};

Scene.prototype.reshape = function(width, height) {
	this.camera.setAspect(width / height);
};

Scene.prototype.mouseEvent = function(type, event) {
	this.camera.mouseEvent(type, event);
};