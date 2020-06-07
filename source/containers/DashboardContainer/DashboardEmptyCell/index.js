// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';

// own
import { DragItemTypes, ROW_HEIGHT } from '../dashboardConfig';

const dropTarget = {
    drop(props, monitor) {
        const { mode, globalPosition, day, stationNum, employeeId } = props;

        return {
            time:       globalPosition,
            day:        day,
            stationNum:
                mode === 'calendar' ? monitor.getItem().station : stationNum,
            employeeId: employeeId,
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
            mode,
            daysWithConflicts,
            day,
            stationsWithConflicts,
            employeesWithConflicts,
            stationNum,
            employeeId,
        } = this.props;

        return (
            <StyledDashboardEmptyCell
                // className={ className }
                mode={ mode }
                daysWithConflicts={ daysWithConflicts }
                stationsWithConflicts={ stationsWithConflicts }
                employeesWithConflicts={ employeesWithConflicts }
                day={ day }
                stationNum={ stationNum }
                employeeId={ employeeId }
                globalPosition={ globalPosition }
                ref={ cell => connectDropTarget(cell) }
            >
                { children }
                { isOver && !canDrop && <EmptyCellOverlay color={ 'red' } /> }
                { !isOver && canDrop && <EmptyCellOverlay color={ 'yellow' } /> }
                { isOver && canDrop && <EmptyCellOverlay color={ 'green' } /> }
            </StyledDashboardEmptyCell>
        );
    }
}
/* eslint-disable func-names */
export const StyledDashboardEmptyCell = styled.div`
    height: ${ROW_HEIGHT}px;
    grid-column: ${props => `span ${props.column}`};
    background-color: ${function({
        mode,
        daysWithConflicts,
        stationsWithConflicts,
        employeesWithConflicts,
        day,
        stationNum,
        employeeId,
        globalPosition,
    }) {
        if (mode === 'calendar') {
            if (daysWithConflicts.includes(day)) {
                return globalPosition % 2
                    ? 'rgba(var(--warningRGB), 0.3)'
                    : 'rgba(var(--warningRGB), 0.5)';
            }

            return globalPosition % 2 ? 'white' : 'var(--snow)';
        }
        if(mode === 'stations') {
            if (stationsWithConflicts.includes(stationNum)) {
                return globalPosition % 2
                    ? 'rgba(var(--warningRGB), 0.3)'
                    : 'rgba(var(--warningRGB), 0.5)';
            }

            return globalPosition % 2 ? 'white' : 'var(--snow)';
        }
        if(mode === 'employees') {
            if (employeesWithConflicts.includes(employeeId)) {
                return globalPosition % 2
                    ? 'rgba(var(--warningRGB), 0.3)'
                    : 'rgba(var(--warningRGB), 0.5)';
            }

            return globalPosition % 2 ? 'white' : 'var(--snow)';
        }

        return globalPosition % 2 ? 'white' : 'var(--snow)';
    }};
`;

export const EmptyCellOverlay = styled.div`
    height: ${ROW_HEIGHT}px;
    grid-column: ${props => `span ${props.column}`};
    opacity: 0.5;
    background-color: ${props => props.color};
`;
