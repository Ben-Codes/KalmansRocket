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

	multiply(v) {
		this.x *= v.x;
		this.y *= v.y;
	}

	divide(v) {
		this.x /= v.x;
		this.y /= v.y;
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	cross(v) {
		return this.x * v.y - this.y * v.x;
	}

	normalize() {

		let len = length();
		this.x /= len;
		this.y /= len;
	}

}

export default Vector2;