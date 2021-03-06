console.log("========================");
console.log("starting...");

var frameRate = 60;
var interval = 1000 / frameRate;
var lastUpdate = 0;
var stats;
var div;
var canvas;
var gl;
var scene;

window.onload = function () {
	canvas = createCanvas();
	gl = startWebGL(canvas);
	
	if (canvas && gl) {
		// webgl configuration
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
    	gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
        	
        // load shaders
    	var shaders = [
			"particle-vertex-shader", "particle-frag-shader",
			"room-vertex-shader", "room-frag-shader"
		];
    	ShaderDatabase.load(gl, shaders);
    	
    	// load textures
    	var textures = [
			"res/particle.png",
			"res/wall.jpg"
		];
    	TextureLoader.load(gl, textures, start);
    	
    	// create stats component
    	stats = new Stats();

    	stats.domElement.style.position = 'absolute';
    	stats.domElement.style.left = '0px';
    	stats.domElement.style.top = '0px';

    	div.appendChild(stats.domElement);
	}
};

/*window.onresize = function(e) {
	if (scene) {
		scene.canvas.width = window.innerWidth;
		scene.canvas.height = window.innerHeight;
		scene.gl.viewportWidth = scene.canvas.width;
		scene.gl.viewportHeight = scene.canvas.height;

		scene.reshape(scene.canvas.width, scene.canvas.height);
	}
};*/

window.onmousedown = function(e) {
	if (scene) {
		scene.mouseEvent("down", e);
	}
};

window.onmousemove = function(e) {
	if (scene) {
		scene.mouseEvent("move", e);
	}
};

window.onmouseup = function(e) {
	if (scene) {
		scene.mouseEvent("up", e);
	}
};

window.onkeydown = function(e) {
	if (scene) {
		scene.keyboardEvent("down", e);
	}
};

window.onkeyup = function(e) {
	if (scene) {
		scene.keyboardEvent("up", e);
	}
};

function start() {
	scene = new Scene(canvas, gl);
	
	lastUpdate = (new Date()).getTime();
	setInterval(update, 1000 / frameRate, canvas, gl);
}

function createCanvas() {
	div = document.getElementById("content-div");
	var canvas = document.getElementById("content-canvas");
	
	div.style.margin = '0 auto';
	div.style.position = 'relative';
	div.style.width = '640px';
	div.style.height = '480px';

	canvas.width = 640;
	canvas.height = 480;
	
	return canvas;
}

function startWebGL(canvas) {
	var gl = null;
	
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch(e) {
		alert("Exception initializing WebGL: " + e);
	}

	if (!gl) {
		alert("Could not initialise WebGL");
	}
	
	return gl;
}

function update(canvas, gl) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.ALPHA_BUFFER_BIT);
	
	var now = (new Date()).getTime();
	scene.update(now - lastUpdate);
	lastUpdate = now;
	
	stats.update();
}

function printError() {
	var error = gl.getError();
	
	 if (error == gl.OUT_OF_MEMORY) {
		 console.log("OUT_OF_MEMORY ERROR");
	 } else if (error == gl.INVALID_ENUM_OPERATION) {
		 console.log("INVALID_ENUM_OPERATION ERROR");
	 } else if (error == gl.INVALID_FRAMEBUFFER_OPERATION) {
		 console.log("INVALID_FRAMEBUFFER_OPERATION ERROR");
	 } else if (error == gl.INVALID_VALUE) {
		 console.log("INVALID_VALUE ERROR");
	 } else if (error == gl.CONTEXT_LOST_WEBGL) {
		 console.log("CONTEXT_LOST_WEBGL ERROR");
	 } else if (error == gl.NO_ERROR) {
		 console.log("NO_ERROR");
	 }
}