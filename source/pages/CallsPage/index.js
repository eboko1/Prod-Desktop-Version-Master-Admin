// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Select } from 'antd';
import moment from "moment";

// proj
import {
    fetchCalls,
    fetchCallsChart,
    setCallsDaterange,
    setCallsChannelId,
} from 'core/calls/duck';
import { DateRangePicker } from 'components';
import { Layout, Spinner } from 'commons';
import { CallsContainer } from 'containers';

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
            channels,
            callsInitializing,
            callsFetching,
            filter: { startDate, endDate },
        } = this.props;

        return callsInitializing ? (
            <Spinner spin={ callsInitializing } />
        ) : (
            <Layout
                title={ <FormattedMessage id='calls-page.title' /> }
                description={ <FormattedMessage id='calls-page.description' /> }
                controls={
                    <>
                        {
                            callsFetching
                                ? ""
                                : <DateRangePicker
                                    minimize
                                    dateRange={[moment(startDate), moment(endDate)]}
                                    style={{margin: '0 0 0 8px'}}//prevent default space
                                    onDateChange={this._setCallsDaterange}
                                />
                        }

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
