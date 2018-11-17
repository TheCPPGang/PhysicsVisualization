var Example = Example || {};

Example.universalGravitation = function(){
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
        playing: true,
        firstTime: true,
        smallObjectVelocity: [],
        defaultCat: 0x0001,
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
        Body = Matter.Body;



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
        addObjectInEnviroment(demVar.width*0.5, demVar.height*0.5, 50, 0, 0, 0);
        addObjectInEnviroment(demVar.width*0.5-150, demVar.height*0.5, 10, 0, 0, 6);
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

    Events.on( engine, "beforeTick", function(event) {
        playPause();
    } );

    // run the engine
    Engine.run( engine );

    Render.run( render );

    document.getElementById('equations').innerHTML = `
        <p>Equations</p>
        <div style="text-align:center">
            <button id="play-pause">Pause</button>
        </div>
    `;

    document.getElementById('play-pause').onclick = function(){
        demVar.playing = !demVar.playing;
        demVar.firstTime = true;
        document.getElementById('play-pause').innerHTML = (demVar.playing ? "Pause" : "Play");
    };

    return {
        engine: engine,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
        }
    };
};