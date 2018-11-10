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
		 demVar.objects.push( body = Bodies.circle( 400, 100, 50 ) );
		
		 demVar.objects.push( constraint = Constraint.create( {
				pointA: { x: 350, y: 200 },
				bodyB: body,
				length: radius
				render: 
				{
					lineWidth: 5.5,
					strokeStyle: '#666'
				}
			} )
		);
		
		World.add( engine.world, demVar.objects );
	}

	createCircularMotion( 100 );

	World.add( engine.world, mouseConstraint );

	// run the engine
	Engine.run( engine );
	Render.run( render );

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
