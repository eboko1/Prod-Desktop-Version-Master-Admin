import React, { Component } from 'react';
import moment from 'moment';
import { v4 } from 'uuid';

// proj

import { Catcher } from 'commons';
// import { Dashboard } from 'components';

// own
import Styles from './styles.m.css';

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
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>time</div>
                        <div className={ Styles.gridContent }>
                            { time.map(time => <div key={ v4() }>{ time }</div>) }
                        </div>
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>1</div>
                        <div className={ Styles.gridContent }>
                            <div className={ Styles.order }>order 123</div>
                            <div className={ Styles.order }>order 999</div>
                        </div>
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>2</div>
                        <div className={ Styles.gridContent } />
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>3</div>
                        <div className={ Styles.gridContent }>
                            <div className={ Styles.order }>order 123</div>
                        </div>
                    </div>
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
                        <div className={ Styles.gridContent } />
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>6</div>
                        <div className={ Styles.gridContent } />
                    </div>
                    <div className={ Styles.gridColumn }>
                        <div className={ Styles.gridHead }>7</div>
                        <div className={ Styles.gridContent } />
                    </div>
                </div>
            </Catcher>
        );
    }
}
