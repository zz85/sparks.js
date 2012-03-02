## uglify build script 
## @author zz85
## you need uglifyjs, install with npm install uglify-js 

cat src/Sparks.js src/core/Emitter.js src/core/Engine.js src/core/Particle.js src/actions/Accelerate.js src/actions/Action.js src/actions/ActionZone.js src/actions/Age.js src/actions/DeathZone.js src/actions/Move.js src/actions/RandomDrift.js src/firers/ShotCounter.js src/firers/SteadyCounter.js src/initializers/Lifetime.js src/initializers/Position.js src/initializers/Target.js src/initializers/Velocity.js src/renderers/SimpleRenderer.js src/util/Staging.js src/util/Utils.js src/util/VectorPool.js src/zones/CubeZone.js src/zones/LineZone.js src/zones/ParallelogramZone.js src/zones/PointZone.js src/zones/Zone.js > Sparks.concat.js

uglifyjs -v --overwrite --beautify --output Sparks.js Sparks.concat.js

# This is for uglified compressed code
# uglifyjs --output Sparks.build.js Sparks.concat.js