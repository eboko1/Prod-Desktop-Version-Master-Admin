// Core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';

import { Pie, MiniPie, Bar } from 'components/Charts';

// own
import ChartControls from './ChartControls';
import Styles from './styles.m.css';

export default class CallsStatistics extends Component {
    render() {
        const { chart, pieStats, stats, setCallsChartMode } = this.props;

        const piesRow = this._renderPiesRow();

        const barConfig = {
            dataKeys: [
                {
                    name:  'total',
                    color: 'rgba(155, 89, 182, 0.85)',
                },
                {
                    name:  'answered',
                    color: 'rgba(81, 205, 102, 0.85)',
                },
                {
                    name:  'notAnswered',
                    color: 'rgba(255, 126, 126, 0.85)',
                },
                {
                    name:  'busy',
                    color: 'rgba(251, 158, 62, 0.85)',
                },
            ],
        };

        return (
            <Catcher>
                <div className={ Styles.callsStatistics }>
                    <div className={ Styles.column }>
                        { /* { barControls } */ }
                        <ChartControls setCallsChartMode={ setCallsChartMode } />
                        <Bar
                            data={ chart }
                            config={ barConfig }
                            intlCtx='calls-statistics'
                        />
                    </div>
                    <div className={ Styles.column }>
                        { piesRow }
                        <div className={ Styles.pieChart }>
                            <Pie
                                hasLegend
                                subTitle={
                                    <FormattedMessage id='calls-statistics.all' />
                                }
                                total={ stats.total }
                                data={ pieStats }
                                height={ 248 }
                                lineWidth={ 4 }
                                intlCtx='calls-statistics'
                            />
                        </div>
                    </div>
                </div>
            </Catcher>
        );
    }

    _renderPiesRow = () => {
        const { stats } = this.props;

        return (
            <div className={ Styles.piesRow }>
                <MiniPie
                    label='calls-statistics.answered_calls_efficiency'
                    color={ 'rgb(81, 205, 102)' } // secondary
                    percent={ stats.answered }
                />
                <MiniPie
                    label='calls-statistics.missed_calls_percent'
                    color={ 'rgb(255, 126, 126)' } // warning
                    percent={ stats.notAnswered }
                />
                <MiniPie
                    label='calls-statistics.became_your_clients'
                    color={ 'rgb(155, 89, 182)' } // primary
                    percent={ stats.becameClients }
                />
            </div>
        );
    };
}
