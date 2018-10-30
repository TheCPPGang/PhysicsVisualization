var canvas = document.getElementById('diagram');

var demoVariables = {
    width: 700,
    height: 400,
    gravity: 0.001,
    ballSize: 10,
    friction: 0,
    frictionStatic: 1,
    frictionAir: 0,
    restitution: 0.5,
    velocityVector: true,
    offset: 25
}

function resetSettings(){
    demoVariables.gravity = 0.001;
    demoVariables.friction = 0;
}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

engine.velocityIterations = 4;
engine.positionIterations = 6;

var render = Render.create({
    element: canvas,
    engine: engine,
    options:
    {
        width: demoVariables.width,
        height: demoVariables.height,
        background: 'white',
        wireframeBackground: '#222',
        enabled: true,
        wireframes: false,
        showVelocity: true,
        showAngleIndicator: true,
        showCollisions: false,
        pixelRatio: 1
    }
});
// create two boxes and a ground
var boxA = Bodies.rectangle( 400, 200, 80, 80 );
var boxB = Bodies.rectangle( 450, 50, 80, 80 );

function createWall(x, y, width, height){
    return Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        render: {
            restitution: 1,
            fillStyle: 'white',
            strokeStyle: 'black'
        }
    });
}
var ceiling = createWall(400, -demoVariables.offset, demoVariables.width * 2 + 2 * demoVariables.offset, 50);
var floor = createWall(400, demoVariables.height + demoVariables.offset, demoVariables.width * 2 + 2 * demoVariables.offset, 50);
var leftWall = createWall(-demoVariables.offset, 300, 50, demoVariables.height * 2 + 2 * demoVariables.offset);
var rightWall = createWall(demoVariables.width + demoVariables.offset, 300, 50, demoVariables.height * 2 + 2 * demoVariables.offset);

// add all of the bodies to the world
World.add( engine.world, [
    ceiling,
    floor,
    rightWall,
    leftWall,
    boxA,
    boxB] );

// run the engine
Engine.run( engine );

Render.run( render );