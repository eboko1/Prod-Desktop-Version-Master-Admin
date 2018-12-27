// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

// own

export default class CashOrdersPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='chart-page.title' /> }
                description={ <FormattedMessage id='chart-page.description' /> }
            />
        );
    }
}
