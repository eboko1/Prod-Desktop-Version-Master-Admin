// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import withDnDropContext from 'utils/withDnDContext.js';

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
        const { dashboard, schedule } = this.props;

        const timeColumn = this._renderTimeColumn();
        const dashboardColumns = this._renderDashboardColumns();

        return (
            <Catcher>
                <Dashboard innerRef={ this._dashboardRef }>
                    <DashboardTimeline schedule={ schedule } />
                    { timeColumn }
                    <DashboardGrid columns={ dashboard.columns }>
                        { dashboardColumns }
                    </DashboardGrid>
                </Dashboard>
            </Catcher>
        );
    }

    _linkToStations = day => this.props.linkToDashboardStations(day);

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
        const { dashboard, days, stations, load, mode } = this.props;
        const { currentDay } = this.state;
        console.log('→ dashboard', dashboard);

        return [ ...Array(dashboard.columns).keys() ].map((_, index) => (
            <DashboardColumn
                dashboard={ dashboard }
                column={ 1 }
                key={ index }
                currentDay={ currentDay }
                day={ mode === 'calendar' ? days[ index ] : null }
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
                    { this._renderDashboardAddOrderColumn(index) }
                </DashboardBody>
            </DashboardColumn>
        ));
    };

    _renderDashboardContentColumn = column => {
        const {
            dashboard,
            days,
            stations,
            orders,
            schedule,
            updateDashboardOrder,
            date,
            mode,
        } = this.props;
        // const { hideSourceOnDrag } = this.state;

        const dashboardMode = mode === 'calendar';

        const columnsData = dashboardMode ? days : stations;

        const columnId = dashboardMode
            ? columnsData
                ? columnsData[ column ]
                : null
            : columnsData
                ? columnsData[ column ].num
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
                                            mode={ mode }
                                            day={
                                                dashboardMode
                                                    ? days[ column ]
                                                    : date.format('YYYY-MM-DD')
                                            }
                                            stationNum={ _.get(
                                                stations,
                                                `[${column}].num`,
                                            ) }
                                            { ...order }
                                        />
                                    ) : (
                                        <DashboardOrder
                                            key={ index }
                                            mode={ mode }
                                            label={ result[ index ].options.num }
                                            id={ result[ index ].options.id }
                                            status={
                                                result[ index ].options.status
                                            }
                                            dashboardRef={ this._dashboardRef }
                                            dropOrder={ updateDashboardOrder }
                                            // hideSourceOnDrag={ hideSourceOnDrag }
                                            schedule={ schedule }
                                            day={
                                                dashboardMode
                                                    ? days[ column ]
                                                    : date.format('YYYY-MM-DD')
                                            }
                                            stationNum={ stations[ column ].num }
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

    _renderDashboardAddOrderColumn = column => {
        const { dashboard, days, stations, schedule, mode } = this.props;

        return (
            <DashboardAddOrderColumn dashboard={ dashboard }>
                { [ ...Array(dashboard.rows).keys() ].map((_, index) => (
                    <DashboardAddOrderCell key={ index }>
                        <DashboardAddOrderLink
                            time={ getBeginDatetime(
                                days[ column ],
                                index,
                                schedule.beginHour,
                            ) }
                            stationNum={
                                mode !== 'calendar' && stations[ column ].num
                            }
                        />
                    </DashboardAddOrderCell>
                )) }
            </DashboardAddOrderColumn>
        );
    };
}

export default withDnDropContext(DashboardContainer);
