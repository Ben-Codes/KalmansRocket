import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';

class SpaceCraftBase {

	constructor(game, position, sprite, width, height, stageOffset) {


		this._sprite = sprite;

		this._game = game;

		this.position = position;
		this.velocity = vector2.zero();

		this.mass = 0;
		this.gravitationaParent = null;

		this.accelerationG = vector2.zero();
		this.accelerationD = vector2.zero();
		this.accelerationN = vector2.zero();
		this.accelerationL = vector2.zero();

		this.machNumber = 0.0;

		this.apogee = 0.0;
		this.perigee = 0.0;

		this.roll = 0.0;
		this.yaw = 0.0;
		this.pitch = -Math.PI * 0.5;       

		this.width = width;
		this.height = height;

		this._stageOffset = stageOffset;
		this.onGround = true;

		this.parent = null;
		this.children = [];

		this.aeroDynamicProperties = "None";

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

	resetAccelerations(){
		this.accelerationG = vector2.zero();
		this.accelerationD = vector2.zero();
		this.accelerationN = vector2.zero();
		this.accelerationL = vector2.zero();
	}

	getRelativeAltitude(){
		if(this.gravitationaParent == null)
			return 0;

		let diffrence = this.position.clone();
		diffrence.subtract(this.gravitationaParent.position);

		return diffrence.length();
	}

	getRelativeVelocity(){
		if(this.gravitationaParent == null)
			return vector2.zero;

		let diffrence = this.velocity.clone();
		return diffrence.subtract(this.gravitationaParent.velocity);
	}

	getTotalHeight(){
		let totalHeight = height;

		for (let spacecraft of this.children) {
			totalHeight += spacecraft._getChildHeight();
		}

		return totalHeight;
	}

	_getChildHeight(){

		let totalHeight = 0;

		if(this.aeroDynamicProperties == "ExtendsFineness")
			totalHeight += height;

		for (let spacecraft of this.children) {
			spacecraft._getChildHeight();
		}

		return totalHeight;
	}


	resolveGrav(earth){

		///gravity

		if (this.parent != null)
			return;

		this.gravitationaParent = earth;

		let diff_position = earth.position.clone();
		diff_position.subtract(this.position);

		let r2 = diff_position.LengthSquared();
		let mass_dist_ratio = earth.mass() / r2;

		//to far
		if(mass_dist_ratio < 2500){
			return
		}

		let GravitationConstant = 6.67384e-11;

		diff_position.normalize();

		mass_dist_ratio = mass_dist_ratio * GravitationConstant;
		diff_position.multiply(mass_dist_ratio);
		this.accelerationG.add(diff_position);

		this._resolveAtmo(earth);
	}

	resolveAtmo(earth){
		diff_position = earth.position.clone();
		diff_position.subtract(this.position);

		let heightOffset = 0;
		if(this.children.length > 0)
			heightOffset = getTotalHeight() - this.height *.5;
		else
			heightOffset = this.height *.5;

		let distance = diff_position.length() - heightOffset;

		diff_position.normalize();
		let altitude = distance - earth.SurfaceRadius;

		//In atmo?
		if(altitude < earth.atmosphereHeight()){
			let surfaceNormal = new vector2(-diff_position.y, diff_position.x);

			// Distance of circumference at this altitude ( c= 2r * pi )
			let pathCircumference = 2*Math.PI * distance;
			let rotationalSpeed = pathCircumference / earth.rotationPeriod();

			//TODO: Ground collision;

			let atmoDensity = earth.getAtmosphericDensity(altitude);

			let relativeVelocity = earth.velocity.clone();
			relativeVelocity.add(surfaceNormal);
			relativeVelocity.multiply(rotationalSpeed);

			let velocityMagnitude = relativeVelocity.LengthSquared();

			if(velocityMagnitude > 0){

				//M*sec
				let speed = relativeVelocity.length();

				let HeatingRate = 1.83e-4 * Math.Pow(speed, 3) * Math.Sqrt(atmoDensity / (this.width * 0.5));

				//totalFormDragCoefficient();
                //totalSkinFrictionCoefficient();
				//totalLiftCoefficient();


			}
		}

	}

	getBaseCd(cd){
		if(this.machNumber > 1.0){
			let exp = Math.exp(0.3 / this.machNumber);
			return cd * 1.4 * exp;
		}

		return cd;
	}

	getSkinFrictionCoefficient(){
		let velocity = getRelativeAltitude()
	}


}

export default SpaceCraftBase;