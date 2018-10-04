import React from 'react';
import {
    World,
    Mouse,
} from 'matter-js/src/module/main';
import SimpleMouseConstraint from '../Doodle/SimpleMouseConstraint';
import PropTypes from 'prop-types';

class ControlConstraint extends React.Component {
    static contextTypes = {
        engine: PropTypes.object
    };

    componentDidMount() {
        const { container } = this.props;
        const { engine } = this.context;


        // cheat just a little bit (matter mouse events don't work on <svg>)...
        const mouse = Mouse.create(container.element.parentNode),
            mouseConstraint = SimpleMouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });


        World.add(engine.world, mouseConstraint);

        Mouse.setOffset(mouse, {
            x: -container.innerWidth / 2,
            y: -container.innerHeight / 2
        });
        Mouse.setScale(mouse, {
            x: container.innerWidth / container.width,
            y: container.innerHeight / container.height,
        });

        //Events.on(mouseConstraint, 'mousedown', ({ mouse: { position: { x, y } } }) => console.log(`mousedown at ${x} ${y}`));
    }

    render() {
        return null;
    }
}

export default ControlConstraint;