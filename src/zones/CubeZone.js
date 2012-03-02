SPARKS.CubeZone = function(position, x, y, z) {
    this.position = position;
	this.x = x;
	this.y = y;
	this.z = z;
};

SPARKS.CubeZone.prototype.getLocation = function() {
    //TODO use pool?

	var location = this.position.clone();
	location.x += Math.random() * this.x;
	location.y += Math.random() * this.y;
	location.z += Math.random() * this.z;
	
	return location;
	
};


SPARKS.CubeZone.prototype.contains = function(position) {

	var startX = this.position.x;
	var startY = this.position.y;
	var startZ = this.position.z;
	var x = this.x; // width
	var y = this.y; // depth
	var z = this.z; // height
	
	if (x<0) {
		startX += x;
		x = Math.abs(x);
	}
	
	if (y<0) {
		startY += y;
		y = Math.abs(y);
	}
	
	if (z<0) {
		startZ += z;
		z = Math.abs(z);
	}
	
	var diffX = position.x - startX;
	var diffY = position.y - startY;
	var diffZ = position.z - startZ;
	
	if ( (diffX > 0) && (diffX < x) && 
			(diffY > 0) && (diffY < y) && 
			(diffZ > 0) && (diffZ < z) ) {
		return true;
	}
	
	return false;
	
};
