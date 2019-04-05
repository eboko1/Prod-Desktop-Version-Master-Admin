// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const IncomePage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.income' /> }>
            <div>IncomePage</div>
        </Layout>
    );
};
