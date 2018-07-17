import React, { Component } from 'react';
import moment from 'moment';
import { v4 } from 'uuid';

// proj

import { Catcher } from 'commons';
// import { Dashboard } from 'components';

// own
import Styles from './styles.m.css';
import './s.css';

export default class DashboardContainer extends Component {
    render() {
        const { schedule } = this.props;

        // const formatTime = time =>
        //     time < 10 ? `${time.toStirng()}:00` : `0${time.toString()}:00`;

        const genScheduler = Array(schedule.endHour)
            .fill(0)
            .map((e, i) => i + 1)
            .slice(schedule.beginHour - 1);

        const time = genScheduler.map(
            time => time >= 10 ? `${time}:00` : `0${time}:00`,
        );

        return (
            <Catcher>
                <div className={ Styles.grid }>
                    { /* <div></div> */ }
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>time</div>

                        { time.map(time => (
                            <React.Fragment key={ time }>
                                <div className={ Styles.gridTimeCell }>
                                    { time }
                                </div>
                                <div className={ Styles.gridEmptyCell } />
                                { /* <div className={ Styles.gridTimeEmptyCell } />
                                <div className={ Styles.gridTimeEmptyCell } /> */ }
                            </React.Fragment>
                        )) }
                        { /* { time.map(time => (
                            <div className={ Styles.gridContent } key={ time }>
                                <div className={ Styles.gridTimeCell }>
                                    { time }
                                </div>
                                <div className={ Styles.gridEmptyCell } />

                            </div>
                        )) } */ }
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
                    <div className={ Styles.gridColumn } />
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>4</div>
                        <div className={ Styles.gridContent }>
                            <div className={ Styles.order }>order 123</div>
                            <div className={ Styles.order }>order 53</div>
                            <div className={ Styles.order }>order 777</div>
                            <div className={ Styles.order }>order 43252456</div>
                        </div>
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
