// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import _ from 'lodash';

// proj
import { fetchBusinessPackages, setPage, setSort } from 'core/businessPackage/duck';

import { Layout, Spinner } from 'commons';
import { BusinessPackageContainer } from 'containers';

const mapStateToProps = state => {
    return {
        isFetching:       state.ui.businessPackageFetching,
        businessPackages: state.businessPackage.businessPackages,
    };
};

const mapDispatchToProps = {
    fetchBusinessPackages,
    setPage,
    setSort,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class BusinessPackagePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchBusinessPackages();
    }

    render() {
        const { isFetching, businessPackages } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout title={ 'Business packages' }>
                <BusinessPackageContainer businessPackages={ businessPackages } />
            </Layout>
        );
    }
}
