// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Icon, notification, Popconfirm, Modal} from 'antd';
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

import { Layout } from 'tireFitting';
import { Spinner, MobileView, ResponsiveView, StyledButton} from 'commons';
import { OrderForm, MobileRecordForm } from 'tireFitting';
import {ReportsDropdown, ChangeStatusDropdown} from 'components';
import {
    CancelReasonModal,
    ConfirmOrderExitModal,
    OrderTaskModal,
    StoreProductModal,
    TecDocInfoModal,
    CashOrderModal,
} from 'modals';
import {BREAKPOINTS, extractFieldsConfigs, permissions, isForbidden, withErrorMessage, roundCurrentTime} from 'utils';
import book from 'routes/book';
import { fetchVehicleTypes } from 'core/vehicleTypes/duck';

// own
import Styles from './styles.m.css';
const { confirm } = Modal;

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
        modalProps:            state.modals.modalProps,
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
        orderFetching:         state.ui.orderFetching,
        stations:              state.forms.orderForm.stations,
        businessLocations:     state.forms.orderForm.businessLocations,
        user:                  state.auth,
        vehicles:              state.forms.orderForm.vehicles,
        vehicleTypes:          state.vehicleTypes.vehicleTypes,
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
    fetchVehicleTypes,
};

@withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@withErrorMessage()
@injectIntl
class OrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: void 0,
            showOilModal: false,
            scrollToMapId: undefined,
            repairMapData: [],
            focusedRef: undefined,
        };

        this._isMounted = false;
    }

    componentDidMount() {
        const {fetchOrderForm, fetchOrderTask, match: {params: {id}}, user, fetchVehicleTypes} = this.props;
        fetchOrderForm(id);
        fetchVehicleTypes();

        const viewTasks = !isForbidden(user, permissions.GET_TASKS);
        if (viewTasks) {
            fetchOrderTask(id);
        }

        this._isMounted = true;
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

    _focusOnRef = (focusedRef) => {
        this.setState({focusedRef});
    }

    _scrollToMap = (id) => {
        this.setState({
            scrollToMapId: id,
        })
    }

    _showOilModal = (oem, oeCode, acea, api, sae) => {
        this.setState({
            showOilModal: true,
            oilModalData: {
                oem: oem,
                oeCode: oeCode,
                acea: acea,
                api: api,
                sae: sae,
            }
        })
    }

    _clearOilData = () => {
        this.setState({
            showOilModal: false,
        })
    }

    _onStatusChange = (status, redirectStatus, options, redirectTo) => {
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
                    redirectTo,
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

    _getOrderRemainSum = (callback) => {
        const { fetchedOrder } = this.props;
        let token = localStorage.getItem("_my.carbook.pro_token");
        let url = __API_URL__;
        let params = `/orders/${this.props.order.id}?onlyLabors=${false}&onlyDetails=${false}`;
        url += params;
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }
                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                let remainSum = data.order.totalSumWithTax;;

                if(fetchedOrder) {
                    fetchedOrder.cashOrders.map((elem)=>{
                        remainSum += elem.decrease || 0;
                        remainSum -= elem.increase || 0;
                    })
                }
                if(callback) callback(remainSum);
            })
            .catch(function(error) {
                console.log("error", error);
            });
    }

    _checkIsAllReserved = (callback) => {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/orders/${this.props.match.params.id}`;
        url += params;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var reserveError = false;
            data.orderDetails.map((elem)=>{
                if(elem.productId && elem.reservedCount != elem.count) {
                    reserveError = true;
                    return;
                }
            });
            if(reserveError) {
                confirm({
                    title: that.props.intl.formatMessage({id: 'order-page.status_confirmed_reserve_error'}),
                    onOk() {
                        callback();
                    },
                });
            } else {
                callback();
            }
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    _getCurrentOrder = (isReservedCheck=false, callback) => {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/orders/${this.props.match.params.id}`;
        url += params;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if(!isReservedCheck) {
                that._createCopy(data.orderServices, data.orderDetails);
            } else {
                var isReserved = false;
                data.orderDetails.map((elem)=>{
                    if(elem.reservedCount) {
                        isReserved = true;
                        return;
                    }
                });
                if(isReserved) {
                    notification.error({
                        message: that.props.intl.formatMessage({
                            id: `order-page.reserved_error`,
                        }),
                    });
                } else {
                    callback();
                }
            }
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    _createCopy = (services, details) => {
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
                var copyData = {...convertFieldsValuesToDbEntity(
                    orderFormEntity,
                    allServices,
                    allDetails,
                    'not_complete',
                    this.props.user,
                )};

                copyData.details = details.map((detail)=>{
                    return  detail.productId ? 
                    {
                        id: detail.id,
                        storeGroupId: detail.storeGroupId,
                        name: detail.detailName,
                        productId: detail.storeId || detail.productId,
                        productCode: detail.detailCode,
                        purchasePrice: Math.round(detail.purchasePrice*10)/10 || 0,
                        count: detail.count ? detail.count : 1,
                        price: detail.price ? Math.round(detail.price*10)/10  : 1,
                        reservedFromWarehouseId: detail.reservedFromWarehouseId,
                        supplierBrandId: detail.supplierBrandId || detail.brandId,
                        supplierId: detail.supplierId,
                        supplierOriginalCode: detail.supplierOriginalCode,
                        supplierProductNumber: detail.supplierProductNumber,
                        supplierPartNumber: detail.supplierPartNumber,
                        comment: detail.comment || {
                            comment: undefined,
                            positions: [],
                        },
                    } : 
                    {
                        id:              detail.id,
                        storeGroupId:    detail.storeGroupId,
                        name:            detail.detailName,
                        productCode:     detail.detailCode ? detail.detailCode : null,
                        supplierId:      detail.supplierId,
                        supplierBrandId: detail.supplierBrandId || detail.brandId,
                        supplierOriginalCode: detail.supplierOriginalCode,
                        supplierProductNumber: detail.supplierProductNumber,
                        supplierPartNumber: detail.supplierPartNumber,
                        purchasePrice:
                            Math.round(detail.purchasePrice * 10) / 10 || 0,
                        count:   detail.count,
                        price:   detail.price ? Math.round(detail.price * 10) / 10 : 1,
                        comment: detail.comment || {
                            comment:   undefined,
                            positions: [],
                        },
                    }
                });
                copyData.services = services.map((labor)=>(
                    {
                        serviceId: labor.laborId,
                        serviceName: labor.serviceName,
                        employeeId: labor.employeeId,
                        serviceHours: labor.hours ? labor.hours : 0,
                        purchasePrice: labor.purchasePrice ? Math.round(labor.purchasePrice*10)/10 : 0,
                        count: labor.count ? labor.count : 1,
                        servicePrice: Math.round(labor.price*10)/10,
                        comment: labor.comment || {
                            comment: undefined,
                            positions: [],
                            problems: [],
                        },
                    }
                ));
                this.props.createOrderCopy(copyData);
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

    reloadOrderPageComponents = () => {
        this.componentDidMount();
    }

    /* eslint-disable complexity*/
    render() {
        const {showOilModal, oilModalData, repairMapData, focusedRef } = this.state;
        const {
            fetchOrderForm,
            fetchOrderTask,
            setModal,
            resetModal,
            orderFetching,
            hasInviteStatus,
            isInviteVisible,
            isInviteEnabled,
            inviteOrderId,
            modal,
            modalProps,
            isMobile,
            managers,
            stations,
            businessLocations,
            user,
            initialOrderTask,
            fetchedOrder,
            order,
            vehicleTypes,
        } = this.props;
        const {num, status, datetime, diagnosis, totalSumWithTax} = this.props.order;
        const { clientId, name, surname } = this.props.selectedClient;
        const {id} = this.props.match.params;

        const {
            isClosedStatus,
            hideEditButton,
            disabledEditButton,
            forbiddenUpdate,
        } = this.getSecurityConfig();
        const viewTasks = !isForbidden(user, permissions.GET_TASKS);
        const copyDisabled = isForbidden(user, permissions.ACCESS_ORDER_COPY);

        let remainSum = totalSumWithTax;

        if(fetchedOrder) {
            fetchedOrder.cashOrders.map((elem)=>{
                remainSum += elem.decrease || 0;
                remainSum -= elem.increase || 0;
            })
        }

        const showCahOrderModal = () => {
            this._getOrderRemainSum((remainSum)=>{
                setModal(MODALS.CASH_ORDER, {
                    fromOrder: true,
                    cashOrderEntity: {
                        orderId: id,
                        clientId: clientId,
                        orderNum: num,
                        clientName: name,
                        clientSurname: surname,
                        increase: Math.round(remainSum*100)/100,
                        type: "INCOME",
                    },
                })
            });
        }

        return  orderFetching ? (
            <Spinner spin={ orderFetching }/>
        ) : (
            <Layout
                className={`orderPageLayout hideHeaderControls`}
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
                        { !isMobile && isInviteVisible && !inviteOrderId ? (
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
                        <ChangeStatusDropdown
                            user={ user }
                            orderStatus={ status }
                            onStatusChange={ this._onStatusChange }
                            checkReserved={ this._checkIsAllReserved }
                            setModal={ setModal }
                            modals={ MODALS }
                            isMobile={ isMobile }
                        />
                        {!isForbidden(user, permissions.ACCESS_ORDER_PAY) &&
                            <Icon
                                type='dollar'
                                onClick={showCahOrderModal}
                                style={ {
                                    fontSize: isMobile ? 14 : 24,
                                    cursor:   'pointer',
                                    margin:   '0 10px',
                                } }
                            />
                        }
                        { !isMobile && (
                            <ReportsDropdown
                                user={ this.props.user }
                                orderId={ id }
                                orderStatus={ status }
                                download={ this.props.getReport }
                                isMobile={ isMobile }
                            />
                        ) }
                        { !copyDisabled &&
                            <Icon
                                title={this.props.intl.formatMessage({ id: `order-page.create_copy`})}
                                type='copy'
                                onClick={ () => {
                                    this._getCurrentOrder();
                                } }
                                style={ {
                                    fontSize: isMobile ? 14 : 24,
                                    cursor:   'pointer',
                                    margin:   '0 10px',
                                } }
                            /> 
                        }
                        { !hideEditButton && (
                            <Icon
                                type='save'
                                style={ {
                                    fontSize: isMobile ? 14 : 24,
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
                        !forbiddenUpdate &&
                        !isForbidden(user, permissions.ACCESS_ORDER_DELETE) && (
                            <Icon
                                type='delete'
                                style={ {
                                    fontSize: isMobile ? 14 : 24,
                                    cursor:   'pointer',
                                    margin:   '0 10px',
                                } }
                                onClick={ () =>{
                                    this._getCurrentOrder(true, ()=>{setModal(MODALS.CANCEL_REASON)});
                                }}
                            />
                        ) }
                        <Icon
                            style={ {
                                fontSize: isMobile ? 14 : 24,
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
                        orderFetching={orderFetching}
                        isMobile={isMobile}
                        order={ order }
                        fetchedOrder={ fetchedOrder }
                        errors={ this.state.errors }
                        user={ this.props.user }
                        orderId={ id }
                        wrappedComponentRef={ this.saveOrderFormRef }
                        orderHistory={ this.props.orderHistory }
                        allDetails={ this.props.allDetails }
                        allServices={ this.props.allServices }
                        employees={ this.props.employees }
                        setModal={ setModal }
                        changeModalStatus={ this.props.changeModalStatus }
                        location={ false }
                        fetchOrderForm={ fetchOrderForm }
                        onStatusChange={ this._onStatusChange }
                        reloadOrderPageComponents = { this.reloadOrderPageComponents }
                        orderStatus={ status }
                        setAddClientModal={ this.setAddClientModal }
                        vehicleTypes={ vehicleTypes }
                        modal={ modal }
                    />
                </MobileView>
                <ResponsiveView
                    view={ {min: BREAKPOINTS.sm.max, max: BREAKPOINTS.xxl.max} }
                >
                    <OrderForm
                        errors={ this.state.errors }
                        user={ this.props.user }
                        orderId={ id }
                        wrappedComponentRef={ this.saveOrderFormRef }
                        orderTasks={ this.props.orderTasks }
                        orderHistory={ this.props.orderHistory }
                        setAddClientModal={ this.setAddClientModal }
                        modal={ modal }
                        orderCalls={ this.props.orderCalls }
                        orderDiagnostic = { diagnosis }
                        allDetails={ this.props.allDetails }
                        employees={ this.props.employees }
                        filteredDetails={ this.props.filteredDetails }
                        setModal={ setModal }
                        changeModalStatus={ this.props.changeModalStatus }
                        location={ false }
                        fetchOrderForm={ fetchOrderForm }
                        fetchOrderTask={ fetchOrderTask }
                        onStatusChange={ this._onStatusChange }
                        reloadOrderPageComponents = { this.reloadOrderPageComponents }
                        showOilModal= { showOilModal }
                        oilModalData = { oilModalData }
                        clearOilData = { this._clearOilData }
                        modals={ MODALS }
                        download={ this.props.getReport }
                        scrollToMapId={ this.state.scrollToMapId }
                        scrollToMap={ this._scrollToMap }
                        repairMapData={ repairMapData }
                        businessLocations={ businessLocations }
                        focusOnRef={this._focusOnRef}
                        focusedRef={focusedRef}
                        showCahOrderModal={showCahOrderModal}
                        orderStatus={ status }
                        orderFetching={ orderFetching }
                        vehicleTypes={ vehicleTypes }
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
                <StoreProductModal />
                <CashOrderModal
                    visible={modal}
                    modalProps={modalProps}
                    fetchOrder={()=>{
                        fetchOrderForm(id);
                    }}
                />
            </Layout>
        );
    }
}

export default OrderPage;