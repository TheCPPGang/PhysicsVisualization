import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import SvgContainer from './SvgContainer';
import {
    Engine,
} from 'matter-js/src/module/main';
import PropTypes from 'prop-types';

class Render extends Component {
    static propTypes = {
        children: PropTypes.any,
    };

    static contextTypes = {
        engine: PropTypes.object
    };

    constructor(props){
        super(props);

        this.state = { timestamp: 0 };
        this.animationFrame = this.animationFrame.bind(this);
    }

    componentDidMount() {
        requestAnimationFrame(this.animationFrame);
    }

    render() {
        const { engine } = this.context;
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                timestamp: engine.timing.timestamp,
            })
        );

        return (
            <ContainerDimensions>
                <SvgContainer>
                    {childrenWithProps}
                </SvgContainer>
            </ContainerDimensions>
        )
    }

    animationFrame() {
        const delta = 1000 / 60;
        const { engine } = this.context;
        Engine.update(engine, delta);

        this.setState({
            timestamp: engine.timing.timestamp,
        });

        requestAnimationFrame(this.animationFrame);
    }
}

export default Render;
