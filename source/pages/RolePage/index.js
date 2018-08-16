// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';

// proj
import { Layout, Spinner } from 'commons';
import { fetchRoles } from 'core/role/duck';

import RoleContainer from 'containers/RoleContainer';

const mapStateToProps = state => {
    return {
        isFetching: state.ui.roleFetching,
        roles:      state.roles.roles,
    };
};

const mapDispatchToProps = {
    fetchRoles,
};

@connect(mapStateToProps, mapDispatchToProps)
class RolePage extends Component {
    componentDidMount() {
        this.props.fetchRoles(this.props.match.params.id);
    }

    render() {
        const { isFetching, roles } = this.props;

        return !isFetching ? (
            <Layout title='Roles'>
                <RoleContainer
                    packageId={ this.props.match.params.id }
                    roles={ roles }
                />
            </Layout>
        ) : (
            <Spinner spin={ isFetching } />
        );
    }
}

export default RolePage;
