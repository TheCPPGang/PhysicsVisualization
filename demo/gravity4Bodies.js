var Example = Example || {};

Example.gravity4Bodies = function(){
    var canvas = document.getElementById('diagram');

    var demVar = {
        width: 700,
        height: 400,
        gravity: 0.001,
        ballSize: 10,
        friction: 0,
        frictionStatic: 1,
        frictionAir: 0,
        restitution: 0.5,
        velocityVector: true,
        offset: 25,
        lastTimeStamp: 0,
        objects: [],
        objectsTrails: [],
        playing: false,
        firstTime: true,
        smallObjectVelocity: []
    }

    function resetSettings(){
        demVar.gravity = 0.001;
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

    function addObjectInEnviroment(x, y, r, sides, Vx, Vy){
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
                collisionFilter: {
                    mask: null
                }
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
        addObjectInEnviroment(demVar.width*0.5+100, demVar.height*0.5+100, 12, 0, 1, 0);
        addObjectInEnviroment(demVar.width*0.5-100, demVar.height*0.5-100, 12, 0,-1, 0);
        addObjectInEnviroment(demVar.width*0.5-100, demVar.height*0.5+100, 12, 0, 0, 1);
        addObjectInEnviroment(demVar.width*0.5+100, demVar.height*0.5-100, 12, 0, 0,-1);
    }

    engine.velocityIterations = 4;
    engine.positionIterations = 6;
    engine.world.gravity.y = 0;

    simpleOrbit()

    function gravity() {
        if(demVar.playing){
            var length = demVar.objects.length;
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                        if (i != j) {
                            var Dx = demVar.objects[j].position.x - demVar.objects[i].position.x;
                            var Dy = demVar.objects[j].position.y - demVar.objects[i].position.y;
                            var force = (engine.timing.timestamp-demVar.lastTimeStamp)*demVar.gravity * demVar.objects[j].mass * demVar.objects[i].mass / (Math.sqrt(Dx * Dx + Dy * Dy))
                            var angle = Math.atan2(Dy, Dx);
                            demVar.objects[i].force.x += force * Math.cos(angle);
                            demVar.objects[i].force.y += force * Math.sin(angle);
                            demVar.smallObjectVelocity[i].x = demVar.objects[i].velocity.x;
                            demVar.smallObjectVelocity[i].y = demVar.objects[i].velocity.y;
                        }
                }
            }
        }else{
            for (var i = 0; i < demVar.objects.length; i++) {
                Body.setVelocity(demVar.objects[i], {x: 0, y: 0});
            }
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
        var rgb;
        if(bodyIndex > 2){
            rgb = [255,215,0];
        }else{
            var i = bodyIndex % 3;
            rgb = [0,0,0];
            rgb[i] = 255;
        }
        var alpha = currentTrail/maxTrail;
        var ret = `rgba(` + rgb[0]+ `,` +rgb[1]+ `,` + rgb[2] + `,` + alpha + `)`;
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
                    if(((engine.timing.timestamp - demVar.objectsTrails[i][j].timestamp)/1000) > 10){
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

    Events.on(render, 'afterRender', function() {
        renderTrails();        
    });


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