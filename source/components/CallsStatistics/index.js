// Core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';

// proj
import { Catcher } from 'commons';

import { Pie, MiniPie, Bar } from 'components/Charts';

// own
import Styles from './styles.m.css';

export default class CallsStatistics extends Component {
    render() {
        const { chart, pieStats } = this.props;

        const barControls = this._renderBarControls();
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
                    color: 'rgba(82, 179, 255, 0.85)',
                },
            ],
        };

        return (
            <Catcher>
                <div className={ Styles.callsStatistics }>
                    <div className={ Styles.column }>
                        { barControls }
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
                                subTitle='Всего'
                                total={ 143 }
                                data={ pieStats }
                                height={ 248 }
                                lineWidth={ 4 }
                            />
                        </div>
                    </div>
                </div>
            </Catcher>
        );
    }

    _renderBarControls = () => {
        return (
            <div className={ Styles.barControls }>
                <span className={ `${Styles.controlIcon} ${Styles.totalIcon}` }>
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.total_quantity' />
                    </span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${Styles.answeredIcon}` }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.answered' />
                    </span>
                </span>
                <span className={ `${Styles.controlIcon} ${Styles.missedIcon}` }>
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.missed' />
                    </span>
                </span>
                <span className={ `${Styles.controlIcon} ${Styles.busyIcon}` }>
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.busy' />
                    </span>
                </span>
            </div>
        );
    };

    _renderPiesRow = () => {
        const { stats } = this.props;

        return (
            <div className={ Styles.piesRow }>
                <MiniPie
                    label='calls-statistics.answered_calls_efficiency'
                    color={ 'rgb(81, 205, 102)' } // secondary
                    inner={ 0.5 }
                    tooltip={ false }
                    margin={ [ 0, 0, 0, 0 ] }
                    percent={ stats.answered }
                />
                <MiniPie
                    label='calls-statistics.missed_calls_percent'
                    color={ 'rgb(255, 126, 126)' } // warning
                    inner={ 0.5 }
                    tooltip={ false }
                    margin={ [ 0, 0, 0, 0 ] }
                    percent={ stats.notAnswered }
                />
                <MiniPie
                    label='calls-statistics.became_your_clients'
                    color={ 'rgb(155, 89, 182)' } // primary
                    inner={ 0.5 }
                    tooltip={ false }
                    margin={ [ 0, 0, 0, 0 ] }
                    percent={ stats.becameClients }
                />
            </div>
        );
    };
}
