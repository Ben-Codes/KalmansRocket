(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _MainState = require('states/MainState');

var _MainState2 = _interopRequireDefault(_MainState);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Game = function (_Phaser$Game) {
	_inherits(Game, _Phaser$Game);

	function Game() {
		_classCallCheck(this, Game);

		var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, 1200, 600, Phaser.AUTO, 'content', null));

		_this.state.add('MainState', _MainState2.default, false);
		_this.state.start('MainState');
		return _this;
	}

	return Game;
}(Phaser.Game);

new Game();

},{"states/MainState":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _Vector = require('objects/math/Vector2');

var _Vector2 = _interopRequireDefault(_Vector);

var _RenderUtils = require('objects/core/RenderUtils');

var _RenderUtils2 = _interopRequireDefault(_RenderUtils);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Earth = function () {
	function Earth(game) {
		_classCallCheck(this, Earth);

		this._game = game;
		this.position = new _Vector2.default(0, 0);

		this._earthGraphics = game.add.graphics(0, 0);
		this._renderUtils = new _RenderUtils2.default(this._game);

		this.isDebugged = true;
	}

	_createClass(Earth, [{
		key: 'mass',
		value: function mass() {
			return 5.97219e24;
		}
	}, {
		key: 'surfaceRadius',
		value: function surfaceRadius() {
			return 6.371e6;
		}
	}, {
		key: 'atmosphereHeight',
		value: function atmosphereHeight() {
			return 1.5e5;
		}
	}, {
		key: 'rotationRate',
		value: function rotationRate() {
			return -7.2722052166e-5;
		}

		// https://www.grc.nasa.gov/www/k-12/rocket/atmos.html

	}, {
		key: 'getAtmosphericDensity',
		value: function getAtmosphericDensity(altitude) {
			if (altitude > atmosphereHeight()) return 0;

			var tempurature = .0;
			var pressure = .0;

			if (altitude > 25098.756) {

				tempurature = -205.05 + 0.0053805776 * altitude;
				pressure = 51.97 * Math.Pow((tempurature + 459.7) / 389.98, -11.388);
			} else if (altitude > 11019.13) {

				tempurature = -70;
				pressure = 473.1 * Math.Exp(1.73 - 0.00015748032 * altitude);
			} else {

				tempurature = 59 - 0.0116797904 * altitude;
				pressure = 2116 * Math.Pow((tempurature + 459.7) / 518.6, 5.256);
			}

			var density = pressure / (1718 * (tempurature + 459.7));

			return density * 515.379;
		}

		//http://www.mhtl.uwaterloo.ca/old/onlinetools/airprop/airprop.html

	}, {
		key: 'getAtmosphericViscosity',
		value: function getAtmosphericViscosity(altitude) {
			if (altitude > atmosphereHeight()) return 0;

			if (altitude > 10668) return 0.0000089213;

			return -5.37e-10 * altitude + 1.458e-5;
		}
	}, {
		key: 'render',
		value: function render(cameraBounds) {
			//Get dimensions of ellipse base on window size
			var ellipse = this._renderUtils.computeEllipseSize(this.position, cameraBounds, this.surfaceRadius());

			//debugger;
			this._earthGraphics.position.x = ellipse.x;
			this._earthGraphics.position.y = ellipse.y;
			//this._earthGraphics.moveTo(ellipse.x, ellipse.y);

			this._earthGraphics.beginFill(0x009900);
			this._earthGraphics.drawEllipse(ellipse.x, ellipse.y, ellipse.width, ellipse.height);

			this._earthGraphics.endFill();
		}
	}]);

	return Earth;
}();

exports.default = Earth;

},{"objects/core/RenderUtils":4,"objects/math/Vector2":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _RectangleD = require('objects/math/RectangleD');

var _RectangleD2 = _interopRequireDefault(_RectangleD);

var _Vector = require('objects/math/Vector2');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Camera = function () {
	function Camera(game, target, zoom) {
		_classCallCheck(this, Camera);

		this._target = target;
		this._zoom = zoom;
		this._game = game;
		this._position = new _Vector2.default(target.position.x, target.position.y);
	}

	_createClass(Camera, [{
		key: 'setZoom',
		value: function setZoom(zoom) {
			zoom = this._game.math.clamp(this._zoom + zoom, .05, 1000000000000);
		}
	}, {
		key: 'update',
		value: function update(deltaTime) {
			var targetPosition = this._target.position;
			this._position.x(targetPosition.x());
			this._position.y(targetPosition.y());
		}
	}, {
		key: 'getBounds',
		value: function getBounds() {

			var width = this._game.scale.width * this._zoom;
			var height = this._game.scale.height * this._zoom;

			var x = this._position.x - width * .5;
			var y = this._position.y - height * .5;

			return new _RectangleD2.default(x, y, width, height);
		}
	}]);

	return Camera;
}();

exports.default = Camera;

},{"objects/math/RectangleD":5,"objects/math/Vector2":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _RectangleD = require('objects/math/RectangleD');

var _RectangleD2 = _interopRequireDefault(_RectangleD);

var _Vector = require('objects/math/Vector2');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var RenderUtils = function () {
	function RenderUtils(game) {
		_classCallCheck(this, RenderUtils);

		this._game = game;
	}

	_createClass(RenderUtils, [{
		key: 'computeEllipseSize',
		value: function computeEllipseSize(position, cameraBounds, radius) {

			//debugger;
			var screenRadius = radius / cameraBounds.width * this._game.scale.width;
			var screenPosition = position.clone();
			screenPosition.subtract(new _Vector2.default(cameraBounds.left, cameraBounds.top));

			var screenU = screenPosition.x / cameraBounds.width;
			var screenV = screenPosition.y / cameraBounds.height;

			var screenX = screenU * this._game.scale.width;
			var screenY = screenV * this._game.scale.height;

			return new _RectangleD2.default(screenX - screenRadius, screenY - screenRadius, screenRadius * 2.0, screenRadius * 2.0);
		}
	}]);

	return RenderUtils;
}();

exports.default = RenderUtils;

},{"objects/math/RectangleD":5,"objects/math/Vector2":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var rectangleD = function () {
	function rectangleD(x, y, width, height) {
		_classCallCheck(this, rectangleD);

		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.left = 0;
		this.right = 0;

		this.top = 0;
		this.bottom = 0;

		this._computeProperties();
	}

	_createClass(rectangleD, [{
		key: "_computeProperties",
		value: function _computeProperties() {
			this.left = this.x;
			this.right = this.x + this.width;

			this.top = this.y;
			this.bottom = this.y + this.height;
		}
	}, {
		key: "contains",
		value: function contains(rect) {
			return rect.x > this.left && rect.x < this.right && rect.y > this.top && rect.y < this.bottom;
		}
	}, {
		key: "intersects",
		value: function intersects(rect) {
			return this.left < rect.right && this.right > rect.left && this.top < rect.bottom && this.bottom > rect.top;
		}
	}, {
		key: "clone",
		value: function clone() {
			return new rectangleD(this.x, this.y, this.width, this.height);
		}
	}]);

	return rectangleD;
}();

exports.default = rectangleD;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Vector2 = function () {
	function Vector2(x, y) {
		_classCallCheck(this, Vector2);

		this.x = x;
		this.y = y;
	}

	_createClass(Vector2, [{
		key: "reset",
		value: function reset() {
			this.x = 0;
			this.y = 0;
		}
	}, {
		key: "length",
		value: function length() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
	}, {
		key: "clone",
		value: function clone() {
			return new Vector2(this.x, this.y);
		}
	}, {
		key: "add",
		value: function add(v) {
			this.x += v.x;
			this.y += v.y;
		}
	}, {
		key: "subtract",
		value: function subtract(v) {
			this.x -= v.x;
			this.y -= v.y;
		}
	}, {
		key: "multiply",
		value: function multiply(v) {
			this.x *= v.x;
			this.y *= v.y;
		}
	}, {
		key: "divide",
		value: function divide(v) {
			this.x /= v.x;
			this.y /= v.y;
		}
	}, {
		key: "dot",
		value: function dot(v) {
			return this.x * v.x + this.y * v.y;
		}
	}, {
		key: "cross",
		value: function cross(v) {
			return this.x * v.y - this.y * v.x;
		}
	}, {
		key: "normalize",
		value: function normalize() {

			var len = length();
			this.x /= len;
			this.y /= len;
		}
	}]);

	return Vector2;
}();

exports.default = Vector2;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Vector = require('objects/math/Vector2');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var SpaceCraftBase = function SpaceCraftBase(game, earth) {
	_classCallCheck(this, SpaceCraftBase);

	this._game = game;
	this.earth = earth;
	this.position = new _Vector2.default(0, -earth.surfaceRadius());
	this.position.add(earth.position);
	this.velocity = new _Vector2.default(0, 0);
};

exports.default = SpaceCraftBase;

},{"objects/math/Vector2":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _Earth = require('objects/Earth');

var _Earth2 = _interopRequireDefault(_Earth);

var _SpaceCraftBase = require('objects/spaceCraft/SpaceCraftBase');

var _SpaceCraftBase2 = _interopRequireDefault(_SpaceCraftBase);

var _Camera = require('objects/core/Camera');

var _Camera2 = _interopRequireDefault(_Camera);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var MainState = function (_Phaser$State) {
	_inherits(MainState, _Phaser$State);

	function MainState() {
		_classCallCheck(this, MainState);

		return _possibleConstructorReturn(this, (MainState.__proto__ || Object.getPrototypeOf(MainState)).apply(this, arguments));
	}

	_createClass(MainState, [{
		key: 'preload',
		value: function preload() {
			this.load.spritesheet('startButton', 'assets/red_button13.png', 190, 49, 1);
		}
	}, {
		key: 'create',
		value: function create() {
			this._isStarted = false;

			this._startButton = this.add.button(this.world.centerX + 450, 550, 'startButton', this.startButtonClicked, this);
			this._startButton.anchor.x = 0.5;
			this._startButton.anchor.y = 0.5;

			this._startButton.input.useHandCursor = true;

			var text = this.add.text(this.world.centerX + 450, 550, "Launch", {
				fill: "#e9eecf"
			});
			text.anchor.setTo(0.5);

			text.font = 'Revalia';
			text.fontSize = 20;
			text.align = 'center';
			this._startText = text;

			//////////////////////

			this._earth = new _Earth2.default(this);
			this._spacecraft = new _SpaceCraftBase2.default(this, this._earth);
			this._simCamera = new _Camera2.default(this, this._spacecraft, 10);
		}
	}, {
		key: 'update',
		value: function update() {

			if (this._isStarted) {
				computePhysics();
			}

			this.draw();
		}
	}, {
		key: 'computePhysics',
		value: function computePhysics() {
			//TODO
		}
	}, {
		key: 'draw',
		value: function draw() {

			var cameraBounds = this._simCamera.getBounds();
			this._earth.render(cameraBounds);
		}
	}, {
		key: 'startButtonClicked',
		value: function startButtonClicked() {
			this._isStarted = false;
			this._startText.visible = false;
			this._startButton.visible = false;
		}
	}]);

	return MainState;
}(Phaser.State);

exports.default = MainState;

},{"objects/Earth":2,"objects/core/Camera":3,"objects/spaceCraft/SpaceCraftBase":7}]},{},[1])
//# sourceMappingURL=game.js.map
