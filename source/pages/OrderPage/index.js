// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Icon } from 'antd';
import moment from 'moment';
import _ from 'lodash';

// proj
import {
    fetchOrderForm,
    updateOrder,
    returnToOrdersPage,
    createInviteOrder,
    fetchOrderTask,
} from 'core/forms/orderForm/duck';
import { resetOrderTasksForm, saveOrderTask } from 'core/forms/orderTaskForm/duck'
import { fetchAddClientForm } from 'core/forms/addClientForm/duck';
import { getReport, fetchReport } from 'core/order/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { AddClientModal } from 'modals';
import book from 'routes/book';

import {
    Layout,
    Spinner,
    MobileView,
    ResponsiveView,
    BREAKPOINTS,
} from 'commons';
import { OrderForm, MobileRecordForm } from 'forms';
import { ReportsDropdown, ChangeStatusDropdown } from 'components';
import {
    CancelReasonModal,
    ToSuccessModal,
    ConfirmOrderExitModal,
    OrderTaskModal,
} from 'modals';

import {
    convertFieldsValuesToDbEntity,
    requiredFieldsOnStatuses,
} from './../AddOrderPage/extractOrderEntity';

const mapStateToProps = state => {
    return {
        orderTaskEntity:   state.forms.orderTaskForm.fields,
        orderTasks:        state.forms.orderForm.tasks,
        stations:          state.forms.orderForm.stations,
        vehicles:          state.forms.orderForm.vehicles,
        employees:         state.forms.orderForm.employees,
        managers:          state.forms.orderForm.managers,
        clients:           state.forms.orderForm.clients,
        allDetails:        state.forms.orderForm.allDetails,
        allServices:       state.forms.orderForm.allServices,
        requisites:        state.forms.addOrderForm.requisites,
        addClientFormData: state.forms.addClientForm.data,
        orderComments:     state.forms.orderForm.orderComments,
        order:             state.forms.orderForm.order,
        inviteOrderId:     state.forms.orderForm.inviteOrderId,
        orderCalls:        state.forms.orderForm.calls,
        orderHistory:      state.forms.orderForm.history,
        initOrderEntity:   state.forms.orderForm.initOrderEntity,
        invited:           state.forms.orderForm.invited,
        modal:             state.modals.modal,
        spinner:           state.ui.get('orderFetching'),
        orderEntity:       {
            ...state.forms.orderForm.fields,
            selectedClient: state.forms.orderForm.selectedClient,
        },
    };
};

const mapDispatchToProps = {
    fetchOrderForm,
    fetchOrderTask,
    getReport,
    fetchReport,
    updateOrder,
    setModal,
    resetModal,
    returnToOrdersPage,
    createInviteOrder,
    fetchAddClientForm,
    resetOrderTasksForm,
    saveOrderTask,

};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class OrderPage extends Component {
    componentDidMount() {
        this.props.fetchOrderForm(this.props.match.params.id);
        // TBD: @andrey
        this.props.fetchOrderTask(this.props.match.params.id);
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    saveOrderFormRef = formRef => {
        this.orderFormRef = formRef;
    };

    handleAddClientModalSubmit = () => {
        const form = this.formRef.props.form;
        this.setAddClientModal();
        form.validateFields((err, values) => {
            if (!err) {
                // eslint-disable-next-line
                console.log("Received values of AddClientForm: ", values);
            }
        });
        this.props.resetModal();
    };

    setAddClientModal = () => {
        this.props.fetchAddClientForm();
        this.props.setModal(MODALS.ADD_CLIENT);
    };

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

    /* eslint-disable complexity*/
    render() {
        const {
            setModal,
            resetModal,
            spinner,
            modal,
            addClientFormData,
        } = this.props;

        const { num, status, datetime } = this.props.order;
        const { id } = this.props.match.params;

        const hasInviteStatus = [ 'success', 'cancel' ].includes(
            _.get(this.props, 'order.status'),
        );
        const isInviteVisible =
            !this.props.inviteOrderId &&
            _.get(this.props, 'order.id') &&
            _.get(this.props, 'order.status') &&
            hasInviteStatus;

        const isInviteEnabled =
            _.get(this.props, 'order.id') &&
            _.get(this.props, 'order.status') &&
            hasInviteStatus &&
            _.get(this.props, 'order.clientVehicleId') &&
            _.get(this.props, 'order.clientId') &&
            _.get(this.props, 'order.clientPhone') &&
            !this.props.invited;

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
                        {hasInviteStatus ? (
                            <Link
                                visible={ this.props.inviteOrderId }
                                to={ `${book.order}/${this.props.inviteOrderId}` }
                            >
                                { this.props.inviteOrderId }
                            </Link>
                        ) : null}

                        {isInviteVisible ? (
                            <Button
                                disabled={ !isInviteEnabled }
                                onClick={ () => {
                                    const {
                                        clientVehicleId,
                                        clientId,
                                        status,
                                        clientPhone,
                                    } = this.props.order;

                                    if (
                                        (status === 'success' ||
                                            status === 'cancel') &&
                                        clientVehicleId &&
                                        clientId &&
                                        clientPhone
                                    ) {
                                        this.props.createInviteOrder({
                                            status:    'invite',
                                            clientVehicleId,
                                            clientId,
                                            clientPhone,
                                            managerId: 720, // TODO fix stub
                                        });
                                    }
                                } }
                            >
                                <FormattedMessage id='order-page.create_invite_order' />
                            </Button>
                        ) : null}

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
                <MobileView>
                    <MobileRecordForm />
                </MobileView>
                <ResponsiveView
                    view={ { min: BREAKPOINTS.md.min, max: BREAKPOINTS.xxl.max } }
                >
                    <OrderForm
                        wrappedComponentRef={ this.saveOrderFormRef }
                        orderTasks={ this.props.orderTasks }
                        orderHistory={ this.props.orderHistory }
                        setAddClientModal={ this.setAddClientModal }
                        modal={ modal }
                        orderCalls={ this.props.orderCalls }
                        allService={ this.props.allServices }
                        allDetails={ this.props.allDetails }
                        employees={ this.props.employees }
                        filteredDetails={ this.props.filteredDetails }
                        setModal={ setModal }
                    />
                </ResponsiveView>
                <AddClientModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    handleAddClientModalSubmit={ this.handleAddClientModalSubmit }
                    resetModal={ resetModal }
                    addClientFormData={ addClientFormData }
                />
                <CancelReasonModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    handleCancelReasonModalSubmit={ this.onStatusChange.bind(
                        this,
                    ) }
                    orderComments={ this.props.orderComments }
                    resetModal={ () => resetModal() }
                />
                <ConfirmOrderExitModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    status={ status }
                    returnToOrdersPage={ this.props.returnToOrdersPage.bind(
                        this,
                    ) }
                    saveOrder={ () => this.onStatusChange(status, status) }
                    resetModal={ () => resetModal() }
                />
                <ToSuccessModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    handleToSuccessModalSubmit={ this.onStatusChange.bind(this) }
                    resetModal={ () => resetModal() }
                />
                <OrderTaskModal
                    orderTaskEntity={ this.props.orderTaskEntity }
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    resetModal={ () => resetModal() }
                    num={ num }
                    orderId={ this.props.match.params.id }
                    saveOrderTask={ this.props.saveOrderTask }
                    resetOrderTasksForm={ this.props.resetOrderTasksForm }
                />
            </Layout>
        ) : (
            <Spinner spin={ spinner } />
        );
    }
}

export default OrderPage;
// moment(datetime).format('DD MMMM YYYY, HH:mm')
