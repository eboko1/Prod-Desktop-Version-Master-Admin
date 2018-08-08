// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Catcher } from 'commons';

// own
import DashboardEmptyCell from './DashboardEmptyCell';
import DashboardOrder from './DashboardOrder';
import DashboardTooltip from './DashboardTooltip';
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

import mapOrders from './dashboardCore/mapOrders';
import ordersPuzzle from './dashboardCore/ordersPuzzle';

export default class DashboardContainer extends Component {
    _saveDashboardRef = dashboardRef => {
        this.dashboardRef = dashboardRef;
    };

    render() {
        const { dashboard } = this.props;

        const timeColumn = this._renderTimeColumn();
        const dashboardColumns = this._renderDashboardColumns();

        return (
            <Catcher>
                <Dashboard ref={ this._saveDashboardRef }>
                    { timeColumn }
                    <DashboardGrid columns={ dashboard.columns }>
                        { dashboardColumns }
                    </DashboardGrid>
                </Dashboard>
            </Catcher>
        );
    }

    _linkToStations = day => this.props.linkToDashboardStations(day);
    //     console.log('→ day', day);
    //     console.log(
    //         '→ this.props.linkToDashboardStations',
    //         this.props.linkToDashboardStations(day),
    //     );
    //
    // };

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
        const {
            dashboard,
            currentDay,
            days,
            stations,
            load,
            mode,
        } = this.props;

        return [ ...Array(dashboard.columns).keys() ].map((_, index) => (
            <DashboardColumn
                dashboard={ dashboard }
                column={ 1 }
                key={ index }
                currentDay={ currentDay }
                day={ days ? days[ index ] : null }
                station={ stations ? stations[ index ] : null }
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
                                    load[ index ].stationNum
                                }
                            </DashboardTitle>
                            <DashboardLoad
                                loadCoefficient={ load[ index ].loadCoefficient }
                                link={ mode === 'calendar' }
                                onClick={ () =>
                                    this._linkToStations(days[ index ])
                                }
                            >
                                { mode === 'calendar'
                                    ? `${moment(load[ index ].beginDate).format(
                                        'DD MMM',
                                    )} -`
                                    : stations[ index ].name &&
                                      `${stations[ index ].name} - ` }
                                { load[ index ].loadCoefficient }%
                            </DashboardLoad>
                        </>
                    }
                </DashboardHead>
                <DashboardBody>
                    { this._renderDashboardContentColumn(index) }
                    { this._renderDashboardAddOrderColumn() }
                </DashboardBody>
            </DashboardColumn>
        ));
    };

    _renderDashboardContentColumn = id => {
        const {
            dashboard,
            days,
            mode,
            stations,
            orders,
            schedule,
        } = this.props;
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

                                            <DashboardTooltip
                                                // id={ result[ index ].options.id }
                                                { ...order.options }
                                            />
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
        const { dashboard } = this.props;

        return (
            <DashboardAddOrderColumn dashboard={ dashboard }>
                { [ ...Array(dashboard.rows).keys() ].map((_, index) => (
                    <DashboardAddOrderCell key={ index }>
                        <DashboardAddOrderLink />
                    </DashboardAddOrderCell>
                )) }
            </DashboardAddOrderColumn>
        );
    };
}
