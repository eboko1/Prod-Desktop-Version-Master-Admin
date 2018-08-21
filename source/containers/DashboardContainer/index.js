// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

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

    _renderDashboardContentColumn = column => {
        const {
            dashboard,
            days,
            mode,
            stations,
            orders,
            schedule,
            updateDashboardOrder,
        } = this.props;
        const { hideSourceOnDrag } = this.state;

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
                { /* { console.log('→ puzzle', puzzle) } */ }
                { puzzle.map(
                    ({ data: { result, maxRows, maxBlocks } }, index) => (
                        <DashboardContentBox
                            key={ index }
                            dashboard={ dashboard }
                            rows={ maxRows }
                            columns={ maxBlocks }
                        >
                            { /* { console.log('→ result', result) }
                            { console.log('→ maxRows', maxRows) }
                            { console.log('→ maxBlocks', maxBlocks) } */ }
                            { result.map(
                                (order, index) =>
                                    order.empty ? (
                                        <DashboardEmptyCell
                                            key={ index }
                                            { ...order }
                                            day={ days ? days[ column ] : null }
                                            station={
                                                stations
                                                    ? stations[ column ]
                                                    : null
                                            }
                                        />
                                    ) : (
                                        <DashboardOrder
                                            key={ index }
                                            status={
                                                result[ index ].options.status
                                            }
                                            id={ result[ index ].options.id }
                                            dashboardRef={ this._dashboardRef }
                                            dropOrder={ updateDashboardOrder }
                                            hideSourceOnDrag={ hideSourceOnDrag }
                                            label={ result[ index ].options.num }
                                            { ...order }
                                        >
                                            { /* { result[ index ].options.num }
                                            { order.rows > 1
                                                ? console.log('→ BIG')
                                                : console.log('→ LOLY') } */ }
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

export default withDnDropContext(DashboardContainer);
