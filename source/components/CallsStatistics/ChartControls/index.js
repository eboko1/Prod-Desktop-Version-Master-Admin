// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';

// proj
import { answered, missed, busy, all } from 'core/calls/config';

// own
import Styles from '../styles.m.css';

export default class ChartControls extends Component {
    state = {
        all:      all,
        answered: answered,
        missed:   missed,
        busy:     busy,
    };

    _setChartModes = mode => {
        this.setState(state => ({ [ mode ]: !state[ mode ] }));

        this.props.setCallsChartMode(mode);
        this.props.fetchCallsChart();
    };

    render() {
        return (
            <div className={ Styles.barControls }>
                <span
                    className={ `${Styles.controlIcon} ${Styles.totalIcon}` }
                    onClick={ () => this._setChartModes('all') }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.total_quantity' />
                    </span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${Styles.answeredIcon}` }
                    onClick={ () => this._setChartModes('answered') }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.answered' />
                    </span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${Styles.missedIcon}` }
                    onClick={ () => this._setChartModes('missed') }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.missed' />
                    </span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${Styles.busyIcon}` }
                    onClick={ () => this._setChartModes('busy') }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.busy' />
                    </span>
                </span>
            </div>
        );
    }
}
