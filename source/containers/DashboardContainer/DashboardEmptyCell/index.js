//vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';

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
class DashboardEmptyCell extends Component {
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
            // className,
        } = this.props;

        // const backgroundColor = 'palevioletred';

        return (
            <StyledDashboardEmptyCell
                // className={ className }
                innerRef={ cell => connectDropTarget(cell) }
            >
                { children }
                { /* { isOver && !canDrop && this._renderOverlay('red') }
                { !isOver && canDrop && this._renderOverlay('yellow') }
                { isOver && canDrop && this._renderOverlay('green') } */ }
            </StyledDashboardEmptyCell>
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

export const StyledDashboardEmptyCell = styled.div`
    height: ${ROW_HEIGHT}px;
    grid-column: ${props => `span ${props.column}`};
`;

export default DropTarget(DragItemTypes.ORDER, dropTarget, collect)(
    DashboardEmptyCell,
);
