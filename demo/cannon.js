window.addEventListener('load', function() {
	
	//Fetch our canvas
	var canvas = document.getElementById('world');
	
	//Setup Matter JS
	var engine = Matter.Engine.create();
	var world = engine.world;
	var render = Matter.Render.create({
		canvas: canvas,
		engine: engine,
		options: {
			width: 700,
			height: 500,
			background: 'transparent',
			wireframes: false,
			showAngleIndicator: false
		}
	});
	
	//Add a ballA
	var ballA = Matter.Bodies.circle(250, 250, 50, {
		density: 0.04,
		friction: 0.01,
        frictionAir: 0.00001,
        restitution: 0.8,
        render: {
            fillStyle: '#F35e66',
            strokeStyle: 'black',
            lineWidth: 1
        }
	});
	Matter.World.add(world, ballA);
	
	//Add a ballB
	var ballB = Matter.Bodies.circle(50, 50, 25, {
		density: 0.08,
		friction: 0.02,
        frictionAir: 0.00002,
        restitution: 0.8,
        render: {
            fillStyle: '#F35e66',
            strokeStyle: 'black',
            lineWidth: 1
        }
	});
	Matter.World.add(world, ballB);
	function addBall()
	{
		var ballX = Matter.Bodies.circle(100, 50, 25, {
		density: 0.08,
		friction: 0.02,
        frictionAir: 0.00002,
        restitution: 0.8,
        render: {
            fillStyle: '#F35e66',
            strokeStyle: 'black',
            lineWidth: 1
        }
		});
		Matter.World.add(world, ballX);
	}
	document.getElementById("addBall").onclick = addBall()
	
	//Add a floor
	var floor = Matter.Bodies.rectangle(250, 520, 500, 40, {
		isStatic: true, //An immovable object
		render: {
			visible: false
		}
	});
	Matter.World.add(world, floor);
	
	//Make interactive
	var mouseConstraint = Matter.MouseConstraint.create(engine, { //Create Constraint
		element: canvas,
		constraint: {
			render: {
	        	visible: false
	    	},
	    	stiffness:0.8
	    }
	});
	Matter.World.add(world, mouseConstraint);
	
	//Start the engine
	Matter.Engine.run(engine);
	Matter.Render.run(render);
	
});