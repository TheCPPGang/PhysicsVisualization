(function(){
	
	var sourceLinkRoot = '../demo';

	var demo = MatterTools.Demo.create({
		toolbar: {
            reset: false,
            source: false,
            inspector: false,
            tools: false,
            fullscreen: false,
            exampleSelect: true
        },
        tools: {
            inspector: false,
            gui: false
        },
        inline: false,
        preventZoom: true,
        resetOnOrientation: true,
        routing: true,
        startExample: 'universalGravitation',
        examples: [
	        {
                name: 'Universal Gravitation',
                id: 'universalGravitation',
                init: Example.universalGravitation,
	        },
	        {
                name: 'Pulley',
                id: 'pulley',
                init: Example.pulley,
	        },
        	{
                name: 'Circular Motion',
                id: 'circularMotion',
                init: Example.circularMotion,
        	},
    		{
        		name: 'Dielectrics',
        		id: 'dielectric',
        		init: Example.dielectric,
    		},
            {
                name: 'Gravitation w/ 2 Bodies',
                id: 'gravity2Bodies',
                init: Example.gravity2Bodies,
            }
        ],
	});

    document.getElementById('topBar').appendChild(demo.dom.root);
    document.getElementById('physics-logo').innerHTML = `
        <div class='.container'>
        <h1 id="title">S<div class='eye'></div>
        <div class='eye'></div> Physics</h1> 
        </div>
    `;
    MatterTools.Demo.start(demo);
})();
