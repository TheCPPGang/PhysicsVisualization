import { Component } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-webpack-loader-syntax
// import 'expose-members?decomp!poly-decomp';
import {
    Engine,
} from 'matter-js/src/module/main';

class Physics extends Component {
    static childContextTypes = {
        engine: PropTypes.object
    };

    getChildContext() {
        return { engine: this.engine };
    }

    componentWillMount() {
        this.engine = Engine.create({
            enableSleeping: true,
            positionIterations: 2,
            velocityIterations: 2,
        });
    }

    componentWillUnmount() {
        this.engine.clear();
    }

    render() {
        return this.props.children;
    }
}

export default Physics;
