// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

// own

export default class SuppliersPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.suppliers' /> }
                description={ <FormattedMessage id='chart-page.description' /> }
            />
        );
    }
}
