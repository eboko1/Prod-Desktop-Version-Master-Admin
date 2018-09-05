// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { DragSource } from 'react-dnd';

// proj
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

// own
import DashboardOrderDropTarget from '../DashboardOrderDropTarget';
import DashboardTooltip from '../../DashboardTooltip';
import { DragItemTypes, ordersStatus } from '../../dashboardConfig';
import handleHover from '../../dashboardCore/handleHover';
import getBeginDatetime from '../../dashboardCore/getBeginDatetime';

const orderSource = {
    canDrag(props) {
        const canUpdate =
            !isForbidden(props.user, permissions.EDIT_DASHBOARD_ORDER) &&
            !isForbidden(props.user, permissions.ACCESS_ORDER_BODY);

        return canUpdate && props.status !== 'success';
    },

    beginDrag(props) {
        return { id: props.id, station: props.options.stationNum };
    },

    endDrag(props, monitor) {
        const { id, station } = monitor.getItem();
        const didDrop = monitor.didDrop();

        if (didDrop) {
            const { dropOrder, schedule, mode } = props;
            const { day, time, stationNum } = monitor.getDropResult();

            if (mode === 'calender') {
                dropOrder({
                    beginDatetime: getBeginDatetime(
                        day,
                        time,
                        schedule.beginHour,
                    ).toISOString(),
                    station,
                    id,
                });
            } else {
                dropOrder({
                    beginDatetime: getBeginDatetime(
                        day,
                        time,
                        schedule.beginHour,
                    ).toISOString(),
                    stationNum,
                    id,
                });
            }
        }

        if (!didDrop) {
            console.warn(`Order ${id} didn\'t dropped`);
        }
    },
};

const collectSource = (connect, monitor) => ({
    connectDragSource:  connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging:         monitor.isDragging(),
});

@withRouter
@DragSource(DragItemTypes.ORDER, orderSource, collectSource)
export default class DashboardOrderDragSource extends Component {
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
        resizePosition:  null,
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
            user,
            // hideSourceOnDrag,
        } = this.props;

        const { tooltipPosition } = this.state;
        const canOpenOrder =
            !isForbidden(user, permissions.OPEN_DASHBOARD_ORDER) &&
            !isForbidden(user, permissions.SHOW_ORDERS);

        const openOrder = () =>
            history.push(`${book.order}/${id}`, {
                fromDashboard: true,
            });

        return (
            <StyledDashboardOrder
                isdragging={ isDragging ? 1 : 0 }
                status={ status }
                x={ x }
                y={ y }
                columns={ columns }
                rows={ rows }
                { ...(canOpenOrder ? { onClick: openOrder } : {}) }
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

const StyledDashboardOrder = styled.div`
    position: relative;
    background: ${props => ordersStatus(props.status)};
    color: white;
    font-size: 12px;
    cursor: ${props => props.status === 'success' ? 'pointer' : 'move'};
    opacity: ${props => props.isdragging ? 0.5 : 1};
    ${
    '' /* grid-row: ${props => `${props.x + 1} / span ${props.rows}`};
    grid-column: ${props => `${props.y + 1} / span ${props.columns}`}; */
}
    ${
    '' /* https://stackoverflow.com/questions/43311943/prevent-content-from-expanding-grid-items */
} ${'' /* min-width: 0; */};
`;

const StyledDashboardOrderBox = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
