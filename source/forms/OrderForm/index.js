// vendor
import React, { Component } from 'react';
import { Form, notification, message } from 'antd';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

//proj
import {
	onChangeOrderForm,
	setClientSelection,
	fetchTecdocSuggestions,
	fetchTecdocDetailsSuggestions,
	clearTecdocSuggestions,
	clearTecdocDetailsSuggestions,
	selectCashSum,
	selectCashFlowFilters,
} from 'core/forms/orderForm/duck';
import {
	setStoreProductsSearchQuery,
	selectStoreProductsByQuery,
} from 'core/search/duck';
import {
	fetchRecommendedPrice,
	selectRecommendedPrice,
	selectRecommendedPriceLoading,
} from 'core/storage/products';
import { resetModal } from 'core/modals/duck';
import { initOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import { AddClientModal, ToSuccessModal } from 'modals';

import { withReduxForm2, isForbidden, permissions } from 'utils';

// own
import OrderFormHeader from './OrderFormHeader';
import OrderFormBody from './OrderFormBody';
import OrderFormTabs from './OrderFormTabs';
import { servicesStats, detailsStats } from './stats';
import Styles from './styles.m.css';

@injectIntl
@withReduxForm2({
	name: 'orderForm',
	// debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
	actions: {
		change: onChangeOrderForm,
		setClientSelection,
		initOrderTasksForm,
		resetModal,
		fetchTecdocSuggestions,
		clearTecdocSuggestions,
		fetchTecdocDetailsSuggestions,
		clearTecdocDetailsSuggestions,
		setStoreProductsSearchQuery,
		fetchRecommendedPrice,
	},

	mapStateToProps: (state) => ({
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
export class OrderForm extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			formValues: {},
			labors: [],
			details: undefined,
			fetchedOrder: undefined,
		};
	}

	_isMounted = false;

	_fetchLaborsAndDetails = async () => {
		var that = this;
		let token = localStorage.getItem('_my.carbook.pro_token');
		let url = __API_URL__ + `/store_groups`;
		fetch(url, {
			method: 'GET',
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
				console.log(data);
				data.map((elem, index) => {
					elem.key = index;
				});
				that.state.details = data;
			})
			.catch(function(error) {
				console.log('error', error);
			});
	};

	_reloadOrderForm = (callback, type = 'all', reloadRepairMap = false) => {
		const onlyLabors = type == 'labors' || type == 'all',
			onlyDetails = type == 'details' || type == 'all';
		var that = this;
		let token = localStorage.getItem('_my.carbook.pro_token');
		let url = __API_URL__;
		let params = `/orders/${this.props.orderId}?onlyLabors=true&onlyDetails=true`;
		url += params;
		fetch(url, {
			method: 'GET',
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
				console.log(data);
				that.setState({
					fetchedOrder: data,
				});
				if (callback) callback(data);
				if (reloadRepairMap) that.props.fetchRepairMapData();
			})
			.catch(function(error) {
				console.log('error', error);
			});
	};

	_updateOrderField = (field) => {
		if (field == 'duration') {
			let hours = 0;
			this.orderServices.map((elem) => {
				if (elem.agreement != 'REJECTED') hours += elem.count;
			});

			if (hours > 8) {
				message.warning('Количество часов превышает 8. ');
				hours = 8;
			}

			field = { duration: Math.round(hours * 10) / 10 };
		}

		var that = this;
		let token = localStorage.getItem('_my.carbook.pro_token');
		let url = __API_URL__;
		let params = `/orders/${this.props.orderId}`;
		url += params;
		fetch(url, {
			method: 'PUT',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(field),
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
				that._reloadOrderForm();
				that.props.fetchOrderForm(that.props.orderId);
			})
			.catch(function(error) {
				console.log('error', error);
			});
	};

	_openNotification = ({ make, model }) => {
		const params = {
			message: this.props.intl.formatMessage({
				id: 'order-form.warning',
			}),
			description: (
				<div>
					<div>
						{this.props.intl.formatMessage({
							id: 'order-form.update_modification_info',
						})}
					</div>
					<div>
						{make} {model}
					</div>
				</div>
			),
			placement: 'topLeft',
			duration: 7,
		};
		notification.open(params);
	};

	async componentDidMount() {
		// TODO in order to fix late getFieldDecorator invoke for services
		//this.setState({ initialized: true });
		//this.props.selectedClient.vehicles.push(this.props.vehicle);
		this._isMounted = true;
		if (this._isMounted && this.props.fetchedOrder) {
			await this._fetchLaborsAndDetails();
			await this._reloadOrderForm();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
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
			_.get(formValues, 'details', [])
		);

		if (newClientVehicleId !== oldClientVehicleId && newClientVehicleId) {
			const newClientVehicle = this._getClientVehicle(newClientVehicleId);
			if (!newClientVehicle.modificationId) {
				this._openNotification(newClientVehicle);
			} else if (newClientVehicle.bodyType && !newClientVehicle.tecdocId) {
				this._openNotification(newClientVehicle);
			}
		}

		if (!_.isEqual(formValues, prevFormValues)) {
			this.setState({ formValues });
		}

		if (
			_.get(formValues, 'stationLoads[0].beginDate', undefined) &&
			_.get(prevFormValues, 'stationLoads[0].beginDate', undefined) &&
			!_.get(formValues, 'stationLoads[0].beginDate', undefined).isSame(
				_.get(prevFormValues, 'stationLoads[0].beginDate', undefined)
			)
		) {
			this.props.form.setFieldsValue({
				deliveryDate: _.get(formValues, 'stationLoads[0].beginDate', undefined),
			});
		}
	}

	_saveFormRef = (formRef) => {
		this.formRef = formRef;
	};

	_bodyUpdateIsForbidden = () =>
		isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);

	_getClientVehicle = (clientVehicleId) => {
		const vehicles = _.get(this.props, 'selectedClient.vehicles');

		return clientVehicleId && _.isArray(vehicles)
			? _.chain(vehicles)
					.find({ id: clientVehicleId })
					.value()
			: null;
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
        console.log(this)
		const {
			authentificatedManager,
			form,
			allServices,
			orderHistory,
			orderId,
			searchClientsResult,
			setClientSelection,
			selectedClient,
			cashSum,
			cashFlowFilters,
			setAddClientModal,
			schedule,
			stations,
			businessLocations,
			managers,
			employees,
			requisites,
			user,
			location,
			errors,
			repairMap,
			focusOnRef,
			focusedRef,
		} = this.props;

		const formFieldsValues = form.getFieldsValue();

		const { totalHours } = servicesStats(this.orderServices, allServices);
		const clientVehicle = _.get(formFieldsValues, 'clientVehicle');
		const clientPhone = _.get(formFieldsValues, 'clientPhone');
		const clientEmail = _.get(formFieldsValues, 'clientEmail');
		const searchClientQuery = _.get(formFieldsValues, 'searchClientQuery');

		const zeroStationLoadBeginDate = _.get(
			formFieldsValues,
			'stationLoads[0].beginDate'
		);
		const zeroStationLoadBeginTime = _.get(
			formFieldsValues,
			'stationLoads[0].beginTime'
		);
		const zeroStationLoadStation = _.get(
			formFieldsValues,
			'stationLoads[0].station'
		);
		const zeroStationLoadDuration = _.get(
			formFieldsValues,
			'stationLoads[0].duration'
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
			'businessLocationId',
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

		const tabs = this._renderTabs(formFieldsValues);

		const fetchedOrder = this.state.fetchedOrder || this.props.fetchedOrder;
		const order = _.get(fetchedOrder, 'order', {});

		const {
			totalSum,
			totalSumWithTax,
			isTaxPayer,
			servicesDiscount,
			servicesSum,
			servicesSumDiscount,
			servicesTotalSum,
			detailsDiscount,
			detailsSum,
			detailsSumDiscount,
			detailsTotalSum,
		} = order;

		const remainPrice = isTaxPayer
			? Math.round((totalSumWithTax - cashSum) * 100) / 100
			: Math.round((totalSum - cashSum) * 100) / 100;

		return (
			<Form className={Styles.form} layout='horizontal'>
				<OrderFormHeader
					updateOrderField={this._updateOrderField}
					allServices={allServices}
					authentificatedManager={authentificatedManager}
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
					totalPrice={totalSum}
					user={user}
					zeroStationLoadBeginDate={zeroStationLoadBeginDate}
					zeroStationLoadBeginTime={zeroStationLoadBeginTime}
					zeroStationLoadDuration={zeroStationLoadDuration}
					zeroStationLoadStation={zeroStationLoadStation}
					totalSumWithTax={totalSumWithTax}
					isTaxPayer={isTaxPayer}
					focusOnRef={focusOnRef}
					focusedRef={focusedRef}
				/>
				<OrderFormBody
					updateOrderField={this._updateOrderField}
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
					orderStatus={this.props.order.status}
					onStatusChange={this.props.onStatusChange}
					createOrder={this.props.createOrder}
					createStatus={this.props.createStatus}
					businessLocations={businessLocations}
					focusOnRef={focusOnRef}
					focusedRef={focusedRef}
				/>
				<div id='OrderTabs'>{tabs}</div>
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

	_renderTabs = (formFieldsValues) => {
		const fetchedOrder = this.state.fetchedOrder || this.props.fetchedOrder;
		if (!fetchedOrder || !this.state.details || !this.state.details.length) {
			return;
		}
		const { form, orderTasks, schedule, stationLoads, orderId } = this.props;
		const { formatMessage } = this.props.intl;
		const { getFieldDecorator } = this.props.form;

		const tecdocId = this._getTecdocId();

		// _.values(value).some(_.isNil) gets only filled rows
		const stationsCount = _.get(formFieldsValues, 'stationLoads', [])
			.filter(Boolean)
			.filter((value) => !_.values(value).some(_.isNil));

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
			orderDiagnostic,
			allServices,
			allDetails,
			employees,
			selectedClient,
			detailsSuggestions,
			suggestions,
			user,
			stations,

			changeModalStatus,
			errors,
			location,

			storeProducts,
			setStoreProductsSearchQuery,

			normHourPrice,

			showOilModal,
			oilModalData,
			clearOilData,

			repairMap,
			modals,
			download,
			scrollToMapId,
			scrollToMap,
			repairMapData,
			fetchRepairMapData,
			focusOnRef,
			showCahOrderModal,
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

		const order = _.get(fetchedOrder, 'order', {});
		const {
			totalSum,
			totalSumWithTax,
			isTaxPayer,
			servicesDiscount,
			servicesSum,
			servicesSumDiscount,
			servicesTotalSum,
			detailsDiscount,
			detailsSum,
			detailsSumDiscount,
			detailsTotalSum,
		} = order;

		const orderServices = _.get(fetchedOrder, 'orderServices', []);
		const orderDetails = _.get(fetchedOrder, 'orderDetails', []);
		let totalDetailsProfit = detailsTotalSum;
		let totalServicesProfit = servicesTotalSum;

		orderDetails.map(({ purchasePrice }) => {
			totalDetailsProfit -= purchasePrice;
		});
		orderServices.map(({ purchasePrice }) => {
			totalServicesProfit -= purchasePrice;
		});

		return (
			<OrderFormTabs
				orderStatus={this.props.order.status}
				laborTimeMultiplier={this.props.order.laborTimeMultiplier}
				defaultEmployeeId={this.props.order.employeeId}
				normHourPrice={normHourPrice}
				orderId={orderId}
				errors={errors}
				initialBeginDatetime={initialBeginDatetime}
				initialStation={initialStation}
				fields={orderFormTabsFields}
				services={orderFormTabsFields.services || []}
				fetchOrderForm={fetchOrderForm}
				fetchOrderTask={fetchOrderTask}
				fetchTecdocSuggestions={fetchTecdocSuggestions}
				fetchTecdocDetailsSuggestions={fetchTecdocDetailsSuggestions}
				clearTecdocDetailsSuggestions={clearTecdocDetailsSuggestions}
				clearTecdocSuggestions={clearTecdocSuggestions}
				addOrderForm={addOrderForm}
				detailsSuggestionsFetching={detailsSuggestionsFetching}
				suggestionsFetching={suggestionsFetching}
				orderCalls={orderCalls}
				orderHistory={orderHistory}
				orderServices={orderServices}
				orderDetails={orderDetails}
				orderDiagnostic={orderDiagnostic}
				labors={allServices}
				allDetails={allDetails}
				details={this.state.details}
				employees={employees}
				selectedClient={selectedClient}
				detailsSuggestions={detailsSuggestions}
				suggestions={suggestions}
				fetchedOrder={fetchedOrder}
				user={user}
				stations={stations}
				changeModalStatus={changeModalStatus}
				tecdocId={tecdocId}
				clientVehicleId={clientVehicleId}
				initOrderTasksForm={this.props.initOrderTasksForm}
				formatMessage={formatMessage}
				getFieldDecorator={getFieldDecorator}
				form={form}
				setModal={setModal}
				orderTasks={orderTasks}
				stationLoads={stationLoads}
				schedule={schedule}
				priceServices={servicesSum}
				priceDetails={detailsSum}
				countServices={orderServices.length}
				countDetails={orderDetails.length}
				totalDetailsProfit={totalDetailsProfit}
				totalServicesProfit={totalServicesProfit}
				commentsCount={commentsCount}
				stationsCount={stationsCount}
				storeProducts={storeProducts}
				setStoreProductsSearchQuery={setStoreProductsSearchQuery}
				recommendedPrice={this.props.recommendedPrice}
				recommendedPriceLoading={this.props.recommendedPriceLoading}
				fetchRecommendedPrice={this.props.fetchRecommendedPrice}
				reloadOrderPageComponents={this.props.reloadOrderPageComponents}
				reloadOrderForm={this._reloadOrderForm}
				clientVehicleVin={this.props.order.clientVehicleVin}
				showOilModal={showOilModal}
				oilModalData={oilModalData}
				clearOilData={clearOilData}
				repairMap={repairMap}
				setModal={setModal}
				modals={modals}
				download={download}
				scrollToMapId={scrollToMapId}
				scrollToMap={scrollToMap}
				repairMapData={repairMapData}
				fetchRepairMapData={fetchRepairMapData}
				focusOnRef={focusOnRef}
				showCahOrderModal={showCahOrderModal}
			/>
		);
	};
}
