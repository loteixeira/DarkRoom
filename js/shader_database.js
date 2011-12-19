ShaderDatabase = {}; 

ShaderDatabase.load = function(gl, ids) {
	ShaderDatabase._shaders = new Object();
	
	for (var i = 0; i < ids.length; i++) {
		var shader = ShaderDatabase._getShader(gl, ids[i]);
		
		if (shader) {
			ShaderDatabase._shaders[ids[i]] = shader;
		} else {
			console.log("Error creating shader " + ids[i]);
		}
	}
};

ShaderDatabase.link = function(gl, vertexId, fragId, vertexArrays, uniforms) {
	// create program
	var vertexShader = ShaderDatabase._shaders[vertexId];
	var fragShader = ShaderDatabase._shaders[fragId];
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram);
	
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    // active program
    gl.useProgram(shaderProgram);
    
    // set vertex arrays
    shaderProgram.arrays = {};
    
    for (var i = 0; i < vertexArrays.length; i++) {
    	var location = gl.getAttribLocation(shaderProgram, vertexArrays[i]);
    	gl.enableVertexAttribArray(location);
    	shaderProgram.arrays[vertexArrays[i]] = location;   	
    }
    
    // set uniforms
    shaderProgram.uniforms = {};
    
    for (var i = 0; i < uniforms.length; i++) {
    	var location = gl.getUniformLocation(shaderProgram, uniforms[i]);
    	shaderProgram.uniforms[uniforms[i]] = location;
    }
	
    // return
	return shaderProgram;
};

// from WebGL Lesson 1
// http://learningwebgl.com/blog/?p=28
ShaderDatabase._getShader = function(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3)
			str += k.textContent;
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
	shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
	return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
};