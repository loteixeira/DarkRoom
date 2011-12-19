MeshFactory = {};

MeshFactory.createParticleMesh = function(gl, count) {
	// create position buffer
	var position = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(count * 12), gl.DYNAMIC_DRAW);
	
	// create color buffer
	var life = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, life);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(count * 4), gl.DYNAMIC_DRAW);
	
	// create texture coordinate buffer
	var texcoord = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
	
	var texcoordData = new Array();
	
	for (var i = 0; i < count; i++) {
		texcoordData.push(0.0, 0.0);
		texcoordData.push(1.0, 0.0);
		texcoordData.push(1.0, 1.0);
		texcoordData.push(0.0, 1.0);
	}
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoordData), gl.STATIC_DRAW);
	
	// create index buffer
	var index = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
	
	var indices = new Array();
	
	for (var i = 0; i < count; i++) {
		var baseIndex = i * 4;

		// first triangle
		indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
		// second triangle
		indices.push(baseIndex, baseIndex + 3, baseIndex + 2);
	}
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	
	// return object
	var mesh = { positionBuffer: position, texcoordBuffer: texcoord, indexBuffer: index, lifeBuffer: life };
	return mesh;
};

MeshFactory.createRoomMesh = function(gl, size) {
	var halfX = size[0] / 2;
	var halfY = size[1] / 2;
	var halfZ = size[2] / 2;
	
	// create position buffer
	var positionData = [
		// at x = half
		halfX, -halfY, -halfZ,  // 0
		halfX, -halfY, halfZ,   // 1
		halfX, halfY, halfZ,    // 2
		halfX, halfY, -halfZ,   // 3
		
		// at x = -half
		-halfX, -halfY, -halfZ, // 4
		-halfX, -halfY, halfZ,  // 5
		-halfX, halfY, halfZ,   // 6
		-halfX, halfY, -halfZ,  // 7

		// at y = half
		-halfX, halfY, -halfZ,  // 8
		-halfX, halfY, halfZ,   // 9
		halfX, halfY, halfZ,    // 10
		halfX, halfY, -halfZ,   // 11
		
		// at y = -half
		-halfX, -halfY, -halfZ, // 12
		-halfX, -halfY, halfZ,  // 13
		halfX, -halfY, halfZ,   // 14
		halfX, -halfY, -halfZ,  // 15
		
		// at z = half
		-halfX, -halfY, halfZ,  // 16
		halfX, -halfY, halfZ,   // 17
		halfX, halfY, halfZ,    // 18
		-halfX, halfY, halfZ,   // 19
		
		// at z = -half
		-halfX, -halfY, -halfZ,  // 20
		halfX, -halfY, -halfZ,   // 21
		halfX, halfY, -halfZ,    // 22
		-halfX, halfY, -halfZ    // 23
	];
	
	var position = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);
	
	// create texture coordinate buffer
	var texcoordData = [];
	
	for (var i = 0; i < 6; i++) {
		texcoordData.push(0.0, 0.0);
		texcoordData.push(1.0, 0.0);
		texcoordData.push(1.0, 1.0);
		texcoordData.push(0.0, 1.0);
	}
	
	var texcoord = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoordData), gl.STATIC_DRAW);
	
	// create index buffer
	var indexData = [
		// at x = half
		0, 1, 2,
		0, 2, 3,
		
		// at x = -half
		4, 5, 6,
		4, 6, 7,
		
		// at y = half
		8, 9, 10,
		8, 10, 11,
		
		// at y = -half
		12, 13, 14,
		12, 14, 15,
		
		// z = half
		16, 17, 18,
		16, 18, 19,
		
		// z = -half
		20, 21, 22,
		20, 22, 23
	];
	
	var index = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	
	// return object
	var mesh = { positionBuffer: position, texcoordBuffer: texcoord, indexBuffer: index };
	return mesh;
};