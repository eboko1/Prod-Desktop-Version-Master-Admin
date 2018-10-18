// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import { fetchPackages } from 'core/package/duck';

import { Layout, Spinner } from 'commons';
import { PackageContainer } from 'containers';

const mapStateToProps = state => {
    return {
        isFetching: state.ui.packageFetching,
        packages:   state.packages.packages,
    };
};

const mapDispatchToProps = {
    fetchPackages,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class PackagePage extends Component {
    componentDidMount() {
        this.props.fetchPackages();
    }

    render() {
        const { isFetching, packages } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout title={ <FormattedMessage id='packages' /> }>
                <PackageContainer packages={ packages } />
            </Layout>
        );
    }
}
