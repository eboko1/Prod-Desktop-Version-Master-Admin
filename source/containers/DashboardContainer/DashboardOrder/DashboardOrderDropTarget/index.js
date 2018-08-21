// vendor
import React, { Component } from 'react';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';

// own
import { DragItemTypes } from '../../dashboardConfig';

const orderTarget = {
    drop(props) {
        return {
            time: props.globalPosition,
            day:  props.day,
        };
    },
};

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        canDrop:           monitor.canDrop(),
    };
}

@DropTarget(DragItemTypes.ORDER, orderTarget, collectTarget)
class DashboardOrderDropTarget extends Component {
    _getOrderDropTargetRef = dropTarget => {
        this.orderDropTargetRef = dropTarget;
        this.props.connectDropTarget(dropTarget);
    };

    render() {
        const { isOver, canDrop } = this.props;

        return (
            <StyledDashboardOrderDropTarget
                innerRef={ dropTarget => this._getOrderDropTargetRef(dropTarget) }
                overlayDrop={ isOver && canDrop }
            />
        );
    }
}

const StyledDashboardOrderDropTarget = styled.div`
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: ${props => props.overlayDrop && 'var(--primary)'};
`;

export default DashboardOrderDropTarget;
