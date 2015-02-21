var Timer = (function() {
	var self = {};

	var data = {};

	var t = 0;
	var dt = 1 / 60;
	var currentTime = 0;
	var startTime = 0;
	var accumulator = 0;

	var running = false;

	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(f) {
			setTimeout(f, 1000 * dt);
		};

	var mainLoop = function() {
		var time = Date.now();
		var newTime = time / 1000;
		var frameTime = newTime - currentTime;
		// limit the frame time to 4 fps
		if (frameTime > 0.25)
			frameTime = 0.25;
		currentTime = newTime;

		accumulator += frameTime;

		while (accumulator >= dt) {
			if (data.simulation)
				data.simulation(dt);
			t += dt;
			accumulator -= dt;
		}

		if (data.graphics)
			data.graphics(time - startTime);

		if (running) {
			requestAnimationFrame(mainLoop);
		}
	};

	self.init = function(_data) {
		data.simulation = _data.simulation || function() {};
		data.graphics = _data.graphics || function() {};
		dt = typeof _data.framerate != 'undefined' ? 1 / _data.framerate : dt;
		self.start();
	};

	self.start = function() {
		if (!running) {
			running = true;
			startTime = Date.now();
			currentTime = startTime / 1000;
			mainLoop();
		}
	};

	self.stop = function() {
		running = false;
	};

	return self;
})();