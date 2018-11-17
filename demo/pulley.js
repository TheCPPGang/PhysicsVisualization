var Example = Example || {};

Example.pulley = function(){
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
        Constraint = Matter.Constraint;
        Composites = Matter.Composites;
        Common = Matter.Common;

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
    var boxA = Bodies.rectangle( 150, 200, 60, 60 );
    var boxB = Bodies.rectangle( 450, 50, 60, 60 );
    
    var cliff = Bodies.rectangle(100, 350, 350, 250, { 
            isStatic: true,
            
        });
    
    var mount = Bodies.rectangle(275, 235, 60, 20, { 
        isStatic: true,
        angle: -Math.PI * .2
    });
    
    //use a sprite
    var pulley = Bodies.circle(300, 220, 20, {
        isStatic: true,
        friction: 0,
    });

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
    
    var group = Body.nextGroup(true);

    var bridge = Composites.stack(160, 290, 15, 1, 0, 0, function(x, y) {
        return Bodies.rectangle(x - 20, y, 30, 20, { 
            collisionFilter: { group: group },
            chamfer: 5,
            density: 0.005,
            frictionAir: 0.005,
            render: {
                fillStyle: '#575375'
            }
        });
    });
    
    Composites.chain(bridge, 0.3, 0, -0.3, 0, { 
        stiffness: 1,
        length: 0,
        render: {
            visible: false
        }
    });

    // add all of the bodies to the world
    World.add( engine.world, [boxA, boxB, cliff, mount, pulley, ceiling, floor, leftWall, rightWall, mouseConstraint, bridge,
        
        Constraint.create({ 
            bodyA: boxA,
            pointA:{x:5, y:30},
            bodyB: bridge.bodies[0], 
            pointB: { x: -25, y: 0 },
            length: 2,
            stiffness: 0.9
        }),
        Constraint.create({ 
            bodyA: boxB,
            pointA: { x: 5, y: 30 }, 
            bodyB: bridge.bodies[bridge.bodies.length - 1], 
            pointB: { x: 25, y: 0 },
            length: 2,
            stiffness: 0.9
        })
]);

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

