// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames/bind';

// own
import Styles from './styles.m.css';
const cx = classNames.bind(Styles);

export const Subscriptions = props => {
    const { packages, suggestions } = props;

    const expirationDiff = -moment().diff(packages.expirationDatetime, 'days');

    const backgroundColor = () => {
        if (Number(expirationDiff)) {
            return cx({
                normalRow:   expirationDiff > 10,
                warningRow:  expirationDiff <= 10 && expirationDiff >= -10,
                criticalRow: expirationDiff < -10,
            });
        }
    };

    return (
        <div className={ Styles.headerInfo }>
            <div className={ Styles.packages }>
                <span className={ `${backgroundColor()} ${Styles.leftRow} ` }>
                    PRO:&nbsp;
                </span>
                <span className={ backgroundColor() }>{ packages.name }&nbsp;</span>
                <span className={ `${backgroundColor()} ${Styles.rightRow}` }>
                    до&nbsp;
                    { moment(packages.expirationDatetime).format('YYYY-MM-DD') }
                </span>
            </div>
            <div className={ Styles.suggestions }>
                <span className={ `${backgroundColor()} ${Styles.leftRow}` }>
                    <FormattedMessage id='header.advertisement' />
                    :&nbsp;
                </span>
                <span className={ `${backgroundColor()} ${Styles.rightRow}` }>
                    { suggestions ? 
                        suggestions
                        : (
                            <FormattedMessage id='header.no_active' />
                        ) }
                </span>
            </div>
        </div>
    );
};
