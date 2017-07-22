import Earth from 'objects/Earth';
import SpaceCraftBase from 'objects/spaceCraft/SpaceCraftBase';
import SimCamera from 'objects/core/Camera';

class MainState extends Phaser.State {

	preload() {
		this.load.spritesheet('startButton', 'assets/red_button13.png', 190, 49, 1);
	}

	create() {
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

		this._earth = new Earth(this);
		this._spacecraft = new SpaceCraftBase(this, this._earth);
		this._simCamera = new SimCamera(this, this._spacecraft, 10);

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

		let cameraBounds = this._simCamera.getBounds();
		this._earth.render(cameraBounds);
	}

	startButtonClicked() {
		this._isStarted = false;
		this._startText.visible = false;
		this._startButton.visible = false;

	}

}

export default MainState;