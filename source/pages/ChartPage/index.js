// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Radio } from 'antd';

// proj
import {
    fetchChart,
    setChartPeriod,
    setChartDate,
    setChartMode,
} from 'core/chart/duck';

import { Layout, Spinner } from 'commons';
import { ChartContainer } from 'containers';
import { ArrowsDatePicker } from 'components';

// own
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
        } = this.props;
        const headerControls = this._renderHeaderControls();

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='chart-page.title' /> }
                description={ <FormattedMessage id='chart-page.description' /> }
                controls={ headerControls }
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

    _renderHeaderControls = () => {
        const {
            isFetching,
            filter: { date, period },
        } = this.props;

        return (
            <>
                <ArrowsDatePicker
                    date={ date }
                    onDayChange={ this._setChartDate }
                    loading={ isFetching }
                />
                <RadioGroup value={ period } className={ Styles.filters }>
                    <RadioButton
                        value='day'
                        onClick={ () => this._setChartPeriod('day') }
                    >
                        <FormattedMessage id='day' />
                    </RadioButton>
                    <RadioButton
                        value='week'
                        onClick={ () => this._setChartPeriod('week') }
                    >
                        <FormattedMessage id='week' />
                    </RadioButton>
                    <RadioButton
                        value='month'
                        onClick={ () => this._setChartPeriod('month') }
                    >
                        <FormattedMessage id='month' />
                    </RadioButton>
                </RadioGroup>
            </>
        );
    };
}
