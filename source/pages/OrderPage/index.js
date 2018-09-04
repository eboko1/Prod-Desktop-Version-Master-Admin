// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
    selectInviteData,
} from 'core/forms/orderForm/duck';
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import { fetchAddClientForm } from 'core/forms/addClientForm/duck';
import { getReport, fetchReport } from 'core/order/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import book from 'routes/book';

import { Layout, Spinner, MobileView, ResponsiveView } from 'commons';
import { BREAKPOINTS } from 'utils';
import { OrderForm, MobileRecordForm } from 'forms';
import { ReportsDropdown, ChangeStatusDropdown } from 'components';
import {
    CancelReasonModal,
    ToSuccessModal,
    ConfirmOrderExitModal,
    OrderTaskModal,
} from 'modals';
import { permissions, isForbidden } from 'utils';
import {
    convertFieldsValuesToDbEntity,
    requiredFieldsOnStatuses,
} from 'forms/OrderForm/extractOrderEntity';

const mapStateToProps = state => {
    return {
        isMobile:              state.ui.views.isMobile,
        orderTaskEntity:       state.forms.orderTaskForm.fields,
        orderTaskId:           state.forms.orderTaskForm.taskId,
        priorityOptions:       state.forms.orderTaskForm.priorityOptions,
        progressStatusOptions: state.forms.orderTaskForm.progressStatusOptions,
        orderTasks:            state.forms.orderForm.orderTasks,
        stations:              state.forms.orderForm.stations,
        vehicles:              state.forms.orderForm.vehicles,
        employees:             state.forms.orderForm.employees,
        managers:              state.forms.orderForm.managers,
        clients:               state.forms.orderForm.clients,
        allDetails:            state.forms.orderForm.allDetails,
        allServices:           state.forms.orderForm.allServices,
        requisites:            state.forms.orderForm.requisites,
        addClientFormData:     state.forms.addClientForm.data,
        orderComments:         state.forms.orderForm.orderComments,
        order:                 state.forms.orderForm.order,
        inviteOrderId:         state.forms.orderForm.inviteOrderId,
        orderCalls:            state.forms.orderForm.calls,
        orderHistory:          state.forms.orderForm.history,
        initOrderEntity:       state.forms.orderForm.initOrderEntity,
        invited:               state.forms.orderForm.invited,
        user:                  state.auth,
        modal:                 state.modals.modal,
        spinner:               state.ui.orderFetching,
        selectedClient:        state.forms.orderForm.selectedClient,
        fetchedOrder:          state.forms.orderForm.fetchedOrder,
        fields:                state.forms.orderForm.fields,
        ...selectInviteData(state),
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
    changeModalStatus,
};

// @withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class OrderPage extends Component {
    componentDidMount() {
        const { fetchOrderForm, fetchOrderTask, match } = this.props;
        fetchOrderForm(match.params.id);
        fetchOrderTask(match.params.id);
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    saveOrderFormRef = formRef => {
        this.orderFormRef = formRef;
    };

    saveOrderTaskFormRef = formRef => {
        this.orderTaskFormRef = formRef;
    };

    setAddClientModal = () => {
        this.props.fetchAddClientForm();
        this.props.setModal(MODALS.ADD_CLIENT);
    };

    _onStatusChange = (status, redirectStatus, options) => {
        const { allServices, allDetails, selectedClient, history } = this.props;
        const requiredFields = requiredFieldsOnStatuses[ status ];
        const { id } = this.props.match.params;
        const form = this.orderFormRef.props.form;

        form.validateFields(requiredFields, err => {
            if (!err) {
                const values = form.getFieldsValue();
                const orderFormEntity = { ...values, selectedClient };
                const redirectToDashboard = _.get(
                    history,
                    'location.state.fromDashboard',
                );

                this.props.updateOrder({
                    id,
                    order: convertFieldsValuesToDbEntity(
                        orderFormEntity,
                        allServices,
                        allDetails,
                        status,
                        this.props.user,
                    ),
                    redirectStatus,
                    redirectToDashboard,
                    options,
                });
            }
        });
    };

    _saveNewOrderTask = () => {
        const {
            saveOrderTask,
            resetModal,
            resetOrderTasksForm,
            orderTaskEntity,
            orderTaskId,
        } = this.props;

        const form = this.orderTaskFormRef.props.form;
        form.validateFields(err => {
            if (!err) {
                saveOrderTask(
                    orderTaskEntity,
                    this.props.match.params.id,
                    orderTaskId,
                );
                resetModal();
                resetOrderTasksForm();
            }
        });
    };

    _close = () => {
        const {
            selectedClient,
            fields,
            allServices,
            allDetails,
            fetchedOrder,
            returnToOrdersPage,
            setModal,
            history,
            order: { status },
        } = this.props;

        const form = this.orderFormRef.props.form;

        const orderData = form.getFieldsValue();

        const orderFormEntity = {
            selectedClient,
            ...orderData,
        };

        const orderEntity = convertFieldsValuesToDbEntity(
            orderFormEntity,
            allServices,
            allDetails,
            void 0,
            this.props.user,
        );
        const fetchedOrderEntity = {
            ...fetchedOrder.order,
            services: fetchedOrder.orderServices || [],
            details:  fetchedOrder.orderDetails || [],
            ..._.get(fetchedOrder, 'client.clientId')
                ? { clientId: _.get(fetchedOrder, 'client.clientId') }
                : {},
        };

        const compareFields = _(orderEntity)
            .omit([ 'services', 'details', 'status' ])
            .toPairs()
            .value();

        const areInputValuesEqual = (originValue, fieldValue) => {
            return !originValue && !fieldValue || originValue === fieldValue;
        };

        const identicalOrders = _.reduce(
            compareFields,
            (prev, [ field, value ]) =>
                prev && areInputValuesEqual(fetchedOrderEntity[ field ], value),
            true,
        );

        const { canEdit, hideEditButton } = this.getSecurityConfig();

        const ordersAreSame =
            identicalOrders &&
            !fields.services.length &&
            !fields.details.length;

        if (!canEdit || hideEditButton || ordersAreSame) {
            this._redirect();
        } else {
            setModal(MODALS.CONFIRM_EXIT);
        }
    };

    _redirect = () => {
        const {
            resetModal,
            returnToOrdersPage,
            history,
            order: { status },
        } = this.props;

        resetModal();
        _.get(history, 'location.state.fromDashboard')
            ? history.push(`${book.dashboard}`)
            : returnToOrdersPage(status);
    };

    _invite = () => {
        const {
            clientVehicleId,
            clientId,
            status,
            clientPhone,
        } = this.props.order;
        const { user, createInviteOrder } = this.props;

        if (
            (status === 'success' || status === 'cancel') &&
            clientVehicleId &&
            clientId &&
            clientPhone
        ) {
            createInviteOrder({
                status:    'invite',
                clientVehicleId,
                clientId,
                clientPhone,
                managerId: user.id,
            });
        }
    };

    getSecurityConfig() {
        const user = this.props.user;
        const status = this.props.order.status;

        const isClosedStatus = [ 'success', 'cancel', 'redundant' ].includes(
            status,
        );
        const canEditClosedStatus = !isForbidden(
            user,
            permissions.UPDATE_SUCCESS_ORDER,
        );
        const canEdit =
            !isForbidden(user, permissions.ACCESS_ORDER_BODY) ||
            !isForbidden(user, permissions.ACCESS_ORDER_DETAILS) ||
            !isForbidden(user, permissions.ACCESS_ORDER_SERVICES) ||
            !isForbidden(user, permissions.ACCESS_ORDER_COMMENTS);

        const hideEditButton = isClosedStatus && !canEditClosedStatus;
        const disabledEditButton = hideEditButton || !canEdit;

        const forbiddenUpdate = isForbidden(
            user,
            permissions.ACCESS_ORDER_STATUS,
        );

        return {
            isClosedStatus,
            canEditClosedStatus,
            canEdit,
            hideEditButton,
            disabledEditButton,
            forbiddenUpdate,
        };
    }
    /* eslint-disable complexity*/
    render() {
        const {
            fetchOrderForm,
            fetchOrderTask,
            setModal,
            resetModal,
            spinner,
            hasInviteStatus,
            isInviteVisible,
            isInviteEnabled,
            inviteOrderId,
            modal,
            isMobile,
            managers,
            stations,
            user,
        } = this.props;

        const { num, status, datetime } = this.props.order;
        const { id } = this.props.match.params;

        const {
            isClosedStatus,
            hideEditButton,
            disabledEditButton,
            forbiddenUpdate,
        } = this.getSecurityConfig();

        return spinner ? (
            <Spinner spin={ spinner } />
        ) : (
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
                        {hasInviteStatus &&
                            inviteOrderId && (
                            <Link
                                to={ `${book.order}/${inviteOrderId}` }
                                onClick={ () => {
                                    fetchOrderForm(inviteOrderId);
                                    fetchOrderTask(inviteOrderId);
                                } }
                            >
                                { inviteOrderId }
                            </Link>
                        )}
                        {isInviteVisible && !inviteOrderId ? (
                            <Button
                                disabled={
                                    !isInviteEnabled ||
                                    isForbidden(
                                        user,
                                        permissions.CREATE_ORDER,
                                    ) ||
                                    isForbidden(
                                        user,
                                        permissions.CREATE_INVITE_ORDER,
                                    )
                                }
                                onClick={ this._invite }
                            >
                                <FormattedMessage id='order-page.create_invite_order' />
                            </Button>
                        ) : null}
                        {!isMobile && (
                            <ChangeStatusDropdown
                                user={ user }
                                orderStatus={ status }
                                onStatusChange={ this._onStatusChange }
                                setModal={ setModal }
                                modals={ MODALS }
                                isMobile={ isMobile }
                            />
                        )}
                        <ReportsDropdown
                            user={ this.props.user }
                            orderId={ id }
                            orderStatus={ status }
                            download={ this.props.getReport }
                            isMobile={ isMobile }
                        />
                        {!hideEditButton && (
                            <Icon
                                type='save'
                                style={ {
                                    fontSize: isMobile ? 12 : 24,
                                    cursor:   'pointer',
                                    margin:   '0 10px',
                                    ...disabledEditButton
                                        ? { color: 'gray' }
                                        : {},
                                } }
                                onClick={ () =>
                                    !disabledEditButton &&
                                    this._onStatusChange(status)
                                }
                            />
                        )}
                        {!isClosedStatus &&
                            !forbiddenUpdate && (
                            <Icon
                                type='delete'
                                style={ {
                                    fontSize: isMobile ? 12 : 24,
                                    cursor:   'pointer',
                                    margin:   '0 10px',
                                } }
                                onClick={ () =>
                                    setModal(MODALS.CANCEL_REASON)
                                }
                            />
                        )}
                        <Icon
                            style={ {
                                fontSize: isMobile ? 12 : 24,
                                cursor:   'pointer',
                            } }
                            type='close'
                            onClick={ this._close }
                        />
                    </>
                }
            >
                <MobileView>
                    <MobileRecordForm
                        wrappedComponentRef={ this.saveOrderFormRef }
                        onStatusChange={ this._onStatusChange }
                    />
                </MobileView>
                <ResponsiveView
                    view={ { min: BREAKPOINTS.sm.max, max: BREAKPOINTS.xxl.max } }
                >
                    <OrderForm
                        orderId={ Number(this.props.match.params.id) }
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
                        changeModalStatus={ this.props.changeModalStatus }
                        location={ false }
                        fetchOrderForm={ fetchOrderForm }
                        fetchOrderTask={ fetchOrderTask }
                    />
                </ResponsiveView>
                <CancelReasonModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    handleCancelReasonModalSubmit={ this._onStatusChange }
                    orderComments={ this.props.orderComments }
                    resetModal={ () => resetModal() }
                />
                <ConfirmOrderExitModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    status={ status }
                    returnToOrdersPage={ () =>
                        this.props.returnToOrdersPage(status)
                    }
                    saveOrder={ () => {
                        if (_.get(history, 'location.state.fromDashboard')) {
                            return this._onStatusChange(status, 'dashboard');
                        }

                        return this._onStatusChange(status, status);
                    } }
                    resetModal={ () => resetModal() }
                    closeModal={ () => this._close() }
                    redirect={ () => this._redirect() }
                />
                <ToSuccessModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    handleToSuccessModalSubmit={ this._onStatusChange }
                    resetModal={ () => resetModal() }
                />
                <OrderTaskModal
                    wrappedComponentRef={ this.saveOrderTaskFormRef }
                    orderTaskEntity={ this.props.orderTaskEntity }
                    priorityOptions={ this.props.priorityOptions }
                    progressStatusOptions={ this.props.progressStatusOptions }
                    visible={ modal }
                    resetModal={ () => resetModal() }
                    num={ num }
                    orderTaskId={ this.props.orderTaskId }
                    orderId={ id }
                    resetOrderTasksForm={ this.props.resetOrderTasksForm }
                    stations={ stations }
                    managers={ managers }
                    saveNewOrderTask={ this._saveNewOrderTask }
                    orderTasks={ this.props.orderTasks }
                />
            </Layout>
        );
    }
}

export default OrderPage;
// moment(datetime).format('DD MMMM YYYY, HH:mm')
