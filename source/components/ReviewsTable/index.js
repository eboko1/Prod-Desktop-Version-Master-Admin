// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';

//own
import { columnsConfig } from './reviewsTableConfig.js';
import Styles from './styles.m.css';

let cx = classNames.bind(Styles);

@injectIntl
export default class ReviewsTable extends Component {
    render() {
        const {
            reviews,
            stats,
            filter,
            intl: { formatMessage },
            fetchReviews,
            reviewsFetching,
            setReviewsPageFilter,
        } = this.props;

        const columns = columnsConfig(formatMessage);

        const pagination = {
            pageSize:         10,
            size:             'large',
            total:            Math.ceil(_.get(stats, 'total') / 10) * 10,
            hideOnSinglePage: true,
            current:          filter.page,
            onChange:         page => {
                setReviewsPageFilter(page);
                fetchReviews();
            },
        };

        const _rowStyles = complaint =>
            cx({
                row:          true,
                rowComplaint: complaint,
            });

        return (
            <Table
                size='small'
                className={ Styles.table }
                columns={ columns }
                dataSource={ reviews }
                loading={ reviewsFetching }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
                pagination={ pagination }
                // onChange={ handleTableChange }
                scroll={ { x: 1080 } }
                rowClassName={ review => _rowStyles(review.complaint) }
            />
        );
    }
}
