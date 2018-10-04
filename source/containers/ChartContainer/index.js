// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import moment from 'moment';

// proj
import { fetchChart } from 'core/chart/duck';

import { Catcher } from 'commons';
import { UniversalChart } from 'components';

// own
// import Styles from './styles.m.css';

const mapStateToProps = state => ({
    chart:  state.chart,
    filter: state.chart.filter,
});

const mapDispatchToProps = {
    fetchChart,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ChartContainer extends Component {
    _handleChartOption(e, { value, label }) {
        const { period, startDate, endDate, type } = this.state;

        this.setState(
            {
                chartOption: { label, value },
            },
            () =>
                this._fetchChartData({
                    startDate,
                    endDate,
                    period,
                    type,
                }),
        );
    }

    render() {
        const { chartData, label } = this.props;

        return (
            <Catcher>
                <div>Показать</div>
                <UniversalChart
                    data={ chartData }
                    label={ label || 'test label' }
                />
                { /* <ChartModal /> */ }
            </Catcher>
        );
    }
}
