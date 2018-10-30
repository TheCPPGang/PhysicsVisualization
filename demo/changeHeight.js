// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var canvas = document.getElementById('diagram');
var engine;
var world;
var boxes = [];
var height;


// create a renderer

// create an engine
engine = Engine.create(canvas, 
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
 world = engine.world;



var ground = Bodies.rectangle(400, 400, 810, 60, { isStatic: true });


// add all of the bodies to the world
World.add(world, ground);

document.getElementById("height").onclick = function() {
    
    height = document.getElementById("heightEntered").value;
    
    boxes.push(new Box(400, 200, 80, height));
    
}

for (var i = 0; i < boxes.length; i ++) {
    boxes[i].show();
}

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
