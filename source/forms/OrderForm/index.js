// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

//proj
import {
    onChangeOrderForm,
    setClientSelection,
    fetchAvailableHours,
    fetchTecdocSuggestions,
    fetchTecdocDetailsSuggestions,
    clearTecdocSuggestions,
    clearTecdocDetailsSuggestions,
} from 'core/forms/orderForm/duck';
import { resetModal } from 'core/modals/duck';
import { initOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import { AddClientModal } from 'modals';

import { withReduxForm2, isForbidden, permissions } from 'utils';

// own
import OrderFormHeader from './OrderFormHeader';
import OrderFormBody from './OrderFormBody';
import OrderFormTabs from './OrderFormTabs';
import { servicesStats, detailsStats } from './stats';
import Styles from './styles.m.css';

@injectIntl
@withReduxForm2({
    name:    'orderForm',
    // debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
    actions: {
        change: onChangeOrderForm,
        setClientSelection,
        initOrderTasksForm,
        resetModal,
        fetchAvailableHours,
        fetchTecdocSuggestions,
        clearTecdocSuggestions,
        fetchTecdocDetailsSuggestions,
        clearTecdocDetailsSuggestions,
    },
    mapStateToProps: state => ({
        modal:                      state.modals.modal,
        addClientFormData:          state.forms.addClientForm.data,
        authentificatedManager:     state.auth.id,
        user:                       state.auth,
        suggestionsFetching:        state.ui.suggestionsFetching,
        detailsSuggestionsFetching: state.ui.detailsSuggestionsFetching,
        stationLoads:               state.forms.orderForm.stationLoads,
        schedule:                   state.forms.orderForm.schedule,
    }),
})
export class OrderForm extends Component {
    state = {
        formValues: {},
    };

    componentDidMount() {
        // TODO in order to fix late getFieldDecorator invoke for services
        this.setState({ initialized: true });
    }

    componentDidUpdate() {
        const { orderId } = this.props;
        // You must set to local state formValues for correct initialValues work
        // It's providing actual form data for all cases
        const { formValues: prevFormValues } = this.state;
        const formValues = this.props.form.getFieldsValue();

        if (!_.isEqual(formValues, prevFormValues)) {
            this.setState({ formValues });
        }
        //
        // for each stationLoad row in stationLoads tab we have to provide extra check
        // if values is not equal we will fetch available hours for each row
        _.each(formValues.stationLoads, (stationLoad, index) => {
            const prevStationLoad = _.get(prevFormValues.stationLoads, index);
            const prevStationHoursFields = _.pick(prevStationLoad, [ 'beginDate', 'station' ]);
            const stationHoursFields = _.pick(stationLoad, [ 'beginDate', 'station' ]);

            if (
                stationHoursFields &&
                !_.isEqual(prevStationHoursFields, stationHoursFields)
            ) {
                const { station, beginDate } = stationHoursFields;
                const {
                    station: prevStation,
                    beginDate: prevBeginDate,
                } = prevStationHoursFields;
                // fetching new availableHours
                if (![ station, beginDate ].some(_.isNil)) {
                    this.props.fetchAvailableHours(
                        station,
                        beginDate,
                        orderId,
                        index,
                    );
                    // clearing previous form fields values
                    if (![ prevStation, prevBeginDate ].some(_.isNil)) {
                        this.props.form.setFieldsValue({
                            [ `stationLoads[${index}].beginTime` ]: void 0,
                        });
                    }
                }
            }
        });
    }

    _saveFormRef = formRef => {
        this.formRef = formRef;
    };

    _bodyUpdateIsForbidden = () =>
        isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);

    _getTecdocId = () => {
        const { form } = this.props;

        const clientVehicleId = form.getFieldValue('clientVehicle');
        const vehicles = _.get(this.props, 'selectedClient.vehicles');

        return clientVehicleId && _.isArray(vehicles)
            ? _.chain(vehicles)
                .find({ id: clientVehicleId })
                .get('tecdocId', null)
                .value()
            : null;
    };

    render() {
        const {
            authentificatedManager,
            form,
            allServices,
            orderHistory,
            orderId,
            searchClientsResult,
            setClientSelection,
            selectedClient,
            order,
            setAddClientModal,
            schedule,
            stations,
            fetchedOrder,
            availableHours,
            managers,
            employees,
            requisites,
            user,
            location,
            errors,
        } = this.props;

        const formFieldsValues = form.getFieldsValue();

        const { totalHours } = servicesStats(
            _.get(formFieldsValues, 'services', []),
            allServices,
        );
        const clientVehicle = _.get(formFieldsValues, 'clientVehicle');
        const clientPhone = _.get(formFieldsValues, 'clientPhone');
        const clientEmail = _.get(formFieldsValues, 'clientEmail');
        const searchClientQuery = _.get(formFieldsValues, 'searchClientQuery');

        const zeroStationLoadBeginDate = _.get(
            formFieldsValues,
            'stationLoads[0].beginDate',
        );
        const zeroStationLoadBeginTime = _.get(
            formFieldsValues,
            'stationLoads[0].beginTime',
        );
        const zeroStationLoadStation = _.get(
            formFieldsValues,
            'stationLoads[0].station',
        );
        const zeroStationLoadDuration = _.get(
            formFieldsValues,
            'stationLoads[0].duration',
        );
        const deliveryDate = _.get(formFieldsValues, 'deliveryDate');

        const orderFormBodyFields = _.pick(formFieldsValues, [
            'comment',
            'odometerValue',
            'clientVehicle',
            'clientRequisite',
            'clientEmail',
            'clientPhone',
            'searchClientQuery',
        ]);
        const orderFormHeaderFields = _.pick(formFieldsValues, [
            'stationLoads[0].beginTime',
            'stationLoads[0].station',
            'stationLoads[0].beginDate',
            'stationLoads[0].duration',
            'deliveryDate',
            'deliveryTime',
            'manager',
            'employee',
            'appurtenanciesResponsible',
            'paymentMethod',
            'requisite',
        ]);

        const { price: priceDetails } = detailsStats(
            _.get(formFieldsValues, 'details', []),
        );
        const { price: priceServices } = servicesStats(
            _.get(formFieldsValues, 'services', []),
            allServices,
        );

        const servicesDiscount = _.get(formFieldsValues, 'servicesDiscount', 0);
        const detailsDiscount = _.get(formFieldsValues, 'detailsDiscount', 0);

        const tabs = this._renderTabs(formFieldsValues);

        return (
            <Form className={ Styles.form } layout='horizontal'>
                <OrderFormHeader
                    errors={ errors }
                    priceServices={ priceServices }
                    priceDetails={ priceDetails }
                    detailsDiscount={ detailsDiscount }
                    servicesDiscount={ servicesDiscount }
                    location={ location }
                    authentificatedManager={ authentificatedManager }
                    fields={ orderFormHeaderFields }
                    deliveryDate={ deliveryDate }
                    zeroStationLoadBeginDate={ zeroStationLoadBeginDate }
                    zeroStationLoadBeginTime={ zeroStationLoadBeginTime }
                    zeroStationLoadDuration={ zeroStationLoadDuration }
                    zeroStationLoadStation={ zeroStationLoadStation }
                    fetchedOrder={ fetchedOrder }
                    schedule={ schedule }
                    form={ form }
                    stations={ stations }
                    availableHours={ availableHours }
                    managers={ managers }
                    employees={ employees }
                    allServices={ allServices }
                    requisites={ requisites }
                    user={ user }
                    totalHours={ totalHours }
                />
                <OrderFormBody
                    errors={ errors }
                    location={ location }
                    fields={ orderFormBodyFields }
                    searchClientQuery={ searchClientQuery }
                    clientVehicle={ clientVehicle }
                    clientPhone={ clientPhone }
                    clientEmail={ clientEmail }
                    orderHistory={ orderHistory }
                    orderId={ orderId }
                    searchClientsResult={ searchClientsResult }
                    setClientSelection={ setClientSelection }
                    fetchedOrder={ fetchedOrder }
                    selectedClient={ selectedClient }
                    form={ form }
                    user={ user }
                    order={ order }
                    setAddClientModal={ setAddClientModal }
                />
                { tabs }
                <AddClientModal
                    searchQuery={ searchClientQuery }
                    wrappedComponentRef={ this._saveFormRef }
                    visible={ this.props.modal }
                    resetModal={ this.props.resetModal }
                    addClientFormData={ this.props.addClientFormData }
                />
            </Form>
        );
    }

    _renderTabs = formFieldsValues => {
        const {
            form,
            orderTasks,
            allServices,
            schedule,
            stationLoads,
        } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        const tecdocId = this._getTecdocId();

        const { count: countDetails, price: priceDetails } = detailsStats(
            _.get(formFieldsValues, 'details', []),
        );

        const {
            count: countServices,
            price: priceServices,
            // totalHours,
        } = servicesStats(_.get(formFieldsValues, 'services', []), allServices);

        // _.values(value).some(_.isNil) gets only filled rows
        const stationsCount = _.get(formFieldsValues, 'stationLoads', [])
            .filter(Boolean)
            .filter(value => !_.values(value).some(_.isNil));

        const comments = _.pick(formFieldsValues, [
            'comment',
            'businessComment',
            'vehicleCondition',
            'recommendation',
        ]);

        const commentsCollection = _.values(comments);
        const commentsCount = commentsCollection.filter(Boolean).length;

        const clientVehicleId = _.get(formFieldsValues, 'clientVehicle');

        const {
            setModal,
            fetchOrderForm,
            fetchOrderTask,
            fetchTecdocSuggestions,
            fetchTecdocDetailsSuggestions,
            clearTecdocSuggestions,

            addOrderForm,
            detailsSuggestionsFetching,
            suggestionsFetching,

            orderCalls,
            orderHistory,
            orderServices,
            orderDetails,
            // allServices,
            allDetails,
            employees,
            selectedClient,
            detailsSuggestions,
            suggestions,
            fetchedOrder,
            user,
            stations,
            availableHours,

            changeModalStatus,
            errors,
            location,
        } = this.props;

        const orderFormTabsFields = _.pick(formFieldsValues, [
            'comment',
            'vehicleCondition',
            'businessComment',
            'recommendation',
            'stationLoads',
            'services',
            'clientVehicle',
            'employee',
            'details',
            'servicesDiscount',
            'detailsDiscount',
        ]);

        const beginDatetime =
            _.get(fetchedOrder, 'order.beginDatetime') ||
            (this._bodyUpdateIsForbidden()
                ? void 0
                : _.get(location, 'state.beginDatetime'));

        const initialBeginDatetime = beginDatetime
            ? moment(beginDatetime).toISOString()
            : void 0;

        const initialStation =
            _.get(fetchedOrder, 'order.stationNum') ||
            (this._bodyUpdateIsForbidden()
                ? void 0
                : _.get(location, 'state.stationNum'));

        return (
            <OrderFormTabs
                errors={ errors }
                initialBeginDatetime={ initialBeginDatetime }
                initialStation={ initialStation }
                fields={ orderFormTabsFields }
                details={ orderFormTabsFields.details || [] }
                services={ orderFormTabsFields.services || [] }
                fetchOrderForm={ fetchOrderForm }
                fetchOrderTask={ fetchOrderTask }
                fetchTecdocSuggestions={ fetchTecdocSuggestions }
                fetchTecdocDetailsSuggestions={ fetchTecdocDetailsSuggestions }
                clearTecdocDetailsSuggestions={ clearTecdocDetailsSuggestions }
                clearTecdocSuggestions={ clearTecdocSuggestions }
                addOrderForm={ addOrderForm }
                detailsSuggestionsFetching={ detailsSuggestionsFetching }
                suggestionsFetching={ suggestionsFetching }
                orderCalls={ orderCalls }
                orderHistory={ orderHistory }
                orderServices={ orderServices }
                orderDetails={ orderDetails }
                allServices={ allServices }
                allDetails={ allDetails }
                employees={ employees }
                selectedClient={ selectedClient }
                detailsSuggestions={ detailsSuggestions }
                suggestions={ suggestions }
                fetchedOrder={ fetchedOrder }
                user={ user }
                stations={ stations }
                availableHours={ availableHours }
                changeModalStatus={ changeModalStatus }
                tecdocId={ tecdocId }
                clientVehicleId={ clientVehicleId }
                initOrderTasksForm={ this.props.initOrderTasksForm }
                formatMessage={ formatMessage }
                getFieldDecorator={ getFieldDecorator }
                form={ form }
                setModal={ setModal }
                orderTasks={ orderTasks }
                stationLoads={ stationLoads }
                schedule={ schedule }
                priceServices={ priceServices }
                priceDetails={ priceDetails }
                countServices={ countServices }
                countDetails={ countDetails }
                commentsCount={ commentsCount }
                stationsCount={ stationsCount }
            />
        );
    };
}
