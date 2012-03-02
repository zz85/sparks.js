/*
 * Sparks.js
 * https://github.com/zz85/sparks.js
 * simple, extensible javascript 3d particles system 
 * MIT licensed 
 * 
 * @author zz85 (http://github.com/zz85 http://www.lab4games.net/zz85/blog)
 */

var SPARKS = {};


/*
 * Constant Names for
 * Events called by emitter.dispatchEvent()
 * 
 */
SPARKS.EVENT_PARTICLE_CREATED = "created"
SPARKS.EVENT_PARTICLE_UPDATED = "updated"
SPARKS.EVENT_PARTICLE_DEAD = "dead";
SPARKS.EVENT_LOOP_UPDATED = "loopUpdated";