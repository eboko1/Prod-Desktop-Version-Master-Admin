// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

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

import { withReduxForm2 } from 'utils';

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
        const { formValues: prevFormValues } = this.state;
        const formValues = this.props.form.getFieldsValue();

        if (!_.isEqual(formValues, prevFormValues)) {
            this.setState({ formValues });
        }

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
                if (![ station, beginDate ].some(_.isNil)) {
                    this.props.fetchAvailableHours(
                        station,
                        beginDate,
                        orderId,
                        index,
                    );

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
        } = this.props;
        this.formFieldsValues = _.cloneDeep(form.getFieldsValue());
        const formFieldsValues = this.formFieldsValues;

        const tabs = this._renderTabs();

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

        const orderFormBodyFields = _.pick(formFieldsValues, [ 'comment', 'odometerValue', 'clientVehicle', 'clientRequisite', 'clientEmail', 'clientPhone', 'searchClientQuery' ]);
        const orderFormHeaderFields = _.pick(formFieldsValues, [ 'stationLoads[0].beginTime', 'stationLoads[0].station', 'stationLoads[0].beginDate', 'stationLoads[0].duration', 'deliveryDate', 'deliveryTime', 'manager', 'employee', 'appurtenanciesResponsible', 'paymentMethod', 'requisite' ]);

        const formFieldsValue = this.formFieldsValues;

        const { price: priceDetails } = detailsStats(_.get(formFieldsValue, 'details', []));
        const { price: priceServices } = servicesStats(_.get(formFieldsValue, 'services', []), allServices);
        const servicesDiscount = _.get(formFieldsValue, 'servicesDiscount', 0);
        const detailsDiscount = _.get(formFieldsValue, 'detailsDiscount', 0);

        return (
            <Form className={ Styles.form } layout='horizontal'>
                <OrderFormHeader
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

    _renderTabs = () => {
        const {
            form,
            orderTasks,
            allServices,
            schedule,
            stationLoads,
        } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;
        const formFieldsValue = this.formFieldsValues;

        const { count: countDetails, price: priceDetails } = detailsStats(
            _.get(formFieldsValue, 'details', []),
        );

        const {
            count: countServices,
            price: priceServices,
            // totalHours,
        } = servicesStats(_.get(formFieldsValue, 'services', []), allServices);

        const stationsCount = _.get(formFieldsValue, 'stationLoads', [])
            .filter(Boolean)
            .filter(value => !_.values(value).some(_.isNil));

        const comments = _.pick(formFieldsValue, [ 'comment', 'businessComment', 'vehicleCondition', 'recommendation' ]);

        const commentsCollection = _.values(comments);
        const commentsCount = commentsCollection.filter(Boolean).length;

        const tecdocId = this._getTecdocId();
        const clientVehicleId = _.get(formFieldsValue, 'clientVehicle');

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
        } = this.props;

        const formFieldsValues = this.formFieldsValues;
        const orderFormTabsFields = _.pick(formFieldsValues, [ 'comment', 'vehicleCondition', 'businessComment', 'recommendation', 'stationLoads', 'services', 'clientVehicle', 'employee', 'details', 'servicesDiscount', 'detailsDiscount' ]);

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

        return (
            <OrderFormTabs
                zeroStationLoadBeginDate={ zeroStationLoadBeginDate }
                zeroStationLoadBeginTime={ zeroStationLoadBeginTime }
                zeroStationLoadDuration={ zeroStationLoadDuration }
                zeroStationLoadStation={ zeroStationLoadStation }
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
