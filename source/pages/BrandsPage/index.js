// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

// proj

import { Layout, Spinner } from 'commons';
import { BrandsForm } from 'forms';

import book from 'routes/book';

export default class BrandsPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.priority_brands' /> }
            >
                <BrandsForm />
            </Layout>
        );
    }
}
