// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import { fetchServices } from 'core/forms/servicesForm/duck';

import { Layout, Spinner } from 'commons';
import { ServicesForm } from 'forms';

const mapStateToProps = state => ({
    isFetching: state.ui.servicesFetching,
});

const mapDispatchToProps = { fetchServices };

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ServicesPage extends Component {
    componentDidMount() {
        this.props.fetchServices();
    }

    render() {
        const { isFetching } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={
                    <FormattedMessage id='navigation.services-spare_parts' />
                }
            >
                <ServicesForm />
            </Layout>
        );
    }
}
