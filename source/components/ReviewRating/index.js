// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Rating } from 'components';

// own
import Styles from './styles.m.css';

export default class ReviewRating extends Component {
    render() {
        const {
            repairQuality,
            repairDuration,
            comfort,
            serviceQuality,
        } = this.props;

        return (
            <ul className={ Styles.reviewRating }>
                <li>
                    <FormattedMessage id='reviews-table.repair_quality' />:{ ' ' }
                    <Rating rating={ repairQuality } />
                </li>
                <li>
                    <FormattedMessage id='reviews-table.repair_duration' />:{ ' ' }
                    <Rating rating={ repairDuration } />
                </li>
                <li>
                    <FormattedMessage id='reviews-table.comfort' />:
                    <Rating rating={ comfort } />
                </li>
                <li>
                    <FormattedMessage id='reviews-table.service' />:
                    <Rating rating={ serviceQuality } />
                </li>
            </ul>
        );
    }
}
