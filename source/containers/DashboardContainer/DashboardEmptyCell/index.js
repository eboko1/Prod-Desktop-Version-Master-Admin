// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';

// own
import { DragItemTypes, ROW_HEIGHT } from '../dashboardConfig';

const dropTarget = {
    drop(props, monitor) {
        const { mode, globalPosition, day, stationNum } = props;

        return {
            time:       globalPosition,
            day:        day,
            stationNum:
                mode === 'calendar' ? monitor.getItem().station : stationNum,
        };
    },
};

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver:            monitor.isOver(),
    canDrop:           monitor.canDrop(),
});

@DropTarget(DragItemTypes.ORDER, dropTarget, collect)
export default class DashboardEmptyCell extends Component {
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
            globalPosition,
            connectDropTarget,
            isOver,
            canDrop,
            children,
            // className,
        } = this.props;

        // console.log('→ EmptyCell globalPosition', globalPosition);
        // const backgroundColor = 'palevioletred';

        return (
            <StyledDashboardEmptyCell
                // className={ className }
                globalPosition={ globalPosition }
                innerRef={ cell => connectDropTarget(cell) }
            >
                { children }
                { isOver && !canDrop && <EmptyCellOverlay color={ 'red' } /> }
                { !isOver && canDrop && <EmptyCellOverlay color={ 'yellow' } /> }
                { isOver && canDrop && <EmptyCellOverlay color={ 'green' } /> }
            </StyledDashboardEmptyCell>
        );
    }
}

export const StyledDashboardEmptyCell = styled.div`
    height: ${ROW_HEIGHT}px;
    grid-column: ${props => `span ${props.column}`};
    ${
    '' /* background-color: ${props =>
        props.globalPosition % 2 ? '#fff' : 'var(--lightGray)'}; */
}
    background-color: ${props =>
        props.globalPosition % 2
            ? 'rgba(var(--warningRGB), 0.25)'
            : 'rgba(var(--warningRGB), 0.4)'};
        ${'' /* background-color: rgba(var(--warningRGB), 0.4); */}
`;

export const EmptyCellOverlay = styled.div`
    height: ${ROW_HEIGHT}px;
    grid-column: ${props => `span ${props.column}`};
    opacity: 0.5;
    background-color: ${props => props.color};
`;
