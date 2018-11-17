var Example = Example || {};

Example.dielectric = function(){

var canvas = document.getElementById('diagram');

var demVar = 
{
    objects: [],
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

// Define our categories (as bit fields, there are up to 32 available)
var CAPACITOR_MASK = 0x0001,
	CHARGE_MASK = 0x0002;
	
// Color
var RED = '#FF0000',
	BLUE = '#0000FF',
	YELLOW = '#999900',
	BLACK = '#000000';

// Create a particle in the dielectric
function createParticle( x, y ) 
{
		var plusA = Bodies.rectangle( x, y, 5, 1, { render: { fillStyle: RED } } ),
			plusB = Bodies.rectangle( x, y,  1, 5, { render: { fillStyle: RED } } );
			minus = createNegativeCharge( x + 10, y ),
			particle = Bodies.circle( x + 5, y, 10, { render: { fillStyle: BLACK, opacity: .05 } } );

        return Body.create({
			isStatic: true,
            parts: [plusA, plusB, minus, particle],
			collisionFilter: { mask: CHARGE_MASK }
        });
}

// Create a positive charge
function createPositiveCharge( x, y )
{
	var plusA = Bodies.rectangle( x, y, 5, 1, { render: { fillStyle: RED } } ),
		plusB = Bodies.rectangle( x, y,  1, 5, { render: { fillStyle: RED } } );

	return Body.create({
		isStatic: true,
		parts: [plusA, plusB],
		collisionFilter: { mask: CHARGE_MASK }
	});
}

// Create a minus charge
function createNegativeCharge( x, y )
{
	return Bodies.rectangle( x, y, 5, 1, 
	{ 
		isStatic: true,
		render: { fillStyle: BLUE },
		collisionFilter: { mask: CHARGE_MASK }
	} );
}

// We need to create a circuit diagram and matter isn't really the ideal
// engine for this sort of thing, but really thin, static boxes will probably
// work fine for now.
function createEnvironment()
{
	
	// Left wall 
	demVar.objects.push( Bodies.rectangle( 75, 225, 1, 250, { isStatic: true } ) );
	
	// Right wall 
	demVar.objects.push( Bodies.rectangle( 600, 225, 1, 250, { isStatic: true } ) );
	
	// Top wall left side
	demVar.objects.push( Bodies.rectangle( 175, 100, 200, 1, { isStatic: true } ) );
	
	// Top wall right side
	demVar.objects.push( Bodies.rectangle( 500, 100, 200, 1, { isStatic: true } ) );
	
	// Bottom wall left side
	demVar.objects.push( Bodies.rectangle( 200, 350, 250, 1, { isStatic: true } ) );
	
	// Bottom wall right side
	demVar.objects.push( Bodies.rectangle( 475, 350, 250, 1, { isStatic: true } ) );
	
	// Battery +
	demVar.objects.push( Bodies.rectangle( 325, 350, 1, 75, { isStatic: true } ) );
	
	// Battery -
	demVar.objects.push( Bodies.rectangle( 350, 350, 1, 50, { isStatic: true } ) );
	
	// Left capacitor plate
	demVar.objects.push( Bodies.rectangle( 400, 100, 20, 150, { isStatic: true, collisionFilter: { mask: CAPACITOR_MASK } } ) );
	
	// Right capacitor plate
	demVar.objects.push( Bodies.rectangle( 275, 100, 20, 150, { isStatic: true, collisionFilter: { mask: CAPACITOR_MASK } } ) );
	
	// Dielectric
	demVar.objects.push( Bodies.rectangle( 337, 100, 106, 150, 
	{
		isStatic: true,
		render: { fillStyle: YELLOW },
		collisionFilter: { mask: CAPACITOR_MASK }
	} ) );
	
	for ( var i = 0; i < 5; i++ )
	{
		for ( var j = 0; j < 7; j++ )
		{
			demVar.objects.push( createParticle( 292 + ( 20 * i ), 40 + ( 20 * j ) ) );
		}
	}
	
	World.add( engine.world, demVar.objects );
}

createEnvironment();

// run the engine
Engine.run( engine );

// run the renderer
Render.run( render );

return {
	        engine: engine,
	        render: render,
	        canvas: render.canvas,
	        stop: function() {
	            Matter.Render.stop(render);
	        }
	    };
};