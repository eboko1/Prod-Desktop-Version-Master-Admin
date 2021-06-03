// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Select } from 'antd';

// proj
import {
    fetchCalls,
    fetchCallsChart,
    setCallsDaterange,
    setCallsPeriod,
    setCallsChannelId,
} from 'core/calls/duck';

import { Layout, Spinner } from 'commons';
import { CallsContainer } from 'containers';
import { DatePickerGroup } from 'components';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

const mapStateToProps = state => ({
    tab:               state.calls.tab,
    calls:             state.calls.calls,
    channels:          state.calls.channels,
    filter:            state.calls.filter,
    callsInitializing: state.ui.callsInitializing,
    callsFetching:     state.ui.callsFetching,
});

const mapDispatchToProps = {
    fetchCalls,
    fetchCallsChart,
    setCallsDaterange,
    setCallsPeriod,
    setCallsChannelId,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CallsPage extends Component {
    componentDidMount() {
        this.props.fetchCallsChart('init');
    }

    _setCallsDaterange = daterange => {
        const {
            tab,
            setCallsDaterange,
            fetchCallsChart,
            fetchCalls,
        } = this.props;

        setCallsDaterange(daterange);

        if (tab === 'callsTable') {
            fetchCalls();
        }
        if (tab === 'callsChart') {
            fetchCallsChart();
        }
    };

    _setCallsPeriod = period => {
        this.props.setCallsPeriod(period);
        this.props.fetchCallsChart();
    };

    _setCallsChannelId = channelId => {
        const {
            tab,
            setCallsChannelId,
            fetchCalls,
            fetchCallsChart,
        } = this.props;

        if (channelId === 'ALL') {
            setCallsChannelId(null);
            if (tab === 'callsTable') {
                fetchCalls();
            }
            if (tab === 'callsChart') {
                fetchCallsChart();
            }
        }

        if (channelId !== 'ALL') {
            setCallsChannelId(channelId);
            if (tab === 'callsTable') {
                fetchCalls();
            }
            if (tab === 'callsChart') {
                fetchCallsChart();
            }
        }
    };

    render() {
        const {
            tab,
            channels,
            callsInitializing,
            callsFetching,
            filter: { startDate, endDate, period },
        } = this.props;

        return callsInitializing ? (
            <Spinner spin={ callsInitializing } />
        ) : (
            <Layout
                title={ <FormattedMessage id='calls-page.title' /> }
                description={ <FormattedMessage id='calls-page.description' /> }
                controls={
                    <>
                        <DatePickerGroup
                            startDate={ startDate }
                            endDate={ endDate }
                            loading={ callsInitializing || callsFetching }
                            period={ period }
                            onDaterangeChange={ this._setCallsDaterange }
                            onPeriodChange={ this._setCallsPeriod }
                            periodGroup={ tab !== 'callsTable' }
                        />
                        {channels && (
                            <Select
                                defaultValue='ALL'
                                className={ Styles.channels }
                                onChange={ this._setCallsChannelId }
                            >
                                <Option value='ALL'>
                                    <FormattedMessage id='all' />
                                </Option>
                                { channels.map(({ id, name }) => (
                                    <Option key={ id } value={ id }>
                                        { name }
                                    </Option>
                                )) }
                            </Select>
                        )}
                    </>
                }
            >
                <CallsContainer callsFetching={ callsFetching } />
            </Layout>
        );
    }
}
