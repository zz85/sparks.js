/*
 * SPARKS.ActionZone applies an action when particle is found in zone
 */
SPARKS.ActionZone = function(action, zone) {
	this.action = action;
    this.zone = zone;
};

SPARKS.Extends(SPARKS.ActionZone, SPARKS.Action);

SPARKS.ActionZone.prototype.update = function(emitter, particle, time) {

    if (this.zone.contains(particle.position)) {
		this.action.update( emitter, particle, time );
	}

};