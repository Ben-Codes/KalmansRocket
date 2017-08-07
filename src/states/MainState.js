import Earth from 'objects/Earth';
import Falcon9S1 from 'objects/spaceCraft/Falcon9S1';
import Falcon9S2 from 'objects/spaceCraft/Falcon9S2';
import Fairing from 'objects/spaceCraft/Fairing';
import BasePayload from 'objects/spaceCraft/BasePayload';
import SimCamera from 'objects/core/Camera';
import vector2 from 'objects/math/Vector2';

class MainState extends Phaser.State {

	preload() {
		this.load.spritesheet('startButton', 'assets/red_button13.png', 190, 49, 1);
		//TODO: Find a way to move to object classes
		this.load.spritesheet('falcon9S1', 'assets/spacecraft/S1.png', 100, 1170, 1);
		this.load.spritesheet('falcon9S2', 'assets/spacecraft/S2.png', 90, 340, 1);
		this.load.spritesheet('BasePayload', 'assets/spacecraft/default.png', 200, 426, 1);
		this.load.spritesheet('fairingLeft', 'assets/spacecraft/fairingLeft.png', 62, 314, 1);
		this.load.spritesheet('fairingRight', 'assets/spacecraft/fairingRight.png', 62, 314, 1);

	}

	create() {

		//Launch Button
		this._isStarted = false;
		this._buttonGroup = this.game.add.group();

		this._startButton = this.add.button(this.world.centerX + 450, 550, 'startButton', this.startButtonClicked, this);
		this._startButton.anchor.setTo(.5, .5);
		this._startButton.input.useHandCursor = true;
		this._buttonGroup.add(this._startButton);

		let text = this.add.text(this.world.centerX + 450, 550, "Launch", {
			fill: "#e9eecf"
		});
		text.anchor.setTo(0.5);

		text.font = 'Revalia';
		text.fontSize = 20;
		text.align = 'center';
		this._startText = text;
		this._buttonGroup.add(text);

		this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		/////

		this.now = 0;
		this.timeElapsed = 0;
		this.hasLaunched = false;

		//////////////////////
		//Zoom

		this.game.input.mouse.mouseWheelCallback = this.mouseWheel;
		this._zoom = .15;

		///////////////////////

		this._earth = new Earth(this);
		this._spacecraft = this.createSpacecraft();
		this._simCamera = new SimCamera(this, this._spacecraft[0], this._zoom);

		this.computePhysics();

	}

	update() {

		if (this._isStarted) {
			this.tempController();
		}

		this.computePhysics();

		this.draw();
	}

	computePhysics() {

		for (let spacecraft of this._spacecraft) {
			spacecraft.resetAccelerations();
			spacecraft.resolveGrav(this._earth);
		}

		for (let spacecraft of this._spacecraft) {
			spacecraft.resolveAtmo(this._earth);
		}

		for (let spacecraft of this._spacecraft) {
			let secs = this.game.time.physicsElapsed;
			spacecraft.update(secs);
		}
	}

	draw() {

		this._simCamera.update();

		this.game.debug.start(20, 20, 'blue');

		let craftPos = this._spacecraft[2];


		this.game.debug.line('Thrust: ' + craftPos.thrust + ' Speed: ' + Math.floor(craftPos.velocity.length()) + ' Altitude: ' + Math.floor(this._spacecraft[0]._altitude * 3.28) + " ft");
		this.game.debug.line('Mass: ' + Math.floor(craftPos.mass()) + ' PropellantMass: ' + Math.floor(craftPos.propellantMass));
		this.game.debug.line('Pitch: ' + this._spacecraft[0].pitch);
		if (this.now) {
			this.timeElapsed = Math.floor(this.game.time.elapsedSecondsSince(this.now));
			this.game.debug.line('Elapsed Time: ' + this.timeElapsed);
		}


		if (this.leftKey.isDown) {
			this.game.debug.line('Left Key Down');
		} else if (this.rightKey.isDown) {
			this.game.debug.line('Right Key Down');
		}
		if (this.leftKey.isDown) {
			this._spacecraft[0].offsetPitch(-.01);
		} else if (this.rightKey.isDown) {
			this._spacecraft[0].offsetPitch(.01);
		}


		let cameraBounds = this._simCamera.getBounds();
		this._earth.render(cameraBounds);
		for (let spacecraft of this._spacecraft) {
			spacecraft.render(cameraBounds);
		}

		this.game.debug.stop();

		///////////////////////////////////////

		if (this.game.scrollDelta > 0)
			this._zoom += this._zoom * this.game.scrollDelta;
		else if (this.game.scrollDelta < 0)
			this._zoom -= Math.abs(this._zoom * this.game.scrollDelta);

		this._zoom = this.math.clamp(this._zoom, .05, 1000000000000);

		this._simCamera.setZoom(this._zoom);
		this.game.scrollDelta = 0;

		/////

		this.game.world.bringToTop(this._buttonGroup);

	}

	createSpacecraft() {
		let position = new vector2(0, -this._earth.surfaceRadius());
		position.add(this._earth.position);

		let payload = new BasePayload(this, position, this._earth, 3136);

		let zero = new vector2(0, 0);

		let leftFairing = new Fairing(this, zero.clone(), true, this._earth);
		let rightFairing = new Fairing(this, zero.clone(), false, this._earth);

		payload.addFairings(leftFairing, rightFairing);


		let f9s2 = new Falcon9S2(this, zero.clone(), this._earth);
		let f9s1 = new Falcon9S1(this, zero.clone(), this._earth);

		payload.addChild(f9s2);
		f9s2.setParent(payload);

		f9s2.addChild(f9s1);
		f9s1.setParent(f9s2);

		return [payload, f9s2, f9s1, leftFairing, rightFairing];
	}

	startButtonClicked() {

		this._isStarted = true;
		this._startText.visible = false;
		this._startButton.visible = false;
	}

	mouseWheel(event) {

		if (this.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
			this.scrollDelta -= .5
		} else {
			this.scrollDelta += 1.5
		}
	}

	tempController() {

		this.turn1 = false;
		this.turn2 = false;

		if (this._isStarted) {

			this.now = this.game.time.time;
			this.hasLaunched = true;
			this._spacecraft[2].tempLaunch();
			this._isStarted = false;
		}





	}

}

export default MainState;