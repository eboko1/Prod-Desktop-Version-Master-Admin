// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Radio } from 'antd';
import moment from 'moment';

// proj
import { fetchChart } from 'core/chart/duck';

import { Layout, Spinner } from 'commons';
import { ChartContainer } from 'containers';

// own
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapStateToProps = state => ({
    isFetching: state.ui.chartFetching,
});

const mapDispatchToProps = {
    fetchChart,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ChartPage extends Component {
    _setChartDaterange = daterange => {
        const { setChartDaterangeFilter, fetchChart } = this.props;

        if (daterange === 'month') {
            setChartDaterangeFilter({});
        } else if (daterange !== 'month') {
            const daterangeFilter = getDaterange(daterange);
            setChartDaterangeFilter({ daterange, ...daterangeFilter });
        }

        fetchChart();
    };

    _fetchChartData = () => {
        const {
            period,
            chartOption: { value: type },
            date,
        } = this.state;

        const formatDate = (date, quantity, period) =>
            moment(date)
                .add(quantity, period)
                .format('YYYY-MM-DD');

        const config = {
            week: date => ({
                startDate: formatDate(date, -12, 'w'),
                endDate:   formatDate(date, 2, 'w'),
            }),
            month: date => ({
                startDate: formatDate(date, -13, 'M'),
                endDate:   formatDate(date, 1, 'M'),
            }),
            day: date => ({
                startDate: formatDate(date, -7, 'd'),
                endDate:   formatDate(date, 7, 'd'),
            }),
        };

        const { startDate, endDate } = config[ period ](date || new Date());
        this.props.fetchChart({ startDate, endDate, period, type });
    };

    render() {
        const { chart, chartData, isFetching } = this.props;
        const { chartOption } = this.state;

        const {
            beginDate,
            endDate,
            period,
            contentWidth = 0,
            visibility,
        } = this.state;

        const headerControls = this._renderHeaderControls();

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='chart-page.title' /> }
                description={ <FormattedMessage id='chart-page.description' /> }
                controls={ headerControls }
            >
                <ChartContainer />
                { /* <UniversalLineChart
                    data={ chartData }
                    chartOption={ chartOption }
                /> */ }
            </Layout>
        );
    }

    _renderHeaderControls = () => {
        return (
            <RadioGroup value={ this.props.daterange } className={ Styles.filters }>
                <RadioButton
                    value='day'
                    onClick={ () => this._setChartDaterange('day') }
                >
                    <FormattedMessage id='day' />
                </RadioButton>
                <RadioButton
                    value='week'
                    onClick={ () => this._setChartDaterange('week') }
                >
                    <FormattedMessage id='week' />
                </RadioButton>
                <RadioButton
                    value='month'
                    onClick={ () => this._setChartDaterange('month') }
                >
                    <FormattedMessage id='month' />
                </RadioButton>
            </RadioGroup>
        );
    };
}

// const chartOptions = [
//     {
//       title: lng.mainKPI,
//       options: [
//         {
//           label: lng.sales,
//           value: 'sales'
//         },
//         {
//           label: lng.avgCheck,
//           value: 'average_sales'
//         },
//         {
//           label: lng.postsLoad,
//           value: 'load'
//         },
//         {
//           label: lng.appointmentsToRepairs,
//           value: 'appointment-progress'
//         },
//         {
//           label: lng.permanentClients,
//           value: 'perm_clients'
//         },
//         {
//           label: lng.overallNPS,
//           value: 'reviews'
//         },
//       ]
//     },
//     {
//       title: lng.calls,
//       options: [
//         {
//           label: lng.reactionTime,
//           value: 'calls_reaction'
//         },
//         {
//           label: lng.frozenNew,
//           value: 'stack_calls'
//         }
//       ]
//     },
//     {
//       title: lng.serviceLoad,
//       options: [
//         {
//           label: lng.postsLoadAuto,
//           value: 'appointments'
//         },
//         {
//           label: lng.appointmentsQuantity,
//           value: 'appointment'
//         },
//         {
//           label: lng.approvesQuantity,
//           value: 'approve'
//         },
//         {
//           label: lng.repairsQuantity,
//           value: 'progress'
//         }
//       ]
//     },
//     {
//       title: lng.conversion,
//       options: [
//         {
//           label: lng.apointmentsToApproves,
//           value: 'appointment-approve'
//         },

//         {
//           label: lng.approvesToRepairs,
//           value: 'approve-progress'
//         },
//         {
//           label: lng.invitationsToApproves,
//           value: 'invite-approve'
//         }
//       ]
//     },
// {
//   title: lng.nps,
//   options: [
//     {
//       label: lng.avgNPS,
//       value: 'reviews'
//     },

// {
//   label: lng.serviceQuality,
//   value: 'service_quality'
// }
//   ]
// }
//   ];
