// vendor
import React, { Component } from 'react';
import { Rate } from 'antd';
// import styled from 'styled-components';

// own

export default class Rating extends Component {
    static defaultProps = {
        formatter: 2,
        allowHalf: true,
    };

    render() {
        const { rating, formatter, allowHalf, className } = this.props;
        const value = rating / formatter;

        return (
            <Rate
                className={ className }
                style={ { color: 'var(--secondary)' } }
                allowHalf={ allowHalf }
                disabled
                defaultValue={ value }
            />
        );
    }
}

// .recommendationIcon {
//     font-size: 28px;
//     color: var(--primary);
// }
//
// .ratingStars {
//     color: var(--secondary);
// }
