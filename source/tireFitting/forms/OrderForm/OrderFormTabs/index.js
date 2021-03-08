// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Tabs, Icon, Button } from 'antd';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';
import { DecoratedTextArea } from 'forms/DecoratedFields';
import { permissions, isForbidden, isAdmin } from 'utils';

// own
import {
	DetailsTable,
	ServicesTable,
	DiscountPanel,
	HistoryTable,
} from '../OrderFormTables';
import Styles from './styles.m.css';

const TabPane = Tabs.TabPane;

function hideTasks(orderTasks, managerId) {
	const newOrderTasks = _.cloneDeep(orderTasks);
	_.each(_.get(newOrderTasks, 'orderTasks'), (newOrderTask) => {
		newOrderTask.history = _.filter(newOrderTask.history, {
			responsibleId: managerId,
		});
	});

	return newOrderTasks;
}

@injectIntl
export default class OrderFormTabs extends React.PureComponent {
	/* eslint-disable complexity */

	constructor(props) {
		super(props);
		this.state = {
			activeKey: 'services',
			action: undefined,
			detailsTreeData: [],
		};
		this._localizationMap = {};
		this.commentsRules = [
			{
				max: 2000,
				message: this.props.intl.formatMessage({
					id: 'field_should_be_below_2000_chars',
				}),
			},
		];
		this.commentsAutoSize = { minRows: 2, maxRows: 6 };
		this._setActiveTab = this._setActiveTab.bind(this);
	}

	buildStoreGroupsTree() {
		var treeData = [];
		for (
			let i = 0;
			i < i < this.props.details ? this.props.details.length : 0;
			i++
		) {
			const parentGroup = this.props.details[i];
			treeData.push({
				title: `${parentGroup.name} (#${parentGroup.id})`,
				name: parentGroup.name,
				value: parentGroup.id,
				className: Styles.groupTreeOption,
				key: `${i}`,
				selectable: false,
				children: [],
				multiplier: parentGroup.priceGroupMultiplier,
			});
			for (let j = 0; j < parentGroup.childGroups.length; j++) {
				const childGroup = parentGroup.childGroups[j];
				treeData[i].children.push({
					title: `${childGroup.name} (#${childGroup.id})`,
					name: childGroup.name,
					value: childGroup.id,
					className: Styles.groupTreeOption,
					key: `${i}-${j}`,
					selectable: false,
					children: [],
					multiplier: childGroup.priceGroupMultiplier,
				});
				for (let k = 0; k < childGroup.childGroups.length; k++) {
					const lastNode = childGroup.childGroups[k];
					treeData[i].children[j].children.push({
						title: `${lastNode.name} (#${lastNode.id})`,
						name: lastNode.name,
						value: lastNode.id,
						className: Styles.groupTreeOption,
						key: `${i}-${j}-${k}`,
						children: [],
						multiplier: lastNode.priceGroupMultiplier,
					});
					for (let l = 0; l < lastNode.childGroups.length; l++) {
						const elem = lastNode.childGroups[l];
						treeData[i].children[j].children[k].children.push({
							title: `${elem.name} (#${elem.id})`,
							name: elem.name,
							value: elem.id,
							className: Styles.groupTreeOption,
							key: `${i}-${j}-${k}-${l}`,
							multiplier: elem.priceGroupMultiplier,
						});
					}
				}
			}
		}
		this.setState({
			detailsTreeData: treeData,
		});
	}

	// TODO: move into utils
	_getLocalization(key) {
		if (!this._localizationMap[key]) {
			this._localizationMap[key] = this.props.intl.formatMessage({
				id: key,
			});
		}

		return this._localizationMap[key];
	}

	_setActiveTab(tab, action) {
		this.setState({
			activeKey: tab,
			action: action,
		});
	}

	async componentDidUpdate(prevProps, prevState) {
		if (!prevProps.showOilModal && this.props.showOilModal) {
			this.setState({
				activeKey: 'services',
			});
		}
		if (!this.state.detailsTreeData.length) {
			this.buildStoreGroupsTree();
		}
		if (prevState.action) {
			this.setState({ action: undefined });
		}
	}

	render() {
		const {
			setModal,
			fetchOrderForm,
			fetchOrderTask,
			fetchTecdocSuggestions,
			fetchTecdocDetailsSuggestions,
			clearTecdocDetailsSuggestions,
			clearTecdocSuggestions,

			addOrderForm,
			detailsSuggestionsFetching,
			suggestionsFetching,

			orderTasks,
			orderCalls,
			orderHistory,
			orderServices,
			orderDetails,
			orderDiagnostic,
			orderId,
			allServices,
			allDetails,
			labors,
			details,
			employees,
			selectedClient,
			detailsSuggestions,
			suggestions,
			fetchedOrder,
			user,
			schedule,
			stations,
			availableHours,
			stationLoads,
			tecdocId,
			clientVehicleId,

			//fields
			initialStation,
			initialBeginDatetime,

			// stats
			priceDetails,
			priceServices,
			countDetails,
			countServices,
			commentsCount,
			stationsCount,
			totalDetailsProfit,
			totalServicesProfit,

			intl: { formatMessage },
			form: { getFieldDecorator },
			form,

			initOrderTasksForm,
			changeModalStatus,

			fields,
			errors,

			normHourPrice,

			showOilModal,
			oilModalData,
			clearOilData,
			repairMap,
			modals,
			download,
			repairMapData,
			fetchRepairMapData,
			focusOnRef,
			showCahOrderModal,
			reloadOrderForm,
		} = this.props;

		var orderServicesSize = 0,
			orderDetailsSize = 0;

		orderServices.map((x) => {
			if (x.id) orderServicesSize++;
		});
		orderDetails.map((x) => {
			if (x.id) orderDetailsSize++;
		});

		const {
			ACCESS_ORDER_HISTORY,
			ACCESS_ORDER_CALLS,
			ACCESS_ORDER_COMMENTS,
			ACCESS_ORDER_SERVICES,
			ACCESS_ORDER_DETAILS,
			ACCESS_ORDER_DIAGNOSTICS,
			GET_TASKS,
			GET_ALL_TASKS,
			UPDATE_SUCCESS_ORDER,
			ACCESS_ORDER_REPAIR_MAP,
			ACCESS_ORDER_WORKSHOP,
			ACCESS_ORDER_STOCK,
			ACCESS_ORDER_TABS_POSTS_CRUD,
			ACCESS_ORDER_TABS_COMMENTS_CRUD,
		} = permissions;

		const isHistoryForbidden = isForbidden(user, ACCESS_ORDER_HISTORY);
		const areServicesForbidden = isForbidden(user, ACCESS_ORDER_SERVICES);
		const areDetailsForbidden = isForbidden(user, ACCESS_ORDER_DETAILS);
		const closedEditing =
			(this.props.orderStatus == 'success' ||
				this.props.orderStatus == 'cancel') &&
			isForbidden(user, UPDATE_SUCCESS_ORDER);

		if (this.state.activeKey == 'services' && areServicesForbidden) {
			if (!areDetailsForbidden) {
				this.setState({
					activeKey: 'details',
				});
			} else {
				this.setState({
					activeKey: 'history',
				});
			}
		}

		const viewTasks = !isForbidden(user, GET_TASKS);
		const viewAllTasks = !isForbidden(user, GET_ALL_TASKS);
		const canCreateTask =
			viewAllTasks && orderTasks.orderTasks && orderTasks.orderTasks.length < 1;

		const tasks = viewAllTasks ? orderTasks : hideTasks(orderTasks, user.id);

		const servicesTableFieldsProps = _.pick(this.props.fields, [
			'services',
			'clientVehicle',
			'employee',
		]);
		const detailsTableFieldsProps = _.pick(this.props.fields, ['details']);
		const discountTabFieldsProps = _.pick(this.props.fields, [
			'servicesDiscount',
			'detailsDiscount',
		]);
		const stationLoadsFieldsProps = _.pick(this.props.fields, ['stationLoads']);

		const clientVehicleTypeId = _.get(
			fetchedOrder,
			'order.clientVehicleTypeId'
		);
		const clientVehicleRadius = _.get(
			fetchedOrder,
			'order.clientVehicleRadius'
		);

		return (
			<Tabs
				type='card'
				className={Styles.orderFormsTabs}
				activeKey={this.state.activeKey}
				onTabClick={(key) => {
					this.setState({
						activeKey: key,
						action: undefined,
					});
				}}
			>
				{!addOrderForm && (
					<TabPane
						forceRender
						tab={`${formatMessage({
							id: 'add_order_form.services',
							defaultMessage: 'Services',
						})} (${orderServicesSize})`}
						key='services'
					>
						<ServicesTable
							disabled={
								closedEditing ||
								isForbidden(user, permissions.ACCESS_ORDER_LABORS_CRUD)
							}
							laborTimeMultiplier={this.props.laborTimeMultiplier}
							defaultEmployeeId={this.props.defaultEmployeeId}
							normHourPrice={normHourPrice}
							tecdocId={tecdocId}
							errors={errors}
							orderId={orderId}
							fields={servicesTableFieldsProps}
							employees={employees}
							form={form}
							allServices={allServices}
							labors={labors}
							details={details}
							orderServices={orderServices}
							user={user}
							fetchedOrder={fetchedOrder}
							agreementCompleted={_.get(
								fetchedOrder,
								'order.agreementCompleted'
							)}
							selectedClient={selectedClient}
							fetchTecdocSuggestions={fetchTecdocSuggestions}
							completedDiagnostic={
								orderDiagnostic ? orderDiagnostic.completed : null
							}
							reloadOrderForm={reloadOrderForm}
							activeKey={this.state.activeKey}
							detailsTreeData={this.state.detailsTreeData}
							clientVehicleTypeId={clientVehicleTypeId}
							clientVehicleRadius={clientVehicleRadius}
						/>
						<DiscountPanel
							fields={discountTabFieldsProps}
							form={form}
							forbidden={
								areServicesForbidden ||
								isForbidden(user, permissions.ACCESS_ORDER_LABORS_DISCOUNTS)
							}
							isServiceMarkupForbidden={
								areServicesForbidden ||
								isForbidden(user, permissions.ACCESS_NORM_HOURS_MODAL_WINDOW)
							}
							price={priceServices}
							discountFieldName={'servicesDiscount'}
							fetchedOrder={fetchedOrder}
							totalServicesProfit={totalServicesProfit}
							servicesMode
							reloadOrderForm={reloadOrderForm}
							laborTimeMultiplier={this.props.laborTimeMultiplier}
							orderId={orderId}
						/>
					</TabPane>
				)}
				{!addOrderForm && (
					<TabPane
						forceRender
						tab={`${formatMessage({
							id: 'add_order_form.details',
							defaultMessage: 'Details',
						})} (${orderDetailsSize})`}
						key='details'
					>
						<DetailsTable
							disabled={
								closedEditing ||
								isForbidden(user, permissions.ACCESS_ORDER_DETAILS_CRUD)
							}
							errors={errors}
							orderId={orderId}
							fields={detailsTableFieldsProps}
							labors={labors}
							details={details}
							tecdocId={tecdocId}
							clientVehicleId={clientVehicleId}
							orderDetails={orderDetails}
							form={form}
							allDetails={allDetails}
							fetchTecdocDetailsSuggestions={fetchTecdocDetailsSuggestions}
							detailsSuggestions={detailsSuggestions}
							clearTecdocDetailsSuggestions={clearTecdocDetailsSuggestions}
							clearTecdocSuggestions={clearTecdocSuggestions}
							suggestions={suggestions}
							detailsSuggestionsFetching={detailsSuggestionsFetching}
							suggestionsFetching={suggestionsFetching}
							user={user}
							setStoreProductsSearchQuery={
								this.props.setStoreProductsSearchQuery
							}
							storeProducts={this.props.storeProducts}
							recommendedPrice={this.props.recommendedPrice}
							recommendedPriceLoading={this.props.recommendedPriceLoading}
							fetchRecommendedPrice={this.props.fetchRecommendedPrice}
							setModal={setModal}
							completedDiagnostic={
								orderDiagnostic ? orderDiagnostic.completed : null
							}
							agreementCompleted={_.get(
								fetchedOrder,
								'order.agreementCompleted'
							)}
							reloadOrderForm={reloadOrderForm}
							clientVehicleVin={this.props.clientVehicleVin}
							showOilModal={showOilModal}
							oilModalData={oilModalData}
							clearOilData={clearOilData}
							activeKey={this.state.activeKey}
							detailsTreeData={this.state.detailsTreeData}
						/>
						<DiscountPanel
							orderDetails={orderDetails}
							fields={discountTabFieldsProps}
							form={form}
							forbidden={
								areDetailsForbidden ||
								isForbidden(user, permissions.ACCESS_ORDER_DETAILS_DISCOUNTS)
							}
							price={priceDetails}
							totalDetailsProfit={totalDetailsProfit}
							discountFieldName={'detailsDiscount'}
							fetchedOrder={fetchedOrder}
							detailsMode
							reloadOrderForm={reloadOrderForm}
							orderId={orderId}
						/>
					</TabPane>
				)}
				{!addOrderForm && (
					<TabPane
						forceRender
						disabled={isHistoryForbidden}
						tab={
							formatMessage({
								id: 'order_form_table.history',
							}) +
							(isHistoryForbidden ? '' : ` (${orderHistory.orders.length})`)
						}
						key='history'
					>
						<HistoryTable
							orderHistory={orderHistory}
							fetchOrderForm={fetchOrderForm}
							fetchOrderTask={fetchOrderTask}
							user={user}
						/>
					</TabPane>
				)}
			</Tabs>
		);
	}
}
