// vendor
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { ExpensesTable } from 'components';
import book from 'routes/book';

export const ExpensesPage = () => {
    return (
        <Layout
            title={ <FormattedMessage id='navigation.expenses' /> }
            controls={
                <Link to={ book.storageExpenseDoc }>
                    <Button type='primary'>
                        <FormattedMessage id='add' />
                    </Button>
                </Link>
            }
        >
            <ExpensesTable />
        </Layout>
    );
};
