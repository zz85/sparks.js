
/********************************
* Action Classes
*
*   An abstract class which have
*   update function
*********************************/
SPARKS.Action = function() {
    this._priority = 0;
};

SPARKS.Action.prototype.update = function(emitter, particle, time) {
    
	console.log('SPARKS.Action: update() not implemented.');

};