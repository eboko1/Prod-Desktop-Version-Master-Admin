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

    const expirationDiff = subscriptionType =>
        subscriptionType
            ? -moment().diff(subscriptionType.expirationDatetime, 'days')
            : 1000;

    const backgroundColor = subscriptionType => {
        const expiration = expirationDiff(subscriptionType);
        if (Number(expiration)) {
            return cx({
                normalRow:   expiration > 10,
                warningRow:  expiration <= 10 && expiration >= -10,
                criticalRow: expiration < -10,
            });
        }
    };

    return (
        <div className={ Styles.headerInfo }>
            <div className={ Styles.packages }>
                <span
                    className={ `${backgroundColor(packages)} ${
                        Styles.leftRow
                    } ` }
                >
                    PRO:&nbsp;
                </span>
                { packages ? (
                    <>
                        <span className={ backgroundColor(packages) }>
                            { packages.name }&nbsp;
                        </span>
                        <span
                            className={ `${backgroundColor(packages)} ${
                                Styles.rightRow
                            }` }
                        >
                            до&nbsp;
                            { moment(packages.expirationDatetime).format(
                                'YYYY-MM-DD',
                            ) }
                        </span>
                    </>
                ) : (
                    <span
                        className={ `${backgroundColor(packages)} ${
                            Styles.rightRow
                        }` }
                    >
                        <FormattedMessage id='header.not_active' />
                    </span>
                ) }
            </div>
            <div className={ Styles.suggestions }>
                <span
                    className={ `${backgroundColor(suggestions)} ${
                        Styles.leftRow
                    }` }
                >
                    <FormattedMessage id='header.advertisement' />
                    :&nbsp;
                </span>
                <span
                    className={ `${backgroundColor(suggestions)} ${
                        Styles.rightRow
                    }` }
                >
                    { suggestions ? 
                        suggestions.name.split(' ')[ 0 ]
                        : (
                            <FormattedMessage id='header.not_active' />
                        ) }
                </span>
            </div>
        </div>
    );
};
