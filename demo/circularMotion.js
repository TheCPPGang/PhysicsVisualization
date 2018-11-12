var Example = Example || {};

Example.circularMotion = function(){

	var canvas = document.getElementById('diagram');

var demVar = {
    objects: []
}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
	Body = Matter.Body;
	Constraint = Matter.Constraint;
	Mouse = Matter.Mouse;
	MouseConstraint = Matter.MouseConstraint;
    Events = Matter.Events,
    Vector = Matter.Vector;


// create an engine
var engine = Engine.create();

var render = Render.create({
    element: canvas,
    engine: engine,
    options:
    {
        width: 700,
        height: 400,
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

 // add mouse control
var mouse = Mouse.create( render.canvas ),
	mouseConstraint = MouseConstraint.create( engine, {
		mouse: mouse,
		constraint: {
			// allow bodies on mouse to rotate
			angularStiffness: 0,
			render: {
				visible: false
			}
		}
	});

function createCircularMotion( radius )
{
    // add revolute constraint
     demVar.objects.push( body = Bodies.circle( 400, 100, 25, {frictionAir: 0} ) );
    
     demVar.objects.push( constraint = Constraint.create( {
            pointA: { x: 350, y: 200 },
            bodyB: body,
            length: radius,
            render: 
            {
                lineWidth: 5.5,
                strokeStyle: '#666'
            }
        } )
    );
    
    Body.setAngularVelocity( body, Math.PI/6);
    World.add( engine.world, demVar.objects );
}



World.add( engine.world, mouseConstraint );

Render.run( render );

// run the engine
Engine.run( engine );

createCircularMotion( 100 );

//trace circle path
var trail = [];

    Events.on(render, 'afterRender', function() {
        trail.unshift({
            position: Vector.clone(body.position),
            speed: body.speed
        });

        Render.startViewTransform(render);
        //color intensity: up to 1
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < trail.length; i += 1) {
            var point = trail[i].position,
                speed = trail[i].speed;
            
            //color of the trace    
            render.context.fillStyle = 'black';
            //size of the dots
            render.context.fillRect(point.x, point.y, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);
        
        //disappear when length is greater than specified amount
        if (trail.length > 500) {
            trail.pop();
        }
        
    });

	document.getElementById('equations').innerHTML = `
			<p>Equations</p>
			
			<div style="text-align: center">
				Radius: <input type="text" id="radiusInput">
				<button id="radius">Apply</button>
			</div>
	`;

	// Variables 

	document.getElementById("radius").onclick = function()
	{   
		World.remove( engine.world, demVar.objects );
		demVar.objects = [];
		
		radius = document.getElementById("radiusInput").value;
		createCircularMotion( radius );
	}

	    return {
	        engine: engine,
	        render: render,
	        canvas: render.canvas,
	        stop: function() {
	            Matter.Render.stop(render);
	        }
	    };
};
