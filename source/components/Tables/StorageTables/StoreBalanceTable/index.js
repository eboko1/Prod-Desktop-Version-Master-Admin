// vendor
import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchStoreBalance,
    selectStoreBalance,
    selectStoreBalanceLoading,
    selectStoreBalanceFilters,
    setStoreBalancePage,
} from 'core/storage/storeBalance';

import { usePrevious } from 'utils';

// own
import columns from './columns';

const StoreBalanceTableComponent = memo(props => {
    const { balance } = props;
    const prevBalance = usePrevious(balance);

    useEffect(() => {
        if (!_.isEqual(balance, prevBalance)) {
            props.fetchStoreBalance();
        }
    }, [ balance ]);

    const pagination = {
        pageSize:         32,
        size:             'large',
        total:            Math.ceil(_.get(balance, 'stats.count', 0) / 32) * 32,
        hideOnSinglePage: true,
        current:          props.filters.page,
        onChange:         page => {
            props.setStoreBalancePage(page);
            props.fetchStoreBalance();
        },
    };

    return (
        <Table
            size='small'
            columns={ columns(props) }
            dataSource={ props.balance.list }
            pagination={ pagination }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            loading={ props.loading }
            rowKey={ record => record.id }
        />
    );
});

const mapStateToProps = state => ({
    balance: selectStoreBalance(state),
    filters: selectStoreBalanceFilters(state),
    loading: selectStoreBalanceLoading(state),
});

const mapDispatchToProps = {
    fetchStoreBalance,
    setStoreBalancePage,
};

export const StoreBalanceTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(StoreBalanceTableComponent),
);
