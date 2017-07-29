import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class Fairing extends SpaceCraftBase {

	constructor(game, position, isLeft, gravitationalParent) {


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
		super(game, position, sprite, 2.59, 13.0, offset, gravitationalParent, 0, 0);

		this._isLeft = isLeft;
		this.aeroDynamicProperties = "ExposedToAirFlow";

	}

	stagingForce(){
		return 1500;
	}

	formDragCoefficient() {
		let baseCD = this.getBaseCd(0.4);
		let alpha = this.getAlpha();

		return baseCD * Math.cos(alpha);
	}

	formLiftCoefficient() {
		let baseCD = this.getBaseCd(0.6);
		let alpha = this.getAlpha();

		return baseCD * Math.sin(alpha * 2.0);
	}

	exposedSurfaceArea() {

		return 2 * Math.PI * (this.width / 2) * this.height + this.frontalArea();
	}

	frontalArea() {

		return Math.PI * Math.pow(this.width / 2, 2);
	}

	liftingSurfaceArea() {
		return this.width * this.height;
	}

	dryMass(){
		return 875;
	}

	name(){
		return "Fairing";
	}


}

export default Fairing;