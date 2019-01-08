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

  const scrollTop = -highestIcebox.body.position.y - dimension * 1.5;
  const scrollBot = -bottomIB.body.position.y - dimension * 1.5;
  if (gameVariables.isGameOver) {
   if (!scoreH1.innerHTML.includes('THE END')) {
    scoreH1.innerHTML += '<br>THE END<br>&#8634;';
   }
   const scrollingSpeedWhole = score / dimension * 1500;  //1500ms per cube speed
   gameVariables.endgameScrolling.top = scrollTop;
   gameVariables.endgameScrolling.bot = scrollBot;
   if (score !== 0) {
    const heightDiff = Math.abs(sortedIceboxes[0].body.position.y - sortedIceboxes[sortedIceboxes.length - 1].body.position.y);
    gameVariables.camera.durationMs = scrollingSpeedWhole;
    const isGoingUp = !gameVariables.endgameScrolling.goingDown;
    //set direction
    gameVariables.camera.goUp = isGoingUp;
    //has direction arrived at target ?
    if (gameVariables.camera.atTarget()) {
     //only allow changes if was going up and now goes down
     //or was going down and can now go up if the tower is higher than screen height
     if (isGoingUp || gameVariables.windowHeight <= heightDiff) {
      //then change direction
      gameVariables.endgameScrolling.goingDown = isGoingUp;
      gameVariables.camera.goUp = !isGoingUp;
      //if we were going up, now we must go down!
      gameVariables.camera.setTarget(isGoingUp ? scrollBot : scrollTop);
     }
    }
    gameVariables.camera.update();
   }
  } else {
   if (gameVariables.iceboxSpawner.canSpawn()) {
    gameVariables.iceboxSpawner.spawn();
   }
   gameVariables.camera.setTarget(scrollTop);
   gameVariables.camera.update();
  }
  gameVariables.engine.world.gravity.x = gameVariables.orientation;
  Engine.update(gameVariables.engine, 1000 / gameVariables.FPS);
 }, 1000 / gameVariables.FPS);
}