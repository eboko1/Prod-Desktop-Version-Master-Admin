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

        const scale = this._renderNPSscale();

        if (_.isNumber(nps)) {
            if (mode === 'scale') {
                return scale;
            }

            return (
                <Link to={ `${book.feedback}/${reviewId}` }>
                    <div className={ _styles() }>{ Math.round(nps) }</div>
                </Link>
            );
        }

        return null;
    }

    _renderNPSscale = () => {
        const { nps, label } = this.props;

        const MIN = 0;
        const MAX = 10;

        const _styles = value =>
            cx({
                scaleValue:       true,
                scaleValueFilled: _.isNumber(nps) && Math.round(nps) >= value,
            });

        return (
            <div className={ Styles.npsScale }>
                { label && (
                    <span className={ Styles.scaleLabel }>
                        <span className={ Styles.scaleLabelTitle }>NPS </span>
                        <span className={ Styles.scaleLabelData }>
                            { nps } / { MAX }
                        </span>
                    </span>
                ) }
                <div className={ Styles.scale }>
                    { Array(MAX - MIN + 1)
                        .fill()
                        .map((_void, value) => MIN + value)
                        .map(item => (
                            <div key={ item } className={ _styles(item) }>
                                { item }
                            </div>
                        )) }
                </div>
            </div>
        );
    };
}
