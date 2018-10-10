// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';
import { ReviewRating } from 'components';

//own
import Styles from './styles.m.css';

@injectIntl
export default class ReviewsStats extends Component {
    render() {
        const {
            rating,
            npsRating,
            repairQualityRating,
            repairDurationRating,
            comfortRating,
            serviceQualityRating,
            countReviews,
            recommended,
            notRecommended,
        } = this.props;

        return (
            <Catcher>
                <div className={ Styles.reviewsStats }>
                    <div className={ Styles.column }>
                        <span className={ Styles.title }>
                            <FormattedMessage id='reviews.rating' />
                            <span className={ Styles.titleData }>
                                { ` ${rating} / 10` }
                            </span>
                        </span>
                        <ReviewRating
                            color='var(--primary)'
                            repairQuality={ repairQualityRating }
                            repairDuration={ repairDurationRating }
                            comfort={ comfortRating }
                            serviceQuality={ serviceQualityRating }
                        />
                    </div>
                    <div className={ Styles.column }>
                        <span className={ Styles.title }>
                            <FormattedMessage id='reviews.nps_rating' />
                            <span className={ Styles.titleData }>
                                { ` ${npsRating}%` }
                            </span>
                        </span>
                        <ul className={ Styles.reviewsList }>
                            <li>
                                <FormattedMessage id='reviews.count_reviews' />
                                <span className={ Styles.listData }>
                                    { ` ${countReviews}` }
                                </span>
                            </li>
                            <li>
                                <FormattedMessage id='reviews.count_recommended' />
                                <span className={ Styles.listData }>
                                    { ` ${recommended}` }
                                </span>
                            </li>
                            <li>
                                <FormattedMessage id='reviews.count_not_recommended' />
                                <span className={ Styles.listData }>
                                    { ` ${notRecommended}` }
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Catcher>
        );
    }
}
