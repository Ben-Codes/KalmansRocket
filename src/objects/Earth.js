import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';

class Earth {

	constructor(game) {
		this._game = game;
		this.position = new vector2(0,0);

		this._earthGraphics = game.add.graphics(0, 0);
		this._renderUtils = new RenderUtils(this._game);

		this.isDebugged = true;
	}

	mass() {
		return 5.97219e24;
	}

	surfaceRadius() {
		return 6.371e6;
	}

	atmosphereHeight() {
		return 1.5e5;
	}

	rotationRate() {
		return -7.2722052166e-5;
	}

	// https://www.grc.nasa.gov/www/k-12/rocket/atmos.html
	getAtmosphericDensity(altitude) {
		if (altitude > atmosphereHeight()) return 0;

		let tempurature = .0;
		let pressure = .0;

		if (altitude > 25098.756) {

			tempurature = -205.05 + 0.0053805776 * altitude;
			pressure = 51.97 * Math.Pow((tempurature + 459.7) / 389.98, -11.388);

		} else if (altitude > 11019.13) {

			tempurature = -70;
			pressure = 473.1 * Math.Exp(1.73 - 0.00015748032 * altitude);

		} else {

			tempurature = 59 - 0.0116797904 * altitude;
			pressure = 2116 * Math.Pow((tempurature + 459.7) / 518.6, 5.256);

		}

		let density = pressure / (1718 * (tempurature + 459.7));

		return density * 515.379;
	}

	//http://www.mhtl.uwaterloo.ca/old/onlinetools/airprop/airprop.html
	getAtmosphericViscosity(altitude) {
		if (altitude > atmosphereHeight()) return 0;

		if (altitude > 10668) return 0.0000089213;

		return -5.37e-10 * altitude + 1.458e-5;
	}

	render(cameraBounds){
		//Get dimensions of ellipse base on window size
		let ellipse = this._renderUtils.computeEllipseSize(this.position, cameraBounds, this.surfaceRadius());

		//debugger;
		this._earthGraphics.position.x = ellipse.x;
		this._earthGraphics.position.y = ellipse.y;
		//this._earthGraphics.moveTo(ellipse.x, ellipse.y);

		this._earthGraphics.beginFill(0x009900);
		this._earthGraphics.drawEllipse(ellipse.x, ellipse.y, ellipse.width, ellipse.height);
		
		this._earthGraphics.endFill();

	}


}

export default Earth;