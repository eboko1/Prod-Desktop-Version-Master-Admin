// vendor
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { DragSource, DropTarget } from 'react-dnd';

// proj
import book from 'routes/book';

// own
import { DragItemTypes } from '../dashboardConfig';
import DashboardTooltip from '../DashboardTooltip';
import handleHover from '../dashboardCore/handleHover';

const orderSource = {
    beginDrag(props) {
        console.log('^ beginDrag', props);

        return { ...props };
    },

    endDrag(props, monitor) {
        console.log('^^ endDrag props', props);
        console.log('^^ endDrag monitor', monitor.getItem());

        const { id, x, y, rows, columns } = monitor.getItem();
        const didDrop = monitor.didDrop();

        if (didDrop) {
            console.log('→ dropOrder', props.dropOrder);
            console.log('→ did dropped', props);
            //TODO: call drop action
        }

        if (!didDrop) {
            console.log('→ didn\'t dropped', id);
        }
    },
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
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

// @DropTarget(DragItemTypes.ORDER, orderTarget, connect => ({
//     connectDropTarget: connect.dropTarget(),
// }))
// @DragSource(DragItemTypes.ORDER, orderSource, (connect, monitor) => ({
//     connectDragSource: connect.dragSource(),
//     isDragging:        monitor.isDragging(),
// }))

@withRouter
class DashboardOrder extends Component {
    static propTypes = {
        connectDragSource:  PropTypes.func,
        connectDragPreview: PropTypes.func,
        isDragging:         PropTypes.bool,
    };

    static defaultProps = {
        isDragging: false,
    };

    state = {
        tooltipPosition: null,
    };

    _getOrderRef = order => {
        this.orderRef = order;
        this.props.connectDragSource(order);
    };

    _showDashboardTooltip = (ev, order, dashboard) => {
        const tooltipPosition = handleHover(ev, order, dashboard);
        this.setState({ tooltipPosition });
    };

    _hideDashboardTooltip = () => this.setState({ tooltipPosition: null });

    render() {
        const {
            history,
            connectDragSource,
            isDragging,
            className,
            children,
            x,
            y,
            columns,
            rows,
            id,
            status,
            dashboardRef,
            options,
            dropOrder,
            hideSourceOnDrag,
            label,
        } = this.props;

        const { tooltipPosition } = this.state;

        // if (isDragging && hideSourceOnDrag) {
        //     return null;
        // }

        return (
            <StyledDashboardOrder
                isdragging={ isDragging ? 1 : 0 }
                status={ status }
                x={ x }
                y={ y }
                columns={ columns }
                rows={ rows }
                onClick={ () => history.push(`${book.order}/${id}`) }
                onMouseEnter={ ev =>
                    this._showDashboardTooltip(
                        ev,
                        this.orderRef.getBoundingClientRect(),
                        dashboardRef,
                    )
                }
                onMouseDown={ this._hideDashboardTooltip }
                onMouseLeave={ this._hideDashboardTooltip }
                // className={ className }
                innerRef={ order => this._getOrderRef(order) }
            >
                { /* { console.log('→ this.props', this.props) } */ }
                <StyledDashboardOrderBox>
                    { [ ...Array(rows).keys() ].map(
                        (_, index) =>
                            index === 0 ? (
                                <StyledOrderDropTarget key={ index }>
                                    { label }
                                </StyledOrderDropTarget>
                            ) : (
                                <StyledOrderDropTarget key={ index } />
                            ),
                    ) }
                </StyledDashboardOrderBox>
                <DashboardTooltip position={ tooltipPosition } { ...options } />
            </StyledDashboardOrder>
        );
    }
}

const _ordersStatus = status => {
    switch (status) {
        case 'reserve':
            return 'var(--reserve)';
        case 'not_complete':
            return 'var(--approve)';
        case 'required':
            return 'var(--required)';
        case 'approve':
            return 'var(--approve)';
        case 'progress':
            return 'var(--progress)';
        case 'success':
            return 'var(--success)';
        case 'cancel':
            return 'var(--cancel)';
        default:
            return '#ddd';
    }
};

const StyledDashboardOrder = styled.div`
    position: relative;
    background: ${props => _ordersStatus(props.status)};
    margin: 1px;
    padding: 1px;
    color: white;
    font-size: 12px;
    ${'' /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */} min-height: 28px;
    cursor: move;
    opacity: ${props => props.isdragging ? 0.5 : 1};
    grid-row: ${props => `${props.x + 1} / span ${props.rows}`};
    grid-column: ${props => `${props.y + 1} / span ${props.columns}`};
    ${'' /* https://stackoverflow.com/questions/43311943/prevent-content-from-expanding-grid-items */} min-width: 0;
`;

const StyledDashboardOrderBox = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StyledOrderDropTarget = styled.div`
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export default DragSource(DragItemTypes.ORDER, orderSource, collect)(
    DashboardOrder,
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
