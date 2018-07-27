//vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import styled from 'styled-components';

// import { canMoveOrder, moveOrder } from '../Game';
import { DragItemTypes, ROW_HEIGHT } from '../dashboardConfig';

const dropTarget = {
    // canDrop(props) {
    //     // console.log('→ canDrop', props);
    //     // return canMoveOrder(props.x, props.y);
    // },

    drop(props, monitor) {
        // moveOrder(props.x, props.y);
        console.group('@drop (dropTarget/DashboardCell)');
        console.log('→ props: ', props);
        console.log('→ monitor: ', monitor);
        console.log('→ getItem: ', monitor.getItem());
        console.groupEnd();

        return {};
    },
};

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    // isOver:            monitor.isOver(),
    canDrop:           monitor.canDrop(),
});

// @DropTarget(DragItemTypes.ORDER, dropTarget, collect)
class DragTarget extends Component {
    static propTypes = {
        x:                 PropTypes.number,
        y:                 PropTypes.number,
        isOver:            PropTypes.bool,
        canDrop:           PropTypes.bool,
        connectDropTarget: PropTypes.func,
        children:          PropTypes.node,
    };

    render() {
        const {
            x,
            y,
            connectDropTarget,
            isOver,
            canDrop,
            children,
            className,
        } = this.props;

        // const backgroundColor = 'palevioletred';

        return connectDropTarget(
            <div className={ className }>
                { children }
                { /* { isOver && !canDrop && this._renderOverlay('red') }
                { !isOver && canDrop && this._renderOverlay('yellow') }
                { isOver && canDrop && this._renderOverlay('green') } */ }
            </div>,
        );
    }

    // _renderOverlay(color) {
    //     return (
    //         <div
    //             style={ {
    //                 position:        'absolute',
    //                 top:             0,
    //                 left:            0,
    //                 height:          '100%',
    //                 width:           '100%',
    //                 zIndex:          1,
    //                 opacity:         0.5,
    //                 backgroundColor: color,
    //             } }
    //         />
    //     );
    // }
}

export const DashboardEmptyCell = styled(DragTarget)`
    height: ${ROW_HEIGHT}px;
    border-bottom: 1px dashed red;
    background-color: #1eaafc;
    background-image: linear-gradient(
        130deg,
        #6c52d9 0%,
        #1eaafc 85%,
        #3edfd7 100%
    );
    grid-column: ${props => `span ${props.column}`};
`;

export default DropTarget(DragItemTypes.ORDER, dropTarget, collect)(
    DashboardEmptyCell,
);
