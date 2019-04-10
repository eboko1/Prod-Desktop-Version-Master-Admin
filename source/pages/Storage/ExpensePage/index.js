// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const ExpensePage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.expense' /> }>
            <div>ExpensePage</div>
        </Layout>
    );
};
