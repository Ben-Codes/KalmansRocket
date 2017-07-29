import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';

class SpaceCraftBase {

	constructor(game, position, sprite, width, height, stageOffset, gravitationalParent, payloadMass, propellantMass) {


		this._sprite = sprite;

		this._game = game;

		this.position = position;
		this.velocity = vector2.zero();

		this.propellantMass = propellantMass;
		this.gravitationaParent = gravitationalParent;
		this.heatingRate = 0.0;

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

		this.throttle = 0;

		this._stageOffset = stageOffset;
		this.onGround = true;

		this.parent = null;
		this.children = [];

		this.aeroDynamicProperties = "None";
		this._groundInterations = 0;

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

	resetAccelerations() {
		this.accelerationG = vector2.zero();
		this.accelerationD = vector2.zero();
		this.accelerationN = vector2.zero();
		this.accelerationL = vector2.zero();
	}

	getRelativeAltitude() {
		if (this.gravitationaParent == null)
			return 0;

		let diffrence = this.position.clone();
		diffrence.subtract(this.gravitationaParent.position);

		return diffrence.length();
	}

	getRelativeVelocity() {

		if (this.gravitationaParent == null)
			return vector2.zero;

		let diffrence = this.velocity.clone();

		return diffrence.subtract(this.gravitationaParent.velocity);
	}

	getTotalHeight() {
		let totalHeight = this.height;

		for (let spacecraft of this.children) {
			totalHeight += spacecraft._getChildHeight();
		}

		return totalHeight;
	}

	_getChildHeight() {

		let totalHeight = 0;

		if (this.aeroDynamicProperties == "ExtendsFineness")
			totalHeight += this.height;

		for (let spacecraft of this.children) {
			spacecraft._getChildHeight();
		}

		return totalHeight;
	}

	stagingForce() {
		return this.mass * .02;
	}


	resolveGrav(earth) {

		///gravity

		if (this.parent != null)
			return;

		this.gravitationaParent = earth;

		let diff_position = earth.position.clone();
		diff_position.subtract(this.position);

		let r2 = diff_position.LengthSquared();
		let mass_dist_ratio = earth.mass() / r2;

		//to far
		if (mass_dist_ratio < 2500) {
			return
		}

		let GravitationConstant = 6.67384e-11;

		diff_position.normalize();

		mass_dist_ratio = mass_dist_ratio * GravitationConstant;
		diff_position.multiply(mass_dist_ratio);
		this.accelerationG.add(diff_position);

	}

	resolveAtmo(earth) {

		if (this.parent != null)
			return;

		this.gravitationaParent = earth;

		let diff_position = earth.position.clone();
		diff_position.subtract(this.position);

		let heightOffset = 0;
		if (this.children.length > 0)
			heightOffset = this.getTotalHeight() - this.height * .5;
		else
			heightOffset = this.height * .5;

		let distance = diff_position.length() - heightOffset;

		diff_position.normalize();
		let altitude = distance - earth.surfaceRadius();

		//In atmo?
		if (altitude < earth.atmosphereHeight()) {
			let surfaceNormal = new vector2(-diff_position.y, diff_position.x);

			// Distance of circumference at this altitude ( c= 2r * pi )
			let pathCircumference = 2 * Math.PI * distance;
			let rotationalSpeed = pathCircumference / earth.rotationPeriod();


			//TODO: Review and perhaps implement a beter version

			if (altitude <= 0.0001) {
				this._groundInterations = Math.min(this._groundInterations + 1, 10);

			} else {
				this._groundInterations = Math.max(this._groundInterations - 1, 0);
			}

			if (this._groundInterations > 5) {
				this.onGround = true;

				let normal = new vector2(-diff_position.x, -diff_position.y);

				let earthPosition = earth.position.clone();
				let circumferenceTerm = earth.surfaceRadius() + heightOffset;
				let normalMul = normal.clone();
				normalMul.multiply(circumferenceTerm);

				this.position = earthPosition.add(normalMul);

				this.pitch = normal.angle();

				this.accelerationN.x = -this.accelerationG.x;
				this.accelerationN.y = -this.accelerationG.y;

			} else {
				this.onGround = false;
			}

			let atmoDensity = earth.getAtmosphericDensity(altitude);

			let relativeVelocity = earth.velocity.clone();
			relativeVelocity.add(surfaceNormal);
			relativeVelocity.multiply(rotationalSpeed);


			let velocityMagnitude = relativeVelocity.LengthSquared();

			if (velocityMagnitude > 0) {

				//M*sec
				let speed = relativeVelocity.length();

				this.heatingRate = 1.83e-4 * Math.pow(speed, 3) * Math.sqrt(atmoDensity / (this.width * 0.5));
				
				let formDragCoefficient = this.totalFormDragCoefficient();
				let skinFrictionCoefficient = this.totalSkinFrictionCoefficient();
				let liftCoefficient = this.totalLiftCoefficient();

				let formDragTerm = formDragCoefficient * this.totalFormDragArea();
				let skinFrictionTerm = skinFrictionCoefficient * this.totalSkinFrictionArea();

				let dragTerm = formDragTerm;
				dragTerm += skinFrictionTerm;


				let liftTerm = liftCoefficient * this.totalLiftArea();

				relativeVelocity.normalize();

				let drag = relativeVelocity.clone();
				let dragVTerm = .5 * atmoDensity * velocityMagnitude * dragTerm;

				drag.multiply(dragVTerm);

				let lift = relativeVelocity.clone();
				let liftVTerm = .5 * atmoDensity * velocityMagnitude * liftTerm;

				lift.multiply(liftVTerm);
				drag.divide(this.mass())
				lift.divide(this.mass())

				this.accelerationD = drag;
				let accelerationLift = lift;

				let alpha = this.getAlpha();
				let halfPI = Math.PI / 2;
				let isRetro = alpha > halfPI || alpha < -halfPI;

				
				this.accelerationL.x += accelerationLift.y;
				this.accelerationL.y -= accelerationLift.x;

			}
		} else {
			this.heatingRate = 0;
		}

	}

	totalFormDragCoefficient() {
		let dragCoefficient = 0;

		if (this.aeroDynamicProperties == "ExposedToAirFlow" ||
			this.aeroDynamicProperties == "ExtendsFineness") {
			dragCoefficient = this.formDragCoefficient();
		}

		return this._getChildDragCoefficient(this.children, dragCoefficient);
	}

	_getChildDragCoefficient(children, dragCoefficient) {


		for (let child of children) {

			if (child.aeroDynamicProperties == "ExposedToAirFlow") {

				if (child.formDragCoefficient() > dragCoefficient)
					dragCoefficient = child.formDragCoefficient();

			} else if (child.aeroDynamicProperties = "ExtendsFineness") {

				dragCoefficient *= child.formDragCoefficient();

			} else if (child.aeroDynamicProperties = "ExtendsCrossSection") {

				dragCoefficient = (dragCoefficient + child.formDragCoefficient()) / 2;
			}

			dragCoefficient = this._getChildDragCoefficient(child.children, dragCoefficient);
		}


		return dragCoefficient;
	}


	totalFormDragArea() {
		let totalFormDragArea = 0;

		if (this.aeroDynamicProperties == "ExposedToAirFlow" ||
			this.aeroDynamicProperties == "ExtendsFineness") {
			totalFormDragArea = this.frontalArea();
		}

		return this._getChildDragCoefficient(this.children, totalFormDragArea);
	}

	_getChildFormDragArea(children, totalFormDragArea) {


		for (let child of children) {

			if (child.aeroDynamicProperties == "ExposedToAirFlow") {

				if (child.frontalArea() > totalFormDragArea)
					totalFormDragArea = child.frontalArea();

			} else if (child.aeroDynamicProperties = "ExtendsCrossSection") {

				totalFormDragArea *= child.frontalArea();

			}

			dragCoefficient = this._getChildFormDragArea(child.children, totalFormDragArea);
		}


		return totalFormDragArea;
	}



	skinFrictionCoefficient() {

		let velocity = this.getRelativeVelocity();
		//TODO: Remove
		if (velocity == null)
			return 0.0
		velocity = velocity.length();
		let altitude = this.getRelativeAltitude();
		let viscosity = this.gravitationaParent.getAtmosphericViscosity(altitude);
		let reynoldsNumber = (velocity * this.height) / viscosity;
		return .455 / Math.pow(Math.log10(reynoldsNumber), 2.58);
	}

	totalSkinFrictionCoefficient() {
		let skinFrictionCoefficient = 0;

		if (this.aeroDynamicProperties == "ExposedToAirFlow" ||
			this.aeroDynamicProperties == "ExtendsFineness" ||
			this.aeroDynamicProperties == "ExtendsCrossSection") {

			skinFrictionCoefficient = this.skinFrictionCoefficient();
		}

		for (let spacecraft of this.children) {
			skinFrictionCoefficient += spacecraft.totalSkinFrictionCoefficient();
		}

		return skinFrictionCoefficient;
	}

	totalSkinFrictionArea() {
		let totalSkinFrictionArea = 0;

		if (this.aeroDynamicProperties == "ExposedToAirFlow" ||
			this.aeroDynamicProperties == "ExtendsFineness" ||
			this.aeroDynamicProperties == "ExtendsCrossSection") {

			totalSkinFrictionArea = this.exposedSurfaceArea();
		}

		for (let spacecraft of this.children) {
			totalSkinFrictionArea += spacecraft.exposedSurfaceArea();
		}

		return totalSkinFrictionArea;
	}


	totalLiftCoefficient() {
		let liftCoefficient = 0;

		if (this.aeroDynamicProperties == "ExposedToAirFlow" ||
			this.aeroDynamicProperties == "ExtendsFineness" ||
			this.aeroDynamicProperties == "ExtendsCrossSection") {

			liftCoefficient = this.formLiftCoefficient();
		}

		return this._getMaxChildLiftCoefficient(this.children, liftCoefficient);
	}

	_getMaxChildLiftCoefficient(children, totalLiftCoefficient) {

		for (let child of children) {

			if (child.aeroDynamicProperties == "ExposedToAirFlow") {

				if (Math.abs(child.formLiftCoefficient()) > Math.abs(totalLiftCoefficient))
					totalLiftCoefficient = child.formLiftCoefficient();

			} else if (child.aeroDynamicProperties == "ExtendsFineness" ||
				child.aeroDynamicProperties == "ExtendsCrossSection") {
				totalLiftCoefficient += child.formLiftCoefficient();
			}


			totalLiftCoefficient = this._getMaxChildLiftCoefficient(child.children, totalLiftCoefficient);
		}

		return totalLiftCoefficient;
	}

	totalLiftArea() {
		let totalLiftArea = 0;

		if (this.aeroDynamicProperties == "ExposedToAirFlow" ||
			this.aeroDynamicProperties == "ExtendsFineness" ||
			this.aeroDynamicProperties == "ExtendsCrossSection") {

			totalLiftArea = this.liftingSurfaceArea();
		}

		return this._getChildLiftArea(this.children, totalLiftArea);
	}

	_getChildLiftArea(children, totalLiftArea) {

		for (let child of children) {

			if (child.aeroDynamicProperties == "ExposedToAirFlow") {

				if (child.liftingSurfaceArea() > totalLiftArea)
					totalLiftArea = child.liftingSurfaceArea();

			} else if (child.aeroDynamicProperties == "ExtendsFineness" ||
				child.aeroDynamicProperties == "ExtendsCrossSection") {
				totalLiftArea += child.liftingSurfaceArea();
			}

			totalLiftArea = this._getChildLiftArea(child.children, totalLiftArea);
		}

		return totalLiftArea;
	}

	getBaseCd(cd) {
		if (this.machNumber > 1.0) {
			let exp = Math.exp(0.3 / this.machNumber);
			return cd * 1.4 * exp;
		}

		return cd;
	}



	getAlpha() {

		let altitude = this.getRelativeAltitude();
		let pitch = this.pitch

		if (altitude > this.gravitationaParent.atmosphereHeight()) {

			return this.pitch - this.gravitationaParent.pitch;
		}

		let alpha = 0.0;
		if (altitude > .1) {

			let alpha = this.pitch - this.getRelativeVelocity().angle();

			while (alpha > Math.Pi) {
				alpha -= Math.Pi * 2;
			}

			while (alpha < -Math.Pi) {
				alpha += Math.Pi * 2;
			}
		}

		return alpha;
	}

	mass(){

		let childMass = 0;
		for (let child of this.children) {
			childMass += child.mass();
		}

		return childMass + this.dryMass() + this.propellantMass;
	}


}

export default SpaceCraftBase;