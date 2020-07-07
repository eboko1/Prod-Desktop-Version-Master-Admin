// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import withDnDropContext from 'utils/withDnDContext.js';
import { permissions, isForbidden } from 'utils';

// own
import DashboardEmptyCell from './DashboardEmptyCell';
import DashboardOrder from './DashboardOrder';
import DashboardTimeline from './DashboardTimeline';
import {
    DashboardAddOrderCell,
    DashboardAddOrderLink,
} from './DashboardAddOrderLink';
import {
    Dashboard,
    DashboardGrid,
    DashboardColumn,
    DashboardHead,
    DashboardAddOrderColumn,
    DashboardBody,
    DashboardContentColumn,
    DashboardContentBox,
    DashboardTimeCell,
    DashboardTitle,
    DashboardLoad,
} from './styled.js';

import getBeginDatetime from './dashboardCore/getBeginDatetime';
import mapOrders from './dashboardCore/mapOrders';
import ordersPuzzle from './dashboardCore/ordersPuzzle';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);
        this._dashboardRef = React.createRef();

        this.state = {
            currentDay:       moment().format('YYYY-MM-DD'),
            // dashboardRef: this._dashboardRef,
            hideSourceOnDrag: true,
            // mode:             props.mode === 'calendar',
        };
    }

    _hideSourceOnDrag = () =>
        this.setState({ hideSourceOnDrag: !this.state.hideSourceOnDrag });

    render() {
        const { dashboard, schedule, mode } = this.props;
        const timeColumn = this._renderTimeColumn();
        const dashboardColumns = this._renderDashboardColumns();
        const dashboardGhostColumns = this._renderDashboardGhostColumns();

        return (
            <Catcher>
                <Dashboard ref={ this._dashboardRef } className='withScroll'>
                    <DashboardTimeline schedule={ schedule } />
                    { timeColumn }
                    <DashboardGrid
                        columns={ dashboard.columns < 7 ? 7 : dashboard.columns }
                    >
                        { dashboardColumns }
                        { (mode === 'stations' || mode === 'employees')  &&
                            dashboard.columns < 7 &&
                            dashboardGhostColumns }
                    </DashboardGrid>
                </Dashboard>
            </Catcher>
        );
    }

    _linkToStations = day => this.props.linkToDashboardStations(day);
    _linkToEmployees = day => this.props.linkToDashboardEmployees(day);

    _renderTimeColumn = () => {
        const { dashboard, time } = this.props;

        return (
            <DashboardColumn dashboard={ dashboard } column={ 1 } time>
                <DashboardHead />
                { time.map(time => (
                    <React.Fragment key={ time }>
                        <DashboardTimeCell>{ time }</DashboardTimeCell>
                        <DashboardTimeCell />
                    </React.Fragment>
                )) }
            </DashboardColumn>
        );
    };

    _renderDashboardColumns = () => {
        const { dashboard, days, stations, employees, load, mode } = this.props;
        const { currentDay } = this.state;

        return [ ...Array(dashboard.columns).keys() ].map((_, index) => {
            const day = mode === 'calendar' ? days[ index ] : null;
            const selectedDay = this.props.date.format('YYYY-MM-DD');
            const employeeLoad = load.find((elem)=>elem.employeeId==employees[index].id);
            const employeeLoadCoefficient = employeeLoad ? employeeLoad.loadCoefficient : 0;
            return (
                <DashboardColumn
                    isMobile={window.innerWidth < 1200}
                    dashboard={ dashboard }
                    column={ 1 }
                    key={ index }
                    currentDay={ selectedDay }
                    day={ day }
                >
                    <DashboardHead dashboard={ dashboard } column={ 1 }>
                        { load.length && 
                            <>
                                <DashboardTitle>
                                    { mode === 'calendar' ? (
                                        <FormattedMessage
                                            id={ load[ index ].dayName }
                                        />
                                    ) : 
                                        mode === 'employees' ? 
                                            employees[ index ].employeeNum  :  
                                            load[ index ].stationNum
                                    }
                                </DashboardTitle>
                                <DashboardLoad
                                    loadCoefficient={
                                        mode === 'employees' ?
                                            employeeLoadCoefficient : 
                                            load[ index ].loadCoefficient
                                        
                                    }
                                    link={ mode === 'calendar' }
                                    onClick={ () =>
                                        this._linkToStations(days[ index ])
                                    }
                                >
                                    { mode === 'calendar'
                                        ? `${moment(
                                            load[ index ].beginDate,
                                        ).format('DD MMM')} -`
                                        : mode == 'employees' ?
                                            `${employees[ index ].name} ${employees[ index ].surname} - `
                                            : stations[ index ].name && `${stations[ index ].name} - ` }
                                    { mode == 'employees' ?
                                        Math.round(employeeLoadCoefficient) :
                                        Math.round(load[ index ].loadCoefficient) 
                                    }%
                                </DashboardLoad>
                            </>
                        }
                    </DashboardHead>
                    <DashboardBody>
                        { this._renderDashboardContentColumn(index) }
                        { this._renderDashboardAddOrderColumn(index, day) }
                    </DashboardBody>
                </DashboardColumn>
            );
        });
    };

    _renderDashboardContentColumn = column => {
        const {
            dashboard,
            days,
            stations,
            employees,
            orders,
            schedule,
            updateDashboardOrder,
            date,
            mode,
            user,
            daysWithConflicts,
            stationsWithConflicts,
            employeesWithConflicts,
        } = this.props;
        // const { hideSourceOnDrag } = this.state;

        const dashboardMode = mode === 'calendar';

        const columnsData = mode === 'calendar' ? days : (mode === 'employees' ? employees : stations);

        const columnId = dashboardMode
            ? columnsData
                ? columnsData[ column ]
                : null
            : mode === 'employees' ? 
                columnsData ?
                columnsData[ column ].id
                    : null
                :
                columnsData
                ? columnsData[ column ].num
                : null;

        const dashboardData = dashboardMode
            ? orders.filter(
                ({ beginDatetime }) =>
                    moment(beginDatetime).format('YYYY-MM-DD') === columnId,
            ) :
            mode === 'employees' ? 
                orders.filter(({ employeeId }) => employeeId === columnId)
                : orders.filter(({ stationNum }) => stationNum === columnId);

        const mappedOrders = mapOrders(
            schedule.beginHour,
            dashboard.rows,
            dashboardData,
        );

        const puzzle = ordersPuzzle(mappedOrders, dashboard.rows);

        return (
            <DashboardContentColumn dashboard={ dashboard }>
                { puzzle.map(
                    ({ data: { result, maxRows, maxBlocks } }, index) => (
                        <DashboardContentBox
                            key={ index }
                            dashboard={ dashboard }
                            rows={ maxRows }
                            columns={ maxBlocks }
                        >
                            { result.map(
                                (order, index) =>
                                    order.empty ? (
                                        <DashboardEmptyCell
                                            key={ index }
                                            daysWithConflicts={
                                                daysWithConflicts
                                            }
                                            stationsWithConflicts={
                                                stationsWithConflicts
                                            }
                                            employeesWithConflicts={
                                                employeesWithConflicts
                                            }

                                            mode={ mode }
                                            day={
                                                dashboardMode
                                                    ? days[ column ]
                                                    : date.format('YYYY-MM-DD')
                                            }
                                            stationNum={
                                                !dashboardMode
                                                    ? _.get(stations,`[${column}].num`,)
                                                    : column + 1
                                            }
                                            employeeId={
                                                _.get(employees,`[${column}].id`,)
                                            }
                                            { ...order }
                                        />
                                    ) : (
                                        <DashboardOrder
                                            user={ user }
                                            key={ index }
                                            mode={ mode }
                                            label={ {
                                                vehicleMakeName:
                                                    result[ index ].options
                                                        .vehicleMakeName,
                                                vehicleModelName:
                                                    result[ index ].options
                                                        .vehicleModelName,
                                                vehicleNumber:
                                                    result[ index ].options
                                                        .vehicleNumber,
                                                clientName:
                                                    result[ index ].options
                                                        .clientName,
                                                stationName:
                                                    result[ index ].options.
                                                        stationName,

                                            } }
                                            id={
                                                result[ index ].options.stationLoadId
                                            }
                                            status={
                                                result[ index ].options.status
                                            }
                                            dashboardRef={ this._dashboardRef }
                                            dropOrder={ updateDashboardOrder }
                                            // hideSourceOnDrag={ hideSourceOnDrag }
                                            schedule={ schedule }
                                            day={
                                                mode === 'calendar'
                                                    ? days[ column ]
                                                    : date.format('YYYY-MM-DD')
                                            }
                                            stationNum={
                                                mode == 'calendar'
                                                    ? result[ index ].options.stationNum 
                                                    : _.get(stations,`[${column}].num`,)
                                            }
                                            employeeId={
                                                result[ index ].options.employeeId 
                                            }
                                            { ...order }
                                        />
                                    ),
                            ) }
                        </DashboardContentBox>
                    ),
                ) }
            </DashboardContentColumn>
        );
    };

    _renderDashboardAddOrderColumn = (column, day) => {
        const {
            dashboard,
            days,
            date,
            stations,
            employees,
            schedule,
            mode,
            user,
            daysWithConflicts,
            stationsWithConflicts,
            employeesWithConflicts,
        } = this.props;

        const dashboardMode = mode === 'calendar';

        const setBeginDateitme = index => {
            if (mode !== 'calendar') {
                return getBeginDatetime(
                    date.format('YYYY-MM-DD'),
                    index,
                    schedule.beginHour,
                );
            }

            return getBeginDatetime(days[ column ], index, schedule.beginHour);
        };

        const showLink =
            !isForbidden(user, permissions.CREATE_DASHBOARD_ORDER) &&
            !isForbidden(user, permissions.SHOW_ORDERS);

        return (
            <DashboardAddOrderColumn
                dashboard={ dashboard }
                day={ day }
                daysWithConflicts={ daysWithConflicts }
                stationsWithConflicts={ stationsWithConflicts }
                employeesWithConflicts={ employeesWithConflicts }
                mode={ mode }
                stationNum={
                    !dashboardMode && _.get(stations, `[${column}].num`)
                }
                employeeId={
                    mode == 'employees' && employees[ column ].id
                }
            >
                { [ ...Array(dashboard.rows).keys() ].map((_, index) => (
                    <DashboardAddOrderCell key={ index }>
                        { showLink ? (
                            <DashboardAddOrderLink
                                time={ setBeginDateitme(index) }
                                stationNum={
                                    mode == 'stations' && stations[ column ].num
                                }
                                employeeId={
                                    mode == 'employees' && employees[ column ].id
                                }
                            />
                        ) : null }
                    </DashboardAddOrderCell>
                )) }
            </DashboardAddOrderColumn>
        );
    };

    _renderDashboardGhostColumns = () => {
        const { dashboard } = this.props;

        if (dashboard.columns < 7) {
            return [ ...Array(7 - dashboard.columns).keys() ].map((_, index) => (
                <DashboardColumn dashboard={ dashboard } column={ 1 } key={ index } />
            ));
        }

        return null;
    };
}

export default withDnDropContext(DashboardContainer);
