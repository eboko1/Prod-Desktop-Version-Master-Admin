// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

// proj
import {
    fetchReview,
    postReviewReply,
    postReviewComplain,
} from 'core/review/duck';

import { Layout, Spinner, GoBack } from 'commons';
import { ReviewRating, NPS, Like, ReviewResponse } from 'components';

import book from 'routes/book';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    review:                 state.review,
    isFetching:             state.ui.reviewFetching,
    reviewReplyLoading:     state.ui.reviewReplyLoading,
    reviewComplaintLoading: state.ui.reviewComplaintLoading,
});

const mapDispatchToProps = {
    fetchReview,
    postReviewReply,
    postReviewComplain,
};

@withRouter
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReviewPage extends Component {
    componentDidMount() {
        this.props.fetchReview(this.props.match.params.id);
    }

    render() {
        const {
            isFetching,
            intl: { formatMessage },
        } = this.props;

        const {
            clientName,
            clientSurname,
            anonymous,
            datetime,
            nps,
            recommended,
            comfort,
            repairDuration,
            repairQuality,
            serviceQuality,
            text,
            vehicleMakeName,
            vehicleModelName,
            vehicleYear,
            visitDatetime,
            orderId,
            orderNum,
            employeeName,
            employeeSurname,
            employeeId,
            clientPhones,
            reply,
            replyText,
            complaint,
            complaintText,
        } = this.props.review;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ `${formatMessage({ id: 'review-page.title' })}: ${
                    anonymous
                        ? formatMessage({ id: 'reviews-table.anon' })
                        : `${!_.isNil(clientName) ? clientName : ''} ${
                            !_.isNil(clientSurname) ? clientSurname : ''
                        }`
                }` }
                description={
                    <>
                        <FormattedMessage id='order-page.creation_date' />
                        {`: ${moment(datetime).format('DD MMMM YYYY, HH:mm')}`}
                    </>
                }
                controls={ <GoBack link={ book.feedback } /> }
            >
                <section className={ Styles.reviewHead }>
                    <div className={ Styles.npsColumn }>
                        <div className={ Styles.dataRow }>
                            <span className={ Styles.label }>
                                <FormattedMessage id='reviews-table.visit_date' />
                                :{ ' ' }
                            </span>
                            { moment(visitDatetime).format('DD MMMM YYYY') }
                        </div>
                        <div className={ Styles.dataRow }>
                            <span className={ Styles.label }>
                                <FormattedMessage id='reviews-table.vehicle' />:{ ' ' }
                            </span>
                            { `${
                                !_.isNil(vehicleMakeName) ? vehicleMakeName : ''
                            } ${
                                !_.isNil(vehicleModelName)
                                    ? vehicleModelName
                                    : ''
                            } (${!_.isNil(vehicleYear) ? vehicleYear : ''})` }
                        </div>
                        <div className={ Styles.dataRow }>
                            <span className={ Styles.label }>
                                <FormattedMessage id='phone' />:{ ' ' }
                            </span>
                            <a href={ `tel:${_.first(clientPhones)}` }>
                                { _.first(clientPhones) }
                            </a>
                        </div>
                        <div className={ Styles.dataRow }>
                            <NPS nps={ nps } mode='scale' label />
                        </div>
                    </div>
                    <div className={ Styles.orderColumn }>
                        <span>
                            <FormattedMessage id='review.order' />:{ ' ' }
                            <Link to={ `${book.order}/${orderId}` }>
                                { orderNum }
                            </Link>
                        </span>
                        <span>
                            <FormattedMessage id='review.master' />:{ ' ' }
                            <Link to={ `${book.employeesPage}/${employeeId}` }>
                                { employeeName } { employeeSurname }
                            </Link>
                        </span>
                    </div>
                </section>
                <section className={ Styles.rating }>
                    <ReviewRating
                        comfort={ comfort }
                        repairDuration={ repairDuration }
                        repairQuality={ repairQuality }
                        serviceQuality={ serviceQuality }
                    />
                    <Like like={ recommended } text />
                </section>
                <section className={ Styles.response }>
                    <ReviewResponse
                        text={ text }
                        reply={ reply }
                        replyText={ replyText }
                        complaint={ complaint }
                        complaintText={ complaintText }
                        postReviewReply={ this.props.postReviewReply }
                        postReviewComplain={ this.props.postReviewComplain }
                        id={ this.props.match.params.id }
                        reviewReplyLoading={ this.props.reviewReplyLoading }
                        reviewComplaintLoading={
                            this.props.reviewComplaintLoading
                        }
                    />
                </section>
            </Layout>
        );
    }
}
