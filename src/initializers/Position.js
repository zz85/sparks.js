SPARKS.Position = function(zone) {
    this.zone = zone;
};

SPARKS.Extends( SPARKS.Position, SPARKS.Initializer);

SPARKS.Position.prototype.initialize = function( emitter/*Emitter*/, particle/*Particle*/ ) {
    var pos = this.zone.getLocation();
    particle.position.set(pos.x, pos.y, pos.z);
};