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

		_this.scrollDelta = 0;
		return _this;
	}

	return Game;
}(Phaser.Game);

new Game();

},{"states/MainState":17}],2:[function(require,module,exports){
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
		this.position = _Vector2.default.zero();
		this.velocity = _Vector2.default.zero();

		this._earthGraphics = game.add.graphics(0, 0);
		this._renderUtils = new _RenderUtils2.default(this._game);

		this.pitch = 0.0;

		//temp
		this.bmd = game.make.bitmapData(1200, 600);
		this.bmd.addToWorld();

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
	}, {
		key: 'rotationPeriod',
		value: function rotationPeriod() {
			return 86400;
		}

		// https://www.grc.nasa.gov/www/k-12/rocket/atmos.html

	}, {
		key: 'getAtmosphericDensity',
		value: function getAtmosphericDensity(altitude) {
			if (altitude > this.atmosphereHeight()) return 0;

			var tempurature = .0;
			var pressure = .0;

			if (altitude > 25098.756) {

				tempurature = -205.05 + 0.0053805776 * altitude;
				pressure = 51.97 * Math.pow((tempurature + 459.7) / 389.98, -11.388);
			} else if (altitude > 11019.13) {

				tempurature = -70;
				pressure = 473.1 * Math.exp(1.73 - 0.00015748032 * altitude);
			} else {

				tempurature = 59 - 0.0116797904 * altitude;
				pressure = 2116 * Math.pow((tempurature + 459.7) / 518.6, 5.256);
			}

			var density = pressure / (1718 * (tempurature + 459.7));

			return density * 515.379;
		}

		//http://www.mhtl.uwaterloo.ca/old/onlinetools/airprop/airprop.html

	}, {
		key: 'getAtmosphericViscosity',
		value: function getAtmosphericViscosity(altitude) {
			if (altitude > this.atmosphereHeight()) return 0;

			if (altitude > 10668) return 0.0000089213;

			return -5.37e-10 * altitude + 1.458e-5;
		}
	}, {
		key: 'getIspMultiplier',
		value: function getIspMultiplier(altitude) {

			var heightRatio = Math.max(altitude / this.atmosphereHeight(), 0);

			return 1.0 - Math.exp(-21.3921 * heightRatio);
		}
	}, {
		key: 'render',
		value: function render(cameraBounds) {

			var ellipse = this._renderUtils.computeEllipseSize(this.position, cameraBounds, this.surfaceRadius());
			var atmoEllipse = this._renderUtils.computeEllipseSize(this.position, cameraBounds, this.surfaceRadius() + this.atmosphereHeight());

			///Render the atmo
			//////////
			var grd = this.bmd.context.createRadialGradient(ellipse.x, ellipse.y, ellipse.height - ellipse.height * .0000938, ellipse.x, ellipse.y, atmoEllipse.height);
			grd.addColorStop(0, '#009900');
			grd.addColorStop(0.005, '#0182b7');
			grd.addColorStop(0.4, '#4db6ff');
			grd.addColorStop(1, '#000000');

			this.bmd.cls();
			this.bmd.circle(ellipse.x, ellipse.y, atmoEllipse.height, grd);

			//////
			//Render the surface
			//Get dimensions of ellipse base on window size

			this._earthGraphics.clear();
			this._earthGraphics.beginFill(0x009900);

			//Use arc when zoomed in since it has it renders the circle with better detail.
			if (ellipse.width > 600) this._earthGraphics.arc(ellipse.x, ellipse.y, ellipse.width, 0, -Math.PI * 2.0, true, 1000);else this._earthGraphics.drawEllipse(ellipse.x, ellipse.y, ellipse.width, ellipse.height);

			this._earthGraphics.endFill();
		}
	}]);

	return Earth;
}();

exports.default = Earth;

},{"objects/core/RenderUtils":5,"objects/math/Vector2":11}],3:[function(require,module,exports){
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

			this._zoom = this._game.math.clamp(zoom, .05, 1000000000000);
		}
	}, {
		key: 'update',
		value: function update(deltaTime) {
			var targetPosition = this._target.position;
			this._position.x = targetPosition.x;
			this._position.y = targetPosition.y;
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

},{"objects/math/RectangleD":10,"objects/math/Vector2":11}],4:[function(require,module,exports){
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

var Particle = function Particle() {
	_classCallCheck(this, Particle);

	this.isActive = false;
	this.position = _Vector2.default.zero();
	this.velocity = _Vector2.default.zero();

	this.age = 0;
	this.maxAge = 0;

	this.isFlame = false;
};

exports.default = Particle;

},{"objects/math/Vector2":11}],5:[function(require,module,exports){
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

			var screenRadius = radius / cameraBounds.width * this._game.scale.width;

			var screenPosition = position.clone();
			screenPosition.subtract(new _Vector2.default(cameraBounds.left, cameraBounds.top));

			var screenU = screenPosition.x / cameraBounds.width;
			var screenV = screenPosition.y / cameraBounds.height;

			var screenX = screenU * this._game.scale.width;
			var screenY = screenV * this._game.scale.height;

			return new _RectangleD2.default(screenX, screenY, screenRadius, screenRadius);
		}
	}, {
		key: 'computeBoundingBox',
		value: function computeBoundingBox(position, cameraBounds, width, height) {

			var screenWidth = width / cameraBounds.width * this._game.scale.width;
			var screenHeight = height / cameraBounds.height * this._game.scale.height;

			var screenPosition = position.clone();
			screenPosition.subtract(new _Vector2.default(cameraBounds.left, cameraBounds.top));

			var screenU = screenPosition.x / cameraBounds.width;
			var screenV = screenPosition.y / cameraBounds.height;

			var screenX = screenU * this._game.scale.width;
			var screenY = screenV * this._game.scale.height;

			return new _RectangleD2.default(screenX, screenY, screenWidth, screenHeight);
		}
	}]);

	return RenderUtils;
}();

exports.default = RenderUtils;

},{"objects/math/RectangleD":10,"objects/math/Vector2":11}],6:[function(require,module,exports){
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

var _EngineExhaust = require('objects/engines/EngineExhaust');

var _EngineExhaust2 = _interopRequireDefault(_EngineExhaust);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var EngineBase = function () {
	function EngineBase(parent, offset) {
		_classCallCheck(this, EngineBase);

		this.parent = parent;
		this.offset = offset;
		this._offsetLength = offset.length();
		this._offsetRotation = offset.angle() - Math.PI / 2.0;

		this.isActive = false;
		this.throttle = 0.0;

		this.cant = 0.0;

		this._engineExhaust = new _EngineExhaust2.default(this.parent._game.game);
	}

	_createClass(EngineBase, [{
		key: 'update',
		value: function update(deltaTime, ispMultiplier) {

			if (this._engineExhaust == null) return;
			var rotation = this.parent.pitch - this._offsetRotation;
			var offset = new _Vector2.default(Math.cos(rotation), Math.sin(rotation));
			offset.multiply(this._offsetLength);

			var throttle = 0;
			if (this.isActive && this.parent.propellantMass > 0) throttle = this.throttle;

			var position = this.parent.position.clone();
			position.subtract(offset);

			this._engineExhaust.update(deltaTime, position, this.parent.velocity, this.parent.pitch, throttle, ispMultiplier);
		}
	}, {
		key: 'draw',
		value: function draw(cameraBounds) {

			this._engineExhaust.draw(cameraBounds);
		}
	}, {
		key: 'startup',
		value: function startup() {
			this.isActive = true;
		}
	}, {
		key: 'shutdown',
		value: function shutdown() {
			this.adjustThrottle(0);
			this.isActive = false;
		}
	}, {
		key: 'adjustThrottle',
		value: function adjustThrottle(throttle) {
			this.throttle = throttle;
		}
	}, {
		key: 'adjustCant',
		value: function adjustCant(angle) {
			this.cant = angle;
		}
	}, {
		key: 'thrust',
		value: function thrust(ispMultiplier) {
			return 0.0;
		}
	}, {
		key: 'massFlowRate',
		value: function massFlowRate(ispMultiplier) {
			return 0.0;
		}
	}]);

	return EngineBase;
}();

exports.default = EngineBase;

},{"objects/engines/EngineExhaust":7,"objects/math/Vector2":11}],7:[function(require,module,exports){
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

var _Particle = require('objects/core/Particle');

var _Particle2 = _interopRequireDefault(_Particle);

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

var EngineExhaust = function () {
	function EngineExhaust(game) {
		_classCallCheck(this, EngineExhaust);

		this.particles = [];
		this._availableParticles = [];

		this._graphics = game.add.graphics(0, 0);

		for (var i = 0; i < 500; i++) {
			var p = new _Particle2.default();
			this.particles.push(p);
			this._availableParticles.push(p);
		}

		this._particleRate = .5; //100
		this._minSpread = 2;
		this._maxSpread = .1;
		this._maxAge = 10;
		this._currentMax = .1;
		this._angle = .05;

		this._renderUtil = new _RenderUtils2.default(game);
	}

	_createClass(EngineExhaust, [{
		key: 'update',
		value: function update(deltaTime, enginePosition, shipVelocity, rotation, throttle, ispMultiplier) {

			var partToGenerate = throttle * this._particleRate * deltaTime;
			var retrograde = rotation + Math.PI + this._angle; // 

			var spreadMultiplier = (1.0 - ispMultiplier) * this._minSpread + ispMultiplier * this._maxSpread;

			for (var i = 0; i < partToGenerate; i++) {

				if (this._availableParticles.length > 0) {

					var velocityFactor = Math.random() * (300 - 200) + 200;
					var spread = Math.random() - .5;

					var velocity = _Vector2.default.fromAngle(retrograde + spread * spreadMultiplier);

					if (this._currentMax < this._maxAge) this._currentMax += .001;

					var p = this._availableParticles.pop();
					p.isActive = true;
					p.age = 0;

					if (Math.random() < .25) {
						p.maxAge = .1;
						p.isFlame = true;
					} else {
						p.maxAge = Math.random() * .05 + this._currentMax;
						p.isFlame = false;
					}

					p.position = enginePosition.clone();

					velocity.multiply(velocityFactor);
					p.velocity = velocity;
				}
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.particles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _p = _step.value;

					if (_p.isActive) {

						var _velocity = _p.velocity.clone();
						_velocity.multiply(deltaTime);

						_p.position.add(_velocity);
						_p.age += deltaTime;

						//if(p.velocity.y < 0)
						//debugger;

						if (_p.age > _p.maxAge) {
							_p.isActive = false;
							this._availableParticles.push(_p);
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: 'draw',
		value: function draw(cameraBounds) {

			var particleScale = 4;

			//if(cameraBounds.width < 1000){
			//particleScale = 1.22e-6 * cameraBounds.width * cameraBounds.width - 4.8e-3 * cameraBounds.width + 4.4;
			//}

			var halfParticleScale = particleScale * 0.5;

			this._graphics.clear();

			this._graphics.beginFill(0x708c98);

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.particles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var p = _step2.value;

					if (p.isActive) {

						if (cameraBounds.contains(p.position)) {

							if (p.isFlame) {
								var rand = Math.random();
								if (rand < .5) {
									this._graphics.beginFill(0xea2300);
								} else if (rand < .7) {
									this._graphics.beginFill(0xff8100);
								} else if (rand < .9) {
									this._graphics.beginFill(0xf25500);
								} else {
									this._graphics.beginFill(0xd80000);
								}
							} else {
								this._graphics.beginFill(0x708c98);
							}

							var screencord = this._renderUtil.computeBoundingBox(p.position, cameraBounds);
							this._graphics.drawRect(screencord.x - halfParticleScale, screencord.y - halfParticleScale, particleScale, particleScale);
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			this._graphics.endFill();
		}
	}]);

	return EngineExhaust;
}();

exports.default = EngineExhaust;

},{"objects/core/Particle":4,"objects/core/RenderUtils":5,"objects/math/RectangleD":10,"objects/math/Vector2":11}],8:[function(require,module,exports){
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

var _EngineBase2 = require('objects/engines/EngineBase');

var _EngineBase3 = _interopRequireDefault(_EngineBase2);

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

var Merlin1D = function (_EngineBase) {
	_inherits(Merlin1D, _EngineBase);

	function Merlin1D(parent, offset) {
		_classCallCheck(this, Merlin1D);

		return _possibleConstructorReturn(this, (Merlin1D.__proto__ || Object.getPrototypeOf(Merlin1D)).call(this, parent, offset));
	}

	_createClass(Merlin1D, [{
		key: 'thrust',
		value: function thrust(ispMultiplier) {
			return (845000 + 69000 * ispMultiplier) * this.throttle * 0.01;
		}

		//ISP = F/m*g0

	}, {
		key: 'massFlowRate',
		value: function massFlowRate(ispMultiplier) {
			return (305.76 - 5.88 * ispMultiplier) * this.throttle * 0.01;
		}
	}], [{
		key: 'clone',
		value: function clone() {
			return new Merlin1D(this.parent, this.offset);
		}
	}]);

	return Merlin1D;
}(_EngineBase3.default);

exports.default = Merlin1D;

},{"objects/engines/EngineBase":6,"objects/math/Vector2":11}],9:[function(require,module,exports){
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

var _EngineBase2 = require('objects/engines/EngineBase');

var _EngineBase3 = _interopRequireDefault(_EngineBase2);

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

var Merlin1DVac = function (_EngineBase) {
	_inherits(Merlin1DVac, _EngineBase);

	function Merlin1DVac(parent, offset) {
		_classCallCheck(this, Merlin1DVac);

		return _possibleConstructorReturn(this, (Merlin1DVac.__proto__ || Object.getPrototypeOf(Merlin1DVac)).call(this, parent, offset));
	}

	_createClass(Merlin1DVac, [{
		key: 'thrust',
		value: function thrust(ispMultiplier) {
			return (845000 + 89000 * ispMultiplier) * this.throttle * 0.01;
		}

		//ISP = F/m*g0

	}, {
		key: 'massFlowRate',
		value: function massFlowRate(ispMultiplier) {
			return 273.86 * this.throttle * 0.01;
		}
	}], [{
		key: 'clone',
		value: function clone() {
			return new Merlin1DVac(this.parent, this.offset);
		}
	}]);

	return Merlin1DVac;
}(_EngineBase3.default);

exports.default = Merlin1DVac;

},{"objects/engines/EngineBase":6,"objects/math/Vector2":11}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	return typeof obj;
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

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
		key: 'reset',
		value: function reset() {
			this.x = 0;
			this.y = 0;
		}
	}, {
		key: 'length',
		value: function length() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
	}, {
		key: 'clone',
		value: function clone() {
			return new Vector2(this.x, this.y);
		}
	}, {
		key: 'add',
		value: function add(v) {

			if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
				this.x += v.x;
				this.y += v.y;
			} else {
				this.x += v;
				this.y += v;
			}
		}
	}, {
		key: 'subtract',
		value: function subtract(v) {

			if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
				this.x -= v.x;
				this.y -= v.y;
			} else {
				this.x -= v;
				this.y -= v;
			}
		}
	}, {
		key: 'multiply',
		value: function multiply(scaler) {
			this.x *= scaler;
			this.y *= scaler;
		}
	}, {
		key: 'divide',
		value: function divide(v) {

			if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
				this.x /= v.x;
				this.y /= v.y;
			} else {
				this.x /= v;
				this.y /= v;
			}
		}
	}, {
		key: 'dot',
		value: function dot(v) {
			return this.x * v.x + this.y * v.y;
		}
	}, {
		key: 'cross',
		value: function cross(v) {
			return this.x * v.y - this.y * v.x;
		}
	}, {
		key: 'normalize',
		value: function normalize() {

			var len = this.length();
			this.x /= len;
			this.y /= len;
		}
	}, {
		key: 'lengthSquared',
		value: function lengthSquared() {
			return this.x * this.x + this.y * this.y;
		}
	}, {
		key: 'angle',
		value: function angle() {
			return Math.atan2(this.y, this.x);
		}
	}], [{
		key: 'zero',
		value: function zero() {
			return new Vector2(0, 0);
		}
	}, {
		key: 'fromAngle',
		value: function fromAngle(angle) {
			var x = Math.cos(angle);
			var y = Math.sin(angle);
			return new Vector2(x, y);
		}
	}]);

	return Vector2;
}();

exports.default = Vector2;

},{}],12:[function(require,module,exports){
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

var _SpaceCraftBase2 = require('objects/spaceCraft/SpaceCraftBase');

var _SpaceCraftBase3 = _interopRequireDefault(_SpaceCraftBase2);

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

var BasePayload = function (_SpaceCraftBase) {
	_inherits(BasePayload, _SpaceCraftBase);

	function BasePayload(game, position, gravitationalParent, payloadMass) {
		_classCallCheck(this, BasePayload);

		var sprite = game.add.sprite(-9999, -9999, 'BasePayload');
		sprite.anchor.setTo(.5, .5);

		//Width: 4 meters Height 8.52 meters

		//TODO: Use enums
		var _this = _possibleConstructorReturn(this, (BasePayload.__proto__ || Object.getPrototypeOf(BasePayload)).call(this, game, position, sprite, 4, 8.52, new _Vector2.default(0, 0), gravitationalParent, payloadMass, 0));

		_this.aeroDynamicProperties = "ExposedToAirFlow";

		_this._deployedFairings = true;
		return _this;
	}

	_createClass(BasePayload, [{
		key: 'addFairings',
		value: function addFairings(leftFairing, rightFairing) {
			this._leftFairing = leftFairing;
			this._rightFairing = rightFairing;

			this.addChild(leftFairing);
			this.addChild(rightFairing);
			leftFairing.setParent(this);
			rightFairing.setParent(this);

			this._deployedFairings = false;
		}
	}, {
		key: 'formDragCoefficient',
		value: function formDragCoefficient() {
			var baseCD = this.getBaseCd(0.4);
			var alpha = this.getAlpha();

			return baseCD * Math.cos(alpha);
		}
	}, {
		key: 'formLiftCoefficient',
		value: function formLiftCoefficient() {
			//if (!this._deployedFairings) {
			//	return this._leftFairing.formLiftCoefficient() +
			//		this._rightFairing.formLiftCoefficient();
			//}
			//Fairings are children

			return 0;
		}
	}, {
		key: 'exposedSurfaceArea',
		value: function exposedSurfaceArea() {

			if (!this._deployedFairings) {
				//return this._leftFairing.exposedSurfaceArea() +
				//	this._rightFairing.exposedSurfaceArea();
				//Fairings are children
				return 0;
			}

			return 1;
		}
	}, {
		key: 'frontalArea',
		value: function frontalArea() {

			if (!this._deployedFairings) {
				//return this._leftFairing.frontalArea() +
				//	this._rightFairing.frontalArea();
				//Fairings are children
				return 0;
			}

			return 1;
		}
	}, {
		key: 'liftingSurfaceArea',
		value: function liftingSurfaceArea() {
			if (!this._deployedFairings) {
				//return this._leftFairing.liftingSurfaceArea() +
				//	this._rightFairing.liftingSurfaceArea();
				//Fairings are children
				return 0;
			}

			return 1;
		}
	}, {
		key: 'deployFairing',
		value: function deployFairing() {
			this._deployedFairings = false;

			this.children.splice(this.children.indexOf(this._leftFairing), 1);
			this.children.splice(this.children.indexOf(this._rightFairing), 1);

			this._leftFairing.stage();
			this._rightFairing.stage();
		}
	}, {
		key: 'dryMass',
		value: function dryMass() {
			if (!this._deployedFairings) {
				//return this._leftFairing.dryMass() +
				//	this._rightFairing.dryMass();
				//Fairings are children
			}
			return 0;
		}
	}, {
		key: 'name',
		value: function name() {
			return "BasePayload";
		}
	}]);

	return BasePayload;
}(_SpaceCraftBase3.default);

exports.default = BasePayload;

},{"objects/core/RenderUtils":5,"objects/math/Vector2":11,"objects/spaceCraft/SpaceCraftBase":16}],13:[function(require,module,exports){
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

var _SpaceCraftBase2 = require('objects/spaceCraft/SpaceCraftBase');

var _SpaceCraftBase3 = _interopRequireDefault(_SpaceCraftBase2);

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

var Fairing = function (_SpaceCraftBase) {
	_inherits(Fairing, _SpaceCraftBase);

	function Fairing(game, position, isLeft, gravitationalParent) {
		_classCallCheck(this, Fairing);

		var offset = new _Vector2.default(0, 0);
		var sprite = void 0;

		if (isLeft) {
			sprite = game.add.sprite(-9999, -9999, 'fairingLeft');
			offset.x = -1.26;
			offset.y = -2.2;
		} else {
			sprite = game.add.sprite(-9999, -9999, 'fairingRight');
			offset.x = 1.26;
			offset.y = -2.2;
		}

		sprite.anchor.setTo(.5, .5);

		//Width: 2.59 meters Height 13.0 meters

		var _this = _possibleConstructorReturn(this, (Fairing.__proto__ || Object.getPrototypeOf(Fairing)).call(this, game, position, sprite, 2.59, 13.0, offset, gravitationalParent, 0, 0));

		_this._isLeft = isLeft;
		_this.aeroDynamicProperties = "ExposedToAirFlow";

		return _this;
	}

	_createClass(Fairing, [{
		key: 'stagingForce',
		value: function stagingForce() {
			return 1500;
		}
	}, {
		key: 'formDragCoefficient',
		value: function formDragCoefficient() {
			var baseCD = this.getBaseCd(0.4);
			var alpha = this.getAlpha();

			return baseCD * Math.cos(alpha);
		}
	}, {
		key: 'formLiftCoefficient',
		value: function formLiftCoefficient() {
			var baseCD = this.getBaseCd(0.6);
			var alpha = this.getAlpha();

			return baseCD * Math.sin(alpha * 2.0);
		}
	}, {
		key: 'exposedSurfaceArea',
		value: function exposedSurfaceArea() {

			return 2 * Math.PI * (this.width / 2) * this.height + this.frontalArea();
		}
	}, {
		key: 'frontalArea',
		value: function frontalArea() {

			return Math.PI * Math.pow(this.width / 2, 2);
		}
	}, {
		key: 'liftingSurfaceArea',
		value: function liftingSurfaceArea() {
			return this.width * this.height;
		}
	}, {
		key: 'dryMass',
		value: function dryMass() {
			return 875;
		}
	}, {
		key: 'name',
		value: function name() {
			return "Fairing";
		}
	}]);

	return Fairing;
}(_SpaceCraftBase3.default);

exports.default = Fairing;

},{"objects/core/RenderUtils":5,"objects/math/Vector2":11,"objects/spaceCraft/SpaceCraftBase":16}],14:[function(require,module,exports){
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

var _SpaceCraftBase2 = require('objects/spaceCraft/SpaceCraftBase');

var _SpaceCraftBase3 = _interopRequireDefault(_SpaceCraftBase2);

var _Merlin1D = require('objects/engines/Merlin1D');

var _Merlin1D2 = _interopRequireDefault(_Merlin1D);

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

var Falcon9S1 = function (_SpaceCraftBase) {
	_inherits(Falcon9S1, _SpaceCraftBase);

	function Falcon9S1(game, position, gravitationalParent) {
		var propellantMass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 406698;

		_classCallCheck(this, Falcon9S1);

		var sprite = game.add.sprite(-9999, -9999, 'falcon9S1');
		sprite.anchor.setTo(.5, .5);

		//Width: 4.11 meters Height 47.812 meters

		var _this = _possibleConstructorReturn(this, (Falcon9S1.__proto__ || Object.getPrototypeOf(Falcon9S1)).call(this, game, position, sprite, 4.11, 47.812188, new _Vector2.default(0, 25.55), gravitationalParent, 0, propellantMass));

		_this.aeroDynamicProperties = "ExtendsFineness";

		for (var i = 0; i < 9; i++) {

			var engineOffsetX = (i - 4.0) / 4.0;
			var offset = new _Vector2.default(engineOffsetX * _this.width * 0.3, _this.height * 0.45);

			_this.engines.push(new _Merlin1D2.default(_this, offset));
		}

		return _this;
	}

	_createClass(Falcon9S1, [{
		key: 'formDragCoefficient',
		value: function formDragCoefficient() {

			var baseCD = this.getBaseCd(0.4);
			var alpha = this.getAlpha();

			var isRetro = false;

			if (alpha > Math.PI / 2 || alpha < -(Math.PI / 2)) {
				//LandingLegs

				//GridFins

				baseCD = this.getBaseCd(0.8);

				isRetro = true;
			}

			var dragCoefficient = Math.abs(baseCD * Math.cos(alpha));
			var dragPreservation = 1.0;

			if (isRetro) {

				if (this.throttle > 0 && this.machNumber > 1.5 && this.machNumber < 20) {
					var throttleFactor = throttle / 50;
					//TODO: engine bell drag
					var cantFactor = 0.0;
					dragPreservation += throttleFactor * cantFactor;
					dragCoefficient *= dragPreservation;
				}
			}

			return Math.abs(dragCoefficient);
		}
	}, {
		key: 'formLiftCoefficient',
		value: function formLiftCoefficient() {
			var baseCD = this.getBaseCd(0.6);
			var alpha = this.getAlpha();

			return baseCD * Math.sin(alpha * 2.0);
		}
	}, {
		key: 'exposedSurfaceArea',
		value: function exposedSurfaceArea() {

			return 2 * Math.PI * (this.width / 2) * this.height + this.frontalArea();
		}
	}, {
		key: 'frontalArea',
		value: function frontalArea() {
			var area = Math.PI * Math.pow(this.width / 2, 2);
			var alpha = getAlpha();

			return Math.abs(area * Math.cos(alpha));
		}
	}, {
		key: 'liftingSurfaceArea',
		value: function liftingSurfaceArea() {
			return this.width * this.height;
		}
	}, {
		key: 'dryMass',
		value: function dryMass() {
			return 22200;
		}
	}, {
		key: 'tempLaunch',
		value: function tempLaunch() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.engines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var engine = _step.value;

					engine.startup();
					engine.adjustThrottle(100);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			;
		}
	}, {
		key: 'name',
		value: function name() {
			return "Falcon9S1";
		}
	}]);

	return Falcon9S1;
}(_SpaceCraftBase3.default);

exports.default = Falcon9S1;

},{"objects/core/RenderUtils":5,"objects/engines/Merlin1D":8,"objects/math/Vector2":11,"objects/spaceCraft/SpaceCraftBase":16}],15:[function(require,module,exports){
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

var _SpaceCraftBase2 = require('objects/spaceCraft/SpaceCraftBase');

var _SpaceCraftBase3 = _interopRequireDefault(_SpaceCraftBase2);

var _Merlin1DVac = require('objects/engines/Merlin1DVac');

var _Merlin1DVac2 = _interopRequireDefault(_Merlin1DVac);

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

var Falcon9S2 = function (_SpaceCraftBase) {
	_inherits(Falcon9S2, _SpaceCraftBase);

	function Falcon9S2(game, position, gravitationalParent) {
		_classCallCheck(this, Falcon9S2);

		var sprite = game.add.sprite(-9999, -9999, 'falcon9S2');
		sprite.anchor.setTo(.5, .5);

		//Width: 3.706 meters Height 14.0018 meters

		var _this = _possibleConstructorReturn(this, (Falcon9S2.__proto__ || Object.getPrototypeOf(Falcon9S2)).call(this, game, position, sprite, 3.706, 14.0018, new _Vector2.default(0, 11.2), gravitationalParent, 0, 103500));

		_this.aeroDynamicProperties = "ExtendsFineness";

		_this.engines.push(new _Merlin1DVac2.default(_this, new _Vector2.default(0, _this.height * 0.3)));
		return _this;
	}

	_createClass(Falcon9S2, [{
		key: 'formDragCoefficient',
		value: function formDragCoefficient() {
			var baseCD = this.getBaseCd(0.5);
			var alpha = this.getAlpha();

			return Math.abs(baseCD * Math.cos(alpha));
		}
	}, {
		key: 'formLiftCoefficient',
		value: function formLiftCoefficient() {
			var baseCD = this.getBaseCd(0.6);
			var alpha = this.getAlpha();

			return baseCD * Math.sin(alpha * 2.0);
		}
	}, {
		key: 'exposedSurfaceArea',
		value: function exposedSurfaceArea() {

			return 2 * Math.PI * (this.width / 2) * this.height + this.frontalArea();
		}
	}, {
		key: 'frontalArea',
		value: function frontalArea() {
			return Math.PI * Math.pow(this.width / 2, 2);
		}
	}, {
		key: 'liftingSurfaceArea',
		value: function liftingSurfaceArea() {
			return this.width * this.height;
		}
	}, {
		key: 'dryMass',
		value: function dryMass() {
			return 4000;
		}
	}, {
		key: 'name',
		value: function name() {
			return "Falcon9S2";
		}
	}]);

	return Falcon9S2;
}(_SpaceCraftBase3.default);

exports.default = Falcon9S2;

},{"objects/core/RenderUtils":5,"objects/engines/Merlin1DVac":9,"objects/math/Vector2":11,"objects/spaceCraft/SpaceCraftBase":16}],16:[function(require,module,exports){
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

var _EngineExhaust = require('objects/engines/EngineExhaust');

var _EngineExhaust2 = _interopRequireDefault(_EngineExhaust);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var SpaceCraftBase = function () {
	function SpaceCraftBase(game, position, sprite, width, height, stageOffset, gravitationalParent, payloadMass, propellantMass) {
		_classCallCheck(this, SpaceCraftBase);

		this._sprite = sprite;

		this._game = game;

		this.position = position;
		this.velocity = _Vector2.default.zero();

		this.propellantMass = propellantMass;
		this.gravitationaParent = gravitationalParent;
		this.heatingRate = 0.0;

		this.accelerationG = _Vector2.default.zero();
		this.accelerationD = _Vector2.default.zero();
		this.accelerationN = _Vector2.default.zero();
		this.accelerationL = _Vector2.default.zero();

		this.machNumber = 0.0;

		this.apogee = 0.0;
		this.perigee = 0.0;

		this.roll = 0.0;
		this.yaw = 0.0;
		this.pitch = -Math.PI * 0.5;

		this.width = width;
		this.height = height;

		this.throttle = 0;

		this._stageOffset = stageOffset;
		this.onGround = true;

		this.parent = null;
		this.children = [];

		this.aeroDynamicProperties = "None";
		this._groundInterations = 0;

		this.engines = [];
		this.ispMultiplier = 0.0;
		this.thrust = 0.0;

		this._atmoSpeed = 0.0;
		this._altitude = 0.0;

		//this.engineExhaust = new EngineExhaust(game.game);

		this._renderUtils = new _RenderUtils2.default(this._game);
	}

	_createClass(SpaceCraftBase, [{
		key: 'setParent',
		value: function setParent(parent) {
			this.parent = parent;
		}
	}, {
		key: 'addChild',
		value: function addChild(child) {
			this.children.push(child);
		}
	}, {
		key: 'update',
		value: function update(deltaTime) {

			var altitudeFromCenter = this.getRelativeAltitude();
			this.ispMultiplier = this.gravitationaParent.getIspMultiplier(altitudeFromCenter);

			if (this.parent == null) {

				this.updateEngines(deltaTime);

				if (this.thrust > 0) {

					var trustvector = new _Vector2.default(Math.cos(this.pitch), Math.sin(this.pitch));

					trustvector.multiply(this.thrust);
					trustvector.divide(this.mass());
					this.accelerationN.add(trustvector);
				}

				this.accelerationG.multiply(deltaTime);
				this.accelerationD.multiply(deltaTime);
				this.accelerationN.multiply(deltaTime);
				this.accelerationL.multiply(deltaTime);

				this.velocity.add(this.accelerationG);
				this.velocity.add(this.accelerationD);
				this.velocity.add(this.accelerationN);
				this.velocity.add(this.accelerationL);

				var tempVelocity = this.velocity.clone();
				tempVelocity.multiply(deltaTime);

				this.position.add(tempVelocity);

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var spacecraft = _step.value;

						spacecraft.updateChildren(this.position, this.velocity);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}
		}
	}, {
		key: 'updateChildren',
		value: function updateChildren(parentPosition, velocity) {

			var rotationOffset = new _Vector2.default(Math.cos(this.pitch), Math.sin(this.pitch));

			var newPosition = new _Vector2.default(this._stageOffset.x * rotationOffset.y + this._stageOffset.y * rotationOffset.x, -this._stageOffset.x * rotationOffset.x + this._stageOffset.y * rotationOffset.y);

			var pPosition = parentPosition.clone();

			pPosition.subtract(newPosition);
			this.position = pPosition;
			this.velocity.x = velocity.x;
			this.velocity.y = velocity.y;

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var spacecraft = _step2.value;

					spacecraft.updateChildren(this.position, this.velocity);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	}, {
		key: 'updateEngines',
		value: function updateEngines(deltaTime) {

			this.thrust = 0;

			if (this.engines.length > 0 && this.propellantMass > 0) {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {

					for (var _iterator3 = this.engines[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var engine = _step3.value;

						if (!engine.isActive) continue;
						this.thrust += engine.thrust(this.ispMultiplier);
						this.propellantMass = Math.max(0, this.propellantMass - engine.massFlowRate(this.ispMultiplier) * deltaTime);

						engine.update(deltaTime, this.ispMultiplier);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var spacecraft = _step4.value;

					spacecraft.updateEngines(deltaTime);
					this.thrust += spacecraft.thrust;
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
	}, {
		key: 'render',
		value: function render(cameraBounds) {

			//Todo: Check if ship is in viewport, save render time
			var boundingBox = this._renderUtils.computeBoundingBox(this.position, cameraBounds, this.width, this.height);

			//RenderBelow

			//RenderShip
			this._sprite.position.x = boundingBox.x;
			this._sprite.position.y = boundingBox.y;

			this._sprite.rotation = this.pitch + Math.PI * 0.5;
			this._sprite.width = boundingBox.width;
			this._sprite.height = boundingBox.height;

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.engines[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var engine = _step5.value;

					engine.draw(cameraBounds);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}
		}
	}, {
		key: 'offsetPitch',
		value: function offsetPitch(offset) {

			this.pitch += offset;

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var spacecraft = _step6.value;

					spacecraft.offsetPitch(offset);
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}
		}
	}, {
		key: 'resetAccelerations',
		value: function resetAccelerations() {
			this.accelerationG = _Vector2.default.zero();
			this.accelerationD = _Vector2.default.zero();
			this.accelerationN = _Vector2.default.zero();
			this.accelerationL = _Vector2.default.zero();
		}
	}, {
		key: 'getRelativeAltitude',
		value: function getRelativeAltitude() {

			if (this.gravitationaParent == null) return 0;

			var diffrence = this.position.clone();
			diffrence.subtract(this.gravitationaParent.position);

			return diffrence.length();
		}
	}, {
		key: 'getRelativeVelocity',
		value: function getRelativeVelocity() {

			if (this.gravitationaParent == null) return _Vector2.default.zero;

			var diffrence = this.velocity.clone();

			return diffrence.subtract(this.gravitationaParent.velocity);
		}
	}, {
		key: 'getTotalHeight',
		value: function getTotalHeight() {
			var totalHeight = this.height;

			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = this.children[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var spacecraft = _step7.value;

					totalHeight += spacecraft._getChildHeight();
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return totalHeight;
		}
	}, {
		key: '_getChildHeight',
		value: function _getChildHeight() {

			var totalHeight = 0;

			if (this.aeroDynamicProperties == "ExtendsFineness") totalHeight += this.height;

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = this.children[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var spacecraft = _step8.value;

					spacecraft._getChildHeight();
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			return totalHeight;
		}
	}, {
		key: 'stagingForce',
		value: function stagingForce() {
			return this.mass() * .02;
		}
	}, {
		key: 'resolveGrav',
		value: function resolveGrav(earth) {

			///gravity

			if (this.parent != null) return;

			this.gravitationaParent = earth;

			var diff_position = earth.position.clone();
			diff_position.subtract(this.position);

			var r2 = diff_position.lengthSquared();
			var mass_dist_ratio = earth.mass() / r2;

			//to far
			if (mass_dist_ratio < 2500) {
				return;
			}

			var GravitationConstant = 6.67384e-11;

			diff_position.normalize();

			mass_dist_ratio = mass_dist_ratio * GravitationConstant;
			diff_position.multiply(mass_dist_ratio);
			this.accelerationG.add(diff_position);
		}
	}, {
		key: 'resolveAtmo',
		value: function resolveAtmo(earth) {

			if (this.parent != null) return;

			this.gravitationaParent = earth;

			var diff_position = earth.position.clone();
			diff_position.subtract(this.position);

			var heightOffset = 0;
			if (this.children.length > 0) heightOffset = this.getTotalHeight() - this.height * .5;else heightOffset = this.height * .5;

			var distance = diff_position.length() - heightOffset;

			diff_position.normalize();
			var altitude = distance - earth.surfaceRadius();

			this._altitude = altitude;

			//In atmo?
			if (altitude < earth.atmosphereHeight()) {
				var surfaceNormal = new _Vector2.default(-diff_position.y, diff_position.x);

				// Distance of circumference at this altitude ( c= 2r * pi )
				var pathCircumference = 2 * Math.PI * distance;
				var rotationalSpeed = pathCircumference / earth.rotationPeriod();

				//TODO: Review and perhaps implement a beter version


				if (this.onGround && this.thrust == 0) {

					var normal = new _Vector2.default(-diff_position.x, -diff_position.y);

					var earthPosition = earth.position.clone();
					var circumferenceTerm = earth.surfaceRadius() + heightOffset;
					var normalMul = normal.clone();
					normalMul.multiply(circumferenceTerm);

					earthPosition.add(normalMul);
					this.position = earthPosition;

					this.pitch = normal.angle();

					this.accelerationN.x = -this.accelerationG.x;
					this.accelerationN.y = -this.accelerationG.y;
				} else {
					this.onGround = false;
				}

				var atmoDensity = earth.getAtmosphericDensity(altitude);

				var relativeVelocity = earth.velocity.clone();
				relativeVelocity.add(surfaceNormal);
				relativeVelocity.multiply(rotationalSpeed);

				var velocityMagnitude = relativeVelocity.lengthSquared();

				if (velocityMagnitude > 0) {

					//M*sec
					var speed = relativeVelocity.length();

					this.heatingRate = 1.83e-4 * Math.pow(speed, 3) * Math.sqrt(atmoDensity / (this.width * 0.5));

					var formDragCoefficient = this.totalFormDragCoefficient();
					var skinFrictionCoefficient = this.totalSkinFrictionCoefficient();
					var liftCoefficient = this.totalLiftCoefficient();

					var formDragTerm = formDragCoefficient * this.totalFormDragArea();
					var skinFrictionTerm = skinFrictionCoefficient * this.totalSkinFrictionArea();

					var dragTerm = formDragTerm;
					dragTerm += skinFrictionTerm;

					var liftTerm = liftCoefficient * this.totalLiftArea();

					relativeVelocity.normalize();

					var drag = relativeVelocity.clone();
					var dragVTerm = .5 * atmoDensity * velocityMagnitude * dragTerm;

					drag.multiply(dragVTerm);

					var lift = relativeVelocity.clone();
					var liftVTerm = .5 * atmoDensity * velocityMagnitude * liftTerm;

					lift.multiply(liftVTerm);
					drag.divide(this.mass());
					lift.divide(this.mass());

					this.accelerationD = drag;
					var accelerationLift = lift;

					var alpha = this.getAlpha();
					var halfPI = Math.PI / 2;
					var isRetro = alpha > halfPI || alpha < -halfPI;

					this.accelerationL.x += accelerationLift.y;
					this.accelerationL.y -= accelerationLift.x;
				}
			} else {
				this.heatingRate = 0;
			}
		}
	}, {
		key: 'totalFormDragCoefficient',
		value: function totalFormDragCoefficient() {
			var dragCoefficient = 0;

			if (this.aeroDynamicProperties == "ExposedToAirFlow" || this.aeroDynamicProperties == "ExtendsFineness") {
				dragCoefficient = this.formDragCoefficient();
			}

			return this._getChildDragCoefficient(this.children, dragCoefficient);
		}
	}, {
		key: '_getChildDragCoefficient',
		value: function _getChildDragCoefficient(children, dragCoefficient) {
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {

				for (var _iterator9 = children[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var child = _step9.value;

					if (child.aeroDynamicProperties == "ExposedToAirFlow") {

						if (child.formDragCoefficient() > dragCoefficient) dragCoefficient = child.formDragCoefficient();
					} else if (child.aeroDynamicProperties = "ExtendsFineness") {

						dragCoefficient *= child.formDragCoefficient();
					} else if (child.aeroDynamicProperties = "ExtendsCrossSection") {

						dragCoefficient = (dragCoefficient + child.formDragCoefficient()) / 2;
					}

					dragCoefficient = this._getChildDragCoefficient(child.children, dragCoefficient);
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return dragCoefficient;
		}
	}, {
		key: 'totalFormDragArea',
		value: function totalFormDragArea() {
			var totalFormDragArea = 0;

			if (this.aeroDynamicProperties == "ExposedToAirFlow" || this.aeroDynamicProperties == "ExtendsFineness") {
				totalFormDragArea = this.frontalArea();
			}

			return this._getChildDragCoefficient(this.children, totalFormDragArea);
		}
	}, {
		key: '_getChildFormDragArea',
		value: function _getChildFormDragArea(children, totalFormDragArea) {
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {

				for (var _iterator10 = children[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var child = _step10.value;

					if (child.aeroDynamicProperties == "ExposedToAirFlow") {

						if (child.frontalArea() > totalFormDragArea) totalFormDragArea = child.frontalArea();
					} else if (child.aeroDynamicProperties = "ExtendsCrossSection") {

						totalFormDragArea *= child.frontalArea();
					}

					dragCoefficient = this._getChildFormDragArea(child.children, totalFormDragArea);
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}

			return totalFormDragArea;
		}
	}, {
		key: 'skinFrictionCoefficient',
		value: function skinFrictionCoefficient() {

			var velocity = this.getRelativeVelocity();
			//TODO: Remove
			if (velocity == null) return 0.0;
			velocity = velocity.length();
			var altitude = this.getRelativeAltitude();
			var viscosity = this.gravitationaParent.getAtmosphericViscosity(altitude);
			var reynoldsNumber = velocity * this.height / viscosity;
			return .455 / Math.pow(Math.log10(reynoldsNumber), 2.58);
		}
	}, {
		key: 'totalSkinFrictionCoefficient',
		value: function totalSkinFrictionCoefficient() {
			var skinFrictionCoefficient = 0;

			if (this.aeroDynamicProperties == "ExposedToAirFlow" || this.aeroDynamicProperties == "ExtendsFineness" || this.aeroDynamicProperties == "ExtendsCrossSection") {

				skinFrictionCoefficient = this.skinFrictionCoefficient();
			}

			var _iteratorNormalCompletion11 = true;
			var _didIteratorError11 = false;
			var _iteratorError11 = undefined;

			try {
				for (var _iterator11 = this.children[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
					var spacecraft = _step11.value;

					skinFrictionCoefficient += spacecraft.totalSkinFrictionCoefficient();
				}
			} catch (err) {
				_didIteratorError11 = true;
				_iteratorError11 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion11 && _iterator11.return) {
						_iterator11.return();
					}
				} finally {
					if (_didIteratorError11) {
						throw _iteratorError11;
					}
				}
			}

			return skinFrictionCoefficient;
		}
	}, {
		key: 'totalSkinFrictionArea',
		value: function totalSkinFrictionArea() {
			var totalSkinFrictionArea = 0;

			if (this.aeroDynamicProperties == "ExposedToAirFlow" || this.aeroDynamicProperties == "ExtendsFineness" || this.aeroDynamicProperties == "ExtendsCrossSection") {

				totalSkinFrictionArea = this.exposedSurfaceArea();
			}

			var _iteratorNormalCompletion12 = true;
			var _didIteratorError12 = false;
			var _iteratorError12 = undefined;

			try {
				for (var _iterator12 = this.children[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
					var spacecraft = _step12.value;

					totalSkinFrictionArea += spacecraft.exposedSurfaceArea();
				}
			} catch (err) {
				_didIteratorError12 = true;
				_iteratorError12 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion12 && _iterator12.return) {
						_iterator12.return();
					}
				} finally {
					if (_didIteratorError12) {
						throw _iteratorError12;
					}
				}
			}

			return totalSkinFrictionArea;
		}
	}, {
		key: 'totalLiftCoefficient',
		value: function totalLiftCoefficient() {
			var liftCoefficient = 0;

			if (this.aeroDynamicProperties == "ExposedToAirFlow" || this.aeroDynamicProperties == "ExtendsFineness" || this.aeroDynamicProperties == "ExtendsCrossSection") {

				liftCoefficient = this.formLiftCoefficient();
			}

			return this._getMaxChildLiftCoefficient(this.children, liftCoefficient);
		}
	}, {
		key: '_getMaxChildLiftCoefficient',
		value: function _getMaxChildLiftCoefficient(children, totalLiftCoefficient) {
			var _iteratorNormalCompletion13 = true;
			var _didIteratorError13 = false;
			var _iteratorError13 = undefined;

			try {

				for (var _iterator13 = children[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
					var child = _step13.value;

					if (child.aeroDynamicProperties == "ExposedToAirFlow") {

						if (Math.abs(child.formLiftCoefficient()) > Math.abs(totalLiftCoefficient)) totalLiftCoefficient = child.formLiftCoefficient();
					} else if (child.aeroDynamicProperties == "ExtendsFineness" || child.aeroDynamicProperties == "ExtendsCrossSection") {
						totalLiftCoefficient += child.formLiftCoefficient();
					}

					totalLiftCoefficient = this._getMaxChildLiftCoefficient(child.children, totalLiftCoefficient);
				}
			} catch (err) {
				_didIteratorError13 = true;
				_iteratorError13 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion13 && _iterator13.return) {
						_iterator13.return();
					}
				} finally {
					if (_didIteratorError13) {
						throw _iteratorError13;
					}
				}
			}

			return totalLiftCoefficient;
		}
	}, {
		key: 'totalLiftArea',
		value: function totalLiftArea() {
			var totalLiftArea = 0;

			if (this.aeroDynamicProperties == "ExposedToAirFlow" || this.aeroDynamicProperties == "ExtendsFineness" || this.aeroDynamicProperties == "ExtendsCrossSection") {

				totalLiftArea = this.liftingSurfaceArea();
			}

			return this._getChildLiftArea(this.children, totalLiftArea);
		}
	}, {
		key: '_getChildLiftArea',
		value: function _getChildLiftArea(children, totalLiftArea) {
			var _iteratorNormalCompletion14 = true;
			var _didIteratorError14 = false;
			var _iteratorError14 = undefined;

			try {

				for (var _iterator14 = children[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
					var child = _step14.value;

					if (child.aeroDynamicProperties == "ExposedToAirFlow") {

						if (child.liftingSurfaceArea() > totalLiftArea) totalLiftArea = child.liftingSurfaceArea();
					} else if (child.aeroDynamicProperties == "ExtendsFineness" || child.aeroDynamicProperties == "ExtendsCrossSection") {
						totalLiftArea += child.liftingSurfaceArea();
					}

					totalLiftArea = this._getChildLiftArea(child.children, totalLiftArea);
				}
			} catch (err) {
				_didIteratorError14 = true;
				_iteratorError14 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion14 && _iterator14.return) {
						_iterator14.return();
					}
				} finally {
					if (_didIteratorError14) {
						throw _iteratorError14;
					}
				}
			}

			return totalLiftArea;
		}
	}, {
		key: 'getBaseCd',
		value: function getBaseCd(cd) {
			if (this.machNumber > 1.0) {
				var exp = Math.exp(0.3 / this.machNumber);
				return cd * 1.4 * exp;
			}

			return cd;
		}
	}, {
		key: 'getAlpha',
		value: function getAlpha() {

			var altitude = this.getRelativeAltitude();
			var pitch = this.pitch;

			if (altitude > this.gravitationaParent.atmosphereHeight()) {

				return this.pitch - this.gravitationaParent.pitch;
			}

			var alpha = 0.0;
			if (altitude > .1) {

				var _alpha = this.pitch - this.getRelativeVelocity().angle();

				while (_alpha > Math.Pi) {
					_alpha -= Math.Pi * 2;
				}

				while (_alpha < -Math.Pi) {
					_alpha += Math.Pi * 2;
				}
			}

			return alpha;
		}
	}, {
		key: 'mass',
		value: function mass() {

			var childMass = 0;
			var _iteratorNormalCompletion15 = true;
			var _didIteratorError15 = false;
			var _iteratorError15 = undefined;

			try {
				for (var _iterator15 = this.children[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
					var child = _step15.value;

					childMass += child.mass();
				}
			} catch (err) {
				_didIteratorError15 = true;
				_iteratorError15 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion15 && _iterator15.return) {
						_iterator15.return();
					}
				} finally {
					if (_didIteratorError15) {
						throw _iteratorError15;
					}
				}
			}

			return childMass + this.dryMass() + this.propellantMass;
		}
	}, {
		key: 'setThrottle',
		value: function setThrottle(throttle) {
			var _iteratorNormalCompletion16 = true;
			var _didIteratorError16 = false;
			var _iteratorError16 = undefined;

			try {

				for (var _iterator16 = this.engines[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
					var engine = _step16.value;

					engine.adjustThrottle(throttle);
				}
			} catch (err) {
				_didIteratorError16 = true;
				_iteratorError16 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion16 && _iterator16.return) {
						_iterator16.return();
					}
				} finally {
					if (_didIteratorError16) {
						throw _iteratorError16;
					}
				}
			}

			;
		}
	}, {
		key: 'name',
		value: function name() {
			return "";
		}
	}]);

	return SpaceCraftBase;
}();

exports.default = SpaceCraftBase;

},{"objects/core/RenderUtils":5,"objects/engines/EngineExhaust":7,"objects/math/Vector2":11}],17:[function(require,module,exports){
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

var _Falcon9S = require('objects/spaceCraft/Falcon9S1');

var _Falcon9S2 = _interopRequireDefault(_Falcon9S);

var _Falcon9S3 = require('objects/spaceCraft/Falcon9S2');

var _Falcon9S4 = _interopRequireDefault(_Falcon9S3);

var _Fairing = require('objects/spaceCraft/Fairing');

var _Fairing2 = _interopRequireDefault(_Fairing);

var _BasePayload = require('objects/spaceCraft/BasePayload');

var _BasePayload2 = _interopRequireDefault(_BasePayload);

var _Camera = require('objects/core/Camera');

var _Camera2 = _interopRequireDefault(_Camera);

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
			//TODO: Find a way to move to object classes
			this.load.spritesheet('falcon9S1', 'assets/spacecraft/S1.png', 100, 1170, 1);
			this.load.spritesheet('falcon9S2', 'assets/spacecraft/S2.png', 90, 340, 1);
			this.load.spritesheet('BasePayload', 'assets/spacecraft/default.png', 200, 426, 1);
			this.load.spritesheet('fairingLeft', 'assets/spacecraft/fairingLeft.png', 62, 314, 1);
			this.load.spritesheet('fairingRight', 'assets/spacecraft/fairingRight.png', 62, 314, 1);
		}
	}, {
		key: 'create',
		value: function create() {

			//Launch Button
			this._isStarted = false;
			this._buttonGroup = this.game.add.group();

			this._startButton = this.add.button(this.world.centerX + 450, 550, 'startButton', this.startButtonClicked, this);
			this._startButton.anchor.setTo(.5, .5);
			this._startButton.input.useHandCursor = true;
			this._buttonGroup.add(this._startButton);

			var text = this.add.text(this.world.centerX + 450, 550, "Launch", {
				fill: "#e9eecf"
			});
			text.anchor.setTo(0.5);

			text.font = 'Revalia';
			text.fontSize = 20;
			text.align = 'center';
			this._startText = text;
			this._buttonGroup.add(text);

			this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

			/////

			this.now = 0;
			this.timeElapsed = 0;
			this.hasLaunched = false;

			//////////////////////
			//Zoom

			this.game.input.mouse.mouseWheelCallback = this.mouseWheel;
			this._zoom = .15;

			///////////////////////

			this._earth = new _Earth2.default(this);
			this._spacecraft = this.createSpacecraft();
			this._simCamera = new _Camera2.default(this, this._spacecraft[0], this._zoom);

			this.computePhysics();
		}
	}, {
		key: 'update',
		value: function update() {

			if (this._isStarted) {
				this.tempController();
			}

			this.computePhysics();

			this.draw();
		}
	}, {
		key: 'computePhysics',
		value: function computePhysics() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {

				for (var _iterator = this._spacecraft[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var spacecraft = _step.value;

					spacecraft.resetAccelerations();
					spacecraft.resolveGrav(this._earth);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this._spacecraft[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _spacecraft = _step2.value;

					_spacecraft.resolveAtmo(this._earth);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this._spacecraft[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _spacecraft2 = _step3.value;

					var secs = this.game.time.physicsElapsed;
					_spacecraft2.update(secs);
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	}, {
		key: 'draw',
		value: function draw() {

			this._simCamera.update();

			this.game.debug.start(20, 20, 'blue');

			var craftPos = this._spacecraft[2];

			this.game.debug.line('Thrust: ' + craftPos.thrust + ' Speed: ' + Math.floor(craftPos.velocity.length()) + ' Altitude: ' + Math.floor(this._spacecraft[0]._altitude * 3.28) + " ft");
			this.game.debug.line('Mass: ' + Math.floor(craftPos.mass()) + ' PropellantMass: ' + Math.floor(craftPos.propellantMass));
			this.game.debug.line('Pitch: ' + this._spacecraft[0].pitch);
			if (this.now) {
				this.timeElapsed = Math.floor(this.game.time.elapsedSecondsSince(this.now));
				this.game.debug.line('Elapsed Time: ' + this.timeElapsed);
			}

			if (this.leftKey.isDown) {
				this.game.debug.line('Left Key Down');
			} else if (this.rightKey.isDown) {
				this.game.debug.line('Right Key Down');
			}
			if (this.leftKey.isDown) {
				this._spacecraft[0].offsetPitch(-.01);
			} else if (this.rightKey.isDown) {
				this._spacecraft[0].offsetPitch(.01);
			}

			var cameraBounds = this._simCamera.getBounds();
			this._earth.render(cameraBounds);
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this._spacecraft[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var spacecraft = _step4.value;

					spacecraft.render(cameraBounds);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			this.game.debug.stop();

			///////////////////////////////////////

			if (this.game.scrollDelta > 0) this._zoom += this._zoom * this.game.scrollDelta;else if (this.game.scrollDelta < 0) this._zoom -= Math.abs(this._zoom * this.game.scrollDelta);

			this._zoom = this.math.clamp(this._zoom, .05, 1000000000000);

			this._simCamera.setZoom(this._zoom);
			this.game.scrollDelta = 0;

			/////

			this.game.world.bringToTop(this._buttonGroup);
		}
	}, {
		key: 'createSpacecraft',
		value: function createSpacecraft() {
			var position = new _Vector2.default(0, -this._earth.surfaceRadius());
			position.add(this._earth.position);

			var payload = new _BasePayload2.default(this, position, this._earth, 3136);

			var zero = new _Vector2.default(0, 0);

			var leftFairing = new _Fairing2.default(this, zero.clone(), true, this._earth);
			var rightFairing = new _Fairing2.default(this, zero.clone(), false, this._earth);

			payload.addFairings(leftFairing, rightFairing);

			var f9s2 = new _Falcon9S4.default(this, zero.clone(), this._earth);
			var f9s1 = new _Falcon9S2.default(this, zero.clone(), this._earth);

			payload.addChild(f9s2);
			f9s2.setParent(payload);

			f9s2.addChild(f9s1);
			f9s1.setParent(f9s2);

			return [payload, f9s2, f9s1, leftFairing, rightFairing];
		}
	}, {
		key: 'startButtonClicked',
		value: function startButtonClicked() {

			this._isStarted = true;
			this._startText.visible = false;
			this._startButton.visible = false;
		}
	}, {
		key: 'mouseWheel',
		value: function mouseWheel(event) {

			if (this.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
				this.scrollDelta -= .5;
			} else {
				this.scrollDelta += 1.5;
			}
		}
	}, {
		key: 'tempController',
		value: function tempController() {

			this.turn1 = false;
			this.turn2 = false;

			if (this._isStarted) {

				this.now = this.game.time.time;
				this.hasLaunched = true;
				this._spacecraft[2].tempLaunch();
				this._isStarted = false;
			}
		}
	}]);

	return MainState;
}(Phaser.State);

exports.default = MainState;

},{"objects/Earth":2,"objects/core/Camera":3,"objects/math/Vector2":11,"objects/spaceCraft/BasePayload":12,"objects/spaceCraft/Fairing":13,"objects/spaceCraft/Falcon9S1":14,"objects/spaceCraft/Falcon9S2":15}]},{},[1])
//# sourceMappingURL=game.js.map
