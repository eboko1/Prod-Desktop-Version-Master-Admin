// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

// proj
import { fetchRoles } from 'core/role/duck';

import { Layout, Spinner } from 'commons';
import { RoleContainer } from 'containers';
import book from 'routes/book';

const mapStateToProps = state => ({
    isFetching: state.ui.roleFetching,
    roles:      state.roles.roles,
});

const mapDispatchToProps = {
    fetchRoles,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class RolePage extends Component {
    componentDidMount() {
        this.props.fetchRoles(this.props.match.params.id);
    }

    render() {
        const { isFetching, roles, match } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='roles' /> }
                controls={
                    <Link to={ `${book.packagePage}` }>
                        <Icon type='rollback' />
                        <FormattedMessage id='roles.back_to_packages' />
                    </Link>
                }
            >
                <RoleContainer packageId={ match.params.id } roles={ roles } />
            </Layout>
        );
    }
}
