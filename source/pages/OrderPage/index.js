// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Icon} from 'antd';
import moment from 'moment';
import _ from 'lodash';

// proj
import {
    fetchOrderForm,
    updateOrder,
    returnToOrdersPage,
    createInviteOrder,
    createOrderCopy,
    fetchOrderTask,
    selectInviteData,
} from 'core/forms/orderForm/duck';
import {
    convertFieldsValuesToDbEntity,
    requiredFieldsOnStatuses,
} from 'forms/OrderForm/extractOrderEntity';
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import {fetchAddClientForm} from 'core/forms/addClientForm/duck';
import {getReport, fetchReport} from 'core/order/duck';
import {setModal, resetModal, MODALS} from 'core/modals/duck';

import {Layout, Spinner, MobileView, ResponsiveView, StyledButton} from 'commons';
import {OrderForm, MobileRecordForm} from 'forms';
import {ReportsDropdown, ChangeStatusDropdown} from 'components';
import {
    CancelReasonModal,
    ToSuccessModal,
    ConfirmOrderExitModal,
    OrderTaskModal,
} from 'modals';
import {BREAKPOINTS, extractFieldsConfigs, permissions, isForbidden, withErrorMessage, roundCurrentTime} from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';


const compareOrderTasks = (initialOrderTask, orderTask) => {
    if (!initialOrderTask) {
        return true;
    }

    const initialOrderTaskEntity = {
        responsibleId: initialOrderTask.responsibleId,
        priority:      initialOrderTask.priority,
        status:        initialOrderTask.status,
        comment:       initialOrderTask.comment,
        time:          initialOrderTask.deadlineDate
            ? moment(initialOrderTask.deadlineDate).format('HH:mm')
            : void 0,
        date: initialOrderTask.deadlineDate
            ? moment(initialOrderTask.deadlineDate).format('YYYY-MM-DD')
            : void 0,
        stationNum: initialOrderTask.stationNum,
    };

    const orderTaskEntity = {
        responsibleId: orderTask.responsible,
        priority:      orderTask.priority,
        status:        orderTask.status,
        comment:       orderTask.comment,
        time:          orderTask.deadlineTime
            ? moment(orderTask.deadlineTime).format('HH:mm')
            : void 0,
        date: orderTask.deadlineDate
            ? moment(orderTask.deadlineDate).format('YYYY-MM-DD')
            : void 0,
        stationNum: orderTask.stationName,
    };

    return !_.isEqual(
        _.omitBy(orderTaskEntity, _.isNil),
        _.omitBy(initialOrderTaskEntity, _.isNil),
    );
};

const mapStateToProps = state => {
    return {
        // orderTaskEntity:       state.forms.orderTaskForm.fields,
        // addClientFormData:     state.forms.addClientForm.data,
        allDetails:            state.forms.orderForm.allDetails,
        allServices:           state.forms.orderForm.allServices,
        clients:               state.forms.orderForm.clients,
        employees:             state.forms.orderForm.employees,
        fetchedOrder:          state.forms.orderForm.fetchedOrder,
        fields:                state.forms.orderForm.fields,
        initialOrderTask:      state.forms.orderTaskForm.initialOrderTask,
        initOrderEntity:       state.forms.orderForm.initOrderEntity,
        invited:               state.forms.orderForm.invited,
        inviteOrderId:         state.forms.orderForm.inviteOrderId,
        isMobile:              state.ui.views.isMobile,
        managers:              state.forms.orderForm.managers,
        modal:                 state.modals.modal,
        order:                 state.forms.orderForm.order,
        orderCalls:            state.forms.orderForm.calls,
        orderComments:         state.forms.orderForm.orderComments,
        orderHistory:          state.forms.orderForm.history,
        orderTaskId:           state.forms.orderTaskForm.taskId,
        orderTasks:            state.forms.orderForm.orderTasks,
        priorityOptions:       state.forms.orderTaskForm.priorityOptions,
        progressStatusOptions: state.forms.orderTaskForm.progressStatusOptions,
        requisites:            state.forms.orderForm.requisites,
        selectedClient:        state.forms.orderForm.selectedClient,
        spinner:               state.ui.orderFetching,
        stations:              state.forms.orderForm.stations,
        user:                  state.auth,
        vehicles:              state.forms.orderForm.vehicles,
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
    createOrderCopy,
    fetchAddClientForm,
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
};

@withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@withErrorMessage()
class OrderPage extends Component {

    state = {
        errors: void 0,
    };
    

    componentDidMount() {
        const {fetchOrderForm, fetchOrderTask, match: {params: {id}}, user} = this.props;
        fetchOrderForm(id);

        const viewTasks = !isForbidden(user, permissions.GET_TASKS);
        if (viewTasks) {
            fetchOrderTask(id);
        }
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
        const {allServices, allDetails, selectedClient, history} = this.props;
        const form = this.orderFormRef.props.form;
        const orderFormValues = form.getFieldsValue();
        const requiredFields = requiredFieldsOnStatuses(orderFormValues)[
            status
        ];
        const commentsFields = [
            'comment',
            'businessComment',
            'vehicleCondition',
            'recommendation',
        ];

        const { id } = this.props.match.params;
        form.validateFieldsAndScroll([ ...requiredFields, ...commentsFields ], (errors) => {
      
            if (!errors) {
               
                const orderFormEntity = {...orderFormValues, selectedClient};
            
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
            } else {
                this.setState({errors});
            }
        });
    };

    _saveNewOrderTask = () => {
        const {
            saveOrderTask,
            resetModal,
            resetOrderTasksForm,
            // orderTaskEntity,
            orderTaskId,
            orderTasks,
            initialOrderTask,
            match: {params},
        } = this.props;

        const form = this.orderTaskFormRef.props.form;

        form.validateFields((errors, values) => {
            if (!errors) {
                if (orderTasks.orderTasks.length >= 1) {
                    if (compareOrderTasks(initialOrderTask, values)) {
                        saveOrderTask(values, params.id, orderTaskId);
                    }
                    resetModal();
                    resetOrderTasksForm();
                } else {
                    saveOrderTask(values, params.id, orderTaskId);
                    resetModal();
                    resetOrderTasksForm();
                }
            }
        });
    };
    /* eslint-disable complexity */
    _close = () => {
        const {setModal} = this.props;

        const fields = this.orderFormRef.props.fields;
        const configs = extractFieldsConfigs(fields);
        const ordersAreSame = !_.keys(configs).length;

        const {canEdit, hideEditButton} = this.getSecurityConfig();

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
            order: {status},
        } = this.props;

        resetModal();
        _.get(history, 'location.state.fromDashboard')
            ? history.push(`${book.dashboard}`)
            : returnToOrdersPage(status);
    };

    _createCopy = () => {
        const {allServices, allDetails, selectedClient} = this.props;
        const form = this.orderFormRef.props.form;
        const orderFormValues = form.getFieldsValue();
        const requiredFields = requiredFieldsOnStatuses(orderFormValues).success;
        const commentsFields = [
            'comment',
            'businessComment',
            'vehicleCondition',
            'recommendation',
        ];

        form.validateFieldsAndScroll([ ...requiredFields,  ...commentsFields ], errors => {
            if (!errors) {
        
                const entryStationLoad = _.get(orderFormValues, 'stationLoads[0]');
                const normalizedBeginDateTime = roundCurrentTime();
                entryStationLoad.beginDate = normalizedBeginDateTime;
                entryStationLoad.beginTime = normalizedBeginDateTime;
        
                const normalizedValues = _.set(orderFormValues, 'stationLoads', [ entryStationLoad ]);
                const orderFormEntity = {...normalizedValues, selectedClient};
                
                this.props.createOrderCopy(
                    {...convertFieldsValuesToDbEntity(
                        orderFormEntity,
                        allServices,
                        allDetails,
                        'not_complete',
                        this.props.user,
                    )},
                );
            } else {
                this.setState({errors});
            }
        });
    }

    _invite = () => {
        const {
            clientVehicleId,
            clientId,
            status,
            clientPhone,
        } = this.props.order;
        const {user, createInviteOrder} = this.props;

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
            initialOrderTask,
        } = this.props;

        const {num, status, datetime} = this.props.order;
        const {id} = this.props.match.params;

        const {
            isClosedStatus,
            hideEditButton,
            disabledEditButton,
            forbiddenUpdate,
        } = this.getSecurityConfig();
        const viewTasks = !isForbidden(user, permissions.GET_TASKS);

        return spinner ? (
            <Spinner spin={ spinner }/>
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
                            { ` ${num}` }
                        </>

                }
                description={
                    <>
                        <FormattedMessage id='order-page.creation_date'/>
                        { `: ${moment(datetime).format('DD MMMM YYYY, HH:mm')}` }
                    </>
                }
                controls={
                    <>
                        { hasInviteStatus &&
                        inviteOrderId && (
                            <Link
                                to={ `${book.order}/${inviteOrderId}` }
                                onClick={ () => {
                                    fetchOrderForm(inviteOrderId);
                                    if (viewTasks) {
                                        fetchOrderTask(inviteOrderId);
                                    }
                                } }
                                className={ Styles.inviteButton }
                            >
                                { inviteOrderId }
                            </Link>
                        ) }
                        { isInviteVisible && !inviteOrderId ? (
                            <StyledButton
                                type='secondary'
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
                                className={ Styles.inviteButton }
                            >
                                <FormattedMessage id='order-page.create_invite_order'/>
                            </StyledButton>
                        ) : null }
                        { status === 'success' ? (
                            <Button
                                icon='copy'
                                type='primary'
                                disabled={
                                    !isInviteEnabled ||
                                    isForbidden(
                                        user,
                                        permissions.CREATE_ORDER,
                                    )
                                }
                                onClick={ this._createCopy }
                                className={ Styles.inviteButton }
                            >
                                <FormattedMessage id='order-page.create_copy'/>
                            </Button>
                        ) : null }
                        { !isMobile && (
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
                        { !hideEditButton && (
                            <Icon
                                type='save'
                                style={ {
                                    fontSize: isMobile ? 12 : 24,
                                    cursor:   'pointer',
                                    margin:   '0 10px',
                                    ...disabledEditButton
                                        ? {color: 'gray'}
                                        : {},
                                } }
                                onClick={ () =>
                                    !disabledEditButton &&
                                    this._onStatusChange(status)
                                }
                            />
                        ) }
                        { !isClosedStatus &&
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
                        ) }
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
                    view={ {min: BREAKPOINTS.sm.max, max: BREAKPOINTS.xxl.max} }
                >
                    <OrderForm
                        errors={ this.state.errors }
                        user={ this.props.user }
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
                        // location={ this.props.history.location }
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
                    initialOrderTask={ initialOrderTask }
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
