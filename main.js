function main() {
 const { Engine } = Matter;
 initialize(document.getElementById('gamecanvasdiv'));
 //GAME LOOP
 setInterval(() => {
  const iceBoxes = Object.values(gameVariables.iceboxMap);
  for (const icebox of iceBoxes) {
   if (!icebox.data.freeze.frozen) {
    icebox.data.freeze.isFreezing ? icebox.data.freeze.collidesWithIcyPlane() : icebox.data.freeze.notCollidingWithIcyPlane();
    icebox.body.friction = icebox.data.freeze.friction;
   } else {
    icebox.body.isStatic = true;
   }
   icebox.body.render.fillStyle = icebox.data.freeze.color;
  }

  const activeIceboxes = iceBoxes.filter(ib => !ib.data.freeze.frozen && !ib.data.fallenDown);
  const sortedIceboxes = iceBoxes.filter(ib => ib.data.freeze.frozen).sort((i1, i2) => i1.body.position.y - i2.body.position.y);
  const highestIcebox = sortedIceboxes[0];
  const dimension = Math.sqrt(highestIcebox.body.area);
  for (const activeIB of activeIceboxes) {
   if (activeIB.body.position.y > highestIcebox.body.position.y) {
    activeIB.data.fallenDown = true;
    gameVariables.hearts = Math.max(0, gameVariables.hearts - 1);
   }
  }
  const bottomIB = sortedIceboxes[sortedIceboxes.length - gameVariables.initialIceBoxes];
  scoreH1.innerHTML = `${'❤'.repeat(gameVariables.hearts)}<br>`;
  const score = Math.abs(highestIcebox.body.position.y - bottomIB.body.position.y);
  scoreH1.innerHTML += (score / 1000).toFixed(2) + ' m';

  if (gameVariables.isGameOver) {
   if (!scoreH1.innerHTML.includes('THE END')) {
    scoreH1.innerHTML += '<br>THE END<br>&#8634;';
   }
   if (score !== 0) {
    gameVariables.camera.goUp = false;
    gameVariables.camera.durationMs = score / dimension * 250; //250ms per cube speed
    const scroll = -bottomIB.body.position.y - dimension * 1.5;
    gameVariables.camera.setTarget(scroll);
    gameVariables.camera.update();
   }
  } else {
   if (gameVariables.iceboxSpawner.canSpawn()) {
    gameVariables.iceboxSpawner.spawn();
   }
   const scroll = -highestIcebox.body.position.y - dimension * 1.5;
   gameVariables.camera.setTarget(scroll);
   gameVariables.camera.update();
  }
  gameVariables.engine.world.gravity.x = gameVariables.orientation;
  Engine.update(gameVariables.engine, 1000 / gameVariables.FPS);
 }, 1000 / gameVariables.FPS);
}