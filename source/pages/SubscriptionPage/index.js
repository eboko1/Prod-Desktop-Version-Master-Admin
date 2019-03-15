// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

// own

export default class SubscriptionPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.subscription' /> }
                // description={ <FormattedMessage id='chart-page.description' /> }
            >
                'SubscriptionPage'
            </Layout>
        );
    }
}
