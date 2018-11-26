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
    
    var speeds = 10;


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
		demVar.objects.push( body = Bodies.circle( demVar.width / 2 - radius, demVar.height / 2, 25, { frictionAir: 0 } ) );
		
		demVar.objects.push( constraint = Constraint.create( {
				pointA: { x: demVar.width / 2, y: demVar.height / 2 },
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
			var dist = 3;
			if(demVar.trails.length !== 0){
				var len = demVar.trails.length-1;
				var prevPos = demVar.trails[len];
				var Dy = body.position.y - prevPos.position.y;
				var Dx = body.position.x - prevPos.position.x;
				dist = Math.sqrt(Dx * Dx + Dy * Dy);
			}
			if(dist > 2){
				demVar.trails.push({
					position: Vector.clone(body.position)
				});
			}
			var Dx = body.position.x - demVar.width/2;
			var Dy = body.position.y - demVar.height/2;
			var theta = Math.atan2(Dy, Dx);
	        if(theta > 3.1 || theta < -3.1){
	        	demVar.trails = [];
	        }
		}
        Render.startViewTransform(render);
        //color intensity: up to 1
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < demVar.trails.length; i++) {
            var point = demVar.trails[i].position;
            var context = render.context;
            
            context.beginPath();
            context.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
            context.fillStyle = 'black';
            context.fill();
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);
	}

    Events.on(render, 'afterRender', function() {
		renderTrails();        
    });
    
     document.getElementById('problemDescription').innerHTML = 
        `<p style="text-align: center"> 
        	A ball moves in a horizontal circle of radius 
	        <span id="radiusIn">100</span> m. The velocity of the ball is 
	        <span id="speedIn">10</span> m/s.
        </p> 
        <p>
            Grey Line: Centripetal Force (pointing inwards) 
        </p>`;

	document.getElementById('settings').innerHTML = `
			<div class="mult-btn">
					<button class="btn btn-outline-secondary text-white" type="button" id="play-pause">Pause</button>
			</div>
			<div class="input-group">
				<input type="number" class="form-control" min=0 step=any placeholder="Radius" aria-label="Radius" aria-describedby="basic-addon2" id="radiusInput">
				<div class="input-group-append">
					<button class="btn btn-outline-secondary text-white" type="button" disabled="true">m</button>
					<button class="btn btn-outline-secondary text-white" type="button" id="radius">Apply</button>
				</div>
			</div>
			<div class="input-group">
				<input type="number" class="form-control" min=0 step=any placeholder="Speed" aria-label="Speed" aria-describedby="basic-addon2" id="speedInput">
				<div class="input-group-append">
					<button class="btn btn-outline-secondary text-white" type="button" disabled="true">m/s</button>
					<button class="btn btn-outline-secondary text-white" type="button" id="speed">Apply</button>
				</div>
			</div>
	`;
    
    document.getElementById('equations').innerHTML = `
    <div>
        <p class="h3 text-center">Equations</p> 
    <p>
        $$v = {2 \\pi R \\over T}$$, $$a_c = {v^2 \\over R}$$
    </p>
    <p >
        <ul class="text-center" style="list-style: none;">
            <li>v = <span id="speedIns">10</span><sub>m/s</sub></li>  
            <li>R = <span id="radiusIns">100</span><sub>m</sub></li>
            <li>T = Period = <span id=period>62.83</span> <sub>seconds<sub></li>  
            <li>a<sub>c</sub> = <span id="acceleration">1</span> <sub>m/s&sup2<sub></li>
        </ul>
    </p>
    </div> 
    `;
    if(window.MathJax){
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('equations')[0]]);
    }
    

	// Variables 

	document.getElementById( "radius" ).onclick = function()
	{   
		World.remove( engine.world, demVar.objects );
		demVar.objects = [];
		demVar.trails = [];
		
		demVar.radius = parseFloat( document.getElementById( "radiusInput" ).value );
		createCircularMotion( demVar.radius );
        
        document.getElementById("radiusIn").innerHTML = document.getElementById("radiusInput").value;
        
        document.getElementById("radiusIns").innerHTML = document.getElementById("radiusInput").value;
        
        document.getElementById("period").innerHTML = ((demVar.radius * 2 * Math.PI)/speeds).toFixed(2);
        
        document.getElementById("acceleration").innerHTML = (Math.pow(speeds, 2) / demVar.radius);
	}
	
	document.getElementById( "speed" ).onclick = function()
	{   
		// 1 speed in matter.js = 1px / 16.666ms so convert our speed to a px/s value
		demVar.trails = [];
		demVar.speed = parseFloat( document.getElementById( "speedInput" ).value ) * 0.01666;
        
        speeds = document.getElementById("speedInput").value;
        
        document.getElementById("speedIn").innerHTML = document.getElementById("speedInput").value ;
        
        document.getElementById("speedIns").innerHTML = document.getElementById("speedInput").value ;
        
        document.getElementById("period").innerHTML = ((demVar.radius * 2 * Math.PI)/document.getElementById("speedInput").value).toFixed(2);
        
        document.getElementById("acceleration").innerHTML = (Math.pow(speeds, 2) / demVar.radius);
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
