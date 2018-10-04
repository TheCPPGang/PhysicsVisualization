import React from 'react';
import { deviceOrientation } from 'react-device-events'
import PropTypes from 'prop-types';

class DeviceGravity extends React.Component {
    static contextTypes = {
        engine: PropTypes.object
    };

    render() {
        let { gamma, beta } = this.props.deviceOrientation;
        const { engine } = this.context;

        if (gamma && beta) {
            engine.world.gravity.x = 0;
            engine.world.gravity.y = 0;
        }

        return null;
    }
}

export default deviceOrientation(DeviceGravity);