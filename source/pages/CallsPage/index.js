// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
import moment from 'moment';

// proj
import { fetchCalls } from 'core/calls/duck';
import { Layout, Spinner } from 'commons';

// import book from 'routes/book';

// own
//import Styles from './styles.m.css'

const mapStateToProps = state => ({
    calls:      state.calls,
    isFetching: state.ui.reviewsFetching,
});

const mapDispatchToProps = {
    fetchCalls,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CallsPage extends Component {
    componentDidMount() {
        fetchCalls();
    }

    render() {
        const { isFetching } = this.props;

        return isFetching ? (
            <Spinner spin={ isFetching } />
        ) : (
            <Layout
                title='ОСтатистика звонков Вашей станции'
                controls={
                    <>
                        <div>range picker</div>
                        <div>channel select</div>
                    </>
                }
            >
                <div>Calls content</div>
            </Layout>
        );
    }
}
