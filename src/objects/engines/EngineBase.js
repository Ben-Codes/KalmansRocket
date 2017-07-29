import vector2 from 'objects/math/Vector2';

class EngineBase  {

	constructor(parent, offset) {

		this.parent = parent;
		this.offset = offset;
		this._offsetLength = offset.length();
		this._offsetRotation = offset.angle() - Math.PI / 2.0;

		this.isActive = false;
		this.throttle = 0.0;

		this.cant = 0.0;
	}


	update(deltaTime, ispMultiplier) {
		
		//TODO: Future Flame Calculations
		//let rotation = this.parent.pitch - this._offsetRotation;
		//let offset = new vector2(Math.cos(rotation), Math.sin(rotation));
		//offset.multiply(this._offsetRotation);

		//let throttle = 

	}

	startup() {
		this.isActive = true;
	}

	shutdown(){
		this.adjustThrottle(0);
		this.isActive = false;
	}

	adjustThrottle(throttle){
		this.throttle = throttle;
	}

	adjustCant(angle){
		this.cant = angle;
	}

	thrust(ispMultiplier){
		return 0.0;
	}

	massFlowRate(ispMultiplier){
		return 0.0;
	}

}


export default EngineBase;