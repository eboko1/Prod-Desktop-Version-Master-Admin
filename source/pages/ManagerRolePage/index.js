// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { ManagerRoleContainer } from 'containers';

export default class ManagerRolePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout title={ <FormattedMessage id='manager-role-page.title' /> }>
                <ManagerRoleContainer />
            </Layout>
        );
    }
}
