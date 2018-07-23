// vendor
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragSource, DropTarget } from 'react-dnd';

// own
import { DragItemTypes } from '../dashboardConfig';

const orderSource = {
    beginDrag(props) {
        // const { id, orders, findOrder } = props;
        console.log('→ aa', props);

        // console.log('→ beginDrag', {
        //     id:            id,
        //     originalIndex: findOrder(orders, id).index,
        // });
        return {};
        // return {
        //     id:            id,
        //     originalIndex: findOrder(orders, id).index,
        // };
    },

    // endDrag(props, monitor) {
    //     console.log('→ endDrag');
    //     const { id: droppedId, originalIndex } = monitor.getItem();
    //     const didDrop = monitor.didDrop();
    //
    //     if (didDrop) {
    //         console.log('→ did dropped', droppedId, originalIndex);
    //     }
    //
    //     if (!didDrop) {
    //         console.log('→ didn\'t dropped', droppedId, originalIndex);
    //         // props.moveOrder(droppedId, originalIndex);
    //     }
    // },
};

const orderTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(
            component,
        ).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveOrder(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        // connectDragPreview: connect.dragPreview(),
        isDragging:        monitor.isDragging(),
    };
}

// const DashboardOrder = styled.div`
//     background-image: linear-gradient(203deg, #3edfd7, #29a49d 90%);
//     border: 1px solid yellowgreen;
//     min-height: 30px;
//     cursor: move;
//     opacity: ${props => props.isDragging ? 0.5 : 1};
// `;

// @DropTarget(DragItemTypes.ORDER, orderTarget, connect => ({
//     connectDropTarget: connect.dropTarget(),
// }))
// @DragSource(DragItemTypes.ORDER, orderSource, (connect, monitor) => ({
//     connectDragSource: connect.dragSource(),
//     isDragging:        monitor.isDragging(),
// }))
class DragItem extends Component {
    static propTypes = {
        connectDragSource:  PropTypes.func,
        // connectDragSource:  PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func,
        isDragging:         PropTypes.bool,
    };

    static defaultProps = {
        isDragging: false,
    };

    render() {
        const { connectDragSource, isDragging } = this.props;
        // const { connectDragSource, connectDropTarget, isDragging } = this.props;

        return connectDragSource(
            // <div className={ this.props.className } isDragging={ isDragging }>
            <div
                className={ this.props.className }
                isdragging={ isDragging ? 1 : 0 }
            >
                { this.props.children }
            </div>,
        );
        // return connectDragSource(
        //     <div>
        //         <DashboardOrder
        //             isDragging={ isDragging }
        //             innerRef={ order => {
        //                 this.oroder = connectDragSource(order);
        //             } }
        //             // innerRef={ order => connectDragSource(order) }
        //         >
        //             → order →
        //         </DashboardOrder>,
        //     </div>,
        // );
        // return connectDragSource(
        //     connectDropTarget(
        //         <DashboardOrder
        //             isDragging={ isDragging }
        //             innerRef={ order => {
        //                 connectDragSource(order);
        //             } }
        //         >
        //             → order →
        //         </DashboardOrder>,
        //     ),
        // );
    }
}

const DashboardOrder = styled(DragItem)`
    background-image: linear-gradient(203deg, #3edfd7, #29a49d 90%);
    border: 1px solid yellowgreen;
    min-height: 30px;
    cursor: move;
    opacity: ${props => props.isDragging ? 0.5 : 1};
`;

export default DragSource(DragItemTypes.ORDER, orderSource, collect)(
    DashboardOrder,
);

// export default DragSource(DragItemTypes.ORDER, orderSource, collect)(DragItem);
