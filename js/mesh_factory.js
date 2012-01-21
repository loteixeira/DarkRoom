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

MeshFactory.createCubeMesh = function(gl, size, offset, invertNormal) {
	if (!offset) {
		offset = [0, 0, 0];
	}
	
	if (!invertNormal) {
		invertNormal = false;
	}

	var halfX = size[0] / 2;
	var halfY = size[1] / 2;
	var halfZ = size[2] / 2;
	
	// create position data
	var positionData = [
		// at x = halfX
		halfX, -halfY, -halfZ,  // 0
		halfX, -halfY, halfZ,   // 1
		halfX, halfY, halfZ,    // 2
		halfX, halfY, -halfZ,   // 3
		
		// at x = -halfX
		-halfX, -halfY, -halfZ, // 4
		-halfX, -halfY, halfZ,  // 5
		-halfX, halfY, halfZ,   // 6
		-halfX, halfY, -halfZ,  // 7

		// at y = halfY
		-halfX, halfY, -halfZ,  // 8
		-halfX, halfY, halfZ,   // 9
		halfX, halfY, halfZ,    // 10
		halfX, halfY, -halfZ,   // 11
		
		// at y = -halfY
		-halfX, -halfY, -halfZ, // 12
		-halfX, -halfY, halfZ,  // 13
		halfX, -halfY, halfZ,   // 14
		halfX, -halfY, -halfZ,  // 15
		
		// at z = halfZ
		-halfX, -halfY, halfZ,  // 16
		halfX, -halfY, halfZ,   // 17
		halfX, halfY, halfZ,    // 18
		-halfX, halfY, halfZ,   // 19
		
		// at z = -halfZ
		-halfX, -halfY, -halfZ,  // 20
		halfX, -halfY, -halfZ,   // 21
		halfX, halfY, -halfZ,    // 22
		-halfX, halfY, -halfZ    // 23
	];
	
	// add offset
	for (var i = 0; i < positionData.length; i += 3) {
		for (var j = 0; j < 3; j++) {
			positionData[i + j] += offset[j];
		}
	}
	
	// create buffer
	var position = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);
	
	// create normal buffer
	var normalData = [
		// at x = halfX
		(invertNormal ? 1 : -1), 0, 0,
		(invertNormal ? 1 : -1), 0, 0,
		(invertNormal ? 1 : -1), 0, 0,
		(invertNormal ? 1 : -1), 0, 0,
		
		// at x = -halfX
		(invertNormal ? -1 : 1), 0, 0,
		(invertNormal ? -1 : 1), 0, 0,
		(invertNormal ? -1 : 1), 0, 0,
		(invertNormal ? -1 : 1), 0, 0,
		
		// at y = halfY
		0, (invertNormal ? 1 : -1), 0,
		0, (invertNormal ? 1 : -1), 0,
		0, (invertNormal ? 1 : -1), 0,
		0, (invertNormal ? 1 : -1), 0,
		
		// at y = -halfY
		0, (invertNormal ? -1 : 1), 0,
		0, (invertNormal ? -1 : 1), 0,
		0, (invertNormal ? -1 : 1), 0,
		0, (invertNormal ? -1 : 1), 0,
		
		// at z = halfZ
		0, 0, (invertNormal ? 1 : -1),
		0, 0, (invertNormal ? 1 : -1),
		0, 0, (invertNormal ? 1 : -1),
		0, 0, (invertNormal ? 1 : -1),
		
		//at z = -halfZ
		0, 0, (invertNormal ? -1 : 1),
		0, 0, (invertNormal ? -1 : 1),
		0, 0, (invertNormal ? -1 : 1),
		0, 0, (invertNormal ? -1 : 1)
	];
	
	var normal = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normal);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	
	// create texture coordinate buffer
	var maxSize = Math.max(size[0], Math.max(size[1], size[2]));
	var texcoordData = [];
	
	for (var i = 0; i < 6; i++) {
		var maxU = 1.0;
		var maxV = 1.0;
		
		if (i == 0 || i == 1) {
			maxU = size[2] / maxSize;
			maxV = size[1] / maxSize;
		} else if (i == 2 || i == 3) {
			maxU = size[0] / maxSize;
			maxV = size[2] / maxSize;
		} else {
			maxU = size[0] / maxSize;
			maxV = size[1] / maxSize;			
		}
		
		texcoordData.push(0.0, 0.0);
		texcoordData.push(maxU, 0.0);
		texcoordData.push(maxU, maxV);
		texcoordData.push(0.0, maxV);
	}
	
	var texcoord = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoordData), gl.STATIC_DRAW);
	
	// create index buffer
	var indexData = [
		// at x = halfX
		0, 1, 2,
		0, 2, 3,
		
		// at x = -halfX
		4, 5, 6,
		4, 6, 7,
		
		// at y = halfY
		8, 9, 10,
		8, 10, 11,
		
		// at y = -halfY
		12, 13, 14,
		12, 14, 15,
		
		// z = halfZ
		16, 17, 18,
		16, 18, 19,
		
		// z = -halfZ
		20, 21, 22,
		20, 22, 23
	];
	
	var index = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	
	// return object
	var mesh = { positionBuffer: position, normalBuffer: normal, texcoordBuffer: texcoord, indexBuffer: index };
	return mesh;
};