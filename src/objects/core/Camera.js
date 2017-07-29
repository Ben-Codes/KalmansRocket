import rectangleD from 'objects/math/RectangleD';
import vector2 from 'objects/math/Vector2';

class Camera {

	constructor(game, target, zoom) {

		this._target = target;
		this._zoom = zoom;
		this._game = game;
		this._position = new vector2(target.position.x, target.position.y);
	}

	setZoom(zoom) {

		this._zoom = this._game.math.clamp(zoom, .05, 1000000000000);
	}

	update(deltaTime) {
		let targetPosition = this._target.position;
		this._position.x = targetPosition.x;
		this._position.y = targetPosition.y;
	}

	getBounds() {

		let width = this._game.scale.width * this._zoom;
		let height = this._game.scale.height * this._zoom;

		let x = this._position.x - width * .5;
		let y = this._position.y - height * .5;

		return new rectangleD(x, y, width, height);
	}
}

export default Camera;