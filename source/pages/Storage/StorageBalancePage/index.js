// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { StoreBalanceTable } from 'components';

export const StorageBalancePage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.storage_balance' /> }>
            <StoreBalanceTable />
        </Layout>
    );
};
