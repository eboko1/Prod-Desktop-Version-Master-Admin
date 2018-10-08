// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { fetchReviews } from 'core/reviews/duck';

import { Layout, Spinner } from 'commons';
import { ReviewsContainer } from 'containers';

export default class ReviewsPage extends Component {
    componentDidMount() {
        fetchReviews();
    }

    render() {
        const { isFetching } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title='Отзывы клиентов'
                description='Управление отзывами Ваших клиентов'
            >
                <ReviewsContainer />
            </Layout>
        );
    }
}
