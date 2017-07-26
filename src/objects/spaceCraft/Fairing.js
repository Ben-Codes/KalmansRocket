import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class Fairing extends SpaceCraftBase {

	constructor(game, position, isLeft) {


		let offset = new vector2(0, 0);
		let sprite;

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
		super(game, position, sprite, 2.59, 13.0, offset);

		this._isLeft = isLeft;
		this.aeroDynamicProperties = "ExposedToAirFlow";

	}

}

export default Fairing;