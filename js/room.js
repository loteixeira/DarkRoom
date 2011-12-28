Room = function(gl, size) {
	this.mesh = MeshFactory.createCubeMesh(gl, size);
	this.texture = TextureLoader.get("res/wall.jpg");
	
	var arrays = [ "aPosition", "aNormal", "aTexcoord" ];
	var uniforms = [ "uProjection", "uModelview","uSampler", "uAmbientLight", "uDiffuseLight" ];
	this.shaderProgram = ShaderDatabase.link(gl, "room-vertex-shader", "room-frag-shader", arrays, uniforms);
};

Room.prototype.update = function(gl, camera) {
	gl.disable(gl.BLEND);
	
	// setup shader
    gl.useProgram(this.shaderProgram);
    gl.uniformMatrix4fv(this.shaderProgram.uniforms["uProjection"], false, camera.getProjection());
    gl.uniformMatrix4fv(this.shaderProgram.uniforms["uModelview"], false, camera.getModelview());
    gl.uniform3fv(this.shaderProgram.uniforms["uDiffuseLight"], [0.1, 0.1, 0.05]);
    gl.uniform3fv(this.shaderProgram.uniforms["uAmbientLight"], [0.01, 0.01, 0.01]);
	
	// enable vertex arrays
	gl.enableVertexAttribArray(this.shaderProgram.arrays["aPosition"]);
	gl.enableVertexAttribArray(this.shaderProgram.arrays["aTexcoord"]);
	
	// bind position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.positionBuffer);
	gl.vertexAttribPointer(this.shaderProgram.arrays["aPosition"], 3, gl.FLOAT, false, 0, 0);

	// bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
	gl.vertexAttribPointer(this.shaderProgram.arrays["aNormal"], 3, gl.FLOAT, false, 0, 0);
	
	// bind texture coordinate buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.texcoordBuffer);
	gl.vertexAttribPointer(this.shaderProgram.arrays["aTexcoord"], 2, gl.FLOAT, false, 0, 0);

	// bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.shaderProgram.uniforms["uSampler"], 0);

	// bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
	
	// render
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	gl.flush();
};