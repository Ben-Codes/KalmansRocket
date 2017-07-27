import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class BasePayload extends SpaceCraftBase {

	constructor(game, position) {

		let sprite = game.add.sprite(-9999, -9999, 'BasePayload');
		sprite.anchor.setTo(.5, .5);

		//Width: 4 meters Height 8.52 meters
		super(game, position, sprite, 4, 8.52, new vector2(0, 0));

		//TODO: Use enums
		this.aeroDynamicProperties = "ExposedToAirFlow";

		this._deployedFairings = true;
	}

	addFairings(leftFairing, rightFairing) {
		this._leftFairing = leftFairing;
		this._rightFairing = rightFairing;

		this.addChild(leftFairing);
		this.addChild(rightFairing);
		leftFairing.setParent(this);
		rightFairing.setParent(this);

		this._deployedFairings = false;
	}

	formDragCoefficient() {
		let baseCD = this.getBaseCd(0.4);
		let alpha = this.getAlpha();

		return baseCD * Math.cos(alpha);
	}

	formLiftCoefficient() {
		//if (!this._deployedFairings) {
		//	return this._leftFairing.formLiftCoefficient() +
		//		this._rightFairing.formLiftCoefficient();
		//}
		//Fairings are children

		return 0;
	}

	exposedSurfaceArea() {

		if (!this._deployedFairings) {
			//return this._leftFairing.exposedSurfaceArea() +
			//	this._rightFairing.exposedSurfaceArea();
			//Fairings are children
			return 0;
		}

		return 1
	}

	frontalArea() {

		if (!this._deployedFairings) {
			//return this._leftFairing.frontalArea() +
			//	this._rightFairing.frontalArea();
			//Fairings are children
			return 0;
		}

		return 1;
	}

	liftingSurfaceArea() {
		if (!this._deployedFairings) {
			//return this._leftFairing.liftingSurfaceArea() +
			//	this._rightFairing.liftingSurfaceArea();
			//Fairings are children
			return 0;
		}

		return 1;
	}

	deployFairing() {
		this._deployedFairings = false;

		this.children.splice(this.children.indexOf(this._leftFairing), 1);
		this.children.splice(this.children.indexOf(this._rightFairing), 1);

		this._leftFairing.stage();
		this._rightFairing.stage();
	}

	dryMass() {
		if (!this._deployedFairings) {
			//return this._leftFairing.dryMass() +
			//	this._rightFairing.dryMass();
			//Fairings are children
		}
		return 0;
	}

}

export default BasePayload;