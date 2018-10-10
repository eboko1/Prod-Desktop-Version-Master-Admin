// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table } from 'antd';
import classNames from 'classnames/bind';

//own
import { columnsConfig } from './reviewsTableConfig.js';
import Styles from './styles.m.css';

let cx = classNames.bind(Styles);

@injectIntl
export default class ReviewsTable extends Component {
    render() {
        const {
            reviews,
            count,
            filter,
            intl: { formatMessage },
            fetchReviews,
            reviewsFetching,
            setReviewsPageFilter,
        } = this.props;

        const columns = columnsConfig(formatMessage);

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            35,
            // total:            Math.ceil(count / 25) * 25,
            hideOnSinglePage: true,
            current:          1,
            // current:          filter.page,
            // onChange:         page => {
            //     setReviewsPageFilter(page);
            //     fetchReviews(filter);
            // },
        };

        const _rowStyles = complaint =>
            cx({
                row:          true,
                rowComplaint: complaint,
            });

        // const content = this._renderListContent();

        return (
            <Table
                size='small'
                className={ Styles.table }
                columns={ columns }
                dataSource={ reviews }
                // scroll={ scrollConfig() }
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
