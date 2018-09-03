// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Layout } from 'commons';
import { BusinessPackageContainer } from 'containers';

export default class BusinessPackagePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout title={ <FormattedMessage id='business_packages' /> }>
                <BusinessPackageContainer />
            </Layout>
        );
    }
}
