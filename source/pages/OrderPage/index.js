// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Button, Icon } from 'antd';

// proj
import { fetchOrderForm, updateOrder, returnToOrdersPage } from 'core/forms/orderForm/duck';
import { getReport, fetchReport } from 'core/order/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout, Spinner } from 'commons';
import { OrderForm } from 'forms';
import { ReportsDropdown, ChangeStatusDropdown } from 'components';
import { CancelReasonModal, ToSuccessModal, ConfirmOrderExitModal } from 'modals';
import book from 'routes/book';

import {
    convertFieldsValuesToDbEntity,
    requiredFieldsOnStatuses,
} from './../AddOrderPage/extractOrderEntity';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        stations:          state.forms.orderForm.stations,
        vehicles:          state.forms.orderForm.vehicles,
        employees:         state.forms.orderForm.employees,
        managers:          state.forms.orderForm.managers,
        clients:           state.forms.orderForm.clients,
        allDetails:        state.forms.orderForm.allDetails,
        allServices:       state.forms.orderForm.allServices,
        requisites:        state.forms.addOrderForm.requisites,
        addClientModal:    state.modals.modal,
        addClientFormData: state.forms.addClientForm.data,
        orderComments:     state.forms.orderForm.orderComments,
        order:             state.forms.orderForm.order,
        orderCalls:        state.forms.orderForm.calls,
        orderTasks:        state.forms.orderForm.tasks,
        orderHistory:      state.forms.orderForm.history,
        initOrderEntity:   state.forms.orderForm.initOrderEntity,
        orderEntity:       {
            ...state.forms.orderForm.fields,
            selectedClient: state.forms.orderForm.selectedClient,
        },
        modal:   state.modals.modal,
        spinner: state.ui.get('orderFetching'),
    };
};

@withRouter
@connect(mapStateToProps, {
    fetchOrderForm,
    getReport,
    fetchReport,
    updateOrder,
    setModal,
    resetModal,
    returnToOrdersPage,
})
class OrderPage extends Component {
    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    saveOrderFormRef = formRef => {
        this.orderFormRef = formRef;
    };

    componentDidMount() {
        this.props.fetchOrderForm(this.props.match.params.id);
    }

    onStatusChange(status, redirectStatus) {
        const { id } = this.props.match.params;
        const requiredFields = requiredFieldsOnStatuses[ status ];
        const form = this.orderFormRef.props.form;

        form.validateFields(requiredFields, err => {
            if (!err) {
                this.props.updateOrder({
                    id,
                    order: convertFieldsValuesToDbEntity(
                        this.props.orderEntity,
                        this.props.allServices,
                        this.props.allDetails,
                        status,
                    ),
                    redirectStatus,
                });
            }
        });
    }

    render() {
        const { setModal, resetModal, spinner } = this.props;
        const { num, status, datetime } = this.props.order;
        const { id } = this.props.match.params;

        return !spinner ? (
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
                            onStatusChange={ this.onStatusChange.bind(this) }
                            setModal={ setModal }
                            modals={ MODALS }
                        />
                        <ReportsDropdown
                            orderId={ id }
                            orderStatus={ status }
                            download={ this.props.getReport }
                        />
                        <Icon
                            type='save'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                                margin:   '0 10px',
                            } }
                            onClick={ () => this.onStatusChange(status) }
                        />
                        <Icon
                            type='delete'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                                margin:   '0 10px',
                            } }
                            onClick={ () => setModal(MODALS.CANCEL_REASON) }
                        />
                        <Icon
                            style={ { fontSize: 24, cursor: 'pointer' } }
                            type='close'
                            onClick={ () => {
                                const newOrder = convertFieldsValuesToDbEntity(
                                    this.props.orderEntity,
                                    this.props.allServices,
                                    this.props.allDetails,
                                );

                                if (
                                    _.isEqual(
                                        newOrder,
                                        this.props.initOrderEntity,
                                    )
                                ) {
                                    this.props.returnToOrdersPage(status);
                                } else {
                                    setModal(MODALS.CONFIRM_EXIT);
                                }
                            } }
                        />
                    </>
                }
            >
                <OrderForm
                    wrappedComponentRef={ this.saveOrderFormRef }
                    orderTasks={ this.props.orderTasks }
                    orderHistory={ this.props.orderHistory }
                    orderCalls={ this.props.orderCalls }
                />
                <CancelReasonModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ this.props.modal }
                    handleCancelReasonModalSubmit={ this.onStatusChange.bind(
                        this,
                    ) }
                    orderComments={ this.props.orderComments }
                    resetModal={ () => resetModal() }
                />
                <ConfirmOrderExitModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ this.props.modal }
                    status={ status }
                    returnToOrdersPage={ this.props.returnToOrdersPage.bind(this) }
                    saveOrder={ () => this.onStatusChange(status, status) }
                    resetModal={ () => resetModal() }
                />
                <ToSuccessModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ this.props.modal }
                    handleToSuccessModalSubmit={ this.onStatusChange.bind(this) }
                    resetModal={ () => resetModal() }
                />
            </Layout>
        ) : (
            <Spinner spin={ spinner } />
        );
    }
}

export default OrderPage;
// moment(datetime).format('DD MMMM YYYY, HH:mm')
