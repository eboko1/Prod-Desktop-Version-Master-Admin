// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
// import { v4 } from 'uuid';
import _ from 'lodash';
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

    // static defaultProps = {
    //     data: mapOrders(),
    // };

    static getDerivedStateFromProps(props) {
        const { schedule, mode, stations, orders } = props;

        // const data = mapOrders(schedule.beginHour, orders);
        const dashboardMode = mode === 'calendar';
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

        return { time, dashboard, dashboardGridColumns };
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
        const { days, stations, load } = this.props;
        // const { beginDate, dayName, loadCoefficient } = this.props.load;
        const { dashboard, currentDay } = this.state;

        // console.log('→ this.props.load', this.props.load);
        // console.log('→ dayName', dayName);

        return (
            <DashboardColumn
                dashboard={ dashboard }
                column={ 1 }
                key={ index }
                currentDay={ currentDay }
                day={ days ? days[ index ] : null }
            >
                <DashboardHead dashboard={ dashboard } column={ 1 }>
                    { load && 
                        <>
                            <DashboardTitle>
                                <FormattedMessage id={ load[ index ].dayName } />
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
        const { data, days, mode, stations, orders, schedule } = this.props;
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
        // console.log('→ dashboardData', dashboardData);

        const mappedOrders = mapOrders(
            schedule.beginHour,
            dashboard.rows,
            dashboardData,
        );
        // console.log('→ mappedOrders', mappedOrders);
        const puzzle = buildPuzzle(mappedOrders, dashboard.rows);

        return (
            <DashboardContentColumn dashboard={ dashboard }>
                { console.log('→ puzzle', puzzle) }
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
                            <DashboardAddOrderLink>
                                Add Order
                            </DashboardAddOrderLink>
                        </DashboardAddOrderCell>
                    )) }
            </DashboardAddOrderColumn>
        );
    };
}

// _rednderDashboardColumns = () => {
//     const { orders } = this.props;
//     const { dashboard } = this.state;
//
//     return orders.map((column, index) => {
//         return (
//             <DashboardColumn
//                 dashboard={ dashboard }
//                 column={ dashboard.columns[ index ] }
//                 key={ index }
//             >
//                 <DashboardHead
//                     dashboard={ dashboard }
//                     column={ dashboard.columns[ index ] }
//                 >
//                     Column { index + 1 }
//                 </DashboardHead>
//                 { column.map(order => (
//                     <DashboardOrder
//                         key={ order.id }
//                         order={ order }
//                         findOrder={ findOrder }
//                     />
//                 )) }
//
//                 { Array(dashboard.rows)
//                     .fill(0)
//                     .map((_, ind) => (
//                         <React.Fragment key={ `dashColumn-${ind}` }>
//                             <DashboardEmptyCell
//                                 column={ dashboard.columns[ index ] }
//                             />
//                             <DashboardAddOrderCell>
//                                 <DashboardAddOrderLink>
//                                     Add Order
//                                 </DashboardAddOrderLink>
//                             </DashboardAddOrderCell>
//                         </React.Fragment>
//                     )) }
//             </DashboardColumn>
//         );
//     });
// };

//
// <DashboardAddOrderCell>
//     <DashboardAddOrderLink>
//         Add Order
//     </DashboardAddOrderLink>
// </DashboardAddOrderCell>

// _renderTimeColumn = () => {};

// Button={() => this.wololol()}
//
// class {
//     state={ isModal: false}
//
//     method(){
//         this.setState({!isMenuOpen})
//     }
// }
//
// Modal={this.wololol} findSmth={method}>
//
//
//
// async fun*
// moveOrder(id, atIndex) {
//     const { order, index } = this.findOrder(id);
//     // this.setState(
//     //     update(this.state, {
//     //         orders: {
//     //             $splice: [[ index, 1 ], [ atIndex, 0, order ]],
//     //         },
//     //     }),
//     // );
// }
//
// findOrder(id) {
//     const { orders } = this.props;
//     const order = orders.filter(order => order.id === id)[ 0 ];
//
//     return {
//         order,
//         index: orders.indexOf(order),
//     };
// }

// const mockDash = [{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }];
// import './s.css';

// const mockDash = [[{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }], [{ x: 1, y: 0, columns: 1, rows: 2 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 7, y: 0, columns: 1, rows: 1 }, { x: 6, y: 1, columns: 1, rows: 2 }], [], [{ x: 2, y: 0, columns: 1, rows: 8 }], [{ x: 3, y: 0, columns: 1, rows: 3 }, { x: 5, y: 0, columns: 1, rows: 4 }], [], []];

// orders: [
//     [
//         { x: 0, y: 0, columns: 1, rows: 5, id: 123 },
//         // { x: 1, y: 1, columns: 1, rows: 3, id: 456 },
//         // { x: 2, y: 2, columns: 1, rows: 4, id: 789 },
//         // { x: 4, y: 1, columns: 1, rows: 2, id: 999 },
//         // { x: 6, y: 0, columns: 1, rows: 2, id: 888 },
//         // { x: 6, y: 1, columns: 1, rows: 2, id: 777 },
//         // { x: 6, y: 2, columns: 1, rows: 2, id: 666 },
//         // { x: 6, y: 3, columns: 1, rows: 2, id: 555 },
//     ],
//     [
//         { x: 1, y: 0, columns: 1, rows: 2, id: 444 },
//         { x: 1, y: 1, columns: 1, rows: 3, id: 333 },
//         { x: 2, y: 2, columns: 1, rows: 4, id: 222 },
//         { x: 4, y: 1, columns: 1, rows: 2, id: 111 },
//         { x: 7, y: 0, columns: 1, rows: 1, id: 1010 },
//         { x: 6, y: 1, columns: 1, rows: 2, id: 1212 },
//     ],
//     [],
//     [{ x: 2, y: 0, columns: 1, rows: 8, id: 322 }],
//     [
//         { x: 3, y: 0, columns: 1, rows: 3, id: 228 },
//         { x: 5, y: 0, columns: 1, rows: 4, id: 9000 },
//     ],
//     [],
//     [],
// ],
