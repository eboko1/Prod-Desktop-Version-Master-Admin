// vendor
import React, { Component } from 'react';

// proj
import { Rating } from 'components';

export default class ReviewRating extends Component {
    render() {
        const {
            className,
            repairQuality,
            repairDuration,
            comfort,
            serviceQuality,
        } = this.props;

        return (
            <div className={ className }>
                <Rating rating={ repairQuality } />
                <Rating rating={ repairDuration } />
                <Rating rating={ comfort } />
                <Rating rating={ serviceQuality } />
            </div>
        );
    }
}
