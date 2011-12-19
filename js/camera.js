function Camera(gl, aspect) {
	this.gl = gl;
	this.modelview = mat4.create();
	this.projection = mat4.create();
	this.eye = vec3.create([0, 0, -100]);
	this.center = vec3.create([0, 0, 0]);
	this.up = vec3.create([0, 1, 0]);
	this.setAspect(aspect);

	this.radius = 100;
	this.phi = Math.PI / 2;
	this.theta = 0;
	this.velPhi = 0;
	this.velTheta = 0;
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
	if (Math.abs(this.velPhi) < 0.001) {
		this.velPhi = 0;
	} else {
		this.velPhi *= 0.99;
	}
	
	if (Math.abs(this.velTheta) < 0.001) {
		this.velTheta = 0;
	} else {
		this.velTheta *= 0.99;
	}
	
	var time = interval / 100;
	
	this.phi += this.velPhi * time;
	
	if (this.theta < Math.PI / 4) {
		this.theta = Math.PI / 4;
		this.velTheta = 0;
	} else if (this.theta < -Math.PI / 4) {
		this.theta = -Math.PI / 4;
		this.velTheta = 0;
	}
	
	this.theta += this.velTheta * time;
	
	// calculate camera position using spherical coordinate system
	this.eye[0] = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
	this.eye[1] = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
	this.eye[2] = this.radius * Math.cos(this.phi);
	
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
			var dPhi = (this.lastX - event.clientX) / this.gl.viewportWidth;
			var dTheta = (this.lastY - event.clientY) / this.gl.viewportHeight;
			
			this.velPhi += dPhi * (Math.PI / 4);
			this.velTheta += dTheta * (Math.PI / 8);
			
			this.lastX = event.clientX;
			this.lastY = event.clientY;			
		}
	} else if (type == "up") {
		// mouse up event
		this.dragging = false;
	}
};