// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';

// proj
import { fetchReviews, setReviewsPageFilter } from 'core/reviews/duck';

import { Catcher, Paper } from 'commons';
import { ReviewsStats, ReviewsTable } from 'components';

const mapStateToProps = state => ({
    reviews: state.reviews.reviews,
    filter:  state.reviews.filter,
    stats:   state.reviews.stats,
});

const mapDispatchToProps = {
    fetchReviews,
    setReviewsPageFilter,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReviewsContainer extends Component {
    render() {
        const {
            reviews,
            filter,
            stats,
            setReviewsPageFilter,
            fetchReviews,
        } = this.props;

        return (
            <Catcher>
                <Paper>
                    <ReviewsStats stats={ stats } />
                </Paper>
                <Paper>
                    <ReviewsTable
                        reviews={ reviews }
                        filter={ filter }
                        stats={ stats }
                        setReviewsPageFilter={ setReviewsPageFilter }
                        fetchReviews={ fetchReviews }
                    />
                </Paper>
            </Catcher>
        );
    }
}
