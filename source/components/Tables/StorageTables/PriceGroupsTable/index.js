// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

// proj

// own
import { columnsConfig } from './config';

export const PriceGroupsTable = props => {
    const { priceGroups, priceGroupsFetching } = props;

    const pagination = {
        pageSize:         25,
        size:             'large',
        total:            Math.ceil(props.totalCount / 25) * 25,
        hideOnSinglePage: true,
        current:          props.filters.page,
        onChange:         page => {
            props.setCashOrdersPage({ page });
            props.fetchCashOrders();
        },
    };

    return (
        <Table
            size='small'
            columns={ columnsConfig() }
            pagination={ pagination }
            dataSource={ priceGroups }
            loading={ priceGroupsFetching }
            locale={ {
                emptyText: <FormattedMessage id='no_data' />,
            } }
            scroll={ { x: 1000 } }
            rowKey={ record => record.id }
        />
    );
};
