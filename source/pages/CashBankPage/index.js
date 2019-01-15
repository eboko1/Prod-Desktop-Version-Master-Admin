// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { CashAccountingContainer } from 'containers';

// own

export default class CashBankPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.cash_bank' /> }
                // description={ <FormattedMessage id='chart-page.description' /> }
            >
                <CashAccountingContainer />
            </Layout>
        );
    }
}
