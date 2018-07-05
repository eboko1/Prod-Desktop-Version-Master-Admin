// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Button, Icon } from 'antd';

// proj
import { fetchOrderForm } from 'core/forms/orderForm/duck';
import { getReport, fetchReport } from 'core/order/duck';
import { Layout } from 'commons';
import { OrderForm } from 'forms';
import { ReportsDropdown, ChangeStatusDropdown } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        stations:    state.forms.orderForm.stations,
        vehicles:    state.forms.orderForm.vehicles,
        employees:   state.forms.orderForm.employees,
        managers:    state.forms.orderForm.managers,
        clients:     state.forms.orderForm.clients,
        allDetails:  state.forms.orderForm.allDetails,
        allServices: state.forms.orderForm.allServices,
        requisites:  state.forms.orderForm.requisites,
        order:       state.forms.orderForm.order,
    };
};

@withRouter
@connect(mapStateToProps, { fetchOrderForm, getReport, fetchReport })
class OrderPage extends Component {
    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    componentDidMount() {
        this.props.fetchOrderForm(this.props.match.params.id);
    }

    onStatusChange = status => console.log('→ status', status);

    render() {
        // destruct order
        const { num, status, datetime } = this.props.order;
        console.log(this.props.order);
        const { id } = this.props.match.params;

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
                        <ChangeStatusDropdown
                            orderStatus={ status }
                            onStatusChange={ () => this.onStatusChange() }
                        />
                        <ReportsDropdown
                            orderId={ id }
                            orderStatus={ status }
                            download={ this.props.getReport }
                        />
                        <Icon
                            style={ { fontSize: 24, cursor: 'pointer' } }
                            type='close'
                            onClick={ () => this.props.history.goBack() }
                        />
                    </>
                }
            >
                <OrderForm wrappedComponentRef={ this.saveFormRef } />
            </Layout>
        );
    }
}

export default OrderPage;
// moment(datetime).format('DD MMMM YYYY, HH:mm')
