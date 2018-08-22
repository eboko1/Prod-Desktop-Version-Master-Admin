//vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';
// import { Debounce, Throttle } from 'lodash-decorators';
import _ from 'lodash';

// import { canMoveOrder, moveOrder } from '../Game';
import { DragItemTypes, ROW_HEIGHT } from '../dashboardConfig';

// let flag = false;
// const hoverLog = (props, monitor, component) => {
//     console.group('hoverLog');
//     console.log('props: ', props);
//     console.log('monitor: ', monitor);
//     console.log('component: ', component);
//     console.groupEnd();
//     console.log('→ hoverLog -> flag', flag);
//     flag = false;
//     console.log('→ hoverLog -> flag false', flag);
// };
//
// const debounced = _.debounce(hoverLog, 2000);
//
// let flag2 = false;

const dropTarget = {
    // hover(props, monitor, component) {
    //     if (!flag) {
    //         // const debounced = _.debounce(
    //         //     () => hoverLog(props, monitor, component),
    //         //     2000,
    //         // );
    //         debounced(props, monitor, component);
    //         console.log('→ flag2', flag2);
    //         flag = true;
    //     }
    // },

    // @Debounce(5000)
    // canDrop(props, monitor) {
    //     console.log('→ canDrop props', props);
    //     console.log('→ canDrop monitor', monitor);
    //
    //     return {};
    //     // return canMoveOrder(props.x, props.y);
    // },

    drop(props, monitor) {
        // moveOrder(props.x, props.y);
        // console.group('@drop (dropTarget/DashboardCell)');
        // console.log('→ props: ', props);
        // console.log('→ monitor: ', monitor);
        // console.log('→ getItem: ', monitor.getItem());
        // console.groupEnd();
        // console.log('→ debounced', debounced(props, monitor));
        // console.log('→drop props', props);
        // debounced.cancel();

        return {
            time:       props.globalPosition,
            day:        props.day,
            stationNum: props.stationNum,
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
            x,
            y,
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
    background-color: ${props =>
        props.globalPosition % 2 ? '#fff' : 'var(--lightGray)'};
`;

export const EmptyCellOverlay = styled.div`
    height: ${ROW_HEIGHT}px;
    grid-column: ${props => `span ${props.column}`};
    opacity: 0.5;
    background-color: ${props => props.color};
`;

// export default DropTarget(DragItemTypes.ORDER, dropTarget, collect)(
//     DashboardEmptyCell,
// );
