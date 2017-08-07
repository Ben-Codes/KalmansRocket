import rectangleD from 'objects/math/RectangleD';
import vector2 from 'objects/math/Vector2';
import particle from 'objects/core/Particle';
import RenderUtils from 'objects/core/RenderUtils';

class EngineExhaust {

	constructor(game) {

		this.particles = [];
		this._availableParticles = [];

		this._graphics = game.add.graphics(0, 0);


		for(let i = 0; i < 500; i++){
			let p = new particle();
			this.particles.push(p);
			this._availableParticles.push(p);
		}

		this._particleRate = .5; //100
		this._minSpread = 2;
		this._maxSpread = .1;
		this._maxAge = 10;
		this._currentMax = .1;
		this._angle = .05;

		this._renderUtil = new RenderUtils(game);
	}


	update(deltaTime, enginePosition, shipVelocity, rotation, throttle, ispMultiplier){
		
		let partToGenerate = (throttle * this._particleRate) * deltaTime;
		let retrograde = rotation + Math.PI  + this._angle; // 

		let spreadMultiplier = (1.0 - ispMultiplier) * this._minSpread + ispMultiplier * this._maxSpread;

		for(let i = 0; i < partToGenerate; i++){
	
			if(this._availableParticles.length > 0){

				let velocityFactor = Math.random() * (300 - 200) + 200;
				let spread = Math.random() - .5;

				let velocity = vector2.fromAngle(retrograde + spread * spreadMultiplier); 

				if(this._currentMax < this._maxAge)
					this._currentMax += .001;



				let p = this._availableParticles.pop();
				p.isActive = true;
				p.age = 0;

				if(Math.random() < .25){
					p.maxAge = .1;
					p.isFlame = true;
				} else{
					p.maxAge = Math.random() * .05 + this._currentMax;
					p.isFlame = false;
				}

				
				p.position = enginePosition.clone();
				
				velocity.multiply(velocityFactor);
				p.velocity = velocity;
			}
		}

		for(let p of this.particles){
			if(p.isActive){
				
				let velocity = p.velocity.clone();
				velocity.multiply(deltaTime);

				p.position.add(velocity);
				p.age += deltaTime;

				//if(p.velocity.y < 0)
					//debugger;

				if(p.age > p.maxAge){
					p.isActive = false;
					this._availableParticles.push(p);
				}
			}
		}

	}

	draw(cameraBounds){

		let particleScale = 4;

		//if(cameraBounds.width < 1000){
			//particleScale = 1.22e-6 * cameraBounds.width * cameraBounds.width - 4.8e-3 * cameraBounds.width + 4.4;
		//}

		let halfParticleScale = particleScale * 0.5;

		this._graphics.clear();

		this._graphics.beginFill(0x708c98);

		for(let p of this.particles){
			
			if(p.isActive){
				
				if(cameraBounds.contains(p.position)){

					if (p.isFlame){
						let rand = Math.random();
						 if (rand < .5){
							this._graphics.beginFill(0xea2300);
						} else if (rand < .7){
							this._graphics.beginFill(0xff8100);
						} else if (rand < .9){
							this._graphics.beginFill(0xf25500);
						}else{
							this._graphics.beginFill(0xd80000);
						}
						
					} else {
						this._graphics.beginFill(0x708c98);
					}

					let screencord = this._renderUtil.computeBoundingBox(p.position,cameraBounds);
					this._graphics.drawRect(screencord.x - halfParticleScale, screencord.y - halfParticleScale, particleScale, particleScale);
				}

			}

		}

		this._graphics.endFill();

	}
}

export default EngineExhaust;