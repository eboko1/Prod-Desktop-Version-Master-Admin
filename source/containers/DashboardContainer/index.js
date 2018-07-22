import React, { Component } from 'react';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';

// own
import DragItem from './DragItem';
import {
    DashboardColumn,
    DashboardHead,
    DashboardEmptyCell,
    // DashboardAddOrderColumn,
    DashboardAddOrderCell,
    DashboardAddOrderLink,
} from './styled';
import Styles from './styles.m.css';
import './s.css';

const mockDash = [[{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }], [{ x: 1, y: 0, columns: 1, rows: 2 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 7, y: 0, columns: 1, rows: 1 }, { x: 6, y: 1, columns: 1, rows: 2 }], [], [{ x: 2, y: 0, columns: 1, rows: 8 }], [{ x: 3, y: 0, columns: 1, rows: 3 }, { x: 5, y: 0, columns: 1, rows: 4 }], [], []];
// const mockDash = [{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }];

export default class DashboardContainer extends Component {
    state = {};

    static getDerivedStateFromProps(props, state) {
        console.log('→ getDerivedStateFromProps');

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

    render() {
        const { schedule } = this.props;
        const { dashboard, time } = this.state;
        console.log('→ dashboard', dashboard);

        return (
            <Catcher>
                <div className={ Styles.grid }>
                    <div className={ Styles.gridColumn }>
                        <DashboardHead>time</DashboardHead>
                        { time.map(time => (
                            <React.Fragment key={ time }>
                                <div className={ Styles.gridTimeCell }>
                                    { time }
                                </div>
                                <div className={ Styles.gridEmptyCell } />
                            </React.Fragment>
                        )) }
                    </div>
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
                                    styled 2
                                </DashboardHead>
                                { Array(dashboard.grid)
                                    .fill(0)
                                    .map(() => (
                                        <React.Fragment key={ v4() }>
                                            <DashboardEmptyCell
                                                // dashboard={ dashboard }
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
                </div>
            </Catcher>
        );
    }
}
