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
			this.computePhysics();
		}

		this.draw();
	}

	computePhysics() {

		for (let spacecraft of this._spacecraft) {

			spacecraft.update(0);
		}
	}

	draw() {

		this.game.debug.start(20, 20, 'blue');

		let craftPos = this._spacecraft[0].position
		this.game.debug.line('Spacecraft Position: X:' + craftPos.x + ' Y:' + craftPos.y);
		this.game.debug.line('Zoom: ' + this._zoom + ' D ' + this.game.scrollDelta);

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

		let payload = new BasePayload(this, position);

		let zero = new vector2(0, 0);

		let leftFairing = new Fairing(this, zero.clone(), true);
		let rightFairing = new Fairing(this, zero.clone(), false);

		payload.addChild(leftFairing);
		payload.addChild(rightFairing);
		leftFairing.setParent(payload);
		rightFairing.setParent(payload);

		let f9s2 = new Falcon9S2(this, zero.clone());
		let f9s1 = new Falcon9S1(this, zero.clone());

		payload.addChild(f9s2);
		f9s2.setParent(payload);

		f9s2.addChild(f9s1);
		f9s1.setParent(f9s2);

		return [payload, f9s2, f9s1, leftFairing, rightFairing];
	}

	startButtonClicked() {
		this._isStarted = false;
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

}

export default MainState;