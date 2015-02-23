   
/* Constants */

var width = 600,
	height = 720;

var LEFT = 0,
	UP = 1,
	RIGHT = 2,
	DOWN = 3;


/* Variables */

var camera;
var scene;
var renderer;
var composer;     
// A composer combines different piece types of Passes
// Like a RenderPass and ShaderPasss
var animator;

var cubeParent;
var cube;
var nextBlock;
var nextBlockType;
var nextBlockRotation;
var cubes;
var player;
var angle = 0;

var graphicsStartTime;

var lineCleared = false;
var onGround = false;
var gameover = true;
var paused = false;
var controlActive = true;
var playerAcceleration = 2000;
var maxSpeed = 250;
var rotation = {
	x: 0,
	y: 0,
	z: 0
};
var rotationTarget = {
	x: 0,
	y: 0,
	z: 0
};
var quaternion, quaternionSrc, quaternionDst, quaternionTime;
var x = 0,
	y = 0,
	r = 0;
var xspeed = 0,
	yspeed = 0,
	rspeed = 0;
var xacc = 0,
	yacc = 0,
	racc = 0;

var keydown = {};
var keydownTimer = {};

var keyTime;
var keyWaitTime = 0.15;
var keyIntervalTime = 0.05;
var keyDropWaitTime = 0.08;
var keyDropIntervalTime = 0.02;

var fallTime;
var fallGroundTime = 0.3;
var fallInitialIntervalTime = 1;
var fallIntervalTime = fallInitialIntervalTime;
var fallIntervalDecrease = 0.045;

var lineClearTime = 1;
var gameStartTime = 1000;

var clearTime;
var clearWaitTime = 0.5;

var blockPlacePause = 200;

var blockSize = 1;

var level = {
	w: 10,
	h: 18,
	stage: null,
	stageBlocks: null,
	blockSegments: null,
	blockSegmentsTargets: null,
	explosionObject: null,
	explosionBlocks: []
};

var htmltext = {
	level: document.getElementById('text-level'),
	score: document.getElementById('text-score'),
	lines: document.getElementById('text-lines'),
	highscorehead: document.getElementById('text-highscore-head'),
	highscore: document.getElementById('text-highscore'),
	info: document.getElementById('text-info')
};

var gamedata = {
	highscore: 0,
	level: 0,
	score: 0,
	lines: 0
};

var maxLevel = 20;
var scoremultiplier = 0.5;
var scoretable = {
	1: 100,
	2: 300,
	3: 600,
	4: 800
};

var blocks;

var logotype;
var logotypeBlocks;
var logotypeData = [
	[1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
	[0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
	[0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
	[0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
	[0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0]
];

var shapes = [
	// S piece
	[[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]],

	// I piece
	[[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 3, 0, 0], [0, 0, 3, 0, 0], [0, 0, 3, 0, 0], [0, 0, 3, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]],

	// L piece
	[[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 0, 2, 0, 0], [0, 0, 2, 2, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]],

	// T piece
	[[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 4, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 4, 0, 0], [0, 4, 4, 4, 0], [0, 0, 4, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]]

	/*[[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
	[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]]*/
	/*{
		collision: [
		[0x0010, 0x0111, 0x0000, 0x0000],
		[0x0010, 0x0011, 0x0010, 0x0000],
		[0x0000, 0x0111, 0x0010, 0x0000],
		[0x0010, 0x0110, 0x0010, 0x0000],
		[0x0010, 0x0010, 0x0000, 0x0000],
		[0x0000, 0x0011, 0x0000, 0x0000],
		[0x0000, 0x0010, 0x0010, 0x0000],
		[0x0000, 0x0110, 0x0000, 0x0000],
		[0x0010, 0x0010, 0x0010, 0x0000],
		[0x0010, 0x0010, 0x0010, 0x0000],
		[0x0000, 0x0111, 0x0000, 0x0000],
		[0x0000, 0x0111, 0x0000, 0x0000]
		],
		rotation: [
		[4, 11, 4, 10],
		[8, 5, 9, 5],
		[6, 10, 6, 11],
		[9, 7, 8, 7],
		[0, 9, 0, 8],
		[10, 1, 11, 1],
		[2, 8, 2, 9],
		[11, 3, 10, 3],
		[3, 4, 1, 6],
		[1, 6, 3, 4],
		[7, 0, 5, 2],
		[5, 2, 7, 0]
		]
	}*/
];

var block = {
	stagex: 0,
	stagey: 0,
	targetx: 2,
	targety: 2,
	prevx: 2,
	prevy: 2,
	movetime: 0,
	x: 2,
	y: 2,
	type: 0,
	rotation: 0
};

var collisionMap = document.createElement('canvas');
collisionMap.width = 40;
collisionMap.height = 40;
collisionMap.ctx = collisionMap.getContext('2d');
//document.body.appendChild(collisionMap);

var textures = [];


/* Loads the textures */
(function() {
	if (hasWebGL()) {
		textures = [];
		var images = ['img/block1.png', 'img/block2.png', 'img/block3.png', 'img/block4.png'];
		var nimages = images.length;
		for (var i = 0; i < nimages; i++) {
			var t = THREE.ImageUtils.loadTexture(images[i]);
			t.magFilter = THREE.NearestFilter;
			textures.push(t);

			var img = new Image();
			img.onload = (function(img) {
				return function() {
					nimages--;
					if (nimages == 0)
						load();
				}
			})(img);
			img.src = images[i];
		}
	} else {
		document.getElementById('no-webgl').style.display = 'block';
	}
})();

function hasWebGL() {
	if ( !! window.WebGLRenderingContext) {
		var canvas = document.createElement("canvas"),
			names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
			context = false;

		for (var i = 0; i < 4; i++) {
			try {
				context = canvas.getContext(names[i]);
				if (context && typeof context.getParameter == "function") {
					// WebGL is enabled
					return true;
				}
			} catch (e) {}
		}
	}
	// WebGL not supported
	return false;
}

/**
 * This function loads and sets up almost everything, such as:
 *   - Highscore
 *   - Camera
 *   - Scene
 *   - Lights
 *   - Blocks
 *   - ShadowMap
 *   - Composers
 *   - Meshes & Geometry
 *   - Logotype
 *   - Event listeners (kbd, gamepad, blur, focus, clicks)
 *   - Probably a lot more...
 *
 *  NOTE: Make sure textures are loaded BEFORE calling this.
 */
function load() {


	// Loads highscore from localStorage
	var score = localStorage.getItem('tretris_highscore');
	if (score == null)
		score = 0;
	gamedata.highscore = score;
	htmltext.highscore.innerHTML = gamedata.highscore;

	//camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
	camera = new THREE.OrthographicCamera(0, 15, 18, 0, 1, 1000);
	camera.position.set(0, 0, 50);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	scene = new THREE.Scene();

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 0, 1);
	directionalLight.castShadow = true;
	directionalLight.shadowDarkness = 1;
	scene.add(directionalLight);

	var ambientLight = new THREE.AmbientLight(0x000000);
	scene.add(ambientLight);

	blocks = [];

	var geom = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
	var material = new THREE.MeshLambertMaterial({
		map: textures[0]
	});
	blocks.push(new THREE.Mesh(geom, material));
	geom = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
	material = new THREE.MeshLambertMaterial({
		map: textures[1]
	});
	blocks.push(new THREE.Mesh(geom, material));
	geom = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
	material = new THREE.MeshLambertMaterial({
		map: textures[2]
	});
	blocks.push(new THREE.Mesh(geom, material));
	geom = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
	material = new THREE.MeshLambertMaterial({
		map: textures[3]
	});
	blocks.push(new THREE.Mesh(geom, material));

	// -------

	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias: false
	});
	renderer.setClearColor(0xf4e454);

	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.BasicShadowMap;
	/*renderer.shadowMapSoft = false;
	renderer.shadowCameraNear = 1;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 50;

	renderer.shadowMapBias = 0.0039;
	renderer.shadowMapDarkness = 1;
	renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;*/

	renderer.setSize(width, height);
	document.getElementById('canvas-container').appendChild(renderer.domElement);

	// Postprocessing
	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));

	var shaderpass = new THREE.ShaderPass(THREE.PixelShader);
	shaderpass.renderToScreen = true;
	composer.addPass(shaderpass);

	THREE.DefaultLoadingManager.onProgress = function(item, loaded, total) {
		console.log(item, loaded, total);
	};

	nextBlock = new THREE.Object3D();
	/*nextBlock = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({
		color: 0xffffff,
		wireframe: true
	}));*/
	nextBlock.position.set(level.w + 2.5, level.h - 3.5, 20);
	nextBlockRotation = new THREE.Vector3();
	scene.add(nextBlock);
	level.explosionObject = new THREE.Object3D();
	scene.add(level.explosionObject);

	var geometry = new THREE.PlaneGeometry(5, 18);
	var material = new THREE.MeshBasicMaterial({
		color: 0x66c3e1,
		ambient: 0x66c3e1,
		emissive: 0x66c3e1
	});
	var plane = new THREE.Mesh(geometry, material);
	plane.position.set(12.5, 9, 10);
	scene.add(plane);

	// create logotype
	logotype = new THREE.Object3D();
	var mesh, scale = 0.5;
	logotypeBlocks = new Array(logotypeData.length);
	for (var i = 0; i < logotypeData.length; i++) {
		logotypeBlocks[i] = new Array(logotypeData[0].length);
		for (var j = 0; j < logotypeData[0].length; j++) {
			if (logotypeData[i][j] != 0) {
				mesh = blocks[j >= 20 ? 2 : 3].clone();
				mesh.scale.set(scale, scale, scale);
				mesh.position.set(j * scale, (logotypeData.length - i) * scale, 0);
				logotype.add(mesh);
				logotypeBlocks[i][j] = {
					obj: mesh,
					time: 0.01 * ((logotypeData[0].length - j) * logotypeData.length + i),
					y: (logotypeData.length - i) * scale,
					pos: 2 * Math.PI * (j / logotypeData[0].length + 0.1 * i / logotypeData.length)
				};
			} else {
				logotypeBlocks[i][j] = null;
			}
		}
	}
	logotype.position.set(0.5, 12.5, 20);
	scene.add(logotype);

	/*geometry = new THREE.PlaneGeometry(4.75, 4.75);
	material = new THREE.MeshBasicMaterial({
		color: 0xf4e454,
		ambient: 0xf4e454,
		emissive: 0xf4e454
	});
	plane = new THREE.Mesh(geometry, material);
	plane.position.set(12.5, 12.525, 16);
	scene.add(plane);*/

	Timer.init({
		simulation: simulationLoop,
		graphics: renderLoop,
		framerate: 60
	});

	window.addEventListener('blur', function() {
		Timer.stop();
	});
	window.addEventListener('focus', function() {
		Timer.start();
		graphicsStartTime = 0;
	});
	window.addEventListener('keydown', function(evt) {
		if (!keydown[evt.keyCode]) {
			keydown[evt.keyCode] = true;
			keydownTimer[evt.keyCode] = 0;

			if (gameover) {
				if (evt.keyCode == 32) {
					htmltext.highscorehead.style.display = 'none';
					htmltext.highscore.style.display = 'none';
					htmltext.info.style.display = 'none';
					scene.remove(logotype);
					startNewGame();
				}
			} else {
				switch (evt.keyCode) {
					case 65:
						rotateBlock(LEFT);
						break;
					case 87:
						rotateBlock(UP);
						break;
					case 68:
						rotateBlock(RIGHT);
						break;
					case 83:
						rotateBlock(DOWN);
						break;
					case 37:
						moveBlock(-1, 0);
						keydownTimer[evt.keyCode] = keyWaitTime;
						break;
					case 38:
						//moveBlock(0, 1);
						break;
					case 39:
						moveBlock(1, 0);
						keydownTimer[evt.keyCode] = keyWaitTime;
						break;
					case 40:
						moveBlock(0, -1);
						keydownTimer[evt.keyCode] = keyDropWaitTime;
						break;
					case 32:
						//paused = !paused;
						break;
				}
			}
		}
		switch (evt.keyCode) {
			case 32:
			case 37:
			case 38:
			case 39:
			case 40:
			case 65:
			case 87:
			case 68:
			case 83:
				evt.preventDefault();
				break;
		}
	});
	window.addEventListener('keyup', function(evt) {
		keydown[evt.keyCode] = false;
		keydownTimer[evt.keyCode] = 0;
	});
	document.getElementById('info-container').addEventListener('click', function(evt) {
		var container = document.getElementById('info-container');
		container.style.display = 'none';
		controlActive = true;
	});
	document.getElementById('info-icon').addEventListener('click', function(evt) {
		var container = document.getElementById('info-container');
		container.style.display = 'block';
		controlActive = false;
	});

};

function startNewGame() {
	var r = Math.random();
	nextBlockType = Math.floor(shapes.length * r);
	if (r == 1)
		nextBlockType -= 1;

	controlActive = false;

	resetScore();
	resetLevel();
	graphicsStartTime = 0;
	fallTime = 0;
	fallIntervalTime = fallInitialIntervalTime;
	createNewBlock();

	gameover = false;
	onGround = false;
	paused = false;
	lineCleared = true;
	controlActive = true;
}

function rotateBlock(dir) {
	if (controlActive) {
		var m = copy3dMatrix(block.matrix);
		rotate3dMatrix(m, dir);
		var col = get3dMatrixCollision(m);

		if (blockPositionFree(col, block.stagex, block.stagey)) {
			block.matrix = m;
			block.collision = col;

			if (quaternionTime < 1)
				quaternionSrc.slerp(quaternionDst, quaternionTime);
			quaternionTime = 0;

			var axis, radians;
			switch (dir) {
				case LEFT:
					axis = new THREE.Vector3(0, 1, 0);
					radians = -Math.PI / 2;
					break;
				case UP:
					axis = new THREE.Vector3(1, 0, 0);
					radians = -Math.PI / 2;
					break;
				case RIGHT:
					axis = new THREE.Vector3(0, 1, 0);
					radians = Math.PI / 2;
					break;
				case DOWN:
					axis = new THREE.Vector3(1, 0, 0);
					radians = Math.PI / 2;
					break;
			}
			quaternionDst.multiplyQuaternions(new THREE.Quaternion().setFromAxisAngle(axis, radians), quaternionDst);
		}
	}
}

function drawCollisionMap() {
	var col = block.collision; //shapes[block.type].collision[block.rotation];
	var seg = getLevelSegment(block.stagex, block.stagey);

	collisionMap.ctx.fillStyle = '#fff';
	collisionMap.ctx.fillRect(0, 0, 40, 40);
	collisionMap.ctx.fillStyle = '#000';
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			if (((seg[i]) & (0x10000 >> j * 4)) != 0)
				collisionMap.ctx.fillRect(j * 8, i * 8, 8, 8);
		}
	}
}

function placeBlock() {
	var col = block.collision;
	var x = block.stagex;
	var y = block.stagey;
	var b, c;

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			if (x + j >= 0 && x + j < level.w && y + 4 - i >= 0 && y + 4 - i < level.h) {
				if (level.stage[y + 4 - i][x + j] == 0 && (col[i] & (0x10000 >> j * 4)) != 0) {
					level.stage[y + 4 - i][x + j] = 1;

					for (var k = 0; k < 5; k++) {
						if (block.matrix[i][j][k] != 0) {
							c = block.matrix[i][j][k];
							break;
						}
					}
					b = blocks[c - 1].clone();
					b.position.set((x + j + 0.5) * blockSize, (y + 4 - i + 0.5) * blockSize, 0);
					scene.add(b);
					level.stageBlocks[y + 4 - i][x + j] = b;
				}
			}
		}
	}

	drawCollisionMap();
}

function copy3dMatrix(m) {
	var size = m.length;
	var _m = new Array(size);
	for (var i = 0; i < size; i++) {
		_m[i] = new Array(size);
		for (var j = 0; j < size; j++) {
			_m[i][j] = new Array(size);
			for (var k = 0; k < size; k++) {
				_m[i][j][k] = m[i][j][k];
			}
		}
	}
	return _m;
}

function createNewBlock() {
	var type = nextBlockType;
	var r = Math.random();
	nextBlockType = Math.floor(shapes.length * r);
	if (r == 1)
		nextBlockType -= 1;
	block.type = type;
	block.stagex = Math.floor(level.w / 2) - 2;
	block.stagey = level.h - 5;
	block.targetx = block.stagex + 2;
	block.targety = block.stagey + 2;
	block.prevx = block.targetx;
	block.prevy = block.targety;
	block.x = block.targetx;
	block.y = block.targety;

	quaternion = new THREE.Quaternion();
	quaternionSrc = new THREE.Quaternion();
	quaternionDst = new THREE.Quaternion();
	quaternionTime = 1;

	block.matrix = copy3dMatrix(shapes[type]);
	/*block.matrix = new Array(5);
	for (var i = 0; i < 5; i++) {
		block.matrix[i] = new Array(5);
		for (var j = 0; j < 5; j++) {
			block.matrix[i][j] = new Array(5);
			for (var k = 0; k < 5; k++) {
				var dist = Math.sqrt(Math.pow(i - 3, 2) + Math.pow(j - 3, 2) + Math.pow(k - 3, 2)) / 3;
				if (Math.random() > 0.9 + 0.08 * dist) {
					block.matrix[i][j][k] = 1;
				} else {
					block.matrix[i][j][k] = 0;
				}
			}
		}
	}
	block.matrix[2][2][2] = 1;*/
	block.collision = get3dMatrixCollision(block.matrix);

	scene.remove(cubeParent);
	cubeParent = new THREE.Object3D();
	cube = new THREE.Object3D();
	cubeParent.add(cube);
	scene.add(cubeParent);

	var mesh,
		m = block.matrix,
		mid = Math.floor(m.length / 2),
		size = m.length;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < size; k++) {
				if (m[i][j][k]) {
					mesh = blocks[m[i][j][k] - 1].clone();
					mesh.position.set(j - mid, size - 1 - i - mid, size - 1 - k - mid);
					cube.add(mesh);
				}
			}
		}
	}

	for (var i = nextBlock.children.length - 1; i >= 0; i--)
		nextBlock.remove(nextBlock.children[i]);

	if (!blockPositionFree(block.collision, block.stagex, block.stagey)) {
		gameover = true;
		controlActive = false;
		placeBlock();
		setTimeout(function() {
			resetLevel();
			scene.remove(cubeParent);
		}, 500);
	} else {
		m = copy3dMatrix(shapes[nextBlockType]);
		mid = m.length / 2;
		size = m.length;
		var s = 0.8;
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				for (var k = 0; k < size; k++) {
					if (m[i][j][k]) {
						mesh = blocks[m[i][j][k] - 1].clone();
						mesh.scale.set(s, s, s);
						mesh.position.set(s * (j - mid) + 0.5, s * (size - 1 - i - mid) + 0.5, s * (size - 1 - k - mid) + 0.5);
						nextBlock.add(mesh);
					}
				}
			}
		}
	}

	drawCollisionMap();
}

function resetScore() {
	gamedata.level = 0;
	gamedata.score = 0;
	gamedata.lines = 0;
	updateScore();
}

function updateScore() {
	var level = Math.floor(gamedata.lines / 10);
	if (level > maxLevel)
		level = maxLevel;
	gamedata.level = level;

	fallIntervalTime = fallInitialIntervalTime - level * fallIntervalDecrease;

	if (gamedata.score > 999999)
		gamedata.score = 999999;
	if (gamedata.lines > 999999)
		gamedata.lines = 999999;

	if (gamedata.score > gamedata.highscore) {
		gamedata.highscore = gamedata.score;
		htmltext.highscore.innerHTML = gamedata.highscore;
		localStorage.setItem('tretris_highscore', gamedata.highscore);
	}

	htmltext.level.innerHTML = gamedata.level;
	htmltext.score.innerHTML = gamedata.score;
	htmltext.lines.innerHTML = gamedata.lines;
}

function resetLevel() {
	var obj;

	nextBlock.rotation.set(0, 0, 0);

	if (level.stage != null) {
		for (var i = 0; i < level.h; i++) {
			for (var j = 0; j < level.w; j++) {
				if (level.stage[i][j] != 0) {
					obj = level.stageBlocks[i][j];
					THREE.SceneUtils.attach(obj, scene, level.explosionObject);
					obj.position.set(j + 0.5, i + 0.5, 1);
					level.explosionBlocks.push({
						speed: new THREE.Vector3(3 * (Math.random() - 0.5), 1 + 4 * Math.random(), 0),
						rotation: new THREE.Vector3(5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5)),
						obj: obj
					});
				}
				level.stage[i][j] = 0;
				level.stageBlocks[i][j] = null;
			}
		}
	} else {
		level.stage = new Array(level.h);
		level.stageBlocks = new Array(level.h);
		for (var i = 0; i < level.h; i++) {
			level.stage[i] = new Array(level.w);
			level.stageBlocks[i] = new Array(level.w);
			for (var j = 0; j < level.w; j++) {
				level.stage[i][j] = 0;
				level.stageBlocks[i][j] = null;
			}
		}
	}
}

function getLevelSegment(x, y) {
	var s = new Array(5);
	for (var i = 0; i < 5; i++) {
		s[i] = 0;
		for (var j = 0; j < 5; j++) {
			if (x + j < 0 || x + j > level.w - 1 || y + 4 - i < 0)
				s[i] = s[i] | (0x10000 >> (j * 4));
			else if (y + 4 - i < level.h)
				s[i] = s[i] | ((0x10000 * level.stage[y + 4 - i][x + j]) >> (j * 4));
		}
	}
	return s;
}

function blockPositionFree(col, x, y) {
	var seg = getLevelSegment(x, y);

	for (var i = 0; i < 5; i++) {
		if ((col[i] & seg[i]) != 0) {
			return false;
		}
	}
	return true;
}

function setBlockFromMatrix(m) {
	scene.remove(cubeParent);
	cubeParent = new THREE.Object3D();
	cube = new THREE.Object3D();
	cubeParent.add(cube);
	scene.add(cubeParent);

	var geom, material, mesh,
		mid = Math.floor(m.length / 2),
		size = m.length;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < size; k++) {
				if (m[i][j][k]) {
					geom = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
					material = new THREE.MeshLambertMaterial({
						map: textures[0]
					});
					mesh = new THREE.Mesh(geom, material);
					mesh.position.set(j - mid, size - 1 - i - mid, size - 1 - k - mid);
					cube.add(mesh);
				}
			}
		}
	}

	quaternion = new THREE.Quaternion();
	quaternion.multiplyQuaternions(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 16), quaternion);
	quaternion.multiplyQuaternions(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 16), quaternion);
}

function get3dMatrixCollision(m) {
	var size = m.length;
	var col = new Array(size);
	var p;
	for (var i = 0; i < size; i++) {
		col[i] = 0;
		for (var j = 0; j < size; j++) {
			p = 0;
			for (var k = 0; k < size; k++) {
				p = p | (m[i][j][k] != 0 ? 1 : 0);
				if (p == 1)
					break;
			}
			col[i] = col[i] | (p << ((size - j - 1) * 4));
		}
	}
	return col;
}

function rotate3dMatrix(m, dir) {
	var size = m.length;

	var _m = new Array(size);
	for (var i = 0; i < size; i++) {
		_m[i] = new Array(size);
		for (var j = 0; j < size; j++) {
			_m[i][j] = new Array(size);
		}
	}

	switch (dir) {
		case LEFT:
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					for (var k = 0; k < size; k++) {
						_m[i][k][size - j - 1] = m[i][j][k];
					}
				}
			}
			break;
		case UP:
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					for (var k = 0; k < size; k++) {
						_m[k][j][size - i - 1] = m[i][j][k];
					}
				}
			}
			break;
		case RIGHT:
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					for (var k = 0; k < size; k++) {
						_m[i][size - k - 1][j] = m[i][j][k];
					}
				}
			}
			break;
		case DOWN:
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					for (var k = 0; k < size; k++) {
						_m[size - k - 1][j][i] = m[i][j][k];
					}
				}
			}
			break;
	}

	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < size; k++) {
				m[i][j][k] = _m[i][j][k];
			}
		}
	}
}

function checkNewLines() {
	var lines = [];
	var line;
	// bottom - top
	for (var i = 0; i < level.h; i++) {
		line = true;
		for (var j = 0; j < level.w; j++) {
			line = level.stage[i][j] != 0;
			if (!line)
				break;
		}
		if (line)
			lines.push(i);
	}
	if (lines.length > 0) {
		var bottom, obj,
			top = level.h;

		level.blockSegments = [];
		level.blockSegmentsTargets = [];

		// top - bottom
		for (var i = lines.length - 1; i >= -1; i--) {
			if (i >= 0) {
				bottom = lines[i];

				// remove line
				for (var j = 0; j < level.w; j++) {
					if (level.stage[bottom][j] != 0) {
						obj = level.stageBlocks[bottom][j];
						THREE.SceneUtils.attach(obj, scene, level.explosionObject);
						obj.position.set(j + 0.5, bottom + 0.5, 1);
						level.explosionBlocks.push({
							speed: new THREE.Vector3(3 * (Math.random() - 0.5), 1 + 4 * Math.random(), 0),
							rotation: new THREE.Vector3(5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5)),
							obj: obj
						});

						level.stage[bottom][j] = 0;
						level.stageBlocks[bottom][j] = null;
					}
				}
			} else if (top > 0) {
				bottom = -1;
			} else {
				break;
			}

			if (top - bottom > 1) {
				obj = new THREE.Object3D();
				level.blockSegments.push(obj);
				level.blockSegmentsTargets.push({
					height: top - bottom - 1,
					bottom: bottom + 1,
					src: bottom + 1,
					dst: bottom + 1
				});
				scene.add(obj);
				for (var j = bottom + 1; j <= top - 1; j++) {
					for (var k = 0; k < level.w; k++) {
						if (level.stage[j][k] != 0) {
							THREE.SceneUtils.attach(level.stageBlocks[j][k], scene, obj);
							level.stageBlocks[j][k].position.set(k + 0.5, j - bottom - 0.5, 0);
						}
					}
				}
				obj.position.set(0, bottom + 1, 0);
			}

			top = bottom;
		}

		// set target points and move segments
		bottom = 0;
		// bottom - top
		var d, h;
		for (var i = level.blockSegmentsTargets.length - 1; i >= 0; i--) {
			if (level.blockSegmentsTargets[i].bottom > bottom) {
				level.blockSegmentsTargets[i].dst = bottom;

				d = level.blockSegmentsTargets[i].bottom - bottom;
				h = level.blockSegmentsTargets[i].height;
				for (var j = bottom; j < bottom + h; j++) {
					for (var k = 0; k < level.w; k++) {
						level.stage[j][k] = level.stage[j + d][k];
						level.stageBlocks[j][k] = level.stageBlocks[j + d][k];
					}
				}
			}
			bottom += level.blockSegmentsTargets[i].height;
		}

		clearTime = 0;

		// update score
		gamedata.lines += lines.length;
		gamedata.score += scoretable[lines.length] * (1 + gamedata.level * scoremultiplier);
		updateScore();
	}

	return lines.length > 0;
}

function moveBlock(x, y) {
	if (controlActive) {
		var col = block.collision; //shapes[block.type].collision[block.rotation];
		if (blockPositionFree(col, block.stagex + x, block.stagey + y)) {
			if (block.movetime < 1) {
				block.prevx += block.movetime * (block.targetx - block.prevx);
				block.prevy += block.movetime * (block.targety - block.prevy);
			}
			block.movetime = 0;
			block.targetx += x;
			block.targety += y;
			block.stagex += x;
			block.stagey += y;

			onGround = false;

			drawCollisionMap();
		} else {
			if (y < 0) {
				if (keydown[40] || onGround) {
					onGround = false;
					placeBlock();
					lineCleared = checkNewLines()
					controlActive = false;
					createNewBlock();
					if (!gameover) {
						setTimeout(function() {
							fallTime = 0;
							controlActive = true;
							onGround = !lineCleared;
							keydownTimer[40] = keyWaitTime;
						}, blockPlacePause);
					}
				} else {
					onGround = true;
				}
			}
		}
	}
}

function simulationLoop(delta) {
	if (!paused) {
		if (controlActive) {
			for (var key in keydown) {
				if (keydown[key]) {
					if (keydownTimer[key]) {
						keydownTimer[key] -= delta;
						if (keydownTimer[key] <= 0) {
							switch (key) {
								case '37':
									moveBlock(-1, 0);
									keydownTimer[key] = keyIntervalTime;
									break;
								case '38':
									//moveBlock(0, 1);
									break;
								case '39':
									moveBlock(1, 0);
									keydownTimer[key] = keyIntervalTime;
									break;
								case '40':
									moveBlock(0, -1);
									keydownTimer[key] = keyDropIntervalTime;
									gamedata.score += 1;
									updateScore();
									break;
							}
						}
					}
				}
			}
		}

		if (clearTime < clearWaitTime) {
			clearTime += delta;
			var src, dst, d;
			d = 1 - Math.cos(Math.pow(clearTime / clearWaitTime, 2) * Math.PI / 2);
			if (d > 1)
				d = 1;

			for (var i = 0; i < level.blockSegments.length; i++) {
				src = level.blockSegmentsTargets[i].src;
				dst = level.blockSegmentsTargets[i].dst;
				level.blockSegments[i].position.y = src + d * (dst - src);
			}

			if (d == 1) {
				var obj, child, y;
				for (var i = 0; i < level.blockSegments.length; i++) {
					obj = level.blockSegments[i];
					y = obj.position.y;
					for (var j = obj.children.length - 1; j >= 0; j--) {
						child = obj.children[j];
						THREE.SceneUtils.attach(child, obj, scene);
						child.position.y += y;
					}
				}
			}
		}

		var obj, kill = [];
		for (var i = 0; i < level.explosionBlocks.length; i++) {
			obj = level.explosionBlocks[i];
			obj.speed.y -= 25 * delta;
			obj.obj.position.x += obj.speed.x * delta;
			obj.obj.position.y += obj.speed.y * delta;
			obj.obj.position.z += obj.speed.z * delta;
			obj.obj.rotation.x += obj.rotation.x * delta;
			obj.obj.rotation.y += obj.rotation.y * delta;
			obj.obj.rotation.z += obj.rotation.z * delta;

			if (obj.obj.position.y < -1) {
				kill.push(i);
			}
		}
		if (kill.length > 0 && gameover && level.explosionBlocks.length == kill.length) {
			htmltext.highscorehead.style.display = 'block';
			htmltext.highscore.style.display = 'block';
			htmltext.info.style.display = 'block';
			scene.add(logotype);
		}
		for (var i = kill.length - 1; i >= 0; i--) {
			level.explosionObject.remove(level.explosionBlocks[kill[i]].obj);
			level.explosionBlocks.splice(kill[i], 1);
		}

		if (quaternionTime < 1) {
			quaternionTime += delta * 7;
			if (quaternionTime >= 1) {
				quaternionTime = 1;
				quaternionSrc.copy(quaternionDst);
				quaternion.copy(quaternionDst);
			} else {
				quaternion.copy(quaternionSrc);
				quaternion.slerp(quaternionDst, 1 - Math.cos(quaternionTime * Math.PI / 2));
			}
		}

		if (block.movetime < 1) {
			block.movetime = 1;
			//block.movetime += delta * 20;
			if (block.movetime >= 1) {
				block.movetime = 1;
				block.prevx = block.targetx;
				block.prevy = block.targety;
				block.x = block.prevx;
				block.y = block.prevy;
			} else {
				block.x = block.prevx + (1 - Math.cos(block.movetime * Math.PI / 2)) * (block.targetx - block.prevx);
				block.y = block.prevy + (1 - Math.cos(block.movetime * Math.PI / 2)) * (block.targety - block.prevy);
			}
		}

		if (!keydown[40]) {
			fallTime += delta;
			if (lineCleared) {
				if (fallTime >= lineClearTime) {
					lineCleared = false;
					fallTime = 0;
					moveBlock(0, -1);
				}
			} else if (onGround) {
				if (fallTime >= fallGroundTime) {
					fallTime = 0;
					moveBlock(0, -1);
				}
			} else if (fallTime >= fallIntervalTime) {
				fallTime = 0;
				moveBlock(0, -1);
			}
		}
	}

	if (gameover) {
		var rot;
		for (var i = 0; i < logotypeBlocks.length; i++) {
			for (var j = 0; j < logotypeBlocks[0].length; j++) {
				if (logotypeBlocks[i][j] != null) {
					logotypeBlocks[i][j].time += delta;
					if (logotypeBlocks[i][j].time > 6)
						logotypeBlocks[i][j].time = 0;
					if (logotypeBlocks[i][j].time > 5)
						rot = 2 * Math.PI * (logotypeBlocks[i][j].time - 5) / 1;
					else
						rot = 0;
					logotypeBlocks[i][j].obj.rotation.set(0.2 + rot, 0.2 + rot, 0);
					logotypeBlocks[i][j].obj.scale.set(0.6 + 0.2 * Math.sin(rot), 0.6 + 0.2 * Math.sin(rot), 0.6 + 0.2 * Math.sin(rot));
					logotypeBlocks[i][j].pos += Math.PI * delta;
					logotypeBlocks[i][j].obj.position.y = logotypeBlocks[i][j].y + 0.5 * Math.sin(logotypeBlocks[i][j].pos);
				}
			}
		}
	}

	nextBlock.rotation.x += 0.8 * delta;
	nextBlock.rotation.y += 0.8 * delta;
	//nextBlock.rotation.z += 0.1 * delta;
}

function renderLoop(time) {
	//if (time - graphicsStartTime >= 1000 / 60) {
	//	graphicsStartTime = time;

	if (cubeParent) {
		cubeParent.position.set(((block.x + 0.5) * blockSize), ((block.y + 0.5) * blockSize), 0);
		cube.setRotationFromQuaternion(quaternion);
	}

	composer.render();
	//renderer.render(scene, camera);
}