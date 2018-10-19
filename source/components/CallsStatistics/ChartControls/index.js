// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';

// own
import Styles from '../styles.m.css';

export default class ChartControls extends Component {
    state = {
        // all:      false,
        answered: false,
        missed:   false,
        busy:     false,
    };

    _setChartModes = mode => {
        this.setState(state => ({ [ mode ]: !state[ mode ] }));
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            this.props.setCallsChartMode(this.state);
            this.props.fetchCallsChart();
        }
    }

    render() {
        return (
            <div className={ Styles.barControls }>
                <span
                    className={ `${Styles.controlIcon} ${Styles.totalIcon} ${this
                        .state.all && Styles.disabledIcon}` }
                    // onClick={ () => this._setChartModes('all') }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.total_quantity' />
                    </span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${
                        Styles.answeredIcon
                    } ${this.state.answered && Styles.disabledIcon}` }
                    onClick={ () => this._setChartModes('answered') }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.answered' />
                    </span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${
                        Styles.missedIcon
                    } ${this.state.missed && Styles.disabledIcon}` }
                    onClick={ () => this._setChartModes('missed') }
                >
                    <Icon type='bar-chart' theme='outlined' />
                    <span className={ Styles.controlText }>
                        <FormattedMessage id='calls-statistics.missed' />
                    </span>
                </span>
                <span
                    className={ `${Styles.controlIcon} ${Styles.busyIcon} ${this
                        .state.busy && Styles.disabledIcon}` }
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
