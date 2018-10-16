// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select } from 'antd';
import moment from 'moment';

// proj
import {
    fetchCalls,
    fetchCallsChart,
    setCallsDaterange,
} from 'core/calls/duck';

import { Layout, Spinner } from 'commons';
import { CallsContainer } from 'containers';
import { DecoratedDatePicker, DecoratedSelect } from 'forms/DecoratedFields';
import { DatePickerGroup } from 'components';

// import book from 'routes/book';

// own
// import Styles from './styles.m.css'
import { callsStatuses } from 'core/calls/config';
const Option = Select.Option;

const mapStateToProps = state => ({
    calls:         state.calls.calls,
    channels:      state.calls.channels,
    filter:        state.calls.filter,
    callsFetching: state.ui.callsFetching,
});

const mapDispatchToProps = {
    fetchCalls,
    fetchCallsChart,
    setCallsDaterange,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CallsPage extends Component {
    _setCallsDaterange = daterange => {
        this.props.setCallsDaterange(daterange);
        this.props.fetchCalls();
    };

    _setCallsPeriod = period => {
        this.props.setCallsPeriod(period);
        this.props.fetchCalls();
    };

    componentDidMount() {
        this.props.fetchCallsChart();
    }

    render() {
        const {
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
                            onDateChange={ this._setChartDate }
                            onPeriodChange={ this._setChartPeriod }
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
