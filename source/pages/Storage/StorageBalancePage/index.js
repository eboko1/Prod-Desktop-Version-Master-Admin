// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const StorageBalancePage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.storage_balance' /> }>
            <div>StorageBalancePage</div>
        </Layout>
    );
};
