import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';

class Falcon9S1 extends SpaceCraftBase {

	constructor(game, position) {

		let sprite = game.add.sprite(-9999, -9999, 'falcon9S1');
		sprite.anchor.setTo(.5,.5);
		
		//Width: 4.11 meters Height 47.812 meters
		super(game, position, sprite, 4.11, 47.812188, new vector2(0, 25.55));

	}

}

export default Falcon9S1;