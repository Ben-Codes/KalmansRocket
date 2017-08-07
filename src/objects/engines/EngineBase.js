import vector2 from 'objects/math/Vector2';
import EngineExhaust from 'objects/engines/EngineExhaust';

class EngineBase  {

	constructor(parent, offset) {

		this.parent = parent;
		this.offset = offset;
		this._offsetLength = offset.length();
		this._offsetRotation = offset.angle() - Math.PI / 2.0;

		this.isActive = false;
		this.throttle = 0.0;

		this.cant = 0.0;

		this._engineExhaust = new EngineExhaust(this.parent._game.game);
	}


	update(deltaTime, ispMultiplier) {
		
		
		if(this._engineExhaust == null)
			return;
		let rotation = this.parent.pitch - this._offsetRotation;
		let offset = new vector2(Math.cos(rotation), Math.sin(rotation));
		offset.multiply(this._offsetLength);

		let throttle = 0;
		if(this.isActive && this.parent.propellantMass > 0)
			throttle = this.throttle;

		let position = this.parent.position.clone();
		position.subtract(offset);

		this._engineExhaust.update(deltaTime, position, this.parent.velocity, this.parent.pitch, throttle, ispMultiplier);
	}

	draw(cameraBounds){

		this._engineExhaust.draw(cameraBounds);
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