// vendor
import React from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { ExpensesTable } from 'components';

export const ExpensesPage = () => {
    return (
        <Layout
            title={ <FormattedMessage id='navigation.expenses' /> }
            controls={
                <Button type='primary'>
                    <FormattedMessage id='add' />
                </Button>
            }
        >
            <ExpensesTable />
        </Layout>
    );
};
