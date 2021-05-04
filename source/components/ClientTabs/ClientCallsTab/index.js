/**
 * This tab combines existing functionality for calls(duck, saga) but provides client oriented result.
 * For example we search calls for specific client only ond show only them without charts.
 */


// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';

// proj
import { Spinner } from 'commons';
import { DatePickerGroup } from 'components';
import {
    fetchCalls,
    setCallsDaterange,
    setCallsChannelId,
    setCallsTab,
    tabs,
    setClientFilter,
} from 'core/calls/duck';

// own
import Styles from './styles.m.css';
import CallsTable from './CallsTable';


const Option = Select.Option;


const mapStateToProps = state => ({
    tab:               state.calls.tab,
    calls:             state.calls.calls,
    channels:          state.calls.channels,
    filter:            state.calls.filter,
    callsInitializing: state.ui.callsInitializing,
    callsFetching:     state.ui.callsFetching,
    clientEntity:      state.client.clientEntity,
});

const mapDispatchToProps = {
    fetchCalls,
    setCallsDaterange,
    setCallsChannelId,
    setCallsTab,
    setClientFilter,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientCallsTab extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {
            setCallsTab,
        } = this.props;

        setCallsTab(tabs.callsTable);//Set this tab as we use this one only here
        this._setClientFilter();
    }

    /**
     * Set datarange filter and fetch filtered calls
     * @param {*} daterange datarange of a filter
     */
    _setCallsDaterange = daterange => {
        const {
            setCallsDaterange,
            fetchCalls,
        } = this.props;

        setCallsDaterange(daterange);
        fetchCalls();
    };

    /**
     * Calls can be received with different channels. We can define a filter for those channels.
     * @param {*} channelId 
     */
    _setCallsChannelId = channelId => {
        const {
            setCallsChannelId,
            fetchCalls,
        } = this.props;

        setCallsChannelId(
            (channelId === 'ALL')? null: channelId
        );

        fetchCalls();
    };

    /**
     * Set client filter, is is needed to fetch data for a specific client
     */
    _setClientFilter = () => {
        const {
            setClientFilter,
            clientEntity
        } = this.props;
        const { clientId } = clientEntity || {};

        clientId && setClientFilter({clientId}); //We search all calls for specific client only on this page
    }

    render() {
        const {
            tab,
            channels,
            callsInitializing,
            callsFetching,
            filter: { startDate, endDate },
        } = this.props;


        return callsInitializing ? (
            <Spinner spin={ callsInitializing } />
        ) : (
            <div>
                <div className={Styles.filters}>
                    <DatePickerGroup
                        startDate={ startDate }
                        endDate={ endDate }
                        loading={ callsInitializing || callsFetching }
                        onDaterangeChange={ this._setCallsDaterange }
                        periodGroup={ tab !== tabs.callsTable }
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
                </div>

                <CallsTable />
            </div>
        );
    }
}
