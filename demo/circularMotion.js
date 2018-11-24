var Example = Example || {};

Example.circularMotion = function(){

var canvas = document.getElementById('diagram');

var demVar = 
{
    objects: [],
    trails: [],
	width: 700,
	height: 400,
    speed: 10,
    radius: 100,
    playing: true
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
        width: demVar.width,
        height: demVar.height,
        background: 'white',
        wireframeBackground: '#222',
        enabled: true,
        wireframes: false,
        showVelocity: true,
        showAngleIndicator: false,
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
	demVar.objects.push( body = Bodies.circle( demVar.width/2 - radius, demVar.height/2, 25, { frictionAir: 0 } ) );
	
	demVar.objects.push( constraint = Constraint.create( {
			pointA: { x: demVar.width/2, y: demVar.height/2 },
			bodyB: body,
			length: radius,
			render: 
			{
				lineWidth: 5.5,
				strokeStyle: '#666'
			}
		} )
	);
	
	World.add( engine.world, demVar.objects );
}

World.add( engine.world, mouseConstraint );

Render.run( render );

// run the engine
Engine.run( engine );

createCircularMotion( demVar.radius );

	// Gravity is set to 0 to ensure that
	// gravitational acceleration does not interfere with
	// circular motion of the particle
	engine.world.gravity.y = 0;

	Events.on( engine, 'beforeTick', function() 
	{	
		runCircularMotion();
	});

	function runCircularMotion(){
		if(demVar.playing){
			// Every tick we need to update the velocity of the particle
			// to ensure that the speed is always constant due to matter.js
			// applying friction over time
			var Dx = body.position.x - demVar.width/2;
			var Dy = body.position.y - demVar.height/2;
			var theta = Math.atan2(Dy, Dx);
			var Vx = demVar.speed * -Math.sin( theta );
			var Vy = demVar.speed * Math.cos( theta );
			Body.setVelocity( body, {x: Vx, y: Vy } );
		}else{
			Body.setVelocity( body, {x:0, y: 0});
		}
	}

	function renderTrails(){
		if(demVar.playing){
	        demVar.trails.push({
	            position: Vector.clone(body.position)
        	});

			var Dx = body.position.x - demVar.width/2;
			var Dy = body.position.y - demVar.height/2;
			var theta = Math.atan2(Dy, Dx);

	        if(theta > 3){
	        	demVar.trails = [];
	        }
		}
        Render.startViewTransform(render);
        //color intensity: up to 1
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < demVar.trails.length; i++) {
            var point = demVar.trails[i].position;
            
            //color of the trace    
            render.context.fillStyle = 'black';
            //size of the dots
            render.context.fillRect(point.x, point.y, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);
	}

    Events.on(render, 'afterRender', function() {
		renderTrails();        
    });

	document.getElementById('equations').innerHTML = `
			<p>Equations</p>
			
			<div style="text-align: center">
				<button type="button" class="btn btn-primary" id="play-pause">Pause</button>
				<br/><br/>
				Radius: <input type="text" id="radiusInput">
				<button type="button" class="btn btn-primary" id="radius">Apply</button>
				
				<br/><br/>
				
				Speed: <input type="text" id="speedInput">
				<button type="button" class="btn btn-primary" id="speed">Apply</button>
				<br><br>
			</div>
	`;

	// Variables 

	document.getElementById( "radius" ).onclick = function()
	{   
		World.remove( engine.world, demVar.objects );
		demVar.objects = [];
		demVar.trails = [];
		
		demVar.radius = parseFloat( document.getElementById( "radiusInput" ).value );
		createCircularMotion( demVar.radius );
	}
	
	document.getElementById( "speed" ).onclick = function()
	{   
		demVar.trails = [];
		demVar.speed = parseFloat( document.getElementById( "speedInput" ).value );
	}

	document.getElementById( "play-pause" ).onclick = function()
	{
		demVar.playing = !demVar.playing;
		document.getElementById('play-pause').innerHTML = (demVar.playing ? "Pause" : "Play");
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
