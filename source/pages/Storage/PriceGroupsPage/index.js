// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const PriceGroupsPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.price_groups' /> }>
            <div>StoragePriceGroupsPage</div>
        </Layout>
    );
};
