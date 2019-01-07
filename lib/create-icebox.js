function createIceBox(position) {
 const { Bodies } = Matter;

 const iceBoxes = Object.values(gameVariables.iceboxMap);
 const sortedIceboxes = iceBoxes.filter(ib => ib.data.freeze.frozen).sort((i1, i2) => i1.body.position.y - i2.body.position.y);
 const highestIcebox = sortedIceboxes[0];
 const offset = highestIcebox ? highestIcebox.body.position.y : 0
 const variationSpawn = gameVariables.iceboxDimension * 1;
 const spawnOffset = variationSpawn - (Math.random() * 2 * variationSpawn);
 const bX = position ? position.x : gameVariables.windowWidth / 2 + spawnOffset;
 const bY = position ? position.y : -gameVariables.windowHeight + offset;
 const body = Bodies.rectangle(bX, bY, gameVariables.iceboxDimension, gameVariables.iceboxDimension, {});

 const iceboxMetadata = {
  type: 'ICE_BOX',
  data: {
   fallenDown: false,
   freeze: {
    get friction() {
     const iceMaxFriction = 0.15; //almost not solid
     const iceMinFriction = 0.0; //totally solid ice
     const diff = iceMaxFriction - iceMinFriction;
     const p = this.frozenPercent;
     //the more frozen we are, the less friction we want!
     return iceMinFriction + Math.pow(1 - p, 2) * diff;
    },
    get frozen() { return this.frozenPercent >= 1; },
    get color() {
     const p = this.frozenPercent;
     const frgb = [0xb9, 0xe8, 0xea];
     const trgb = [0x28, 0x89, 0xBD];
     const rgb = [undefined, undefined, undefined];
     let clr = '#';
     for (let i = 0; i < 3; i++) {
      rgb[i] = Math.floor(frgb[i] + p * (trgb[i] - frgb[i]))
      clr += rgb[i].toString(16).padStart(2, '0');
     }
     return clr;
    },
    collidesWithIcyPlane() {
     if (this.frozen) {
      return;
     }
     const frameDt = 1000 / gameVariables.FPS;
     this.frozenPercent += frameDt / this.timeToFreeze;
     if (this.frozenPercent > 1) {
      this.frozenPercent = 1;
     }
    },
    notCollidingWithIcyPlane() {
     if (this.frozen) {
      return;
     }
     const frameDt = 1000 / gameVariables.FPS;
     this.frozenPercent -= frameDt / this.timeToFreeze;
     if (this.frozenPercent < 0) {
      this.frozenPercent = 0;
     }
    },
    isFreezing: false,
    frozenPercent: 0,
    timeToFreeze: 2000
   }
  },
  body
 };
 gameVariables.iceboxMap[body.id] = iceboxMetadata;
 return body;
}