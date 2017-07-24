import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';

class SpaceCraftBase {

	constructor(game, position, sprite, width, height, stageOffset) {


		this._sprite = sprite;

		this._game = game;

		this.position = position;
		this.velocity = new vector2(0, 0);

		this.roll = 0.0;
		this.yaw = 0.0;
		this.pitch = -Math.PI * 0.5;

		this.width = width;
		this.height = height;

		this._stageOffset = stageOffset;
		this.onGround = true;

		this.parent = null;
		this.children = [];

		this._renderUtils = new RenderUtils(this._game);

	}

	setParent(parent) {
		this.parent = parent;
	}

	addChild(child) {
		this.children.push(child);
	}

	update(deltaTime) {

		if (this.parent == null) {

			for (let spacecraft of this.children) {
				spacecraft.updateChildren(this.position, this.velocity);
			}
		}
	}

	updateChildren(parentPosition, velocity) {


		let rotationOffset = new vector2(
			Math.cos(this.pitch), Math.sin(this.pitch)
		);

		let newPosition = new vector2(
			this._stageOffset.x * rotationOffset.y + this._stageOffset.y * rotationOffset.x, -this._stageOffset.x * rotationOffset.x + this._stageOffset.y * rotationOffset.y
		);

		let pPosition = parentPosition.clone();

		pPosition.subtract(newPosition);
		this.position = pPosition;
		this.velocity.x = velocity.x;
		this.velocity.y = velocity.y;



		for (let spacecraft of this.children) {
					//debugger;
			spacecraft.updateChildren(this.position, this.velocity);
		}
	}

	render(cameraBounds) {

		if (this.position == null)
			debugger;

		//Todo: Check if ship is in viewport, save render time
		let boundingBox = this._renderUtils.computeBoundingBox(this.position, cameraBounds, this.width, this.height);

		//RenderBelow

		//RenderShip
		//debugger;
		this._sprite.position.x = boundingBox.x;
		this._sprite.position.y = boundingBox.y;

		this._sprite.rotation = this.pitch + Math.PI * 0.5;

		this._sprite.width = boundingBox.width;
		this._sprite.height = boundingBox.height;


		//RenderAbove

	}


}

export default SpaceCraftBase;