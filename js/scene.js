function Scene(canvas, gl) {
	this.canvas = canvas;
	this.gl = gl;
	
	this.start();
}

Scene.prototype.start = function() {
	console.log("done!");
	
	this.room = new Room(this.gl, [300, 200, 300]);
	this.particleSystem = new ParticleSystem(this.gl, 1000, 2, 900);
	this.camera = new Camera(this.gl, this.canvas.width / this.canvas.height);
};

Scene.prototype.update = function(interval) {
	this.camera.update(interval);
	this.room.update(this.gl, this.camera);
	this.particleSystem.update(this.gl, interval, this.camera);
};

Scene.prototype.reshape = function(width, height) {
	this.camera.setAspect(width / height);
};

Scene.prototype.mouseEvent = function(type, event) {
	this.camera.mouseEvent(type, event);
};