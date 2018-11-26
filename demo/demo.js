(function(){

    var demoExamples = []

    function addDemo(name, id, init){
        demoExamples.push({
            name: name,
            id: id,
            init: init
        });
    };

    addDemo('Circular Motion', 'circularMotion', Example.circularMotion);
    addDemo('Falling Objects', 'projectile', Example.projectile);
    addDemo('2-D Motion', 'motion', Example.motion);
    addDemo('Dielectrics', 'dielectric', Example.dielectric);
    addDemo('Universal Gravitation', 'universalGravitation', Example.universalGravitation);
    addDemo('Gravitation w/ 2 Bodies', 'gravity2Bodies', Example.gravity2Bodies);
    addDemo('Gravitation w/ 4 Bodies', 'gravity4Bodies', Example.gravity4Bodies);
    // Add demos here ^

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
        startExample: 'dielectric',
        examples: demoExamples
    });

    document.getElementById('topBar').appendChild(demo.dom.root);
    document.getElementById('physics-logo').innerHTML = `
             <img src="../images/logo.png"" alt="SeePhysics Logo"> 
    `;
    MatterTools.Demo.start(demo);
})();
