function createCamera() {
 const { Render } = Matter;

 const camera = {
  durationMs: 1200,
  targetY: 0,
  startY: 0,
  currentY: 0,
  goUp: true,

  setTarget(target) {
   this.targetY = target;
  },

  update() {
   const msPerFrame = 1000 / gameVariables.FPS;
   const distance = Math.abs(this.targetY - this.startY);
   const fraction = msPerFrame / this.durationMs;
   if (this.goUp) {
    this.currentY += fraction * distance;
    if (this.currentY >= this.targetY) {
     this.currentY = this.targetY;
     this.startY = this.targetY;
    }
   } else {
    this.currentY -= fraction * distance;
    if (this.currentY <= this.targetY) {
     this.currentY = this.targetY;
     this.startY = this.targetY;
    }
   }
   this.lookAtHeight(this.currentY);
  },

  lookAtHeight(height) {
   Render.lookAt(gameVariables.render, {
    min: { x: 0, y: -gameVariables.windowHeight - height },
    max: { x: gameVariables.windowWidth, y: 0 - height }
   });
  }
 };
 return camera;
}
