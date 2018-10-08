// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { List } from 'antd';
import classNames from 'classnames/bind';

// proj
import { ReviewRating, NPS } from 'components';

//own
import Styles from './styles.m.css';

let cx = classNames.bind(Styles);

@injectIntl
export default class ReviewsList extends Component {
    render() {
        const {
            reviews,
            intl: { formatMessage },
        } = this.props;

        // const pagination = {
        //     pageSize:         25,
        //     size:             'large',
        //     total:            Math.ceil(this.props.count / 25) * 25,
        //     hideOnSinglePage: true,
        //     current:          this.props.filter.page,
        //     onChange:         page => {
        //         this.props.setReviewsPageFilter(page);
        //         this.props.fetchReviews(this.props.filter);
        //     },
        // };

        const _listItemStyles = complaint => {
            return cx({
                listItem:          true,
                listItemComplaint: complaint,
            });
        };

        // const content = this._renderListContent();

        return (
            <List
                bordered
                locale={ {
                    emptyText: formatMessage({ id: 'no_data' }),
                } }
                dataSource={ reviews }
                itemLayout='vertical'
                size='large'
                // pagination={ pagination }
                renderItem={ review => (
                    <List.Item className={ _listItemStyles(review.complaint) }>
                        <List.Item.Meta
                            className={ Styles.feedbackListItem }
                            // description={ content(review) }
                            description={
                                <div className={ Styles.listContent}>
                                    <div>user</div>
                                    <div>message</div>
                                    { /* <NPS nps={ review.nps } /> */ }
                                    <ReviewRating
                                        repairQuality={ review.repairQuality }
                                        repairDuration={ review.repairDuration }
                                        comfort={ review.comfort }
                                        serviceQuality={ review.serviceQuality }
                                    />
                                    <div>edit</div>
                                </div>
                            }
                        />
                    </List.Item>
                ) }
            />
        );
    }

    _renderListContent = review => {
        return (
            <div>
                <div>user</div>
                <div>message</div>
                { /* <NPS nps={ review.nps } /> */ }
                <ReviewRating
                    repairQuality={ review.repairQuality }
                    repairDuration={ review.repairDuration }
                    comfort={ review.comfort }
                    serviceQuality={ review.serviceQuality }
                />
                <div>edit</div>
            </div>
        );
    };
}
