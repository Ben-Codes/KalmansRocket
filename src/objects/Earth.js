import vector2 from 'objects/math/Vector2';
import RenderUtils from 'objects/core/RenderUtils';

class Earth {

	constructor(game) {
		this._game = game;
		this.position = vector2.zero();
		this.velocity = vector2.zero();

		this._earthGraphics = game.add.graphics(0, 0);
		this._renderUtils = new RenderUtils(this._game);

		this.pitch = 0.0;

		//temp
		this.bmd = game.make.bitmapData(1200, 600);
		this.bmd.addToWorld();

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

	rotationPeriod() {
		return 86400;
	}

	// https://www.grc.nasa.gov/www/k-12/rocket/atmos.html
	getAtmosphericDensity(altitude) {
		if (altitude > this.atmosphereHeight()) return 0;

		let tempurature = .0;
		let pressure = .0;

		if (altitude > 25098.756) {

			tempurature = -205.05 + 0.0053805776 * altitude;
			pressure = 51.97 * Math.pow((tempurature + 459.7) / 389.98, -11.388);

		} else if (altitude > 11019.13) {

			tempurature = -70;
			pressure = 473.1 * Math.exp(1.73 - 0.00015748032 * altitude);

		} else {

			tempurature = 59 - 0.0116797904 * altitude;
			pressure = 2116 * Math.pow((tempurature + 459.7) / 518.6, 5.256);

		}

		let density = pressure / (1718 * (tempurature + 459.7));

		return density * 515.379;
	}

	//http://www.mhtl.uwaterloo.ca/old/onlinetools/airprop/airprop.html
	getAtmosphericViscosity(altitude) {
		if (altitude > this.atmosphereHeight()) return 0;

		if (altitude > 10668) return 0.0000089213;

		return -5.37e-10 * altitude + 1.458e-5;
	}

	getIspMultiplier(altitude) {

		let heightRatio = Math.max(altitude / this.atmosphereHeight(), 0);

		return 1.0 - Math.exp(-21.3921 * heightRatio);
	}

	render(cameraBounds) {

		let ellipse = this._renderUtils.computeEllipseSize(this.position, cameraBounds, this.surfaceRadius());
		let atmoEllipse = this._renderUtils.computeEllipseSize(this.position, cameraBounds, this.surfaceRadius() + this.atmosphereHeight());

		///Render the atmo
		//////////
		//let grd = this.bmd.context.createRadialGradient(ellipse.x, ellipse.y, ellipse.height - (ellipse.height * .0000938), ellipse.x, ellipse.y,
		//	atmoEllipse.height);
		//grd.addColorStop(0, '#009900');
		//grd.addColorStop(0.005, '#0182b7');
		//grd.addColorStop(0.4, '#4db6ff');
		//grd.addColorStop(1, '#000000');

		//this.bmd.cls();
		//this.bmd.circle(ellipse.x, ellipse.y, atmoEllipse.height, grd);


		//////
		//Render the surface
		//Get dimensions of ellipse base on window size

		this._earthGraphics.clear()
		this._earthGraphics.beginFill(0x009900);

		//Use arc when zoomed in since it has it renders the circle with better detail.
		if (ellipse.width > 600)
			this._earthGraphics.arc(ellipse.x, ellipse.y, ellipse.width, 0, -Math.PI * 2.0, true, 1000);
		else
			this._earthGraphics.drawEllipse(ellipse.x, ellipse.y, ellipse.width, ellipse.height);

		this._earthGraphics.endFill();


	}


}

export default Earth;