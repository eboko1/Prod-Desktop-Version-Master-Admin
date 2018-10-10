// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout, Spinner } from 'commons';
import { ReviewsContainer } from 'containers';

export default class ReviewsPage extends Component {
    render() {
        const { isFetching } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ <FormattedMessage id='reviews-page.title' /> }
                paper={ false }
                description={ <FormattedMessage id='reviews-page.description' /> }
            >
                <ReviewsContainer />
            </Layout>
        );
    }
}
