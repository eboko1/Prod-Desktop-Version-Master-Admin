// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

// proj
import { fetchReviews } from 'core/reviews/duck';

import { Layout, Spinner } from 'commons';
import { ReviewsContainer } from 'containers';

const mapStateToProps = state => ({
    isFetching: state.ui.reviewsFetching,
});

const mapDispatchToProps = {
    fetchReviews,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReviewsPage extends Component {
    componentDidMount() {
        this.props.fetchReviews();
    }

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
