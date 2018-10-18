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
} from 'core/calls/duck';

import { Layout, Spinner } from 'commons';
import { CallsContainer } from 'containers';
import { DecoratedSelect } from 'forms/DecoratedFields';
import { DatePickerGroup } from 'components';

// own
const Option = Select.Option;

const mapStateToProps = state => ({
    tab:           state.calls.tab,
    calls:         state.calls.calls,
    channels:      state.calls.channels,
    filter:        state.calls.filter,
    callsFetching: state.ui.callsFetching,
});

const mapDispatchToProps = {
    fetchCalls,
    fetchCallsChart,
    setCallsDaterange,
    setCallsPeriod,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CallsPage extends Component {
    _setCallsDaterange = daterange => {
        const { tab, setCallsDaterange, fetchCallsChart } = this.props;
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

    componentDidMount() {
        this.props.fetchCallsChart();
    }

    render() {
        const {
            tab,
            channels,
            callsFetching,
            filter: { startDate, endDate, period },
        } = this.props;

        return callsFetching ? (
            <Spinner spin={ callsFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='calls-page.title' /> }
                description={ <FormattedMessage id='calls-page.description' /> }
                controls={
                    <>
                        <DatePickerGroup
                            startDate={ startDate }
                            endDate={ endDate }
                            loading={ callsFetching }
                            period={ period }
                            onDaterangeChange={ this._setCallsDaterange }
                            onPeriodChange={ this._setCallsPeriod }
                            periodGroup={ tab !== 'callsTable' }
                        />
                        {channels && (
                            <DecoratedSelect>
                                { channels.map(({ id, name }) => (
                                    <Option key={ id } value={ id }>
                                        { name }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        )}
                    </>
                }
            >
                <CallsContainer />
            </Layout>
        );
    }
}
