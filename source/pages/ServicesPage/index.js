// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import { fetchServicesSuggestions } from 'core/servicesSuggestions/duck';

import { Layout, Spinner } from 'commons';
import { ServicesContainer } from 'containers';

const mapStateToProps = state => ({
    isFetching: state.ui.suggestionsFetching,
});

const mapDispatchToProps = { fetchServicesSuggestions };

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ServicesPage extends Component {
    componentDidMount() {
        this.props.fetchServicesSuggestions();
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
                paper={ false }
                // controls={ <BusinessSearchField /> }
            >
                <ServicesContainer isFetching={ isFetching } />
            </Layout>
        );
    }
}
