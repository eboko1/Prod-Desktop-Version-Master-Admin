// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const ProductsTrackingPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.storage' /> }>
            <div>ProductsTrackingPage</div>
        </Layout>
    );
};
