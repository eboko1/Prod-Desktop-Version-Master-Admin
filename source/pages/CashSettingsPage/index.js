// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout, Paper } from 'commons';
import { CashCreationForm } from 'forms';
import { CashboxesTable } from 'components/Tables';
// own

export default class CashSettingsPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.cash_settings' /> }
                paper={ false }
                // description={ <FormattedMessage id='chart-page.description' /> }
            >
                <Paper>
                    <CashCreationForm />
                </Paper>
                <Paper>
                    <CashboxesTable />
                </Paper>
            </Layout>
        );
    }
}
