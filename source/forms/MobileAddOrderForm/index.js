// vendor
import React, { Component } from "react";
import { Form, notification } from "antd";
import { injectIntl } from "react-intl";
import _ from "lodash";
import moment from "moment";

//proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import {
    onChangeOrderForm,
    setClientSelection,
    fetchAvailableHours,
    fetchTecdocSuggestions,
    fetchTecdocDetailsSuggestions,
    clearTecdocSuggestions,
    clearTecdocDetailsSuggestions,
    selectCashSum,
    selectCashFlowFilters,
} from "core/forms/orderForm/duck";
import {
    setStoreProductsSearchQuery,
    selectStoreProductsByQuery,
} from "core/search/duck";
import {
    fetchRecommendedPrice,
    selectRecommendedPrice,
    selectRecommendedPriceLoading,
} from "core/storage/products";
import { resetModal } from "core/modals/duck";
import { initOrderTasksForm } from "core/forms/orderTaskForm/duck";

import { AddClientModal, ToSuccessModal } from "modals";

import { withReduxForm2, isForbidden, permissions } from "utils";

// own
import OrderFormHeader from "./OrderFormHeader";
import OrderFormBody from "./OrderFormBody";
import { servicesStats, detailsStats } from "./stats";
import Styles from "./styles.m.css";

@injectIntl
@withReduxForm2({
    name: "orderForm",
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
        setStoreProductsSearchQuery,
        fetchRecommendedPrice,
    },

    mapStateToProps: state => ({
        // modal: state.modals.modal,
        // user: state.auth,
        addClientFormData: state.forms.addClientForm.data,
        authentificatedManager: state.auth.id,
        cashFlowFilters: selectCashFlowFilters(state),
        cashSum: selectCashSum(state),
        detailsSuggestionsFetching: state.ui.detailsSuggestionsFetching,
        schedule: state.forms.orderForm.schedule,
        stationLoads: state.forms.orderForm.stationLoads,
        suggestionsFetching: state.ui.suggestionsFetching,
        storeProducts: selectStoreProductsByQuery(state),
        recommendedPrice: selectRecommendedPrice(state),
        recommendedPriceLoading: selectRecommendedPriceLoading(state),
    }),
})
export class MobileAddOrderForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
        };
        this.orderDetails = [...this.props.orderDetails];
        this.orderServices = [...this.props.orderServices];
        this.reloadOrderForm = this.reloadOrderForm.bind(this);
    }

    async reloadOrderForm() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}/labors`;
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
            that.orderServices = data.labors,
            that.setState({
                update: true,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/orders/${this.props.orderId}/details`;
        url = API_URL + params;
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
            that.orderDetails = data.details,
            that.setState({
                orderDetails: data.details,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    _openNotification = ({ make, model }) => {
        const params = {
            message: this.props.intl.formatMessage({
                id: "order-form.warning",
            }),
            description: (
                <div>
                    <div>
                        {this.props.intl.formatMessage({
                            id: "order-form.update_modification_info",
                        })}
                    </div>
                    <div>
                        {make} {model}
                    </div>
                </div>
            ),
            placement: "topLeft",
            duration: 7,
        };
        notification.open(params);
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
        const newClientVehicleId = formValues.clientVehicle;
        const oldClientVehicleId = prevFormValues.clientVehicle;

        const { price: priceDetails } = detailsStats(
            _.get(formValues, "details", []),
        );

        if (newClientVehicleId !== oldClientVehicleId && newClientVehicleId) {
            const newClientVehicle = this._getClientVehicle(newClientVehicleId);
            if (!newClientVehicle.modificationId) {
                this._openNotification(newClientVehicle);
            } else if (
                newClientVehicle.bodyType &&
                !newClientVehicle.tecdocId
            ) {
                this._openNotification(newClientVehicle);
            }
        }

        if (!_.isEqual(formValues, prevFormValues)) {
            this.setState({ formValues });
        }
        //
        // for each stationLoad row in stationLoads tab we have to provide extra check
        // if values is not equal we will fetch available hours for each row
        _.each(formValues.stationLoads, (stationLoad, index) => {
            const prevStationLoad = _.get(prevFormValues.stationLoads, index);
            const prevStationHoursFields = _.pick(prevStationLoad, [
                "beginDate",
                "station",
            ]);
            const stationHoursFields = _.pick(stationLoad, [
                "beginDate",
                "station",
            ]);

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
                if (![station, beginDate].some(_.isNil)) {
                    this.props.fetchAvailableHours(
                        station,
                        beginDate,
                        orderId,
                        index,
                    );
                    // clearing previous form fields values
                    if (![prevStation, prevBeginDate].some(_.isNil)) {
                        this.props.form.setFieldsValue({
                            [`stationLoads[${index}].beginTime`]: void 0,
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

    _getClientVehicle = clientVehicleId => {
        const vehicles = _.get(this.props, "selectedClient.vehicles");

        return clientVehicleId && _.isArray(vehicles)
            ? _.chain(vehicles)
                  .find({ id: clientVehicleId })
                  .value()
            : null;
    };

    _getTecdocId = () => {
        const { form } = this.props;

        const clientVehicleId = form.getFieldValue("clientVehicle");
        const vehicles = _.get(this.props, "selectedClient.vehicles");

        return clientVehicleId && _.isArray(vehicles)
            ? _.chain(vehicles)
                  .find({ id: clientVehicleId })
                  .get("tecdocId", null)
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
            cashSum,
            cashFlowFilters,
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
            _.get(formFieldsValues, "services", []),
            allServices,
        );
        const clientVehicle = _.get(formFieldsValues, "clientVehicle");
        const clientPhone = _.get(formFieldsValues, "clientPhone");
        const clientEmail = _.get(formFieldsValues, "clientEmail");
        const searchClientQuery = _.get(formFieldsValues, "searchClientQuery");

        const zeroStationLoadBeginDate = _.get(
            formFieldsValues,
            "stationLoads[0].beginDate",
        );
        const zeroStationLoadBeginTime = _.get(
            formFieldsValues,
            "stationLoads[0].beginTime",
        );
        const zeroStationLoadStation = _.get(
            formFieldsValues,
            "stationLoads[0].station",
        );
        const zeroStationLoadDuration = _.get(
            formFieldsValues,
            "stationLoads[0].duration",
        );
        const deliveryDate = _.get(formFieldsValues, "deliveryDate");

        const orderFormBodyFields = _.pick(formFieldsValues, [
            "comment",
            "odometerValue",
            "clientVehicle",
            "clientRequisite",
            "clientEmail",
            "clientPhone",
            "searchClientQuery",
        ]);

        const orderFormHeaderFields = _.pick(formFieldsValues, [
            "stationLoads[0].beginTime",
            "stationLoads[0].station",
            "stationLoads[0].beginDate",
            "stationLoads[0].duration",
            "deliveryDate",
            "deliveryTime",
            "manager",
            "employee",
            "appurtenanciesResponsible",
            "paymentMethod",
            "requisite",
        ]);

        let priceDetails = 0;
        for(let i = 0; i < this.orderDetails.length; i++) {
            if(this.orderDetails[i].agreement != 'REJECTED') {
                priceDetails += Math.round(this.orderDetails[i].sum);
            }
        }

        let priceServices = 0;
        for(let i = 0; i < this.orderServices.length; i++) {
            if(this.orderServices[i].agreement != 'REJECTED') {
                priceServices += Math.round(this.orderServices[i].sum);
            }
        }

        const servicesDiscount = _.get(formFieldsValues, "servicesDiscount", 0);
        const detailsDiscount = _.get(formFieldsValues, "detailsDiscount", 0);

        const detailsTotalPrice =
            priceDetails - priceDetails * (detailsDiscount / 100);
        const servicesTotalPrice =
            priceServices - priceServices * (servicesDiscount / 100);

        const totalPrice = Math.round(detailsTotalPrice + servicesTotalPrice);
        const remainPrice = Math.round(totalPrice - cashSum);

        return (
            <Form className={Styles.form} layout="horizontal">
                <OrderFormHeader
                    errors={errors}
                    location={location}
                    fields={orderFormBodyFields}
                    searchClientQuery={searchClientQuery}
                    clientVehicle={clientVehicle}
                    clientPhone={clientPhone}
                    clientEmail={clientEmail}
                    orderHistory={orderHistory}
                    orderId={orderId}
                    searchClientsResult={searchClientsResult}
                    setClientSelection={setClientSelection}
                    fetchedOrder={fetchedOrder}
                    selectedClient={selectedClient}
                    form={form}
                    user={user}
                    order={order}
                    setAddClientModal={setAddClientModal}
                />
                <OrderFormBody
                    allServices={allServices}
                    authentificatedManager={authentificatedManager}
                    availableHours={availableHours}
                    cashFlowFilters={cashFlowFilters}
                    cashSum={cashSum}
                    deliveryDate={deliveryDate}
                    detailsDiscount={detailsDiscount}
                    employees={employees}
                    errors={errors}
                    fetchedOrder={fetchedOrder}
                    fields={orderFormHeaderFields}
                    form={form}
                    location={location}
                    managers={managers}
                    remainPrice={remainPrice}
                    requisites={requisites}
                    schedule={schedule}
                    servicesDiscount={servicesDiscount}
                    stations={stations}
                    totalHours={totalHours}
                    totalPrice={totalPrice}
                    user={user}
                    zeroStationLoadBeginDate={zeroStationLoadBeginDate}
                    zeroStationLoadBeginTime={zeroStationLoadBeginTime}
                    zeroStationLoadDuration={zeroStationLoadDuration}
                    zeroStationLoadStation={zeroStationLoadStation}
                />
                <AddClientModal
                    searchQuery={searchClientQuery}
                    wrappedComponentRef={this._saveFormRef}
                    visible={this.props.modal}
                    resetModal={this.props.resetModal}
                    addClientFormData={this.props.addClientFormData}
                />
                <ToSuccessModal
                    wrappedComponentRef={this._saveFormRef}
                    visible={this.props.modal}
                    onStatusChange={this.props.onStatusChange}
                    resetModal={this.props.resetModal}
                    remainPrice={remainPrice}
                    clientId={selectedClient.clientId}
                    orderId={orderId}
                />
            </Form>
        );
    }
}
