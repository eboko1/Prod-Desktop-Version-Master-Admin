import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { v4 } from 'uuid';
import {
    Title,
    Wrapper,
    Input,
    DashboardColumn,
    DashboardHead,
    DashboardEmptyCell,
} from './styled';

// proj

import { Catcher } from 'commons';
// import { Dashboard } from 'components';

// own
import Styles from './styles.m.css';
import './s.css';

// const Title = styled.h1`
//     font-size: 1.5em;
//     text-align: center;
//     color: palevioletred;
// `;
//
// const Wrapper = styled.section`
//     padding: 1em;
//     background: papayawhip;
// `;

const mockDash = [{ x: 0, y: 0, columns: 1, rows: 5 }, { x: 1, y: 1, columns: 1, rows: 3 }, { x: 2, y: 2, columns: 1, rows: 4 }, { x: 4, y: 1, columns: 1, rows: 2 }, { x: 6, y: 0, columns: 1, rows: 2 }, { x: 6, y: 1, columns: 1, rows: 2 }, { x: 6, y: 2, columns: 1, rows: 2 }, { x: 6, y: 3, columns: 1, rows: 2 }];

export default class DashboardContainer extends Component {
    render() {
        const { schedule } = this.props;

        console.log('→ mockDash', mockDash);

        // const formatTime = time =>
        //     time < 10 ? `${time.toStirng()}:00` : `0${time.toString()}:00`;

        const genScheduler = Array(schedule.endHour)
            .fill(0)
            .map((e, i) => i + 1)
            .slice(schedule.beginHour - 1);

        const time = genScheduler.map(
            time => time >= 10 ? `${time}:00` : `0${time}:00`,
        );

        const genDashboard = (genScheduler, mockDash) => {
            console.log('→ genScheduler', genScheduler.length);
            const rows = genScheduler.length * 2;
            const columns = Math.max(...mockDash.map(order => order.y));
            const dashboard = {
                rows,
                columns,
            };

            return dashboard;
        };

        return (
            <Catcher>
                { /* <Wrapper mockDash={ mockDash }>
                    <Title>Styled Dash!</Title>
                    <Input { ...this.props } />
                </Wrapper> */ }
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
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>1</div>

                        <div className='order' style={ { gridRow: 'span 3' } }>
                            order 322
                        </div>
                        { /* <div className='order'>order 322</div> */ }
                        { /* <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } /> */ }
                        { /*  need remove one for each rowspan  (rs 3 = -2)*/ }
                        { /* <div className={ Styles.gridEmptyCell } /> */ }
                        { /* <div className={ Styles.gridEmptyCell } /> */ }

                        <div className='order'>order 228</div>
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />

                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        { /* <div className={ Styles.gridEmptyCell } /> */ }
                        { /* </div> */ }
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div
                            className={ Styles.gridHead }
                            // style={ { gridRow: 'span 2' } }
                        >
                            2
                        </div>
                        <div className='content'>
                            <div className='order1'>order 11111</div>
                            { /* <div className='order1'>order 11111</div> */ }
                            <div className='order2'>order 22222</div>
                            <div className={ Styles.gridEmptyCell } />
                            <div className={ Styles.gridEmptyCell } />
                        </div>
                        <div className={ Styles.gridEmptyCell } />
                        <div className='content2'>
                            <div className='order4'>order 11111</div>
                        </div>
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />

                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        { /* <div className={ Styles.gridEmptyCell } /> */ }
                        { /* <div className={ Styles.gridEmptyCell } /> */ }
                        { /* <div className={ Styles.gridEmptyCell } /> */ }

                        { /* { time.map(() => (
                            <div key={ v4() } className={ Styles.gridContent }>
                                <div className={ Styles.gridEmptyCell } />
                                <div className={ Styles.gridEmptyCell } />
                            </div>
                        )) } */ }
                    </div>
                    <DashboardColumn
                        dashboard={ genDashboard(genScheduler, mockDash) }
                    >
                        <DashboardHead
                            dashboard={ genDashboard(genScheduler, mockDash) }
                        >
                            styled
                        </DashboardHead>
                        { /* { magic.map(fsdfsdf)} */ }
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                        <DashboardEmptyCell />
                    </DashboardColumn>
                    <div className={ Styles.gridColumn }>
                        <div
                            className={ Styles.gridHead }
                            // style={ { gridRow: 'span 2' } }
                        >
                            pure
                        </div>
                        <div className='order10'>order 11111</div>
                        { /* <div className='order1'>order 11111</div> */ }
                        <div className='order20'>order 22222</div>
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className='order4'>order 11111</div>
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />

                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        <div className={ Styles.gridEmptyCell } />
                        { /* <div className={ Styles.gridEmptyCell } /> */ }
                        { /* <div className={ Styles.gridEmptyCell } /> */ }
                        { /* <div className={ Styles.gridEmptyCell } /> */ }

                        { /* { time.map(() => (
                            <div key={ v4() } className={ Styles.gridContent }>
                                <div className={ Styles.gridEmptyCell } />
                                <div className={ Styles.gridEmptyCell } />
                            </div>
                        )) } */ }
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>5</div>
                        { time.map(() => (
                            <div key={ v4() } className={ Styles.gridContent }>
                                <div className={ Styles.gridEmptyCell } />
                                <div className={ Styles.gridEmptyCell } />
                            </div>
                        )) }
                    </div>
                    { /* <DashboardColumn /> */ }
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>6</div>
                        { time.map(() => (
                            <div key={ v4() } className={ Styles.gridEmptyCell } />
                        )) }
                        { /* { time.map(() => (
                            <div key={ v4() } className={ Styles.gridContent }>
                                <div className={ Styles.gridEmptyCell } />
                                <div className={ Styles.gridEmptyCell } />
                            </div>
                        )) } */ }
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>7</div>
                        { time.map(() => (
                            <div key={ v4() } className={ Styles.gridContent }>
                                <div className={ Styles.gridEmptyCell } />
                                <div className={ Styles.gridEmptyCell } />
                            </div>
                        )) }
                    </div>
                </div>
            </Catcher>
        );
    }
}
