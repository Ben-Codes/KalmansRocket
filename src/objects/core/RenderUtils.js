import rectangleD from 'objects/math/RectangleD';
import vector2 from 'objects/math/Vector2';

class RenderUtils {

	constructor(game) {
		this._game = game;
	}

	computeEllipseSize(position, cameraBounds, radius) {

		let screenRadius = (radius / cameraBounds.width) * this._game.scale.width;

		let screenPosition = position.clone();
		screenPosition.subtract(new vector2(cameraBounds.left, cameraBounds.top));

		let screenU = screenPosition.x / cameraBounds.width;
		let screenV = screenPosition.y / cameraBounds.height;

		let screenX = screenU * this._game.scale.width;
		let screenY = screenV * this._game.scale.height;

		return new rectangleD(
			screenX,
			screenY,
			screenRadius,
			screenRadius
		);
	}

	computeBoundingBox(position, cameraBounds, width, height) {

		let screenWidth = (width / cameraBounds.width) * this._game.scale.width;
		let screenHeight = (height / cameraBounds.height) * this._game.scale.height;

		let screenPosition = position.clone();
		screenPosition.subtract(new vector2(cameraBounds.left, cameraBounds.top));

		let screenU = screenPosition.x / cameraBounds.width;
		let screenV = screenPosition.y / cameraBounds.height;

		let screenX = screenU * this._game.scale.width;
		let screenY = screenV * this._game.scale.height;

		return new rectangleD(
			screenX,
			screenY,
			screenWidth,
			screenHeight
		);
	}

}

export default RenderUtils;