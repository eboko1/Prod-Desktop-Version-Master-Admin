// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

// proj

import { Layout, Spinner } from 'commons';
// import { RoleContainer } from 'containers';
import book from 'routes/book';

export default class BrandsPage extends Component {
    render() {
        const { isFetching, roles, match } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='navigation.priority_brands' /> }
            >
                { /* <BrandsContainer packageId={ match.params.id } roles={ roles } /> */ }
            </Layout>
        );
    }
}
