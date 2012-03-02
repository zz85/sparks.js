// Manages and runs multiple emitters

SPARKS.Engine = {
	// Combined Singleton Engine;
	_TIMESTEP: 15,
	_timer: null,
	_lastTime: null,
	_timerStep: 10,
	_velocityVerlet: false,
	_emitters: [],
	_isRunning: false,
	
	add: function(emitter) {
		this._emitters.push(emitter);
	},
	// run its built in timer / stepping
	start: function() {
		this._lastTime = Date.now();
		this._timer = setTimeout(this.step, this._timerStep, this);
		
		for (var i=0,il=this._emitters.length;i<il;i++) {
			this._emitters[i]._isRunning = true;
		}
		
		this._isRunning = true;
	},
	
	stop: function() {
		this._isRunning = false;
		for (var i=0,il=_emitters.length;i<il;i++) {
			_emitters[i]._isRunning = false;
		}
		clearTimeout(this._timer);
	},
	
	isRunning: function() {
		return this._isRunning;
	},
	
	// Step gets called upon by the engine
	// but attempts to call update() on a regular basics
	step: function(me) {
		
		var time = Date.now();
		var elapsed = time - me._lastTime;
	   	
		if (!this._velocityVerlet) {
			// if elapsed is way higher than time step, (usually after switching tabs, or excution cached in ff)
			// we will drop cycles. perhaps set to a limit of 10 or something?
			var maxBlock = me._TIMESTEP * 20;
			
			if (elapsed >= maxBlock) {
				//console.log('warning: sparks.js is fast fowarding engine, skipping steps', elapsed / emitter._TIMESTEP);
				//emitter.update( (elapsed - maxBlock) / 1000);
				elapsed = maxBlock;
			}
		
			while(elapsed >= me._TIMESTEP) {
				me.update(me._TIMESTEP / 1000);
				elapsed -= me._TIMESTEP;
			}
			me._lastTime = time - elapsed;
			
		} else {
			me.update(elapsed/1000);
			me._lastTime = time;
		}
		
		
		setTimeout(me.step, me._timerStep, me);
		
	},
	
	update: function(time) {
		for (var i=0,il=this._emitters.length;i<il;i++) {
			this._emitters[i].update(time);
		}
	}
	
};