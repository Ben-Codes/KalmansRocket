import vector2 from 'objects/math/Vector2';
import EngineBase from 'objects/engines/EngineBase';

class Merlin1D extends EngineBase {

	constructor(parent, offset) {

		super(parent,offset);
	}

	static clone(){
		return new Merlin1D(this.parent,this.offset);
	}

	trust(ispMultiplier){
		return (845000 + 69000 * ispMultiplier) * this.throttle  * 0.01;
	}

	//ISP = F/m*g0
	massFlowRate(ispMultiplier){
		return (305.76 - 5.88 * ispMultiplier) * this.throttle * 0.01;
	}

}


export default Merlin1D;