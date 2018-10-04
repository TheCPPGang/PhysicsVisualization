import {
    MouseConstraint,
    Events,
    Bounds,
    Sleeping,
} from 'matter-js/src/module/main';

const SimpleMouseConstraint = Object.assign(MouseConstraint, {
    update: (mouseConstraint, bodies) => {
        var mouse = mouseConstraint.mouse,
            constraint = mouseConstraint.constraint,
            body = mouseConstraint.body;

        if (mouse.button === 0) {
            if (!constraint.bodyB) {
                for (var i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (Bounds.contains(body.bounds, mouse.position)) {
                        constraint.pointA = mouse.position;
                        constraint.bodyB = mouseConstraint.body = body;
                        constraint.pointB = {
                            x: mouse.position.x - body.position.x,
                            y: mouse.position.y - body.position.y
                        };
                        constraint.angleB = body.angle;

                        Sleeping.set(body, false);
                        Events.trigger(mouseConstraint, 'startdrag', { mouse: mouse, body: body });

                    }
                }
            } else {
                Sleeping.set(constraint.bodyB, false);
                constraint.pointA = mouse.position;
            }
        } else {
            constraint.bodyB = mouseConstraint.body = null;
            constraint.pointB = null;

            if (body)
                Events.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body: body });
        }
    }
});

export default SimpleMouseConstraint;