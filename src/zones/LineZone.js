SPARKS.LineZone = function(start, end) {
    this.start = start;
	this.end = end;
	this._length = end.clone().subSelf( start );
};

SPARKS.LineZone.prototype.getLocation = function() {
    var len = this._length.clone();

	len.multiplyScalar( Math.random() );
	return len.addSelf( this.start );
	
};