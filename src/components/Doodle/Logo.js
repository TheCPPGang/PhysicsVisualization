import React from 'react';
import { svgPathProperties } from 'svg-path-properties';
import {
    World,
    Vertices,
    Body,
    Vector,
    Composite,
} from 'matter-js/src/module/main';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-webpack-loader-syntax
import doodleSvg from './doodle.svg';

class Logo extends React.Component {
    static contextTypes = {
        engine: PropTypes.object
    };

    componentWillMount() {
        const { container: { innerWidth, innerHeight } } = this.props,

            svgPaths = this.getSvgPathPropertiesFrom(doodleSvg);

        const bodies = svgPaths
            .map(({ properties }) =>
                Array.from({ length: 4 * properties.getTotalLength() - 1 }, (_, i) => (i + 1) * 0.25)
                    .reduce((sampled, length) => {

                        const pointA = sampled[sampled.length - 1];
                        const pointB = properties.getPointAtLength(length);
                        const pointC = properties.getPointAtLength(length + 0.25);

                        if (Math.abs(Vector.angle(pointA, pointB) - Vector.angle(pointA, pointC)) > 0.0025) {
                            sampled.push(pointB);
                        }
                        return sampled;
                    }, [properties.getPointAtLength(0)]))
            .map((points) => points.reverse())
            .map((points) => Vertices.create(points))
            .map((vertices) => Vertices.scale(vertices, 10, 10, { x: 0, y: 0 }))
            .map((vertices) => Vertices.translate(vertices, Vector.create( 4*innerWidth / 5, 2 * innerHeight / 3), -0.5))
            .map((vertices, i) => Body.create({
                vertices,
                label: svgPaths[i].id,
                position: Vertices.centre(vertices),
            }));

        const filterByGroup = (group) => (body, index) => svgPaths[index].group === group;

        const letters = [
            Body.create({ label: 'logo', parts: bodies.filter(filterByGroup('letter-capital-d')) }),
            Body.create({ label: 'logo', parts: bodies.filter(filterByGroup('letter-o1')) }),
            Body.create({ label: 'logo', parts: bodies.filter(filterByGroup('letter-o2')) }),
            Body.create({ label: 'logo', parts: bodies.filter(filterByGroup('letter-d')) }),
            Body.create({ label: 'logo', parts: bodies.filter(filterByGroup('letter-l')) }),
            Body.create({ label: 'logo', parts: bodies.filter(filterByGroup('letter-e')) }),
        ];
        World.add(this.context.engine.world, letters);
    }

    getSvgPathPropertiesFrom(rawSvg) {
        const scratch = document.createElement('div');

        scratch.innerHTML = rawSvg;
        const paths = [].map.call(scratch.querySelectorAll('path'), (path) => path);

        return paths.map((path) => ({
            id: path.getAttribute('id'),
            group: path.getAttribute('class'),
            properties: svgPathProperties(path.getAttribute('d')),
        }));
    }

    render() {
        let bodies = Composite.allBodies(this.context.engine.world)
                .filter((body) => body.label === 'logo'),
            parts = [].concat.apply([], bodies.map((body) => body.parts.length > 1 ? body.parts.slice(1) : [body]));

        return (
            <g>
                {parts.map((part, index) => (
                    <polygon points={part.vertices.map(vertex => `${vertex.x.toFixed(1)},${vertex.y.toFixed(1)}`).join(' ')}
                             key={`entity-${part.id}`}
                             stroke="currentColor"
                             strokeWidth={1.75}
                    />
                ))}
            </g>
        );
    }
}

export default Logo;