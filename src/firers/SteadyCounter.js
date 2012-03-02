/*
 * Steady Counter attempts to produces a particle rate steadily
 *
 */

// Number of particles per seconds
SPARKS.SteadyCounter = function(rate) {
    this.rate = rate;
    
	// we use a shortfall counter to make up for slow emitters 
	this.leftover = 0;
	
};

SPARKS.SteadyCounter.prototype.updateEmitter = function(emitter, time) {

	var targetRelease = time * this.rate + this.leftover;
	var actualRelease = Math.floor(targetRelease);
	
	this.leftover = targetRelease - actualRelease;
	
	return actualRelease;
};
