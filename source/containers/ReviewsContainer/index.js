// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

// proj
import { fetchReviews } from 'core/reviews/duck';

import { Catcher } from 'commons';
import { ReviewsList } from 'components';

const mapStateToProps = state => ({
    reviews:        state.reviews.reviews,
    repairQuality:  state.reviews.repairQuality,
    repairDuration: state.reviews.repairDuration,
    comfort:        state.reviews.comfort,
    serviceQuality: state.reviews.serviceQuality,
    isFetching:     state.ui.reviewsFetching,
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
        // const {
        //     reviews,
        //     repairQuality,
        //     repairDuration,
        //     comfort,
        //     serviceQuality,
        // } = this.props;

        return (
            <Catcher>
                <ReviewsList { ...this.props } />
            </Catcher>
        );
    }
}
