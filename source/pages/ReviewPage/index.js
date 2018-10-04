// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
import moment from 'moment';

// proj
import { fetchReview } from 'core/review/duck';
import { Layout, Spinner } from 'commons';

// import book from 'routes/book';

// own
//import Styles from './styles.m.css'

const mapStateToProps = state => ({
    review:     state.review,
    isFetching: state.ui.reviewFetching,
});

const mapDispatchToProps = {
    fetchReview,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReviewPage extends Component {
    componentDidMount() {
        fetchReview(this.props.review.id);
    }

    render() {
        const { isFetching } = this.props;

        const { anonymous, clientFullname, datetime } = this.props.review;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title={ `Отзыв клиента: ${
                    anonymous ? 'Анонимно' : clientFullname
                }` }
                description={
                    <>
                        <FormattedMessage id='order-page.creation_date' />
                        {`: ${moment(datetime).format('DD MMMM YYYY, HH:mm')}`}
                    </>
                }
                controls={ <Button>Go back</Button> }
            >
                <div>Review content</div>
            </Layout>
        );
    }
}
