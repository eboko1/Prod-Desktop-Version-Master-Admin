//vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import styled from 'styled-components';

// import { canMoveOrder, moveOrder } from '../Game';
import { DragItemTypes, ROW_HEIGHT } from '../dashboardConfig';

const dragTarget = {
    canDrop(props) {
        // return canMoveOrder(props.x, props.y);
    },

    drop(props, monitor) {
        // moveOrder(props.x, props.y);
        console.group('→ drop (dragTarget/DashboardCell)');
        console.log('monitor: ', monitor);
        console.log('event: ', 'props.event', monitor.getItem());
        console.groupEnd();
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        // canDrop:           monitor.canDrop(),
    };
}

export const DashboardCell = styled.div`
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

@DropTarget(DragItemTypes.ORDER, dragTarget, collect)
export default class DashboardEmptyCell extends Component {
    static propTypes = {
        x:                 PropTypes.number,
        y:                 PropTypes.number,
        isOver:            PropTypes.bool,
        canDrop:           PropTypes.bool,
        connectDropTarget: PropTypes.func,
        children:          PropTypes.node,
    };

    renderOverlay(color) {
        return (
            <div
                style={ {
                    position:        'absolute',
                    top:             0,
                    left:            0,
                    height:          '100%',
                    width:           '100%',
                    zIndex:          1,
                    opacity:         0.5,
                    backgroundColor: color,
                } }
            />
        );
    }

    render() {
        const {
            x,
            y,
            connectDropTarget,
            isOver,
            canDrop,
            children,
        } = this.props;

        const backgroundColor = 'palevioletred';

        return connectDropTarget(
            <div
                style={ {
                    position: 'relative',
                    width:    '100%',
                    height:   '100%',
                } }
            >
                <div
                    style={ {
                        backgroundColor,
                        width:  '100%',
                        height: '100%',
                    } }
                >
                    { children }
                </div>
                { isOver && !canDrop && this.renderOverlay('red') }
                { !isOver && canDrop && this.renderOverlay('yellow') }
                { isOver && canDrop && this.renderOverlay('green') }
            </div>,
        );
    }
}
