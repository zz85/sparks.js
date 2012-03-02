/********************************
* VectorPool 
*
*  Reuse much of Vectors if possible
*********************************/

SPARKS.VectorPool = {
	__pools: [],

	// Get a new Vector
	get: function() {
		if (this.__pools.length>0) {
			return this.__pools.pop();
		}
		
		return this._addToPool();
		
	},
	
	// Release a vector back into the pool
	release: function(v) {
		this.__pools.push(v);
	},
	
	// Create a bunch of vectors and add to the pool
	_addToPool: function() {
		//console.log("creating some pools");
		
		for (var i=0, size = 100; i < size; i++) {
			this.__pools.push(new THREE.Vector3());
		}
		
		return new THREE.Vector3();
		
	}
	
	
	
};