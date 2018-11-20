// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Radio, Table } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';

//own
import { columnsConfig } from './callsTableConfig.js';
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@injectIntl
export default class CallsTable extends Component {
    state = {
        visiblePhones: [],
    };

    _setCallsTableFilterMode = mode => {
        this.props.setCallsTableMode(mode);
        this.props.fetchCalls();
    };

    _showPhone = phone => {
        this.setState(state => ({
            visiblePhones: [ ...state.visiblePhones, phone ],
        }));
    };

    render() {
        const {
            calls,
            stats,
            filter,
            intl: { formatMessage },
            callsFetching,
        } = this.props;

        const columns = columnsConfig(
            formatMessage,
            this._showPhone,
            this.state.visiblePhones,
        );

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(_.get(stats, 'total') / 25) * 25,
            hideOnSinglePage: true,
            current:          filter.page,
            onChange:         page => {
                this.props.setCallsPageFilter(page);
                this.setState({ visiblePhones: [] });
                this.props.fetchCalls();
            },
        };

        const callsTableControls = this._renderCallsTableControls();

        return (
            <Catcher>
                { callsTableControls }
                <Table
                    size='small'
                    className={ Styles.table }
                    columns={ columns }
                    dataSource={ calls }
                    loading={ callsFetching }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    pagination={ pagination }
                    scroll={ { x: 1080 } }
                />
            </Catcher>
        );
    }

    _renderCallsTableControls = () => {
        const { filter } = this.props;

        return (
            <RadioGroup value={ filter.mode }>
                <RadioButton
                    value='answered'
                    onClick={ () => this._setCallsTableFilterMode('answered') }
                >
                    <FormattedMessage id='calls-table.answered' />
                </RadioButton>
                <RadioButton
                    value='missed'
                    onClick={ () => this._setCallsTableFilterMode('missed') }
                >
                    <FormattedMessage id='calls-table.missed' />
                </RadioButton>
            </RadioGroup>
        );
    };
}
