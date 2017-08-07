import vector2 from 'objects/math/Vector2';

class Particle {

	constructor() {
		
		this.isActive = false;
		this.position = vector2.zero();
		this.velocity = vector2.zero();

		this.age = 0;
		this.maxAge = 0;

		this.isFlame = false;
	}

}

export default Particle;