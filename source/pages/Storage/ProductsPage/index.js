// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const ProductsPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.products' /> }>
            <div>ProductsPage</div>
        </Layout>
    );
};
