// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Radio } from 'antd';
import moment from 'moment';

// proj
import {
    fetchChart,
    setChartPeriod,
    setChartDate,
    setChartMode,
    selectChartDaterange,
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

    ...selectChartDaterange(state),
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
        const { startDate, endDate, fetchChart } = this.props;
        fetchChart({ startDate, endDate });
    }

    _setChartDate = date => {
        const { setChartDate, startDate, endDate } = this.props;
        setChartDate(date);
        console.log('→ 11');
        fetchChart({ startDate, endDate });
        console.log('→ 22');
    };

    _setChartPeriod = period => {
        const { startDate, endDate, fetchChart, setChartPeriod } = this.props;
        setChartPeriod(period);
        fetchChart({ startDate, endDate });
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

        console.info('AAAAAAAAAAAAAAA', this.props.filter.date);
        console.info('BBBBBBBBBBBBBBB', this.props.startDate);

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
                    fetchChartData={ this._fetchChartData }
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

// const mock = [
//     {
//         score:     0,
//         id:        '2017-09',
//         label:     '2017-Sep',
//         startDate: '2017-09-01',
//         endDate:   '2017-10-01',
//     },
//     {
//         score:     0,
//         id:        '2017-10',
//         label:     '2017-Oct',
//         startDate: '2017-10-01',
//         endDate:   '2017-11-01',
//     },
//     {
//         score:     0,
//         id:        '2017-11',
//         label:     '2017-Nov',
//         startDate: '2017-11-01',
//         endDate:   '2017-12-01',
//     },
//     {
//         score:     2300,
//         id:        '2017-12',
//         label:     '2017-Dec',
//         startDate: '2017-12-01',
//         endDate:   '2018-01-01',
//     },
//     {
//         score:     2913,
//         id:        '2018-01',
//         label:     '2018-Jan',
//         startDate: '2018-01-01',
//         endDate:   '2018-02-01',
//     },
//     {
//         score:     35,
//         id:        '2018-02',
//         label:     '2018-Feb',
//         startDate: '2018-02-01',
//         endDate:   '2018-03-01',
//     },
//     {
//         score:     726.45,
//         id:        '2018-03',
//         label:     '2018-Mar',
//         startDate: '2018-03-01',
//         endDate:   '2018-04-01',
//     },
//     {
//         score:     228,
//         id:        '2018-04',
//         label:     '2018-Apr',
//         startDate: '2018-04-01',
//         endDate:   '2018-05-01',
//     },
//     {
//         score:     111222,
//         id:        '2018-05',
//         label:     '2018-May',
//         startDate: '2018-05-01',
//         endDate:   '2018-06-01',
//     },
//     {
//         score:     0,
//         id:        '2018-06',
//         label:     '2018-Jun',
//         startDate: '2018-06-01',
//         endDate:   '2018-07-01',
//     },
//     {
//         score:     149572,
//         id:        '2018-07',
//         label:     '2018-Jul',
//         startDate: '2018-07-01',
//         endDate:   '2018-08-01',
//     },
//     {
//         score:     1017,
//         id:        '2018-08',
//         label:     '2018-Aug',
//         startDate: '2018-08-01',
//         endDate:   '2018-09-01',
//     },
//     {
//         score:     17827,
//         id:        '2018-09',
//         label:     '2018-Sep',
//         startDate: '2018-09-01',
//         endDate:   '2018-10-01',
//     },
//     {
//         score:     0,
//         id:        '2018-10',
//         label:     '2018-Oct',
//         startDate: '2018-10-01',
//         endDate:   '2018-11-01',
//     },
//     {
//         score:     0,
//         id:        '2018-11',
//         label:     '2018-Nov',
//         startDate: '2018-11-01',
//         endDate:   '2018-12-01',
//     },
// ];
