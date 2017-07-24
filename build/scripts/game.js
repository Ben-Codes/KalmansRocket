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

},{"states/MainState":12}],2:[function(require,module,exports){
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

		//temp
		this.bmd = game.make.bitmapData(1200, 600);
		this.bmd.addToWorld();

		this.isDebugged = true;
		this.test1 = 0;
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
			this._game.game.debug.line('Earth Ellipse: X:' + ellipse.x + ' Y:' + ellipse.y + ' height:' + ellipse.height + ' width:' + ellipse.width);

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

			this._zoom = this._game.math.clamp(zoom, .05, 1000000000000);
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

	function BasePayload(game, position) {
		_classCallCheck(this, BasePayload);

		var sprite = game.add.sprite(-9999, -9999, 'BasePayload');
		sprite.anchor.setTo(.5, .5);

		//Width: 4 meters Height 8.52 meters
		return _possibleConstructorReturn(this, (BasePayload.__proto__ || Object.getPrototypeOf(BasePayload)).call(this, game, position, sprite, 4, 8.52, new _Vector2.default(0, 0)));
	}

	return BasePayload;
}(_SpaceCraftBase3.default);

exports.default = BasePayload;

},{"objects/core/RenderUtils":4,"objects/math/Vector2":6,"objects/spaceCraft/SpaceCraftBase":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

	function Fairing(game, position, isLeft) {
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

		var _this = _possibleConstructorReturn(this, (Fairing.__proto__ || Object.getPrototypeOf(Fairing)).call(this, game, position, sprite, 2.59, 13.0, offset));

		_this._isLeft = isLeft;

		return _this;
	}

	return Fairing;
}(_SpaceCraftBase3.default);

exports.default = Fairing;

},{"objects/core/RenderUtils":4,"objects/math/Vector2":6,"objects/spaceCraft/SpaceCraftBase":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var Falcon9S1 = function (_SpaceCraftBase) {
	_inherits(Falcon9S1, _SpaceCraftBase);

	function Falcon9S1(game, position) {
		_classCallCheck(this, Falcon9S1);

		var sprite = game.add.sprite(-9999, -9999, 'falcon9S1');
		sprite.anchor.setTo(.5, .5);

		//Width: 4.11 meters Height 47.812 meters
		return _possibleConstructorReturn(this, (Falcon9S1.__proto__ || Object.getPrototypeOf(Falcon9S1)).call(this, game, position, sprite, 4.11, 47.812188, new _Vector2.default(0, 25.55)));
	}

	return Falcon9S1;
}(_SpaceCraftBase3.default);

exports.default = Falcon9S1;

},{"objects/core/RenderUtils":4,"objects/math/Vector2":6,"objects/spaceCraft/SpaceCraftBase":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var Falcon9S2 = function (_SpaceCraftBase) {
	_inherits(Falcon9S2, _SpaceCraftBase);

	function Falcon9S2(game, position) {
		_classCallCheck(this, Falcon9S2);

		var sprite = game.add.sprite(-9999, -9999, 'falcon9S2');
		sprite.anchor.setTo(.5, .5);

		//Width: 3.706 meters Height 14.0018 meters
		return _possibleConstructorReturn(this, (Falcon9S2.__proto__ || Object.getPrototypeOf(Falcon9S2)).call(this, game, position, sprite, 3.706, 14.0018, new _Vector2.default(0, 11.2)));
	}

	return Falcon9S2;
}(_SpaceCraftBase3.default);

exports.default = Falcon9S2;

},{"objects/core/RenderUtils":4,"objects/math/Vector2":6,"objects/spaceCraft/SpaceCraftBase":11}],11:[function(require,module,exports){
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

var SpaceCraftBase = function () {
	function SpaceCraftBase(game, position, sprite, width, height, stageOffset) {
		_classCallCheck(this, SpaceCraftBase);

		this._sprite = sprite;

		this._game = game;

		this.position = position;
		this.velocity = new _Vector2.default(0, 0);

		this.roll = 0.0;
		this.yaw = 0.0;
		this.pitch = -Math.PI * 0.5;

		this.width = width;
		this.height = height;

		this._stageOffset = stageOffset;
		this.onGround = true;

		this.parent = null;
		this.children = [];

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

			if (this.parent == null) {
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

					//debugger;
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
		key: 'render',
		value: function render(cameraBounds) {

			if (this.position == null) debugger;

			//Todo: Check if ship is in viewport, save render time
			var boundingBox = this._renderUtils.computeBoundingBox(this.position, cameraBounds, this.width, this.height);

			//RenderBelow

			//RenderShip
			//debugger;
			this._sprite.position.x = boundingBox.x;
			this._sprite.position.y = boundingBox.y;

			this._sprite.rotation = this.pitch + Math.PI * 0.5;

			this._sprite.width = boundingBox.width;
			this._sprite.height = boundingBox.height;

			//RenderAbove
		}
	}]);

	return SpaceCraftBase;
}();

exports.default = SpaceCraftBase;

},{"objects/core/RenderUtils":4,"objects/math/Vector2":6}],12:[function(require,module,exports){
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
				this.computePhysics();
			}

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

					spacecraft.update(0);
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
		value: function draw() {

			this.game.debug.start(20, 20, 'blue');

			var craftPos = this._spacecraft[0].position;
			this.game.debug.line('Spacecraft Position: X:' + craftPos.x + ' Y:' + craftPos.y);
			this.game.debug.line('Zoom: ' + this._zoom + ' D ' + this.game.scrollDelta);

			var cameraBounds = this._simCamera.getBounds();
			this._earth.render(cameraBounds);
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this._spacecraft[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var spacecraft = _step2.value;

					spacecraft.render(cameraBounds);
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

			var payload = new _BasePayload2.default(this, position);

			var zero = new _Vector2.default(0, 0);

			var leftFairing = new _Fairing2.default(this, zero.clone(), true);
			var rightFairing = new _Fairing2.default(this, zero.clone(), false);

			payload.addChild(leftFairing);
			payload.addChild(rightFairing);
			leftFairing.setParent(payload);
			rightFairing.setParent(payload);

			var f9s2 = new _Falcon9S4.default(this, zero.clone());
			var f9s1 = new _Falcon9S2.default(this, zero.clone());

			payload.addChild(f9s2);
			f9s2.setParent(payload);

			f9s2.addChild(f9s1);
			f9s1.setParent(f9s2);

			return [payload, f9s2, f9s1, leftFairing, rightFairing];
		}
	}, {
		key: 'startButtonClicked',
		value: function startButtonClicked() {
			this._isStarted = false;
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
	}]);

	return MainState;
}(Phaser.State);

exports.default = MainState;

},{"objects/Earth":2,"objects/core/Camera":3,"objects/math/Vector2":6,"objects/spaceCraft/BasePayload":7,"objects/spaceCraft/Fairing":8,"objects/spaceCraft/Falcon9S1":9,"objects/spaceCraft/Falcon9S2":10}]},{},[1])
//# sourceMappingURL=game.js.map
