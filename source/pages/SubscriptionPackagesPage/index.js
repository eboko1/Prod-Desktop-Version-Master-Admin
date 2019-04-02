// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { SubscriptionProductsContainer } from 'containers';

export default class SubscriptionPackagesPage extends Component {
    render() {
        return (
            <>
                <Layout
                    title={
                        <FormattedMessage id='navigation.subscription_packages' />
                    }
                    paper={ false }
                >
                    <SubscriptionProductsContainer />
                </Layout>
            </>
        );
    }
}
