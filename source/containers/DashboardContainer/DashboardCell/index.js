import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import { canMoveOrder, moveOrder } from '../Game';
import DragItemsTypes from '../DragItemsTypes';

const dragTarget = {
    canDrop(props) {
        return canMoveOrder(props.x, props.y);
    },

    drop(props) {
        moveOrder(props.x, props.y);
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        canDrop:           monitor.canDrop(),
    };
}

@DropTarget(DragItemsTypes.ORDER, dragTarget, collect)
export default class DashboardCell extends Component {
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
