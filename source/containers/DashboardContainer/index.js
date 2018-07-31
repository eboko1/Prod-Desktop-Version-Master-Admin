// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
// import { v4 } from 'uuid';
// import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';

// own
import DashboardEmptyCell from './DashboardEmptyCell';
import DashboardOrder from './DashboardOrder';
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
// import { findOrder } from './dashboardConfig';
// import puzzledData from './dashboardCore/runner';
import mapOrders from './dashboardCore/mapOrders';
import buildPuzzle from './dashboardCore/build_puzzle';

export default class DashboardContainer extends Component {
    state = {
        currentDay: moment().format('YYYY-MM-DD'),
    };

    static getDerivedStateFromProps(props) {
        const { schedule, mode, stations, orders } = props;
        // console.log('_____ props', props);
        // const data = mapOrders(schedule.beginHour, orders);
        // const dashboardMode = mode === 'calendar';
        // get rows
        const time = Array(schedule.endHour)
            .fill(0)
            .map((_, index) => index + 1)
            .slice(schedule.beginHour - 1)
            .map(time => time >= 10 ? `${time}:00` : `0${time}:00`);

        const rows = time.length * 2;
        // get columns
        const stationsColumns = stations ? stations.length : 0;
        const dashboardGridColumns = mode === 'calendar' ? 7 : stationsColumns;
        const columns = dashboardGridColumns;

        // console.log('→ orders', orders);
        // const data = dashboardMode
        //     ? orders.filter(({ beginDatetime }) =>
        //         moment(beginDatetime).format('YYYY-MM-DD') === )
        //     : orders.filter(({ stationNum }) => stationNum === );

        // const ordersData = buildPuzzle(data, rows);
        // .map(col => col.map(item => item.y + item.columns))
        // .map(num => Math.max(...num.filter(_.isFinite)) + 1);
        const dashboard = { rows, columns };

        return { time, dashboard, dashboardGridColumns, mode };
    }

    // const columns = orders
    //     .map(col => col.map(item => item.y + item.columns))
    //     .map(num => Math.max(...num.filter(_.isFinite)) + 1);

    // const columns = Math.max(...mockDash.map(order => order.y)) + 1;

    /* didMount -> time () -> this.setState()
    // genRows -> function helper
    // genColumns
    */
    // componentDidMount() {
    //     const { mode, stations } = this.props;
    //     console.log('→ DMstations', stations);
    //     // const dashboardGridColumns = mode === 'calendar' ? 7 : stations.length;
    //     this.setState({ dashboardGridColumns: 7 });
    // }

    render() {
        const { dashboardGridColumns } = this.state;

        const timeColumn = this._renderTimeColumn();
        // const dashboardColumns = this._renderDashboardColumns();

        return (
            <Catcher>
                <Dashboard>
                    { timeColumn }
                    <DashboardGrid columns={ dashboardGridColumns }>
                        { Array(dashboardGridColumns)
                            .fill(0)
                            .map((_, index) =>
                                this._renderDashboardColumns(index)) }
                    </DashboardGrid>
                </Dashboard>
            </Catcher>
        );
    }

    _renderTimeColumn = () => {
        const { dashboard, time } = this.state;

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

    _renderDashboardColumns = index => {
        const { days, stations, load, mode } = this.props;
        const { dashboard, currentDay } = this.state;

        return (
            <DashboardColumn
                dashboard={ dashboard }
                column={ 1 }
                key={ index }
                currentDay={ currentDay }
                day={ days ? days[ index ] : null }
                station={ stations ? stations[ index ] : null }
            >
                <DashboardHead dashboard={ dashboard } column={ 1 }>
                    { load &&
                        <>
                            {/* {console.log('→ load.length', load.length)}
                            {console.log('→ load.[index]', load[ index ])} */}
                            <DashboardTitle>
                                { mode === 'calendar' ? (
                                    <FormattedMessage
                                        id={ load[ index ].dayName }
                                    />
                                ) :
                                    stations[ index ].name
                                }
                            </DashboardTitle>
                            <DashboardLoad
                                loadCoefficient={ load[ index ].loadCoefficient }
                            >
                                { moment(load[ index ].beginDate).format('DD MMM') }{ ' ' }
                                - { load[ index ].loadCoefficient }%
                            </DashboardLoad>
                        </>
                    }
                </DashboardHead>
                <DashboardBody>
                    { this._renderDashboardContentColumn(index) }
                    { this._renderDashboardAddOrderColumn() }
                </DashboardBody>
            </DashboardColumn>
        );
    };

    _renderDashboardContentColumn = id => {
        const { dashboard } = this.state;
        const { days, mode, stations, orders, schedule } = this.props;
        const dashboardMode = mode === 'calendar';
        const columnsData = dashboardMode ? days : stations;

        const columnId = dashboardMode
            ? columnsData
                ? columnsData[ id ]
                : null
            : columnsData
                ? columnsData[ id ].num
                : null;

        const dashboardData = dashboardMode
            ? orders.filter(
                ({ beginDatetime }) =>
                    moment(beginDatetime).format('YYYY-MM-DD') === columnId,
            )
            : orders.filter(({ stationNum }) => stationNum === columnId);

        const mappedOrders = mapOrders(
            schedule.beginHour,
            dashboard.rows,
            dashboardData,
        );

        const puzzle = buildPuzzle(mappedOrders, dashboard.rows);

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
                                            { ...order }
                                        />
                                    ) : (
                                        <DashboardOrder
                                            key={ index }
                                            status={
                                                result[ index ].options.status
                                            }
                                            id={ result[ index ].options.id }
                                            { ...order }
                                        >
                                            { result[ index ].options.num }
                                        </DashboardOrder>
                                    ),
                            ) }
                        </DashboardContentBox>
                    ),
                ) }
            </DashboardContentColumn>
        );
    };

    _renderDashboardAddOrderColumn = () => {
        const { dashboard } = this.state;

        return (
            <DashboardAddOrderColumn dashboard={ dashboard }>
                { Array(dashboard.rows)
                    .fill(0)
                    .map((_, index) => (
                        <DashboardAddOrderCell key={ index }>
                            <DashboardAddOrderLink />
                        </DashboardAddOrderCell>
                    )) }
            </DashboardAddOrderColumn>
        );
    };
}
