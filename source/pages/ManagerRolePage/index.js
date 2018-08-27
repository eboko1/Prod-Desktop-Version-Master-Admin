// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchManagerRoles,
    setPage,
    setSort,
} from 'core/managerRole/duck';

import { Layout, Spinner } from 'commons';
import { ManagerRoleContainer } from 'containers';

const mapStateToProps = state => {
    return {
        isFetching:       state.ui.managerRoleFetching,
        businessPackages: state.managerRole.managerRoles,
    };
};

const mapDispatchToProps = {
    fetchManagerRoles,
    setPage,
    setSort,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ManagerRolePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchManagerRoles();
    }

    render() {
        const { isFetching, managerRoles } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout title={ <FormattedMessage id='manager-role-page.title' /> }>
                <ManagerRoleContainer businessPackages={ managerRoles } />
            </Layout>
        );
    }
}
