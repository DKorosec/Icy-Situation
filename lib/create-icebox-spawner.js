function createIceboxSpawner() {
 const { World } = Matter;

 const iceboxSpawner = {
  spawnEvery: 3000,
  ts: 0,

  canSpawn() {
   return new Date().getTime() - this.ts >= this.spawnEvery;
  },

  spawn() {
   this.ts = new Date().getTime();
   World.add(gameVariables.world, [
    createIceBox()
   ]);
  }
 };
 return iceboxSpawner;
}