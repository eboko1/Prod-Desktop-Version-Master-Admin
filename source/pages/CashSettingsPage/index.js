// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

// own

export default class CashSettingsPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.cash_settings' /> }
                // description={ <FormattedMessage id='chart-page.description' /> }
            />
        );
    }
}
