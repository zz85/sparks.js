SPARKS.Move = function() {
    
};

SPARKS.Extends(SPARKS.Move, SPARKS.Action);

SPARKS.Move.prototype.update = function(emitter, particle, time) {
    // attempt verlet velocity updating.
    var p = particle.position;
	var v = particle.velocity;
    var old = particle._oldvelocity;
	
	if (this._velocityVerlet) {	
		p.x += (v.x + old.x) * 0.5 * time;
		p.y += (v.y + old.y) * 0.5 * time;
		p.z += (v.z + old.z) * 0.5 * time;
	} else {
		p.x += v.x * time;
		p.y += v.y * time;
		p.z += v.z * time;
	}

    //  OldVel = Vel;
    // Vel = Vel + Accel * dt;
    // Pos = Pos + (vel + Vel + Accel * dt) * 0.5 * dt;
	


};