/*
 * Sparks.js
 * https://github.com/zz85/sparks.js
 * simple, extensible javascript 3d particles system 
 * MIT licensed 
 * 
 * @author zz85 (http://github.com/zz85 http://www.lab4games.net/zz85/blog)
 */var SPARKS = {};

SPARKS.EVENT_PARTICLE_CREATED = "created", SPARKS.EVENT_PARTICLE_UPDATED = "updated", SPARKS.EVENT_PARTICLE_DEAD = "dead", SPARKS.EVENT_LOOP_UPDATED = "loopUpdated", SPARKS.Emitter = function(a) {
    this._counter = a ? a : new SPARKS.SteadyCounter(10), this._particles = [], this._initializers = [], this._actions = [], this._activities = [], this._handlers = [], this.callbacks = {};
}, SPARKS.Emitter.prototype = {
    _TIMESTEP: 15,
    _timer: null,
    _lastTime: null,
    _timerStep: 10,
    _velocityVerlet: !1,
    _isRunning: !1,
    start: function() {
        this._lastTime = Date.now(), this._timer = setTimeout(this.step, this._timerStep, this), this._isRunning = !0;
    },
    stop: function() {
        this._isRunning = !1, clearTimeout(this._timer);
    },
    isRunning: function() {
        return this._isRunning;
    },
    step: function(a) {
        var b = Date.now(), c = b - a._lastTime;
        if (!this._velocityVerlet) {
            var d = a._TIMESTEP * 20;
            c >= d && (c = d);
            while (c >= a._TIMESTEP) a.update(a._TIMESTEP / 1e3), c -= a._TIMESTEP;
            a._lastTime = b - c;
        } else a.update(c / 1e3), a._lastTime = b;
        a._isRunning && setTimeout(a.step, a._timerStep, a);
    },
    update: function(a) {
        var b = this._counter.updateEmitter(this, a);
        for (i = 0; i < b; i++) this.createParticle();
        b = this._activities.length;
        for (i = 0; i < b; i++) this._activities[i].update(this, a);
        b = this._actions.length;
        var c, d = this._particles.length;
        for (j = 0; j < b; j++) {
            c = this._actions[j];
            for (i = 0; i < d; ++i) particle = this._particles[i], c.update(this, particle, a);
        }
        for (i = d; i--; ) particle = this._particles[i], particle.isDead ? (this._particles.splice(i, 1), this.dispatchEvent("dead", particle), SPARKS.VectorPool.release(particle.position), SPARKS.VectorPool.release(particle.velocity)) : this.dispatchEvent("updated", particle);
        this.dispatchEvent("loopUpdated");
    },
    createParticle: function() {
        var a = new SPARKS.Particle, b = this._initializers.length, c;
        for (c = 0; c < b; c++) this._initializers[c].initialize(this, a);
        return this._particles.push(a), this.dispatchEvent("created", a), a;
    },
    addInitializer: function(a) {
        this._initializers.push(a);
    },
    addAction: function(a) {
        this._actions.push(a);
    },
    removeInitializer: function(a) {
        var b = this._initializers.indexOf(a);
        b > -1 && this._initializers.splice(b, 1);
    },
    removeAction: function(a) {
        var b = this._actions.indexOf(a);
        b > -1 && this._actions.splice(b, 1);
    },
    addCallback: function(a, b) {
        this.callbacks[a] = b;
    },
    removeCallback: function(a) {
        delete this.callbacks[a];
    },
    dispatchEvent: function(a, b) {
        var c = this.callbacks[a];
        c && c(b);
    }
}, SPARKS.Engine = {
    _TIMESTEP: 15,
    _timer: null,
    _lastTime: null,
    _timerStep: 10,
    _velocityVerlet: !1,
    _emitters: [],
    _isRunning: !1,
    add: function(a) {
        this._emitters.push(a);
    },
    start: function() {
        this._lastTime = Date.now(), this._timer = setTimeout(this.step, this._timerStep, this);
        for (var a = 0, b = this._emitters.length; a < b; a++) this._emitters[a]._isRunning = !0;
        this._isRunning = !0;
    },
    stop: function() {
        this._isRunning = !1;
        for (var a = 0, b = _emitters.length; a < b; a++) _emitters[a]._isRunning = !1;
        clearTimeout(this._timer);
    },
    isRunning: function() {
        return this._isRunning;
    },
    step: function(a) {
        var b = Date.now(), c = b - a._lastTime;
        if (!this._velocityVerlet) {
            var d = a._TIMESTEP * 20;
            c >= d && (c = d);
            while (c >= a._TIMESTEP) a.update(a._TIMESTEP / 1e3), c -= a._TIMESTEP;
            a._lastTime = b - c;
        } else a.update(c / 1e3), a._lastTime = b;
        setTimeout(a.step, a._timerStep, a);
    },
    update: function(a) {
        for (var b = 0, c = this._emitters.length; b < c; b++) this._emitters[b].update(a);
    }
}, SPARKS.Particle = function() {
    this.lifetime = 0, this.age = 0, this.energy = 1, this.isDead = !1, this.target = null, this.position = SPARKS.VectorPool.get().set(0, 0, 0), this.velocity = SPARKS.VectorPool.get().set(0, 0, 0), this._oldvelocity = SPARKS.VectorPool.get().set(0, 0, 0);
}, SPARKS.Accelerate = function(a, b, c) {
    if (a instanceof THREE.Vector3) {
        this.acceleration = a;
        return;
    }
    this.acceleration = new THREE.Vector3(a, b, c);
}, SPARKS.Accelerate.prototype.update = function(a, b, c) {
    var d = this.acceleration, e = b.velocity;
    b._oldvelocity.set(e.x, e.y, e.z), e.x += d.x * c, e.y += d.y * c, e.z += d.z * c;
}, SPARKS.Action = function() {
    this._priority = 0;
}, SPARKS.ActionZone = function(a, b) {
    this.action = a, this.zone = b;
}, SPARKS.ActionZone.prototype.update = function(a, b, c) {
    this.zone.contains(b.position) && this.action.update(a, b, c);
}, SPARKS.Age = function(a) {
    this._easing = a == null ? TWEEN.Easing.Linear.EaseNone : a;
}, SPARKS.Age.prototype.update = function(a, b, c) {
    b.age += c;
    if (b.age >= b.lifetime) b.energy = 0, b.isDead = !0; else {
        var d = this._easing(b.age / b.lifetime);
        b.energy = -1 * d + 1;
    }
}, SPARKS.DeathZone = function(a) {
    this.zone = a;
}, SPARKS.DeathZone.prototype.update = function(a, b, c) {
    this.zone.contains(b.position) && (b.isDead = !0);
}, SPARKS.Move = function() {}, SPARKS.Move.prototype.update = function(a, b, c) {
    var d = b.position, e = b.velocity, f = b._oldvelocity;
    this._velocityVerlet ? (d.x += (e.x + f.x) * .5 * c, d.y += (e.y + f.y) * .5 * c, d.z += (e.z + f.z) * .5 * c) : (d.x += e.x * c, d.y += e.y * c, d.z += e.z * c);
}, SPARKS.RandomDrift = function(a, b, c) {
    if (a instanceof THREE.Vector3) {
        this.drift = a;
        return;
    }
    this.drift = new THREE.Vector3(a, b, c);
}, SPARKS.RandomDrift.prototype.update = function(a, b, c) {
    var d = this.drift, e = b.velocity;
    e.x += (Math.random() - .5) * d.x * c, e.y += (Math.random() - .5) * d.y * c, e.z += (Math.random() - .5) * d.z * c;
}, SPARKS.ShotCounter = function(a) {
    this.particles = a, this.used = !1;
}, SPARKS.ShotCounter.prototype.updateEmitter = function(a, b) {
    return this.used ? 0 : (this.used = !0, this.particles);
}, SPARKS.SteadyCounter = function(a) {
    this.rate = a, this.leftover = 0;
}, SPARKS.SteadyCounter.prototype.updateEmitter = function(a, b) {
    var c = b * this.rate + this.leftover, d = Math.floor(c);
    return this.leftover = c - d, d;
}, SPARKS.Lifetime = function(a, b) {
    this._min = a, this._max = b ? b : a;
}, SPARKS.Lifetime.prototype.initialize = function(a, b) {
    b.lifetime = this._min + SPARKS.Utils.random() * (this._max - this._min);
}, SPARKS.Position = function(a) {
    this.zone = a;
}, SPARKS.Position.prototype.initialize = function(a, b) {
    var c = this.zone.getLocation();
    b.position.set(c.x, c.y, c.z);
}, SPARKS.Target = function(a, b) {
    this.target = a, this.callback = b;
}, SPARKS.Target.prototype.initialize = function(a, b) {
    this.callback ? b.target = this.callback() : b.target = this.target;
}, SPARKS.Velocity = function(a) {
    this.zone = a;
}, SPARKS.Velocity.prototype.initialize = function(a, b) {
    var c = this.zone.getLocation();
    b.velocity.set(c.x, c.y, c.z), c.__markedForReleased && (SPARKS.VectorPool.release(c), c.__markedForReleased = !1);
}, SPARKS.AccelerateFactor = function(a) {
    this.factor = a;
}, SPARKS.AccelerateFactor.prototype.update = function(a, b, c) {
    var d = this.factor, e = b.velocity, f = e.length(), g;
    f > 0 && (g = d * c / f, g += 1, e.multiplyScalar(g));
}, SPARKS.AccelerateVelocity = function(a) {
    this.factor = a;
}, SPARKS.AccelerateVelocity.prototype.update = function(a, b, c) {
    var d = this.factor, e = b.velocity;
    e.z += -e.x * d, e.y += e.z * d, e.x += e.y * d;
}, SPARKS.SphereCapZone = function(a, b, c, d, e, f) {
    this.x = a, this.y = b, this.z = c, this.minr = d, this.maxr = e, this.angle = f;
}, SPARKS.SphereCapZone.prototype.getLocation = function() {
    var a = Math.PI * 2 * SPARKS.Utils.random(), b = SPARKS.Utils.random(), c = SPARKS.VectorPool.get().set(b * Math.cos(a), -1 / Math.tan(this.angle * SPARKS.Utils.DEGREE_TO_RADIAN), b * Math.sin(a)), d = this.minr - (this.minr - this.maxr) * Math.random();
    return c.multiplyScalar(d), c.__markedForReleased = !0, c;
}, SPARKS.Utils = {
    random: function() {
        return Math.random();
    },
    DEGREE_TO_RADIAN: Math.PI / 180,
    TWOPI: Math.PI * 2,
    getPerpendiculars: function(a) {
        var b = this.getPerpendicular(a), c = a.cross(b);
        return c.normalize(), [ b, c ];
    },
    getPerpendicular: function(a) {
        if (a.x == 0) return new THREE.Vector3D(1, 0, 0);
        var b = new THREE.Vector3(a.y, -a.x, 0);
        return b.normalize();
    }
}, SPARKS.VectorPool = {
    __pools: [],
    get: function() {
        return this.__pools.length > 0 ? this.__pools.pop() : this._addToPool();
    },
    release: function(a) {
        this.__pools.push(a);
    },
    _addToPool: function() {
        for (var a = 0, b = 100; a < b; a++) this.__pools.push(new THREE.Vector3);
        return new THREE.Vector3;
    }
}, SPARKS.CubeZone = function(a, b, c, d) {
    this.position = a, this.x = b, this.y = c, this.z = d;
}, SPARKS.CubeZone.prototype.getLocation = function() {
    var a = this.position.clone();
    return a.x += Math.random() * this.x, a.y += Math.random() * this.y, a.z += Math.random() * this.z, a;
}, SPARKS.CubeZone.prototype.contains = function(a) {
    var b = this.position.x, c = this.position.y, d = this.position.z, e = this.x, f = this.y, g = this.z;
    e < 0 && (b += e, e = Math.abs(e)), f < 0 && (c += f, f = Math.abs(f)), g < 0 && (d += g, g = Math.abs(g));
    var h = a.x - b, i = a.y - c, j = a.z - d;
    return h > 0 && h < e && i > 0 && i < f && j > 0 && j < g ? !0 : !1;
}, SPARKS.LineZone = function(a, b) {
    this.start = a, this.end = b, this._length = b.clone().subSelf(a);
}, SPARKS.LineZone.prototype.getLocation = function() {
    var a = this._length.clone();
    return a.multiplyScalar(Math.random()), a.addSelf(this.start);
}, SPARKS.ParallelogramZone = function(a, b, c) {
    this.corner = a, this.side1 = b, this.side2 = c;
}, SPARKS.ParallelogramZone.prototype.getLocation = function() {
    var a = this.side1.clone().multiplyScalar(Math.random()), b = this.side2.clone().multiplyScalar(Math.random());
    return a.addSelf(b), a.addSelf(this.corner);
}, SPARKS.PointZone = function(a) {
    this.pos = a;
}, SPARKS.PointZone.prototype.getLocation = function() {
    return this.pos;
}, SPARKS.Zone = function() {};