// vendor
import React, { Component } from 'react';
import { Table, Icon, Rate } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';

// proj
import book from 'routes/book';
import { FormattedDatetime } from 'components';

// own
import Styles from './styles.m.css';
import {Link} from 'react-router-dom';

@injectIntl
export default class ClientFeedbackTab extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                dataIndex: 'datetime',
                width:     '20%',
                render:    record => <FormattedDatetime datetime={ record }/>,
            },
            {
                width:  '20%',
                render: ({ orderId, orderNum}) => this.renderOrderLink({ orderId, orderNum}),
            },
            {
                dataIndex: 'rating',
                width:     '20%',
                render:    record => this.renderRatingStars(record),
            },
            {
                dataIndex: 'recommended',
                width:     '5%',
                render:    record => this.renderRecommendationIcon(record),
            },
            {
                dataIndex: 'text',
                width:     '35%',
            },
        ];
    }

    renderOrderLink({orderId, orderNum}){
        const link = <Link
            to={ `${book.order}/${orderId}` }
        >
            { orderNum }
        </Link>;

        return link;
    }

    renderRecommendationIcon(recommended) {
        const type = recommended ? 'like': 'dislike';
        const icon = <Icon
            type={ type }
            theme='outlined'
            className={ Styles.recommendationIcon }
        />;

        return icon;
    }

    renderRatingStars(rating) {
        const value = rating / 2;
        const ratingStarts = <Rate
            className={ Styles.ratingStars }
            allowHalf
            disabled
            defaultValue={ value }
        />;

        return ratingStarts;
    }

    render() {
        const {
            feedback,
        } = this.props;


        const feedbackRows = feedback.map((item, index) => ({
            ...item,
            index,
            key: item.id,
        }));

        return <>
            <h2 className={ Styles.title }>
                <FormattedMessage id='client_feedback.client_feedback_about_completed_orders' />
            </h2>

            <Table
                showHeader = { false }
                pagination={ {
                    hideOnSinglePage: true,
                    size:             'large',
                } }
                size='small'
                dataSource={ feedbackRows }
                columns={ this.columns }
            />
            </>;
    }
}
