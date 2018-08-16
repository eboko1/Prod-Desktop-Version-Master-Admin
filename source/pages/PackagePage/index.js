// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';

// proj
import { Layout, Spinner } from 'commons';
import { fetchPackages } from 'core/package/duck';

import PackageContainer from 'containers/PackageContainer';

const mapStateToProps = state => {
    return {
        isFetching: state.ui.packageFetching,
        packages:   state.packages.packages,
    };
};

const mapDispatchToProps = {
    fetchPackages,
};

@connect(mapStateToProps, mapDispatchToProps)
class PackagePage extends Component {
    componentDidMount() {
        this.props.fetchPackages();
    }

    render() {
        const { isFetching, packages } = this.props;

        return !isFetching ? (
            <Layout>
                <PackageContainer packages={ packages } />
            </Layout>
        ) : (
            <Spinner spin={ isFetching } />
        );
    }
}

export default PackagePage;
