import React from 'react';
import {
    Body,
    Bodies,
    World,
    Composite,
} from 'matter-js/src/module/main';
import PropTypes from 'prop-types';

class Cage extends React.Component {
    static propTypes = {
        container: PropTypes.shape({
            innerWidth: PropTypes.number,
            innerHeight: PropTypes.number,
        }),
    };
    static contextTypes = {
        engine: PropTypes.object
    };

    componentWillMount() {
        const { container } = this.props;

        World.add(this.context.engine.world, this.getCage(container));
    }

    componentWillUpdate(nextProps) {
        if (nextProps.container.innerWidth !== this.props.container.innerWidth ||
            nextProps.container.innerHeight !== this.props.container.innerHeight) {


            const newCage = this.getCage(nextProps.container);
            this.getCageBodies().forEach((cageBody, index) => {
                Body.setVertices(cageBody, newCage[index].vertices);
            });
        }
    }

    getCage = ({ innerWidth, innerHeight }) => [
        Bodies.rectangle(0, -(innerHeight + 1000) / 2, innerWidth, 1000, { isStatic: true, label: 'box' }),
        Bodies.rectangle(-(innerWidth + 1000) / 2, 0, 1000, innerHeight + 2000, { isStatic: true, label: 'box' }),
        Bodies.rectangle((innerWidth + 1000) / 2, 0, 1000, innerHeight + 2000, { isStatic: true, label: 'box' }),
        Bodies.rectangle(0, (innerHeight + 1000) / 2, innerWidth, 1000, { isStatic: true, label: 'box' }),
    ];

    getCageBodies() {
        return Composite.allBodies(this.context.engine.world)
            .filter((body) => body.label === 'box');
    }

    render() {
        return (
            <g>
                {this.getCageBodies().map((part, index) => (
                    <polygon points={part.vertices.map(vertex => `${vertex.x},${vertex.y}`).join(' ')}
                             key={`entity-${part.id}`}
                             stroke="currentColor"
                             strokeWidth={1.75}
                    />
                ))}
            </g>
        );
    }
}

export default Cage;