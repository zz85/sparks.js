/*
 * Base class for stuff which affects emitters
 */

SPARKS.EndActivity = function( callback ) {
	
	this.callback = callback;

};

SPARKS.Extends( SPARKS.EndActivity, SPARKS.Activity);

SPARKS.EndActivity.prototype.update = function(emitter, time) {

    if (emitter._particles.length == 0) {
    	// Action!
    	this.callback();
    	emitter.removeActivity(this);
    }

};