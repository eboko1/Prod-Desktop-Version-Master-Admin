// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Table, Icon } from 'antd';
import moment from 'moment';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { Rating, Like } from 'components';

// own
import Styles from './styles.m.css';
import book from 'routes/book';

export default class EmployeeFeedback extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='employee-feedback.feedback' />,
                dataIndex: 'datetime',
                width:     '15%',
                render:    (datetime, record) => (
                    <div>
                        <Link
                            className={ Styles.employeeName }
                            to={ `${book.oldApp.reviews}/${record.id}` }
                        >
                            <div>
                                { moment(datetime).format('YYYY-MM-DD HH:mm') }
                            </div>
                            <div className={ Styles.link }>
                                <FormattedMessage id='employee-feedback.go_to_feedback' />
                                <Icon type='enter' theme='outlined' />
                            </div>
                        </Link>
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='employee-feedback.order' />,
                dataIndex: 'orderNum',
                width:     '15%',
                render:    (orderNum, orderId) => (
                    <Link to={ `${book.orders}/${orderId}` }>
                        <div>{ orderNum }</div>
                        <div className={ Styles.link }>
                            <FormattedMessage id='employee-feedback.go_to_order' />
                            <Icon type='enter' theme='outlined' />
                        </div>
                    </Link>
                ),
            },
            {
                title:     <FormattedMessage id='employee-feedback.rating' />,
                dataIndex: 'rating',
                width:     '20%',
                render:    (rate, record) => (
                    <div>
                        <Rating rating={ record.rating } />
                        <Like like={ record.recommended } />
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='employee-feedback.comment' />,
                dataIndex: 'text',
                width:     '50%',
                render:    text => <div className={ Styles.comment }>{ text }</div>,
            },
        ];
    }

    render() {
        const { reviews } = this.props;

        const avgRating = this._renderAvgRating();

        return (
            <Catcher>
                { avgRating }
                <Table
                    className={ Styles.employeeFeedbackTable }
                    dataSource={ reviews }
                    columns={ this.columns }
                    size='small'
                    scroll={ { x: 1000 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }

    _renderAvgRating = () => {
        const { reviews } = this.props;
        const avgRating = _.meanBy(reviews, 'rating');

        return (
            <div className={ Styles.avgRating }>
                <FormattedMessage id='employee-feedback.average_rating' />
                <Rating className={ Styles.avgRatingStars } rating={ avgRating } />
            </div>
        );
    };
}
