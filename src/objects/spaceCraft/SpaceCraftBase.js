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
		let totalHeight = height;

		for (let spacecraft of this.children) {
			totalHeight += spacecraft._getChildHeight();
		}

		return totalHeight;
	}

	_getChildHeight() {

		let totalHeight = 0;

		if (this.aeroDynamicProperties == "ExtendsFineness")
			totalHeight += height;

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

		this._resolveAtmo(earth);
	}

	resolveAtmo(earth) {
		diff_position = earth.position.clone();
		diff_position.subtract(this.position);

		let heightOffset = 0;
		if (this.children.length > 0)
			heightOffset = getTotalHeight() - this.height * .5;
		else
			heightOffset = this.height * .5;

		let distance = diff_position.length() - heightOffset;

		diff_position.normalize();
		let altitude = distance - earth.SurfaceRadius;

		//In atmo?
		if (altitude < earth.atmosphereHeight()) {
			let surfaceNormal = new vector2(-diff_position.y, diff_position.x);

			// Distance of circumference at this altitude ( c= 2r * pi )
			let pathCircumference = 2 * Math.PI * distance;
			let rotationalSpeed = pathCircumference / earth.rotationPeriod();

			//TODO: Ground collision;

			let atmoDensity = earth.getAtmosphericDensity(altitude);

			let relativeVelocity = earth.velocity.clone();
			relativeVelocity.add(surfaceNormal);
			relativeVelocity.multiply(rotationalSpeed);

			let velocityMagnitude = relativeVelocity.LengthSquared();

			if (velocityMagnitude > 0) {

				//M*sec
				let speed = relativeVelocity.length();

				this.heatingRate = 1.83e-4 * Math.Pow(speed, 3) * Math.Sqrt(atmoDensity / (this.width * 0.5));

				let formDragCoefficient = this.totalFormDragCoefficient();
				let skinFrictionCoefficient = this.totalSkinFrictionCoefficient();
				let liftCoefficient = this.totalLiftCoefficient();

				let formDragTerm = formDragCoefficient * this.totalFormDragArea();
				let skinFrictionTerm = skinFrictionCoefficient * this.totalSkinFrictionArea();

				let dragTerm = formDragTerm;
				dragTerm += skinFrictionTerm;

				let liftTerm = liftCoefficient * totalLiftArea();

				relativeVelocity.normalize();

				let drag = relativeVelocity.clone();
				let dragVTerm = .5 * atmoDensity * velocityMagnitude * dragTerm;

				drag.multiply(dragVTerm);

				let lift = relativeVelocity.clone();
				let liftVTerm = .5 * atmoDensity * velocityMagnitude * dragTerm;

				lift.multiply(dragVTerm);



			}
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

		let velocity = this.getRelativeVelocity().length();
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

			liftCoefficient = this.exposedSurfaceArea();
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

		return _getMaxChildLiftCoefficient(this.children, liftCoefficient);
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

		return this._getChildLiftArea();
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

			totalLiftArea = this._getChildLiftArea(child.children, liftingSurfaceArea);
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

			return alpha;
		}

	}


}

export default SpaceCraftBase;