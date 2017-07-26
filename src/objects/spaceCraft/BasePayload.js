import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class BasePayload extends SpaceCraftBase {

	constructor(game, position) {

		let sprite = game.add.sprite(-9999, -9999, 'BasePayload');
		sprite.anchor.setTo(.5,.5);
		
		//Width: 4 meters Height 8.52 meters
		super(game, position, sprite, 4, 8.52, new vector2(0, 0));

		//TODO: Use enums
		this.aeroDynamicProperties = "ExposedToAirFlow";

		this._deployedFairings = true;

	}

	addFairings(leftFairing, rightFairing){
		this._leftFairing = leftFairing;
		this._rightFairing = rightFairing;

		this.addChild(leftFairing);
		this.addChild(rightFairing);
		leftFairing.setParent(this);
		rightFairing.setParent(this);

		this._deployedFairings = false;
	}

}

export default BasePayload;