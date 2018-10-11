// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { Like, ReviewRating, NPS } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

export function columnsConfig() {
    const client = {
        title:     <FormattedMessage id='reviews-table.client' />,
        width:     200,
        dataIndex: 'clientFullname',
        key:       'clientFullname',
        render:    (data, review) => (
            <div className={ Styles.client }>
                <div>{ moment(review.datetime).format('YYYY-MM-DD HH:mm') }</div>
                { review.anonymous ? (
                    <div>
                        <Icon
                            className={ Styles.anonIcon }
                            type='user-delete'
                            theme='outlined'
                        />
                        <div className={ Styles.anon }>
                            <FormattedMessage id='reviews-table.anon' />
                        </div>
                    </div>
                ) : (
                    <div>
                        <Icon
                            className={ Styles.userIcon }
                            type='user'
                            theme='outlined'
                        />
                        <div className={ Styles.user }>
                            { review.clientName } { review.clientSurname }
                        </div>
                    </div>
                ) }
            </div>
        ),
    };

    const feedback = {
        title:     <FormattedMessage id='reviews-table.feedback' />,
        width:     400,
        dataIndex: 'text',
        key:       'text',
        render:    (data, review) => (
            <div>
                { review.orderNum && (
                    <Link
                        className={ Styles.orderLink }
                        to={ `${book.order}/${review.orderId}` }
                    >
                        { review.orderNum }
                    </Link>
                ) }
                { review.visitDatetime && (
                    <div>
                        <span className={ Styles.label }>
                            <FormattedMessage id='reviews-table.visit_date' />:{ ' ' }
                        </span>
                        { moment(review.visitDatetime).format('YYYY-MM-DD') }
                    </div>
                ) }
                { (review.vehicleMakeName || review.vehicleModelName) && (
                    <div>
                        <span className={ Styles.label }>
                            <FormattedMessage id='reviews-table.vehicle' />:{ ' ' }
                        </span>
                        <span className={ Styles.vehicle }>
                            { `${review.vehicleMakeName} ${
                                review.vehicleModelName
                            } (${review.vehicleYear})` }
                        </span>
                    </div>
                ) }
                <div className={ Styles.comment }>{ review.text }</div>
                <Like like={ review.recommended } text />
            </div>
        ),
    };

    const nps = {
        title:     <FormattedMessage id='reviews-table.nps' />,
        width:     100,
        dataIndex: 'nps',
        key:       `nps${v4()}`,
        render:    (nps, review) => {
            if (nps) {
                return (
                    <NPS nps={ nps } mode='block' reviewId={ review.id }>
                        { nps }
                    </NPS>
                );
            }

            return null;
        },
    };

    const rating = {
        title:     <FormattedMessage id='reviews-table.rating' />,
        width:     300,
        dataIndex: 'repairQuality',
        key:       `rating${v4()}`,
        render:    (data, review) => (
            <ReviewRating
                repairQuality={ review.repairQuality }
                repairDuration={ review.repairDuration }
                comfort={ review.comfort }
                serviceQuality={ review.serviceQuality }
            />
        ),
    };

    const link = {
        title:  '',
        key:    'link',
        // fixed:  'right',
        width:  'auto',
        render: (data, review) => (
            <Link to={ `${book.feedback}/${review.id}` }>
                <Icon className={ Styles.reviewLinkIcon } type='edit' />
            </Link>
        ),
    };

    return [ client, feedback, nps, rating, link ];
}
