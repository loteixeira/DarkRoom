function Camera(gl, aspect, halfMaxZ) {
	this.gl = gl;
	this.modelview = mat4.create();
	this.projection = mat4.create();
	this.eye = vec3.create([0, 0, -100]);
	this.center = vec3.create([0, 0, 0]);
	this.up = vec3.create([0, 1, 0]);
	this.setAspect(aspect);
	this.halfMaxZ = halfMaxZ;

	this.radius = 100;
	this.theta = 0;
	this.velTheta = 0;
	this.z = 0;
	this.velZ = 0;
	this.lastX = 0;
	this.lastY = 0;
	this.dragging = false;
}

Camera.prototype.setAspect = function(aspect) {
	this.aspect = aspect;
};

Camera.prototype.getAspect = function() {
	return this.aspect;
};

Camera.prototype.getProjection = function() {
	return this.projection;
};

Camera.prototype.getModelview = function() {
	return this.modelview;
};

Camera.prototype.getEye = function() {
	return this.eye;
};

Camera.prototype.getCenter = function() {
	return this.center;
};

Camera.prototype.getUp = function() {
	return this.up;
};

Camera.prototype.update = function(interval) {
	if (Math.abs(this.velTheta) < 0.01) {
		this.velTheta = 0;
	} else {
		this.velTheta *= 0.99;
	}
	
	if (Math.abs(this.velZ) < 0.01) {
		this.velZ = 0;
	} else {
		this.velZ *= 0.99;
	}
	
	var time = interval / 1000;
	
	this.theta += this.velTheta * time;
	
	if (this.z < -this.halfMaxZ) {
		this.z = -this.halfMaxZ;
		this.velZ = 0;
	} else if (this.z > this.halfMaxZ) {
		this.z = this.halfMaxZ;
		this.velZ = 0;
	} else {
		this.z += this.velZ * time;
	}
	
	// calculate camera position using cylindrical coordinate system
	this.eye[0] = this.radius * Math.cos(this.theta);
	this.eye[1] = this.z;
	this.eye[2] = this.radius * Math.sin(this.theta);
	
	// create projection matrix
	mat4.perspective(45, this.aspect, 1, 1000, this.projection);
	// create modelview matrix
    mat4.lookAt(this.eye, this.center, this.up, this.modelview);
    
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
};

Camera.prototype.mouseEvent = function(type, event) {
	if (type == "down") {
		// mouse down event
		this.dragging = true;
		this.lastX = event.clientX;
		this.lastY = event.clientY;
	} else if (type == "move") {
		// mouse move event
		if (this.dragging) {
			var dTheta = (this.lastX - event.clientX) / this.gl.viewportWidth;
			this.velTheta += dTheta * (Math.PI / 2);
			
			var dZ = (this.lastY - event.clientY) / this.gl.viewportHeight;
			this.velZ += dZ * 25;
			
			this.lastX = event.clientX;
			this.lastY = event.clientY;			
		}
	} else if (type == "up") {
		// mouse up event
		this.dragging = false;
	}
};