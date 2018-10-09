// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import _ from 'lodash';

// proj
import book from 'routes/book';

// own
import Styles from './styles.m.css';

let cx = classNames.bind(Styles);

export default class NPS extends Component {
    static defaultProps = {
        mode: 'inline',
    };

    render() {
        const { nps, mode, reviewId } = this.props;

        const _styles = () =>
            cx({
                npsHigh:   nps >= 9,
                npsMid:    nps === 7 || nps === 8,
                npsLow:    nps <= 6,
                npsBlock:  mode === 'block',
                npsInline: mode === 'inline',
                npsScale:  mode === 'scale',
            });

        if (_.isNumber(nps)) {
            return (
                <Link to={ `${book.review}/${reviewId}` }>
                    <div className={ _styles() }>{ Math.round(nps) }</div>
                </Link>
            );
        }

        return null;
    }
}
