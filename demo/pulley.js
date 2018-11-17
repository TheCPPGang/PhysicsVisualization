var Example = Example || {};

Example.demo1 = function(){
    var canvas = document.getElementById('diagram');

    var demoVariables = {
        width: 700,
        height: 400,
        offset: 25,
        currentAXScale: 1,
        currentBXScale: 1
    }

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;
        Body = Matter.Body,
        Runner = Matter.Runner;

    // create an engine
    var engine = Engine.create();

    var render = Render.create({
        element: canvas,
        engine: engine,
        options:
        {
            width: demoVariables.width,
            height: demoVariables.height,
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

    // Create mouse constraint
    var mouseConstraint = Matter.MouseConstraint.create( engine, {
        element: canvas,
        constraint: 
        {
            render: 
            {
                visible: false
            },
            stiffness: 0.8
        }
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle( 400, 200, 80, 80 );
    var boxB = Bodies.rectangle( 450, 50, 80, 80 );

    function createWall(x, y, width, height){
        return Bodies.rectangle(x, y, width, height, {
            isStatic: true,
            render: {
                restitution: 1,
                fillStyle: 'white',
                strokeStyle: 'black'
            }
        });
    }

    var ceiling = createWall(400, -demoVariables.offset, demoVariables.width * 2 + 2 * demoVariables.offset, 50);
    var floor = createWall(400, demoVariables.height + demoVariables.offset, demoVariables.width * 2 + 2 * demoVariables.offset, 50);
    var leftWall = createWall(-demoVariables.offset, 300, 50, demoVariables.height * 2 + 2 * demoVariables.offset);
    var rightWall = createWall(demoVariables.width + demoVariables.offset, 300, 50, demoVariables.height * 2 + 2 * demoVariables.offset);

    // add all of the bodies to the world
    World.add( engine.world, [boxA, boxB, ceiling, floor, leftWall, rightWall, mouseConstraint] );

    // run the engine
    Engine.run( engine );

    Render.run( render );

    function scaleX(box, currentXScale, newXScale)
    {
        normalize = 1.0/currentXScale;
        Body.scale( box, normalize, 1.0);
        Body.scale( box, newXScale, 1.0);
    }

    document.getElementById('equations').innerHTML = `
            <p>Equations</p>
            
            <div style="text-align: center">
                Radius: <input type="text" id="radiusInput">
                <button id="radius">Apply</button>
            </div>
    `;

    document.getElementById('equations').innerHTML = `
            <p>Equations</p>
            
            <div style="text-align: center">
                Box A Y-Scale: <input type="text" id="scaleEnteredBoxA">
                <button id="scaleBoxA">Apply</button>
                <br><br>
                Box B Y-Scale: <input type="text" id="scaleEnteredBoxB">
                <button id="scaleBoxB">Apply</button>
                <br><br>
                Box A X-Scale: 
                <input type="range" min="1" max="2" value="1" step="0.1" class="slider" id="boxAScaleXSlider">
                <br><br>
                Box B X-Scale: 
                <input type="range" min="1" max="2" value="1" step="0.1" class="slider" id="boxBScaleXSlider">
            </div>
    `;

    // Potato code 

    document.getElementById("scaleBoxA").onclick = function()
    {   
        scale = document.getElementById("scaleEnteredBoxA").value;
        Body.scale( boxA, 1.0, scale ); 
    }

    document.getElementById("scaleBoxB").onclick = function()
    {   
        scale = document.getElementById("scaleEnteredBoxB").value;
        Body.scale( boxB, 1.0, scale ); 
    }

    document.getElementById("boxAScaleXSlider").oninput = function()
    {
        scaleX(boxA, demoVariables.currentAXScale, this.value);
        demoVariables.currentAXScale = this.value;
    }

    document.getElementById("boxBScaleXSlider").oninput = function()
    {
        scaleX(boxB, demoVariables.currentBXScale, this.value);
        demoVariables.currentBXScale = this.value;
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

