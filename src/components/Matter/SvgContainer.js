import React from 'react';
import PropTypes from 'prop-types';

class SvgContainer extends React.PureComponent {
    static propTypes = {
        children: PropTypes.any,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = { svgElement: null };
    }

    render() {
        const {
            children,
            width,
            height,
        } = this.props;
        const aspectRatio =  width / height || 1,
            innerWidth = aspectRatio > 1 ? aspectRatio * 1000 : 1000,
            innerHeight = aspectRatio > 1 ? 1000 :  1000 / aspectRatio;

        const childrenWithProps = React.Children.map(this.state.svgElement ? children : [],
            (child) => React.cloneElement(child, {
                container: { innerWidth, innerHeight, width, height, element: this.state.svgElement },
            })
        );

        return (
            <svg width={width}
                 height={height}
                 viewBox={`${-innerWidth / 2} ${-innerHeight / 2} ${innerWidth} ${innerHeight}`}
                 ref={element => !this.state.svgElement && this.setState({ svgElement: element})}
            >
                {childrenWithProps}
            </svg>
        );
    }
}

export default SvgContainer;