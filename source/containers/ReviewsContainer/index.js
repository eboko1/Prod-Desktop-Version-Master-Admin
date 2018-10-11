// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';

// proj
import { fetchReviews, setReviewsPageFilter } from 'core/reviews/duck';

import { Catcher, Paper } from 'commons';
import { ReviewsStats, ReviewsTable } from 'components';

const mapStateToProps = state => ({
    reviews:              state.reviews.reviews,
    filter:               state.reviews.filter,
    stats:                state.reviews.stats,
    rating:               state.reviews.rating,
    recommended:          state.reviews.recommended,
    notRecommended:       state.reviews.notRecommended,
    npsRating:            state.reviews.npsRating,
    countReviews:         state.reviews.countReviews,
    repairQualityRating:  state.reviews.repairQualityRating,
    repairDurationRating: state.reviews.repairDurationRating,
    comfortRating:        state.reviews.comfortRating,
    serviceQualityRating: state.reviews.serviceQualityRating,
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
            rating,
            recommended,
            notRecommended,
            npsRating,
            countReviews,
            repairQualityRating,
            repairDurationRating,
            comfortRating,
            serviceQualityRating,
            setReviewsPageFilter,
            fetchReviews,
        } = this.props;

        return (
            <Catcher>
                <Paper>
                    <ReviewsStats
                        rating={ rating }
                        recommended={ recommended }
                        notRecommended={ notRecommended }
                        npsRating={ npsRating }
                        countReviews={ countReviews }
                        repairQualityRating={ repairQualityRating }
                        repairDurationRating={ repairDurationRating }
                        comfortRating={ comfortRating }
                        serviceQualityRating={ serviceQualityRating }
                    />
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
