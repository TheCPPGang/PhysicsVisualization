var Example = Example || {};

Example.universalGravitation = function(){
    var canvas = document.getElementById('diagram');

    var demVar = {
        width: 700,
        height: 400,
        gravityConstant: 6.67408e-11,
        ballSize: 10,
        friction: 0,
        frictionStatic: 1,
        frictionAir: 0,
        restitution: 0.5,
        velocityVector: true,
        offset: 25,
        lastTimeStamp: 0,
        objects: [],
        playing: false,
        firstTime: true,
        objectsTrails: [],
        smallObjectVelocity: []
    }

    function resetSettings(){
        demVar.gravityConstant = 6.67408e-11;
        demVar.friction = 0;
    }

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Events = Matter.Events,
        Bodies = Matter.Bodies,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Vector = Matter.Vector;



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

    function addObjectInEnviroment(x, y, r, sides, Vx, Vy, mass){
        var index = demVar.objects.length;
        demVar.objects.push(
            Bodies.polygon(x, y, sides,r, {
                friction: demVar.friction,
                frictionStatic: demVar.frictionStatic,
                frictionAir: demVar.frictionAir,
                restitution: demVar.restitution,
                render: {
                    fillStyle: randomColor(),
                    strokeStyle: 'black',
                    lineWidth: 3
                },
                mass: mass*10e7
            })
        );
        demVar.objectsTrails.push([]);
        Matter.Body.setVelocity(demVar.objects[index], {
            x: Vx,
            y: Vy
        });
        World.add(engine.world, demVar.objects[index]);
        demVar.smallObjectVelocity.push({x: Vx, y: Vy});
    }


    function simpleOrbit(){
        resetSettings();
        World.clear(engine.world, true);
        demVar.objects = [];
        demVar.objectsTrails = [];
        // 5.609375
        addObjectInEnviroment(demVar.width*0.5, demVar.height*0.5, 50, 0, 0, 0, 1);
        addObjectInEnviroment(demVar.width*0.5-150, demVar.height*0.5, 10, 0, 0, 5.609375, 1/333000);
    }

    function grav4Bodies(){
        resetSettings();
        World.clear(engine.world, true);
        demVar.objects = [];
        demVar.objectsTrails = [];
        addObjectInEnviroment(demVar.width*0.5+100, demVar.height*0.5+100, 12, 0, 1, 0, 1);
        addObjectInEnviroment(demVar.width*0.5-100, demVar.height*0.5-100, 12, 0,-1, 0, 1);
        addObjectInEnviroment(demVar.width*0.5-100, demVar.height*0.5+100, 12, 0, 0, 1, 1);
        addObjectInEnviroment(demVar.width*0.5+100, demVar.height*0.5-100, 12, 0, 0,-1, 1);
    }

    engine.velocityIterations = 4;
    engine.positionIterations = 6;
    engine.world.gravity.y = 0;

    simpleOrbit()

    function gravity() {
        if(demVar.playing){
            var length = demVar.objects.length;
            for (var i = 1; i < length; i++) {
                for (var j = 0; j < length; j++) {
                        if (i != j) {
                            var Dx = demVar.objects[j].position.x - demVar.objects[i].position.x;
                            var Dy = demVar.objects[j].position.y - demVar.objects[i].position.y;
                            var force = (engine.timing.timestamp-demVar.lastTimeStamp) * demVar.gravityConstant * demVar.objects[j].mass * demVar.objects[i].mass / (Math.sqrt(Dx * Dx + Dy * Dy))
                            var angle = Math.atan2(Dy, Dx);
                            demVar.objects[i].force.x += force * Math.cos(angle)
                            demVar.objects[i].force.y += force * Math.sin(angle)
                            demVar.smallObjectVelocity[i].x = demVar.objects[i].velocity.x;
                            demVar.smallObjectVelocity[i].y = demVar.objects[i].velocity.y;
                        }
                }
            }
        }else{
            Body.setVelocity(demVar.objects[1], {x: 0, y: 0});
        }
        demVar.lastTimeStamp = engine.timing.timestamp;
    }

    function playPause(){
        if(demVar.playing && demVar.firstTime){
            for(var i = 0; i < demVar.objects.length; i++){
                Body.setVelocity(demVar.objects[i], {
                    x: demVar.smallObjectVelocity[i].x,
                    y: demVar.smallObjectVelocity[i].y
                });
            }
            demVar.firstTime = false;
        }
        gravity();
    }

    function getColor(bodyIndex, currentTrail, maxTrail){
        var rgb = [255/4,255/4,255/4];
        var i = bodyIndex % 2 + 1;
        rgb[i] = 255;
        var alpha = currentTrail/maxTrail;
        var ret = `rgba(`+rgb[1]+`,`+rgb[0]+`,`+rgb[2]+`,`+ alpha +`)`;
        return ret;
    }

    function renderTrails(){
        if(demVar.playing){
            for (var i = 0; i <  demVar.objectsTrails.length; i++) {
                demVar.objectsTrails[i].push({
                    position: Vector.clone(demVar.objects[i].position),
                    timestamp: engine.timing.timestamp,
                });
            }

            for (var i = 0; i < demVar.objectsTrails.length; i++) {
                for (var j = 0; j < demVar.objectsTrails[i].length; j++) {
                    if(((engine.timing.timestamp - demVar.objectsTrails[i][j].timestamp)/1000) > 1){
                        demVar.objectsTrails[i].shift();
                    }
                }
            }
        }
        Render.startViewTransform(render);
        for (var i = 0; i < demVar.objectsTrails.length; i++) {
            var len = demVar.objectsTrails[i].length;
            for (var j = 0; j < len; j++) {
                var point = demVar.objectsTrails[i][j].position;
                
                //color of the trace    
                render.context.fillStyle = getColor( i, j, len );
                //size of the dots
                render.context.fillRect(point.x, point.y, 2, 2);
            }
        }
        Render.endViewTransform(render);
    }

    Events.on( runner, "beforeTick", function(event) {
        playPause();
    } );

    Events.on( render, 'afterRender', function() {
        renderTrails();        
    });

    Events.on( runner, 'collisionStart', ({ pairs }) => {
        pairs.forEach(({ bodyA, bodyB }) => {
            if (bodyA !== demVar.objects[0]) Matter.World.remove(engine.world, bodyA);
            if (bodyB !== demVar.objects[0]) Matter.World.remove(engine.world, bodyB);
        });
    });

     document.getElementById('problemDescription').innerHTML = 
        `<p class="text-white text-center"> 
            Formula: $$F = {GM_1M_2 \\over R^2}$$
        </p>`;

    if(window.MathJax){
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('problemDescription')[0]]);
    }

    document.getElementById('settings').innerHTML = `
            <button type="button" class="btn btn-outline-secondary text-white" id="play-pause">Play</button>
    `;

    document.getElementById('play-pause').onclick = function(){
        demVar.playing = !demVar.playing;
        demVar.firstTime = true;
        document.getElementById('play-pause').innerHTML = (demVar.playing ? "Pause" : "Play");
    };

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