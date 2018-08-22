// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { DragSource } from 'react-dnd';
import moment from 'moment';

// proj
import book from 'routes/book';

// own
import DashboardOrderDropTarget from './DashboardOrderDropTarget';
import { DragItemTypes } from '../dashboardConfig';
import DashboardTooltip from '../DashboardTooltip';
import handleHover from '../dashboardCore/handleHover';

const orderSource = {
    beginDrag(props) {
        // console.log('^ beginDrag', props);

        return { ...props };
    },

    endDrag(props, monitor) {
        // console.log('^^ endDrag props', props);
        // console.log('^^ endDrag monitor', monitor.getItem());

        const { id } = monitor.getItem();
        const didDrop = monitor.didDrop();

        if (didDrop) {
            const { dropOrder, schedule } = props;

            const { day, time, stationNum } = monitor.getDropResult();

            const orderHour = time + schedule.beginHour * 2;
            const timeString =
                orderHour % 2
                    ? `${Math.floor(orderHour / 2)}:30`
                    : `${orderHour / 2}:00`;
            console.log('→ endDrag', day);
            console.log('→ endDrag', stationNum);
            const newBeginDatetime = moment(`${day} ${timeString}`);

            dropOrder({
                beginDatetime: newBeginDatetime.toISOString(),
                stationNum,
                id,
            });
        }

        if (!didDrop) {
            console.warn(`Order ${id} didn\'t dropped`);
        }
    },
};

function collectSource(connect, monitor) {
    return {
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

@withRouter
@DragSource(DragItemTypes.ORDER, orderSource, collectSource)
export default class DashboardOrder extends Component {
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
            isDragging,
            x,
            y,
            columns,
            rows,
            id,
            status,
            dashboardRef,
            options,
            // hideSourceOnDrag,
        } = this.props;

        const { tooltipPosition } = this.state;

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
                innerRef={ order => this._getOrderRef(order) }
            >
                <StyledDashboardOrderBox>
                    { [ ...Array(rows).keys() ].map((_, index) =>
                        this._renderDashboardOrderDropTarget(index)) }
                </StyledDashboardOrderBox>
                <DashboardTooltip position={ tooltipPosition } { ...options } />
            </StyledDashboardOrder>
        );
    }

    _renderDashboardOrderDropTarget = index => {
        const { day, stationNum, globalPosition, label } = this.props;

        return (
            <DashboardOrderDropTarget
                key={ index }
                day={ day }
                stationNum={ stationNum }
                globalPosition={ globalPosition + index }
                label={ index === 0 ? label : null }
            />
        );
    };
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
    min-height: 28px;
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
