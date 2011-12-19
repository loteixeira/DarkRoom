TextureLoader = function(gl, file, callback) {
	this.gl = gl;
	this.callback = callback;
	
	this.texture = gl.createTexture();
	this.image = new Image();
	this.image.self = this;
	this.image.onload = function() {
		this.self.callback(this.self);
	};
	
	this.image.src = file;
};

TextureLoader.load = function(gl, files, operationCallback) {
	TextureLoader.gl = gl;
	TextureLoader.files = files;
	TextureLoader.loadedFiles = 0;
	TextureLoader.operationCallback = operationCallback;
	
	for (var i = 0; i < files.length; i++) {
		var pointer = new TextureLoader(gl, files[i], TextureLoader.loadCallback);
		TextureLoader.add(files[i], pointer);
	}
};

TextureLoader.loadCallback = function(loader) {
	var gl = TextureLoader.gl;
	
	gl.bindTexture(gl.TEXTURE_2D, loader.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loader.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	
	TextureLoader.loadedFiles++;
	
	if (TextureLoader.loadedFiles == TextureLoader.files.length) {
		TextureLoader.operationCallback();
	}
};

TextureLoader.add = function(file, pointer) {
	if (!TextureLoader.pointers) {
		TextureLoader.pointers =  {};
	}

	TextureLoader.pointers[file] = pointer;
};

TextureLoader.get = function(file) {
	return TextureLoader.pointers[file].texture;
};