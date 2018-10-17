// Core
import React, { Component } from 'react';
import { Icon } from 'antd';

// proj
import { Catcher } from 'commons';

import { Pie, MiniPie, Bar } from 'components/Charts';

// own
import Styles from './styles.m.css';

export default class CallsStatistics extends Component {
    render() {
        const { chart } = this.props;

        const stats = [
            // {
            //     x: 'total',
            //     y: 143,
            // },
            {
                x: 'answered',
                y: 129,
            },
            {
                x: 'notAnswered',
                y: 14,
            },
            {
                x: 'busy',
                y: 0,
            },
            // {
            //     x: 'becameClients',
            //     y: 17,
            // },
        ];

        const barControls = this._renderBarControls();
        const piesRow = this._renderPiesRow();

        return (
            <Catcher>
                <div className={ Styles.callsStatistics }>
                    <div className={ Styles.column }>
                        { barControls }
                        <Bar data={ chart } />
                    </div>
                    <div className={ Styles.column }>
                        { piesRow }
                        <div className={ Styles.pieChart }>
                            <Pie
                                hasLegend
                                subTitle='Всего'
                                total={ 143 }
                                data={ stats }
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
                    <span className={ Styles.controlText }>Общее кол-во</span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${Styles.answeredIcon}` }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>Принятые</span>
                </span>
                <span className={ `${Styles.controlIcon} ${Styles.missedIcon}` }>
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>Пропущенные</span>
                </span>
            </div>
        );
    };

    _renderPiesRow = () => {
        return (
            <div className={ Styles.piesRow }>
                <MiniPie
                    hasLegend
                    color={ 'rgb(81, 205, 102)' } // secondary
                    inner={ 0.5 }
                    tooltip={ false }
                    margin={ [ 0, 0, 0, 0 ] }
                    percent={ 90 }
                    height={ 90 }
                />
                <MiniPie
                    hasLegend
                    color={ 'rgb(255, 126, 126)' } // warning
                    inner={ 0.5 }
                    tooltip={ false }
                    margin={ [ 0, 0, 0, 0 ] }
                    percent={ 90 }
                    height={ 90 }
                />
                <MiniPie
                    hasLegend
                    color={ 'rgb(82, 179, 255)' } // link
                    inner={ 0.5 }
                    tooltip={ false }
                    margin={ [ 0, 0, 0, 0 ] }
                    percent={ 90 }
                    height={ 90 }
                />
            </div>
        );
    };
}

/* <Pie
    // hasLegend={ false }
    // total={ 143 }
    animate={ false }
    color={ '#BDE4FF' }
    inner={ 0.55 }
    tooltip={ false }
    margin={ [ 0, 0, 0, 0 ] }
    percent={ 90 }
    height={ 128 }
/> */
