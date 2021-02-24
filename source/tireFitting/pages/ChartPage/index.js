// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import {
    fetchChart,
    setChartPeriod,
    setChartDate,
    setChartMode,
} from 'core/chart/duck';

import { Layout } from 'tireFitting';
import { Spinner } from 'commons';
import { ChartContainer } from 'containers';
import { DatePickerGroup } from 'components';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    chartData:  state.chart.chartData,
    filter:     state.chart.filter,
    isFetching: state.ui.chartFetching,
});

const mapDispatchToProps = {
    fetchChart,
    setChartPeriod,
    setChartDate,
    setChartMode,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ChartPage extends Component {
    componentDidMount() {
        this.props.fetchChart();
    }

    _setChartDate = date => {
        this.props.setChartDate(date);
        this.props.fetchChart();
    };

    _setChartPeriod = period => {
        this.props.setChartPeriod(period);
        this.props.fetchChart();
    };

    render() {
        const {
            chartData,
            filter,
            isFetching,
            startDate,
            endDate,
            filter: { date, period },
        } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='chart-page.title' /> }
                description={ <FormattedMessage id='chart-page.description' /> }
                controls={
                    <DatePickerGroup
                        date={ date }
                        loading={ isFetching }
                        period={ period }
                        onDateChange={ this._setChartDate }
                        onPeriodChange={ this._setChartPeriod }
                    />
                }
            >
                <ChartContainer
                    chartData={ chartData }
                    filter={ filter }
                    startDate={ startDate }
                    endDate={ endDate }
                />
            </Layout>
        );
    }
}
