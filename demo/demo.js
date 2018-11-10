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
                name: 'Two Box',
                id: 'demo1',
                init: Example.demo1,
	        },
            {
                name: 'Circular Motion',
                id: 'circularMotion',
                init: Example.circularMotion,
            }
        ],
	});

    document.body.appendChild(demo.dom.root);

    MatterTools.Demo.start(demo);
})();