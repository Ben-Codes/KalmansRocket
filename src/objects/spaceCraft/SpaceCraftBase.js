import vector2 from 'objects/math/Vector2';

class SpaceCraftBase {

	constructor(game, earth) {

		this._game = game;
		this.earth = earth;
		this.position = new vector2(0, -earth.surfaceRadius());
		this.position.add(earth.position);
		this.velocity = new vector2(0, 0);

	}
}

export default SpaceCraftBase;