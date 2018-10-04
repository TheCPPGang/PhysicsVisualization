import React from 'react';

import FullScreen from './FullScreen';
import { Physics, Render, ControlConstraint, DeviceGravity } from '../Matter';
import Logo from './Logo';
import Cage from './Cage';

class Doodle extends React.Component {
    render() {
        return (
            <FullScreen>
                <Physics>
                    <Render>
                        <ControlConstraint />
                        <Cage />
                        <Logo />
                    </Render>
                </Physics>
            </FullScreen>
        );
    }
}

export default Doodle;