// vendor
import React, { Component } from 'react';
import { v4 } from 'uuid';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import { Catcher } from 'commons';

// own
// import DashboardEmptyCell from './DashboardEmptyCell';
// import DashboardOrder from './DashboardOrder';
import {
    DashboardAddOrderCell,
    DashboardAddOrderLink,
} from './DashboardAddOrderLink';
import { ROW_HEIGHT } from './dashboardConfig';

import { DashboardGrid, DashboardColumn, DashboardHead } from './styled.js';

const mockDash = [[{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }], [{ x: 1, y: 0, columns: 1, rows: 2 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 7, y: 0, columns: 1, rows: 1 }, { x: 6, y: 1, columns: 1, rows: 2 }], [], [{ x: 2, y: 0, columns: 1, rows: 8 }], [{ x: 3, y: 0, columns: 1, rows: 3 }, { x: 5, y: 0, columns: 1, rows: 4 }], [], []];

// Replace with DashboardEmptyCell Component
const DashboardEmptyCell = styled.div`
    height: ${ROW_HEIGHT}px;
    border-bottom: 1px dashed red;
    background-color: #1eaafc;
    background-image: linear-gradient(
        130deg,
        #6c52d9 0%,
        #1eaafc 85%,
        #3edfd7 100%
    );
    grid-column: ${props => `span ${props.column}`};
`;

export default class DashboardContainer extends Component {
    state = {};

    static defaultProps = {
        orders: [[{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }], [{ x: 1, y: 0, columns: 1, rows: 2 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 7, y: 0, columns: 1, rows: 1 }, { x: 6, y: 1, columns: 1, rows: 2 }], [], [{ x: 2, y: 0, columns: 1, rows: 8 }], [{ x: 3, y: 0, columns: 1, rows: 3 }, { x: 5, y: 0, columns: 1, rows: 4 }], [], []],
    };

    static getDerivedStateFromProps(props) {
        // console.log('→ getDerivedStateFromProps');

        const time = Array(props.schedule.endHour)
            .fill(0)
            .map((_, index) => index + 1)
            .slice(props.schedule.beginHour - 1)
            .map(time => time >= 10 ? `${time}:00` : `0${time}:00`);

        const rows = time.length * 2;
        const columns = mockDash
            .map(col => col.map(item => item.y))
            .map(num => Math.max(_.isFinite(...num)) + 1);
        // const columns = Math.max(...mockDash.map(order => order.y)) + 1;
        const grid = Number(rows);
        const dashboard = {
            rows,
            columns,
            grid,
        };

        return { time, dashboard };
    }

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

    render() {
        // const { schedule } = this.props;
        const { dashboard, time } = this.state;

        return (
            <Catcher>
                <DashboardGrid>
                    <DashboardColumn dashboard={ dashboard } column={ 1 } time>
                        <DashboardHead column={ 0 }>Time</DashboardHead>
                        { time.map(time => (
                            <React.Fragment key={ time }>
                                <DashboardEmptyCell>{ time }</DashboardEmptyCell>
                                <DashboardEmptyCell />
                            </React.Fragment>
                        )) }
                    </DashboardColumn>
                    { mockDash.map((column, index) => {
                        return (
                            <DashboardColumn
                                dashboard={ dashboard }
                                column={ dashboard.columns[ index ] }
                                key={ index }
                            >
                                <DashboardHead
                                    dashboard={ dashboard }
                                    column={ dashboard.columns[ index ] }
                                >
                                    Column { index + 1 }
                                </DashboardHead>
                                { /* <DashboardOrder /> */ }
                                { Array(dashboard.grid)
                                    .fill(0)
                                    .map(() => (
                                        <React.Fragment key={ v4() }>
                                            <DashboardEmptyCell
                                                column={
                                                    dashboard.columns[ index ]
                                                }
                                            />
                                            <DashboardAddOrderCell>
                                                <DashboardAddOrderLink>
                                                    Add Order
                                                </DashboardAddOrderLink>
                                            </DashboardAddOrderCell>
                                        </React.Fragment>
                                    )) }
                            </DashboardColumn>
                        );
                    }) }
                </DashboardGrid>
            </Catcher>
        );
    }
}

// const mockDash = [{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }];
// import './s.css';
