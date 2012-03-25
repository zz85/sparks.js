SPARKS.Target = function(target, callback) {
    this.target = target;
    this.callback = callback;
};

SPARKS.Extends( SPARKS.Target, SPARKS.Initializer);

SPARKS.Target.prototype.initialize = function( emitter, particle ) {

    if (this.callback) {
        particle.target = this.callback();
    } else {
        particle.target = this.target;
    }

};