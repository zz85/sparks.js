/*
 * @author zz85 (http://github.com/zz85 http://www.lab4games.net/zz85/blog)
 *
 * a simple to use javascript 3d particles system inspired by FliNT and Stardust
 * created with TWEEN.js and THREE.js
 *
 * for feature requests or bugs, please visit https://github.com/zz85/sparks.js
 *
 * licensed under the MIT license 
 */

var SPARKS = {};

/********************************
* Emitter Class
*
*   Creates and Manages Particles
*********************************/


SPARKS.Emitter = function (counter) {
    
    this._counter = counter ? counter : new SPARKS.SteadyCounter(10); // provides number of particles to produce
    
    this._particles = [];
    
    
    this._initializers = []; // use for creation of particles
    this._actions = [];     // uses action to update particles
    this._activities = [];  //  not supported yet
        
    this._handlers = [];
    
    this.callbacks = {};
};


SPARKS.Emitter.prototype = {

    update: function(time) {
        var len = this._counter.updateEmitter( this, time );
        //console.log('len', len);

        
        // Create particles
        for( i = 0; i < len; i++ ) {
            this.createParticle();
        }
        
        // Update activities
        len = this._activities.length;
        for ( i = 0; i < len; i++ )
        {
            this_.activities[i].update( this, time );
        }
        
        
        len = this._actions.length;
        var action;
        var len2 = this._particles.length;
        
        for( j = 0; j < len; j++ )
        {
            action = this._actions[j];
            for ( i = 0; i < len2; ++i )
            {
                particle = this._particles[i];
                action.update( this, particle, time );
            }
        }
        
        
        // remove dead particles
        for ( i = len2; i--; )
        {
            particle = this._particles[i];
            if ( particle.isDead )
            {
                this._particles.splice( i, 1 );
                this.dispatchEvent("dead", particle);
                
            } else {
                this.dispatchEvent("updated", particle);
            }
        }
        
    },
    
    createParticle: function() {
        var particle = new SPARKS.Particle();
        // In future, use a Particle Factory
        var len = this._initializers.length, i;

        for ( i = 0; i < len; i++ ) {
            this._initializers[i].initialize( this, particle );
        }
        
        this._particles.push( particle );
        
        this.dispatchEvent("created", particle); // ParticleCreated
        
        return particle;
    },
    
    addInitializer: function (initializer) {
        this._initializers.push(initializer);
    },
    
    addAction: function (action) {
        this._actions.push(action);
    },
    
    addCallback: function(name, callback) {
        this.callbacks[name] = callback;
    },
    
    dispatchEvent: function(name, args) {
        var callback = this.callbacks[name];
        if (callback) {
            callback(args);
        }
    
    }
    

};


// Number of particles per seconds
SPARKS.SteadyCounter = function(rate) {
    this.rate = rate;
    
};

SPARKS.SteadyCounter.prototype.updateEmitter = function(emitter, time) {
    
    return Math.floor(time * this.rate);
};




/********************************
* Particle Class
*
*   Represents a single particle
*********************************/
SPARKS.Particle = function() {

    /**
     * The lifetime of the particle, in seconds.
     */
    this.lifetime = 0;
    
    /**
     * The age of the particle, in seconds.
     */
    this.age = 0;
    
    /**
     * The energy of the particle.
     */
    this.energy = 1;
    
    /**
     * Whether the particle is dead and should be removed from the stage.
     */
    this.isDead = false;
    
    this.target = null; // tag
    
    /**
     * For 3D
     */
     
     this.position = new THREE.Vector3( 0, 0, 0 );
     this.velocity = new THREE.Vector3( 0, 0, 0 );
     // rotation vec3
     // angVelocity vec3
     // faceAxis vec3
    
};


/********************************
* Action Classes
*
*   An abstract class which have
*   update function
*********************************/
SPARKS.Action = function() {
    this._priority = 0;
};


SPARKS.Age = function(easing) {
    this._easing = (easing == null) ? TWEEN.Easing.Linear.EaseNone : easing;
};

SPARKS.Age.prototype.update = function (emitter, particle, time) {
    particle.age += time;
    if( particle.age >= particle.lifetime )
    {
        particle.energy = 0;
        particle.isDead = true;
    }
    else
    {
        var t = this._easing(particle.age / particle.lifetime);
        particle.energy = -1 * t + 1;
    }
};

/*
// Mark particle as dead when particle's < 0

SPARKS.Death = function(easing) {
    this._easing = (easing == null) ? TWEEN.Linear.EaseNone : easing;
};

SPARKS.Death.prototype.update = function (emitter, particle, time) {
    if (particle.life <= 0) {
        particle.isDead = true;
    }
};
*/
			

SPARKS.Move = function() {
    
};

SPARKS.Move.prototype.update = function(emitter, particle, time) {
    
    var p = particle.position;
    var v = particle.velocity;
    
    p.x += v.x * time;
    p.y += v.y * time;
    p.z += v.z * time;

};


SPARKS.Accelerate = function(x,y,z) {
    // init to x,y,z = a
    y = y || x;
    z = z || y;
    this.acceleration = new THREE.Vector3(x,y,z);
    
    //this.acceleration = acceleration ? acceleration : new THREE.Vector3();
    // if number instead of array, 
};

SPARKS.Accelerate.prototype.update = function(emitter, particle, time) {
    var acc = this.acceleration;
    
    var v = particle.velocity;
    
    v.x += acc.x * time;
    v.y += acc.y * time;
    v.z += acc.z * time; 

};


/********************************
* Zone Classes
*
*   An abstract classes which have
*   getLocation() function
*********************************/
SPARKS.Zone = function() {
};

SPARKS.PointZone = function(pos) {
    this.pos = pos;
};

SPARKS.PointZone.prototype.getLocation = function() {
    return this.pos;
};

SPARKS.PointZone = function(pos) {
    this.pos = pos;
};

SPARKS.PointZone.prototype.getLocation = function() {
    return this.pos;
};

SPARKS.SphereCapZone = function(x, y, z, minr, maxr, angle) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.minr = minr;
    this.maxr = maxr;
    this.angle = angle;
};

SPARKS.SphereCapZone.prototype.getLocation = function() {
    var theta = Math.PI *2  * SPARKS.Utils.random();
    var r = SPARKS.Utils.random();
    
    //Vec3DPool
    var v =  new THREE.Vector3(r * Math.cos(theta), -1 / Math.tan(this.angle * SPARKS.Utils.DEGREE_TO_RADIAN), r * Math.sin(theta));
    
    //v.length = StardustMath.interpolate(0, _minRadius, 1, _maxRadius, Math.random());
            
    var i = this.minr - ((this.minr-this.maxr) *  Math.random() );
    v.multiplyScalar(i);
    
    return v;
};


/********************************
* Initializer Classes
*
*   Classes which initializes
*   particles. Implements initialize( emitter:Emitter, particle:Particle )
*********************************/

// Specifies random life between max and min
SPARKS.Lifetime = function(min, max) {
    this._min = min;
    
    this._max = max ? max : min;
    
};

SPARKS.Lifetime.prototype.initialize = function( emitter/*Emitter*/, particle/*Particle*/ ) {
    particle.lifetime = this._min + SPARKS.Utils.random() * ( this._max - this._min );
};


SPARKS.Position = function(zone) {
    this.zone = zone;
};

SPARKS.Position.prototype.initialize = function( emitter/*Emitter*/, particle/*Particle*/ ) {
    var pos = this.zone.getLocation();
    particle.position.set(pos.x, pos.y, pos.z);
};

SPARKS.Velocity = function(zone) {
    this.zone = zone;
};

SPARKS.Velocity.prototype.initialize = function( emitter/*Emitter*/, particle/*Particle*/ ) {
    var pos = this.zone.getLocation();
    particle.velocity.set(pos.x, pos.y, pos.z);
};

SPARKS.Target = function(target, callback) {
    this.target = target;
    this.callback = callback;
};

SPARKS.Target.prototype.initialize = function( emitter, particle) {

    if (this.callback) {
        particle.target = this.callback();
    } else {
        particle.target = this.target;
    }

};

/********************************
* Util Classes
*
*   Classes which initializes
*   particles. Implements initialize( emitter:Emitter, particle:Particle )
*********************************/
SPARKS.Utils = {
    random: function() {
        return Math.random();
    },
    DEGREE_TO_RADIAN: Math.PI / 180 
};
