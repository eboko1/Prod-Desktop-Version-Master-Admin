// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

// own

export default class PaymentPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.payment' /> }
                // description={ <FormattedMessage id='chart-page.description' /> }
            >
                'PaymentPage'
            </Layout>
        );
    }
}
