class rectangleD {

	constructor(x, y, width, height) {

		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.left = 0;
		this.right = 0;

		this.top = 0;
		this.bottom = 0;

		this._computeProperties();

	}


	_computeProperties() {
		this.left = this.x;
		this.right = this.x + this.width;

		this.top = this.y;
		this.bottom = this.y + this.height;
	}

	contains(rect) {
		return (rect.x > this.left && rect.x < this.right && rect.y > this.top && rect.y < this.bottom);
	}

	intersects(rect) {
		return (this.left < rect.right && this.right > rect.left && this.top < rect.bottom && this.bottom > rect.top);
	}

	clone() {
		return new rectangleD(this.x, this.y, this.width, this.height)
	}

}

export default rectangleD;