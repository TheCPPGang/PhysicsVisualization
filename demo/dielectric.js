var Example = Example || {};

Example.dielectric = function(){
	var canvas = document.getElementById('diagram');

	var demVar = 
	{
		k: 1,
		Area: 5,
		distance: 5,
		objects: [],
		particles: [],
		charges: [],
		capacitor: [],
	}

	// module aliases
	var Engine = Matter.Engine,
		Render = Matter.Render,
		World = Matter.World,
		Bodies = Matter.Bodies,
		Body = Matter.Body,
		Composites = Matter.Composites;
		
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
			showVelocity: false,
			showAngleIndicator: false,
			showCollisions: false,
			pixelRatio: 1
		}
	});

	// Color
	var RED = '#FF0000',
		BLUE = '#0000FF',
		YELLOW = '#999900',
		BLACK = '#000000';

	// Create a particle in the dielectric
	function createParticle( x, y ) 
	{
		// Offset charge positions in the particle depending on the current value of k
		var plusA = Bodies.rectangle( x + demVar.k , y, 12.5, 1, { render: { fillStyle: RED } } ),
			plusB = Bodies.rectangle( x + demVar.k, y,  1, 12.5, { render: { fillStyle: RED } } ),
			minus = createNegativeCharge( x - demVar.k, y, 12.5 ),
			particle = Bodies.circle( x, y, 20, { render: { fillStyle: BLACK, opacity: .05 } } );

		return Body.create({
			isStatic: true,
			parts: [plusA, plusB, minus, particle],
		});
	}

	// Create a positive charge
	function createPositiveCharge( x, y, length )
	{
		var plusA = Bodies.rectangle( x, y, length, 1, { render: { fillStyle: RED } } ),
			plusB = Bodies.rectangle( x, y,  1, length, { render: { fillStyle: RED } } );

		return Body.create({
			isStatic: true,
			parts: [plusA, plusB],
		});
	}

	// Create a minus charge
	function createNegativeCharge( x, y, length )
	{
		return Bodies.rectangle( x, y, length, 1, 
		{ 
			isStatic: true,
			render: { fillStyle: BLUE },
		} );
	}

	// create dielectric particle array and render in a 3x3 grid
	function createParticleArray()
	{
		// clear particles
		World.remove( engine.world, demVar.particles );
		demVar.particles = [];
		
		for ( var i = 0; i < Math.floor( demVar.distance / 5 ); i++ )
		{
			for ( var j = 0; j < 3; j++ )
			{
				demVar.particles.push( createParticle( 375 - ( 5 * demVar.distance ) + ( 50 * i ), 50 + ( 50 * j ) ) );
			}
		}
		
		World.add( engine.world, demVar.particles );
	}

	// create array of charges held by capacitor plates
	function createChargeArray()
	{
		// clear charges
		World.remove( engine.world, demVar.charges );
		demVar.charges = [];
		
		// Our capacitors can fit twice as many rows as columns, so calculate the desired amount of each based on charge count
		// Equation to calculate is: Charge = rows^2 / 2
		nCharges = Math.floor( demVar.Area ) * Math.floor( demVar.k );
		nRows = Math.ceil( Math.sqrt( 2 * nCharges ) );
		nColumns = Math.ceil( Math.sqrt( 2 * nCharges ) /2 );
		
		// Don't make more than 10 rows at most
		// Columns shouldn't exceed the area
		if ( nRows > 10 || demVar.Area <= nColumns )
		{
			nRows = 10;
			nColumns = Math.ceil( nCharges / 10 );
		}

		for ( var i = 1; i <= nRows; i++ )
		{
			for ( var j = 1; j <= nColumns; j++ )
			{
				// Check if we've created enough charges
				if ( nCharges == 0 )
				{
					break;
				}
				
				// One charge for each plate		
				demVar.charges.push( createNegativeCharge( 350 + ( 5 * demVar.distance ) + ( ( ( demVar.Area * 10 ) / ( nColumns + 1 ) ) * j ), 25 + ( ( 150 / ( nRows + 1 ) ) * i ), 7.5 ) );
				demVar.charges.push( createPositiveCharge( 350 - ( 5 * demVar.distance ) - ( ( ( demVar.Area * 10 ) / ( nColumns + 1 ) ) * j ), 25 + ( ( 150 / ( nRows + 1 ) ) * i ), 7.5 ) );
				
				nCharges--;
			}
		}

		World.add( engine.world, demVar.charges );
	}
	
	// When creating the capacitor the offset is adjusted based on the area of the plates as well as the 
	// distance between the plates specified by the user.
	// 1cm = 10px horizontally
	function createCapacitor()
	{
		World.remove( engine.world, demVar.capacitor );
		demVar.capacitor = [];
		
		// Left capacitor plate
		demVar.capacitor.push( leftPlate = Bodies.rectangle( 350 + ( 5 * ( demVar.distance + demVar.Area ) ), 100, 10 * demVar.Area, 150, 
		{ 
			isStatic: true,
			render: { fillStyle: BLACK },  
		} ) );
		
		// Right capacitor plate
		demVar.capacitor.push( rightPlate = Bodies.rectangle( 350 - ( 5 * ( demVar.distance + demVar.Area ) ), 100, 10 * demVar.Area, 150, 
		{ 
			isStatic: true,
			render: { fillStyle: BLACK }, 
		} ) );
		
		// Dielectric
		demVar.capacitor.push( dielectric = Bodies.rectangle( 350 , 100, 10 * demVar.distance, 150, 
		{
			isStatic: true,
			render: { fillStyle: YELLOW },
		} ) );
		
		World.add( engine.world, demVar.capacitor );
	}

	// We need to create a circuit diagram and matter isn't really the ideal
	// engine for this sort of thing, but really thin, static boxes will probably
	// work fine for now.
	function createEnvironment()
	{
		
		// Left wall 
		demVar.objects.push( Bodies.rectangle( 75, 225, 1, 250, { isStatic: true } ) );
		
		// Right wall 
		demVar.objects.push( Bodies.rectangle( 625, 225, 1, 250, { isStatic: true } ) );
		
		// Top wall
		demVar.objects.push( Bodies.rectangle( 350, 100, 550, 1, { isStatic: true } ) );
		
		// Bottom wall left side
		demVar.objects.push( Bodies.rectangle( 205, 350, 262, 1, { isStatic: true } ) );
		
		// Bottom wall right side
		demVar.objects.push( Bodies.rectangle( 495, 350, 262, 1, { isStatic: true } ) );
		
		// Battery +
		demVar.objects.push( Bodies.rectangle( 337, 350, 1, 75, { isStatic: true } ) );
		
		// Battery -
		demVar.objects.push( Bodies.rectangle( 363, 350, 1, 50, { isStatic: true } ) );
		
		World.add( engine.world, demVar.objects );
		
		createCapacitor();
		createParticleArray();
		createChargeArray();
	}

	createEnvironment();

	// run the engine
	Engine.run( engine );

	// run the renderer
	Render.run( render );

	document.getElementById('equations').innerHTML = `
			<p>Equations</p>
			
			<div style="text-align: center">
				Dielectric Constant: <input type="text" size="2" id="kInput">
				<button type="button" class="btn btn-primary" id="kConstant">Apply</button>
				
				<br/><br/>
				
				Plate Area: <input type="text" size="2" id="areaInput"> cm<sup>2</sup>
				<button type="button" class="btn btn-primary" id="area">Apply</button>
				
				<br/><br/>
				
				Distance Between Plates: <input type="text" size="2" id="distanceInput"> cm
				<button type="button" class="btn btn-primary" id="distance">Apply</button>
				<br><br>
			</div>
	`;

	// Variables 
	
	document.getElementById( "kConstant" ).onclick = function()
	{   		
		demVar.k = parseFloat( document.getElementById( "kInput" ).value );
		createParticleArray();
		createChargeArray();
	}	

	document.getElementById( "area" ).onclick = function()
	{   		
		demVar.Area = parseFloat( document.getElementById( "areaInput" ).value );
		createCapacitor();
		createParticleArray();
		createChargeArray();
	}	

	document.getElementById( "distance" ).onclick = function()
	{   		
		demVar.distance = parseFloat( document.getElementById( "distanceInput" ).value );
		createCapacitor();
		createParticleArray();
		createChargeArray();
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