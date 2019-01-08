let gameVariables = null;
function initialize(canvasDiv, reset = false) {
 const {
  Engine,
  Events,
  Render,
  World
 } = Matter;

 if (reset) {
  Object.values(gameVariables.iceboxMap)
   .map(o => o.body)
   .forEach(body => World.remove(gameVariables.world, body));
 }

 gameVariables = {
  get isGameOver() {
   return this.hearts <= 0;
  },
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  FPS: 60,
  orientation: reset ? gameVariables.orientation : 0,
  hearts: 3,
  initialIceBoxes: 2,
  iceboxDimension: 160,
  iceboxMap: {},
  iceboxSpawner: createIceboxSpawner(),
  endgameScrolling : {
   goingDown : false, 
   top : null,
   bot : null,
  },
  camera: createCamera(),
  render: reset ? gameVariables.render : null,
  engine: reset ? gameVariables.engine : Engine.create(),
  get world() { return this.engine.world; }
 };

 const box = createIceBox({ x: gameVariables.windowWidth / 2, y: gameVariables.windowHeight });
 const box2 = createIceBox({ x: gameVariables.windowWidth / 2, y: gameVariables.windowHeight + gameVariables.iceboxDimension });
 gameVariables.iceboxMap[box.id].data.freeze.frozenPercent = 1;
 gameVariables.iceboxMap[box2.id].data.freeze.frozenPercent = 1;
 World.add(gameVariables.world, [
  box,
  box2
 ]);

 if (!reset) {
  gameVariables.render = Render.create({
   element: canvasDiv,
   engine: gameVariables.engine,
   options: {
    width: gameVariables.windowWidth,
    height: gameVariables.windowHeight,
    wireframes: false
   }
  })

  window.addEventListener('click', () => {
   if (gameVariables.isGameOver) {
    initialize(null, true);
   }
  });

  window.addEventListener("deviceorientation", event => {
   let gamma = event.gamma;
   if (gamma < -90) {
    gamma = -90;
   }
   else if (gamma > 90) {
    gamma = 90;
   }
   gameVariables.orientation = gamma / 90;
  }, false);

  Events.on(gameVariables.engine, 'collisionActive', event => {
   const iceLogic = (icebox) => {
    if (!icebox || icebox.data.freeze.frozen) return;
    icebox.data.freeze.isFreezing = true
   };
   for (const pair of event.pairs) {
    const iceBox1 = gameVariables.iceboxMap[pair.bodyA.id];
    const iceBox2 = gameVariables.iceboxMap[pair.bodyB.id];
    iceLogic(iceBox1);
    iceLogic(iceBox2);
   }
  });

  Events.on(gameVariables.engine, 'collisionEnd', event => {
   const iceLogic = (icebox) => {
    if (!icebox || icebox.data.freeze.frozen) return;
    icebox.data.freeze.isFreezing = false;
   };

   for (const pair of event.pairs) {
    const iceBox1 = gameVariables.iceboxMap[pair.bodyA.id];
    const iceBox2 = gameVariables.iceboxMap[pair.bodyB.id];
    iceLogic(iceBox1);
    iceLogic(iceBox2);
   }
  });

  Render.run(gameVariables.render);
 }
}