import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class Falcon9S2 extends SpaceCraftBase {

	constructor(game, position, gravitationalParent) {

		let sprite = game.add.sprite(-9999, -9999, 'falcon9S2');
		sprite.anchor.setTo(.5, .5);

		//Width: 3.706 meters Height 14.0018 meters
		super(game, position, sprite, 3.706, 14.0018, new vector2(0, 11.2), gravitationalParent, 0, 103500);

		this.aeroDynamicProperties = "ExtendsFineness";

	}

	formDragCoefficient() {
		let baseCD = this.getBaseCd(0.5);
		let alpha = this.getAlpha();

		return Math.abs(baseCD * Math.cos(alpha));
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

	dryMass() {
		return 4000;
	}

}

export default Falcon9S2;