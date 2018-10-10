// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

// proj
import { fetchReviews } from 'core/reviews/duck';

import { Catcher, Paper } from 'commons';
import { ReviewsStats, ReviewsTable } from 'components';

const mapStateToProps = state => ({
    reviews:              state.reviews.reviews,
    rating:               state.reviews.rating,
    recommended:          state.reviews.recommended,
    notRecommended:       state.reviews.notRecommended,
    npsRating:            state.reviews.npsRating,
    countReviews:         state.reviews.countReviews,
    repairQualityRating:  state.reviews.repairQualityRating,
    repairDurationRating: state.reviews.repairDurationRating,
    comfortRating:        state.reviews.comfortRating,
    serviceQualityRating: state.reviews.serviceQualityRating,
    isFetching:           state.ui.reviewsFetching,
});

const mapDispatchToProps = {
    fetchReviews,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReviewsContainer extends Component {
    componentDidMount() {
        fetchReviews();
    }

    render() {
        const {
            reviews,
            rating,
            recommended,
            notRecommended,
            npsRating,
            countReviews,
            repairQualityRating,
            repairDurationRating,
            comfortRating,
            serviceQualityRating,
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
                    <ReviewsTable reviews={ reviews } />
                </Paper>
            </Catcher>
        );
    }
}
