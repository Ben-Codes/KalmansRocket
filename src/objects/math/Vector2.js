class Vector2 {

	constructor(x, y) {

		this.x = x;
		this.y = y;
	}

	reset() {
		this.x = 0;
		this.y = 0;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
	}

	subtract(v) {
		this.x -= v.x;
		this.y -= v.y;
	}

	multiply(scaler) {
		this.x *= scaler;
		this.y *= scaler;
	}

	divide(v) {
		
		if (typeof v === 'object') {
			this.x /= v.x;
			this.y /= v.y;

		} else {
			this.x /= v;
			this.y /= v;

		}
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	cross(v) {
		return this.x * v.y - this.y * v.x;
	}

	normalize() {

		let len = this.length();
		this.x /= len;
		this.y /= len;
	}

	LengthSquared() {
		return this.x * this.x + this.y * this.y;
	}

	angle() {
		return Math.atan2(this.y, this.x);
	}

	static zero() {
		return new Vector2(0, 0);
	}

}

export default Vector2;