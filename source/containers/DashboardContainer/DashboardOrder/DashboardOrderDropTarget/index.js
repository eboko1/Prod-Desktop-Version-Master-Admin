// vendor
import React, { Component } from 'react';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';

// own
import { DragItemTypes, ROW_HEIGHT } from '../../dashboardConfig';

const orderTarget = {
    drop(props) {
        return {
            time:       props.globalPosition,
            day:        props.day,
            stationNum: props.stationNum,
        };
    },
};

const collectTarget = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver:            monitor.isOver(),
    canDrop:           monitor.canDrop(),
});

@DropTarget(DragItemTypes.ORDER, orderTarget, collectTarget)
export default class DashboardOrderDropTarget extends Component {
    _getOrderDropTargetRef = dropTarget => {
        this.orderDropTargetRef = dropTarget;
        this.props.connectDropTarget(dropTarget);
    };

    render() {
        const { isOver, canDrop, label } = this.props;

        return (
            <StyledDashboardOrderDropTarget
                innerRef={ dropTarget => this._getOrderDropTargetRef(dropTarget) }
                overlayDrop={ isOver && canDrop }
            >
                { label }
            </StyledDashboardOrderDropTarget>
        );
    }
}

const StyledDashboardOrderDropTarget = styled.div`
    height: ${ROW_HEIGHT}px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: ${props => props.overlayDrop && 'var(--primary)'};
`;
