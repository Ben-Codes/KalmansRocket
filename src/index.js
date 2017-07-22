import MainState from 'states/MainState';

class Game extends Phaser.Game {

	constructor() {
		super(1200, 600, Phaser.AUTO, 'content', null);
		this.state.add('MainState', MainState, false);
		this.state.start('MainState');
	}

}

new Game();
