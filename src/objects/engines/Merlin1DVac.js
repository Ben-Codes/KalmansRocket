import vector2 from 'objects/math/Vector2';
import EngineBase from 'objects/engines/EngineBase';

class Merlin1DVac extends EngineBase {

	constructor(parent, offset) {

		super(parent,offset);
	}

	static clone(){
		return new Merlin1DVac(this.parent,this.offset);
	}

	trust(ispMultiplier){
		return (845000 + 89000 * ispMultiplier) * this.throttle  * 0.01;
	}

	//ISP = F/m*g0
	massFlowRate(ispMultiplier){
		return 273.86 * this.throttle * 0.01;
	}

}


export default Merlin1DVac;