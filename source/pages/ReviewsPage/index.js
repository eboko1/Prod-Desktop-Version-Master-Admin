// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
import moment from 'moment';

// proj
import { fetchReviews } from 'core/reviews/duck';
import { Layout, Spinner } from 'commons';

// import book from 'routes/book';

// own
//import Styles from './styles.m.css'

const mapStateToProps = state => ({
    reviews:    state.reviews,
    isFetching: state.ui.reviewsFetching,
});

const mapDispatchToProps = {
    fetchReviews,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReviewsPage extends Component {
    componentDidMount() {
        fetchReviews();
    }

    render() {
        const { isFetching } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title='Отзывы клиентов'
                description='Управление отзывами Ваших клиентов'
            >
                <div>Reviews content</div>
            </Layout>
        );
    }
}
