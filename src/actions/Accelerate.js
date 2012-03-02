/*
 * Accelerate action affects velocity in specified 3d direction 
 */
SPARKS.Accelerate = function(x,y,z) {
	
	if (x instanceof THREE.Vector3) {
		this.acceleration = x;
		return;
	}

    this.acceleration = new THREE.Vector3(x,y,z);
    
};

SPARKS.Accelerate.prototype.update = function(emitter, particle, time) {
    var acc = this.acceleration;
    
    var v = particle.velocity;
    
	particle._oldvelocity.set(v.x, v.y, v.z);
	
    v.x += acc.x * time;
    v.y += acc.y * time;
    v.z += acc.z * time; 

};