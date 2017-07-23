import Earth from 'objects/Earth';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';
import SimCamera from 'objects/core/Camera';

class MainState extends Phaser.State {

	preload() {
		this.load.spritesheet('startButton', 'assets/red_button13.png', 190, 49, 1);
	}

	create() {

		//Launch Button
		this._isStarted = false;

		this._startButton = this.add.button(this.world.centerX + 450, 550, 'startButton', this.startButtonClicked, this);
		this._startButton.anchor.x = 0.5;
		this._startButton.anchor.y = 0.5;
		this._startButton.input.useHandCursor = true;

		let text = this.add.text(this.world.centerX + 450, 550, "Launch", {
			fill: "#e9eecf"
		});
		text.anchor.setTo(0.5);

		text.font = 'Revalia';
		text.fontSize = 20;
		text.align = 'center';
		this._startText = text;

		//////////////////////
		//Zoom

		this.game.input.mouse.mouseWheelCallback = this.mouseWheel;
		this._zoom = 1;

		///////////////////////

		this._earth = new Earth(this);
		this._spacecraft = new SpaceCraftBase(this, this._earth);
		this._simCamera = new SimCamera(this, this._spacecraft, this._zoom);

	}

	update() {

		if (this._isStarted) {
			computePhysics();
		}

		this.draw();
	}

	computePhysics() {
		//TODO
	}

	draw() {
		this.game.debug.start(20, 20, 'blue');

		let craftPos = this._spacecraft.position

		this.game.debug.line('Spacecraft Position: X:' + craftPos.x + ' Y:' + craftPos.y);
		//this.game.debug.line('Zoom: ' + this._zoom + ' D ' + this.game.scrollDelta );

		let cameraBounds = this._simCamera.getBounds();
		this._earth.render(cameraBounds);

		this.game.debug.stop();

		///////////////////////////////////////

		if (this.game.scrollDelta > 0)
			this._zoom += this._zoom * this.game.scrollDelta;
		else if (this.game.scrollDelta < 0)
			this._zoom -= Math.abs(this._zoom * this.game.scrollDelta);

		this._zoom = this.math.clamp(this._zoom, .05, 1000000000000);

		this._simCamera.setZoom(this._zoom);
		this.game.scrollDelta = 0;
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