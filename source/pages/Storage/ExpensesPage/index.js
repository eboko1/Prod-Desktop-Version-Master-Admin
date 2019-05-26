// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { ExpensesTable } from 'components';

export const ExpensesPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.expenses' /> }>
            <ExpensesTable />
        </Layout>
    );
};
