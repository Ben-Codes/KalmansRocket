import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class Falcon9S1 extends SpaceCraftBase {

	constructor(game, position) {

		let sprite = game.add.sprite(-9999, -9999, 'falcon9S1');
		sprite.anchor.setTo(.5, .5);

		//Width: 4.11 meters Height 47.812 meters
		super(game, position, sprite, 4.11, 47.812188, new vector2(0, 25.55));

		this.aeroDynamicProperties = "ExtendsFineness";
		this._leftFairing = null;
		this._rightFairing = null;
	}

	formDragCoefficient() {

		let baseCD = this.getBaseCd(0.4);
		let alpha = this.getAlpha();

		let isRetro = false;

		if (alpha > (Math.PI / 2) || alpha < -(Math.PI / 2)) {
			//LandingLegs

			//GridFins

			baseCD = this.getBaseCd(0.8);

			isRetro = true;
		}

		let dragCoefficient = Math.abs(baseCD * Math.cos(alpha));
		let dragPreservation = 1.0;

		if (isRetro) {

			if (this.throttle > 0 && this.machNumber > 1.5 && this.machNumber < 20) {
				let throttleFactor = throttle / 50;
				//TODO
				let cantFactor = 0.0;
				dragPreservation += throttleFactor * cantFactor;
				dragCoefficient *= dragPreservation;
			}

		}

		return Math.abs(dragCoefficient);
	}

	formLiftCoefficient() {
		let baseCD = this.getBaseCd(0.6);
		let alpha = this.getAlpha();

		return baseCD * Math.sin(alpha * 2.0);
	}

	exposedSurfaceArea() {

		return 2 * Math.PI * (this.width / 2) * this.height + crossSectionArea();
	}

	crossSectionArea() {
		return Math.PI * Math.pow(this.width / 2, 2);
	}

	liftingSurfaceArea() {
		return this.width * this.height;
	}



}

export default Falcon9S1;