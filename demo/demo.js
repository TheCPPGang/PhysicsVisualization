var canvas = document.getElementById('diagram');

var demoVariables = {
    width: 700,
    height: 400,
    offset: 25
}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
	Body = Matter.Body;

// create an engine
var engine = Engine.create();

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

// Create mouse constraint
var mouseConstraint = Matter.MouseConstraint.create( engine, {
	element: canvas,
	constraint: 
	{
		render: 
		{
			visible: false
		},
		stiffness: 0.8
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
World.add( engine.world, [boxA, boxB, ceiling, floor, leftWall, rightWall, mouseConstraint] );

// run the engine
Engine.run( engine );

Render.run( render );


// Potato code 

document.getElementById("scaleBoxA").onclick = function()
{   
	scale = document.getElementById("scaleEnteredBoxA").value;
	Body.scale( boxA, 1.0, scale ); 
}

document.getElementById("scaleBoxB").onclick = function()
{   
	scale = document.getElementById("scaleEnteredBoxB").value;
	Body.scale( boxB, 1.0, scale ); 
}