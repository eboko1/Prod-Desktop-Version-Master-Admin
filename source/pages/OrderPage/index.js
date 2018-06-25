// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Button, Icon } from 'antd';

// proj
import { fetchOrder, fetchReport } from 'core/order/duck';
import { Layout } from 'commons';
import { OrderForm } from 'forms';
import { ReportsDropdown } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

const mapStateToProps = (state, props) => {
    return {
        order: {
            status:   state.order.order.status,
            num:      state.order.order.num,
            datetime: state.order.order.datetime,
            // id:       state.order.order.id,
        },
    };
};

@withRouter
@connect(mapStateToProps, { fetchOrder, fetchReport })
class OrderPage extends Component {
    componentDidMount() {
        this.props.fetchOrder(this.props.match.params.id);
    }

    getOrderReports() {
        const { status }  = this.props.order;
        const { id } = this.props.match.params;
    }

    render() {
        // destruct order
        const { num, status, datetime } = this.props.order;
        const { id } = this.props.match.params;
        const orderReports = this.getOrderReports();

        return (
            <Layout
                title={
                    !status || !num ?
                        ''
                        :
                        <>
                            <FormattedMessage
                                id={ `order-status.${status || 'order'}` }
                            />
                            {` ${num}`}
                        </>

                }
                description={
                    <>
                        <FormattedMessage id='order-page.creation_date' />
                        {`: ${moment(datetime).format('DD MMMM YYYY, HH:mm')}`}
                    </>
                }
                controls={
                    <>
                        <ReportsDropdown orderId = { id } orderStatus = { status } />
                        <Icon
                            style={ { fontSize: 24, cursor: 'pointer' } }
                            type='close'
                            onClick={ () => this.props.history.goBack() }
                        />
                    </>
                }
            >
                <div>Order Form: { id }</div>
                <OrderForm />
            </Layout>
        );
    }
}

export default OrderPage;
// moment(datetime).format('DD MMMM YYYY, HH:mm')
