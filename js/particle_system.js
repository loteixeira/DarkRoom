ParticleSystem = function(gl, particleCount, creationRate, duration) {
	this.particleCount = particleCount;
	this.creationRate = creationRate;
	this.duration = duration;
	this.enable = true;
	
	this.accumTime = 0;
	this.particles = new Array();
	this.deadParticles = new Array();
	this.posArray = new Float32Array(particleCount * 12);
	this.lifeArray = new Float32Array(particleCount * 4);
	this.particleMesh = MeshFactory.createParticleMesh(gl, particleCount);
	this.particleTexture = TextureLoader.get("res/particle.png");
	
	var arrays = [ "aPosition", "aTexcoord", "aLife" ];
	var uniforms = [ "uProjection", "uModelview", "uSampler" ];
	this.shaderProgram = ShaderDatabase.link(gl, "particle-vertex-shader", "particle-frag-shader", arrays, uniforms);
	
	this.height = 0;
	this.averageLife = 0;
	this.lightPosition = vec3.create([0, 0, 0]);
	this.lightIntensity = 0;
};

ParticleSystem.prototype.setEnable = function(enable) {
	this.enable = enable;
};

ParticleSystem.prototype.isEnable = function() {
	return this.enable;
};

ParticleSystem.prototype.getLightPosition = function() {
	return this.lightPosition;
};

ParticleSystem.prototype.getLightIntensity = function() {
	return this.lightIntensity;
};

ParticleSystem.prototype.update = function(gl, interval, camera) {
	// check for particle creation
	this.accumTime += interval;
	
	if (this.accumTime > this.creationRate) {
		var times = Math.round(this.accumTime / this.creationRate);
		
		for (var i = 0; i < times; i++) {
			if (this.enable && this.particles.length < this.particleCount) {
				if (Math.round(Math.random() * 3) != 1) {
					this.createParticle();
				}
			}
		}
		
		this.accumTime = this.accumTime % this.creationRate;
	}
	
	// update particles
	this.updateParticles(interval, camera);
	
	// update light
	this.updateLight();
	
	// enable blending
	gl.enable(gl.BLEND);
	
	// setup shader
    gl.useProgram(this.shaderProgram);
    gl.uniformMatrix4fv(this.shaderProgram.uniforms["uProjection"], false, camera.getProjection());
    gl.uniformMatrix4fv(this.shaderProgram.uniforms["uModelview"], false, camera.getModelview());
	
	// enable vertex arrays
	gl.enableVertexAttribArray(this.shaderProgram.arrays["aPosition"]);
	gl.enableVertexAttribArray(this.shaderProgram.arrays["aTexcoord"]);
	gl.enableVertexAttribArray(this.shaderProgram.arrays["aLife"]);
	
	// bind position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.particleMesh.positionBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.posArray);
	gl.vertexAttribPointer(this.shaderProgram.arrays["aPosition"], 3, gl.FLOAT, false, 0, 0);
	
	// bind life buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.particleMesh.lifeBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.lifeArray);
	gl.vertexAttribPointer(this.shaderProgram.arrays["aLife"], 1, gl.FLOAT, false, 0, 0);
	
	// bind texture coordinate buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.particleMesh.texcoordBuffer);
	gl.vertexAttribPointer(this.shaderProgram.arrays["aTexcoord"], 2, gl.FLOAT, false, 0, 0);

	// bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.particleTexture);
    gl.uniform1i(this.shaderProgram.uniforms["uSampler"], 0);

	// bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.particleMesh.indexBuffer);
	
	// render
	gl.drawElements(gl.TRIANGLES, this.particles.length * 6, gl.UNSIGNED_SHORT, 0);
	gl.flush();
};

ParticleSystem.prototype.createParticle = function() {
	// randomize start position (using polar coordinates)
	var radius = Math.random() + 0.4;
	var angle = Math.random() * 2 * Math.PI;
	
	// randomize start velocity
	var velXZ = 5 + (Math.random() * 2000) / 1000;
	var velY = 20 + Math.random() % 40;
	
	// create particle object
	var particle = {
		pos: vec3.create([radius * Math.cos(angle), 0, radius * Math.sin(angle)]),
		vel: vec3.create([velXZ * Math.cos(angle), velY, velXZ * Math.sin(angle)]),
		life: 0,
		squaredDistance: 0
	};

	// add to list!
	this.particles.push(particle);
};

ParticleSystem.prototype.updateParticles = function(interval, camera) {
	var force = vec3.create;
	var instantVel = vec3.create();
	var toEye = vec3.create();
	
	// update particles
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		
		// increase particle's life
		particle.life += interval;
		
		// is dead?
		if (particle.life > this.duration) {
			this.deadParticles.push(i);
		} else {
			// update particle position
			var distSq = vec3.dot(particle.pos, particle.pos);
			var time = interval / 1000;
		
			vec3.subtract([0, particle.pos[1], 0], particle.pos, force);
			vec3.scale(force, 120 * time / distSq);
			vec3.add(particle.vel, force);
			vec3.add(particle.pos, vec3.scale(particle.vel, time, instantVel));
		
			// calculate squared distance from observer
			mat4.multiplyVec3(camera.getModelview(), particle.pos, toEye);
			particle.squaredDistance = vec3.dot(toEye, toEye);
		}
	}
	
	// remove dead particles
	while (this.deadParticles.length > 0) {
		this.particles.splice(this.deadParticles.pop(), 1);
	}
	
	// sort particles
	this.particles.sort(function(a, b) {
		return a.squaredDistance < b.squaredDistance;
	});
	
	// fill buffers
	this.height = 0;
	this.averageLife = 0;
	var view = vec3.create();
	var horizontal = vec3.create();
	var vertical = vec3.create();
	
	// make particle face observer
	vec3.subtract(camera.getCenter(), camera.getEye(), view);
	vec3.normalize(view);

	vec3.cross(camera.getUp(), view, horizontal);
	vec3.normalize(horizontal);
	
	vec3.cross(horizontal, view, vertical);
	vec3.normalize(vertical);
	
	vec3.scale(horizontal, 1);
	vec3.scale(vertical, 1);
	
	// loop through alive particles
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		var centerX = particle.pos[0];
		var centerY = particle.pos[1];
		var centerZ = particle.pos[2];
		
		this.averageLife += particle.life;
		
		// find the max height
		if (centerY > this.height) {
			this.height = centerY;
		}
		
		// fill position buffer
		var posIndex = i * 12;

		// first vertex
		this.posArray[posIndex] = centerX + horizontal[0] + vertical[0];
		this.posArray[posIndex + 1] = centerY + horizontal[1] + vertical[1];
		this.posArray[posIndex + 2] = centerZ + horizontal[2] + vertical[2];
	
		// second vertex
		this.posArray[posIndex + 3] = centerX + horizontal[0] - vertical[0];
		this.posArray[posIndex + 4] = centerY + horizontal[1] - vertical[1];
		this.posArray[posIndex + 5] = centerZ + horizontal[2] - vertical[2];
		
		// third vertex
		this.posArray[posIndex + 6] = centerX - horizontal[0] - vertical[0];
		this.posArray[posIndex + 7] = centerY - horizontal[1] - vertical[1];
		this.posArray[posIndex + 8] = centerZ - horizontal[2] - vertical[2];
	
		// fourth vertex
		this.posArray[posIndex + 9] = centerX - horizontal[0] + vertical[0];
		this.posArray[posIndex + 10] = centerY - horizontal[1] + vertical[1];
		this.posArray[posIndex + 11] = centerZ - horizontal[2] + vertical[2];
		
		// fill life buffer
		var particleLife = particle.life / this.duration;
		
		if (particleLife < 0)
			particleLife = 0;
		else if (particleLife > 1)
			particleLife = 1;

		var lifeIndex = i * 4;
		this.lifeArray[lifeIndex] = particleLife;
		this.lifeArray[lifeIndex + 1] = particleLife;
		this.lifeArray[lifeIndex + 2] = particleLife;
		this.lifeArray[lifeIndex + 3] = particleLife;
	}
	
	this.averageLife /= this.particles.length;
};

ParticleSystem.prototype.updateLight = function() {
	vec3.set([0, this.height / 2, 0], this.lightPosition);

	if (isNaN(this.averageLife)) {
		this.lightIntensity = 0;
	} else {
		var averageValue = this.averageLife / this.duration;
	
		if (averageValue > 1) {
			averageValue = 1;
		}
	
		this.lightIntensity = averageValue * (this.particles.length / this.particleCount);
	}
};