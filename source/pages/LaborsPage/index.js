// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj

import { Layout, Spinner } from 'commons';

export default class LaborsPage extends Component {
    componentDidMount() {
        
    }

    render() {

        return (
            <Layout
                title={
                    <FormattedMessage id='navigation.labors_page' />
                }
                paper={ false }
                
            >
                
            </Layout>
        );
    }
}
