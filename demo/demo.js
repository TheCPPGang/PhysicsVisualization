var canvas = document.getElementById('diagram');

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create(canvas, 
{
    render: 
	{
        element: canvas,
        options:
		{
            width: 700,
            height: 400,
        }
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle( 400, 200, 80, 80 );
var boxB = Bodies.rectangle( 450, 50, 80, 80 );
var ground = Bodies.rectangle( 400, 400, 810, 60, { isStatic: true } );

// add all of the bodies to the world
World.add( engine.world, [boxA, boxB, ground] );

// run the engine
Engine.run( engine );
