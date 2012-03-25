/* Set the max ammount of x,y,z drift movements in a second */
SPARKS.RandomDrift = function(x,y,z) {
	if (x instanceof THREE.Vector3) {
		this.drift = x;
		return;
	}

    this.drift = new THREE.Vector3(x,y,z);
};

SPARKS.Extends(SPARKS.RandomDrift, SPARKS.Action);

SPARKS.RandomDrift.prototype.update = function(emitter, particle, time) {
    var drift = this.drift;
    
    var v = particle.velocity;
    
    v.x += ( Math.random() - 0.5 ) * drift.x * time;
    v.y += ( Math.random() - 0.5 ) * drift.y * time;
    v.z += ( Math.random() - 0.5 ) * drift.z * time;

};