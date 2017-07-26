import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class Falcon9S2 extends SpaceCraftBase {

	constructor(game, position) {

		let sprite = game.add.sprite(-9999, -9999, 'falcon9S2');
		sprite.anchor.setTo(.5,.5);
		
		//Width: 3.706 meters Height 14.0018 meters
		super(game, position, sprite, 3.706, 14.0018, new vector2(0, 11.2));

		this.aeroDynamicProperties = "ExtendsFineness";

	}

}

export default Falcon9S2;