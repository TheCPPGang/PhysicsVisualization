var Example = Example || {};

Example.circularMotion = function(){

	var canvas = document.getElementById('diagram');

	var demVar = 
	{
	    objects: [],
	    trails: [],
		width: 700,
		height: 400,
	    speed: 0.208325,
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
	    Vector = Matter.Vector,
	    Runner = Matter.Runner;


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

    Render.run( render );
    
    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

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
		}
	);

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

	createCircularMotion( demVar.radius );

	// Gravity is set to 0 to ensure that
	// gravitational acceleration does not interfere with
	// circular motion of the particle
	engine.world.gravity.y = 0;

	Events.on( runner, 'beforeTick', function() 
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
    
     document.getElementById('problemDescription').innerHTML = 
        '<p style="text-align: center"> A ball moves in a horizontal circle of radius 100. The speed of the ball is 10.</p> <p>Blue line on ball: Velocity vector. <br> Grey Line: Centripetal Force (pointing inwards) </p>';

	document.getElementById('settings').innerHTML = `
			<p class="h3">Settings</p>
			<div class="mult-btn">
					<button class="btn btn-primary" type="button" id="play-pause">Pause</button>
			</div>
			<div class="input-group">
				<input type="text" class="form-control" placeholder="Radius" aria-label="Radius" aria-describedby="basic-addon2" id="radiusInput">
				<div class="input-group-append">
					<button class="btn btn-outline-secondary" type="button" disabled="true">m</button>
					<button class="btn btn-outline-secondary" type="button" id="radius">Apply</button>
				</div>
			</div>
			<div class="input-group">
				<input type="text" class="form-control" placeholder="Speed" aria-label="Speed" aria-describedby="basic-addon2" id="speedInput">
				<div class="input-group-append">
					<button class="btn btn-outline-secondary" type="button" disabled="true">m/s</button>
					<button class="btn btn-outline-secondary" type="button" id="speed">Apply</button>
				</div>
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
		// 1 speed in matter.js = 1px / 16.666ms so convert our speed to a px/s value
		demVar.trails = [];
		demVar.speed = parseFloat( document.getElementById( "speedInput" ).value ) * 0.008333;
	}

	document.getElementById( "play-pause" ).onclick = function()
	{
		demVar.playing = !demVar.playing;
		document.getElementById('play-pause').innerHTML = (demVar.playing ? "Pause" : "Play");
	}

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};
