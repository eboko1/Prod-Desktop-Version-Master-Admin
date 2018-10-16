// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';

//own
import { columnsConfig } from './callsTableConfig.js';
import Styles from './styles.m.css';

@injectIntl
export default class CallsTable extends Component {
    render() {
        const {
            calls,
            stats,
            filter,
            intl: { formatMessage },
            fetchCalls,
            callsFetching,
            setCallsPageFilter,
        } = this.props;

        const columns = columnsConfig(formatMessage);

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(_.get(stats, 'total') / 25) * 25,
            hideOnSinglePage: true,
            current:          filter.page,
            onChange:         page => {
                setCallsPageFilter(page);
                fetchCalls();
            },
        };

        return (
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
        );
    }
}
