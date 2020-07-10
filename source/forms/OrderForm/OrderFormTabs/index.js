// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Tabs, Icon, Button } from "antd";
import _ from "lodash";

// proj
import { MODALS } from "core/modals/duck";
import { DecoratedTextArea } from "forms/DecoratedFields";
import { permissions, isForbidden, isAdmin } from "utils";

// own
import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
    TasksTable,
    HistoryTable,
    CallsTable,
    StationsTable,
    DiagnosticTable,
} from "../OrderFormTables";
import Styles from "./styles.m.css";

const TabPane = Tabs.TabPane;

function hideTasks(orderTasks, managerId) {
    const newOrderTasks = _.cloneDeep(orderTasks);
    _.each(_.get(newOrderTasks, "orderTasks"), newOrderTask => {
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
        this._localizationMap = {};
        this.commentsRules = [
            {
                max: 2000,
                message: this.props.intl.formatMessage({
                    id: "field_should_be_below_2000_chars",
                }),
            },
        ];
        this.commentsAutoSize = { minRows: 2, maxRows: 6 };
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
            services,
            details,
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
        } = this.props;

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
        } = permissions;

        const isHistoryForbidden = isForbidden(user, ACCESS_ORDER_HISTORY);
        const areCallsForbidden = isForbidden(user, ACCESS_ORDER_CALLS);
        const areCommentsForbidden = isForbidden(user, ACCESS_ORDER_COMMENTS);
        const areServicesForbidden = isForbidden(user, ACCESS_ORDER_SERVICES);
        const areDetailsForbidden = isForbidden(user, ACCESS_ORDER_DETAILS);
        const areDiagnosticForbidden = isForbidden(user, ACCESS_ORDER_DIAGNOSTICS);
        const clodedEditing = (this.props.orderStatus == 'success' || this.props.orderStatus == 'cancel') && isForbidden(user, UPDATE_SUCCESS_ORDER)

        const viewTasks = !isForbidden(user, GET_TASKS);
        const viewAllTasks = !isForbidden(user, GET_ALL_TASKS);
        const canCreateTask =
            viewAllTasks &&
            orderTasks.orderTasks &&
            orderTasks.orderTasks.length < 1;

        const tasks = viewAllTasks
            ? orderTasks
            : hideTasks(orderTasks, user.id);

        const servicesTableFieldsProps = _.pick(this.props.fields, [
            "services",
            "clientVehicle",
            "employee",
        ]);
        const detailsTableFieldsProps = _.pick(this.props.fields, ["details"]);
        const discountTabFieldsProps = _.pick(this.props.fields, [
            "servicesDiscount",
            "detailsDiscount",
        ]);
        const stationLoadsFieldsProps = _.pick(this.props.fields, [
            "stationLoads",
        ]);

        return (
            <Tabs type="card" className={Styles.orderFormsTabs}>
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        disabled={areDiagnosticForbidden}
                        tab={
                            formatMessage({
                                id: "order_form_table.diagnostic",
                            })
                        }
                        key="1"
                    >
                        <DiagnosticTable
                            disabled={this.props.orderStatus == 'success' || this.props.orderStatus == 'cancel'}
                            defaultEmployeeId={this.props.defaultEmployeeId}
                            user={user}
                            forbidden={areDiagnosticForbidden}
                            tecdocId={tecdocId}
                            form={form}
                            orderDiagnostic={orderDiagnostic}
                            orderId={orderId}
                            selectedClient={selectedClient}
                            orderServices={orderServices}
                            orderDetails={orderDetails}
                            reloadOrderPageComponents={this.props.reloadOrderPageComponents}
                        />
                    </TabPane>
                )}
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        tab={`${formatMessage({
                            id: "add_order_form.services",
                            defaultMessage: "Services",
                        })} (${orderServices.length})`}
                        key="2"
                    >
                        <ServicesTable
                            disabled={clodedEditing}
                            laborTimeMultiplier={this.props.laborTimeMultiplier}
                            defaultEmployeeId={this.props.defaultEmployeeId}
                            normHourPrice={normHourPrice}
                            tecdocId={tecdocId}
                            errors={errors}
                            orderId={orderId}
                            fields={servicesTableFieldsProps}
                            services={services}
                            employees={employees}
                            form={form}
                            allServices={allServices}
                            orderServices={orderServices}
                            user={user}
                            fetchedOrder={fetchedOrder}
                            agreementCompleted={_.get(fetchedOrder, "order.agreementCompleted")}
                            selectedClient={selectedClient}
                            fetchTecdocSuggestions={fetchTecdocSuggestions}
                            completedDiagnostic={orderDiagnostic? orderDiagnostic.completed : null}
                            reloadOrderForm={this.props.reloadOrderForm}
                        />
                        <DiscountPanel
                            fields={discountTabFieldsProps}
                            form={form}
                            forbidden={areServicesForbidden}
                            price={priceServices}
                            discountFieldName={"servicesDiscount"}
                            fetchedOrder={fetchedOrder}
                            totalServicesProfit={totalServicesProfit}
                            servicesMode
                            reloadOrderForm={this.props.reloadOrderForm}
                        />
                    </TabPane>
                )}
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        tab={`${formatMessage({
                            id: "add_order_form.details",
                            defaultMessage: "Details",
                        })} (${orderDetails.length})`}
                        key="3"
                    >
                        <DetailsTable
                            disabled={clodedEditing}
                            errors={errors}
                            orderId={orderId}
                            fields={detailsTableFieldsProps}
                            details={details}
                            tecdocId={tecdocId}
                            clientVehicleId={clientVehicleId}
                            orderDetails={orderDetails}
                            form={form}
                            allDetails={allDetails}
                            fetchTecdocDetailsSuggestions={
                                fetchTecdocDetailsSuggestions
                            }
                            detailsSuggestions={detailsSuggestions}
                            clearTecdocDetailsSuggestions={
                                clearTecdocDetailsSuggestions
                            }
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
                            recommendedPriceLoading={
                                this.props.recommendedPriceLoading
                            }
                            fetchRecommendedPrice={this.props.fetchRecommendedPrice}
                            setModal={setModal}
                            completedDiagnostic={orderDiagnostic? orderDiagnostic.completed : null}
                            agreementCompleted={_.get(fetchedOrder, "order.agreementCompleted")}
                            reloadOrderForm={this.props.reloadOrderForm}
                        />
                        <DiscountPanel
                            orderDetails={orderDetails}
                            fields={discountTabFieldsProps}
                            form={form}
                            forbidden={areDetailsForbidden}
                            price={priceDetails}
                            totalDetailsProfit={totalDetailsProfit}
                            discountFieldName={"detailsDiscount"}
                            fetchedOrder={fetchedOrder}
                            detailsMode
                            reloadOrderForm={this.props.reloadOrderForm}
                        />
                    </TabPane>
                )}
                <TabPane
                    forceRender
                    key="4"
                    tab={
                        formatMessage({
                            id: "add_order_form.comments",
                        }) + ` (${commentsCount})`
                    }
                >
                    <DecoratedTextArea
                        errors={errors}
                        defaultGetValueProps
                        fieldValue={_.get(fields, "comment")}
                        formItem
                        disabled={areCommentsForbidden}
                        label={this._getLocalization(
                            "add_order_form.client_comments",
                        )}
                        getFieldDecorator={getFieldDecorator}
                        field="comment"
                        initialValue={_.get(fetchedOrder, "order.comment")}
                        rules={this.commentsRules}
                        placeholder={this._getLocalization(
                            "add_order_form.client_comments",
                        )}
                        autosize={this.commentsAutoSize}
                    />
                    <DecoratedTextArea
                        errors={errors}
                        defaultGetValueProps
                        fieldValue={_.get(fields, "vehicleCondition")}
                        formItem
                        disabled={areCommentsForbidden}
                        label={this._getLocalization(
                            "add_order_form.vehicle_condition",
                        )}
                        getFieldDecorator={getFieldDecorator}
                        field="vehicleCondition"
                        initialValue={_.get(
                            fetchedOrder,
                            "order.vehicleCondition",
                        )}
                        rules={this.commentsRules}
                        placeholder={this._getLocalization(
                            "add_order_form.vehicle_condition",
                        )}
                        autosize={this.commentsAutoSize}
                    />

                    <DecoratedTextArea
                        errors={errors}
                        defaultGetValueProps
                        fieldValue={_.get(fields, "businessComment")}
                        formItem
                        disabled={areCommentsForbidden}
                        label={this._getLocalization(
                            "add_order_form.business_comment",
                        )}
                        getFieldDecorator={getFieldDecorator}
                        field="businessComment"
                        initialValue={_.get(
                            fetchedOrder,
                            "order.businessComment",
                        )}
                        rules={this.commentsRules}
                        placeholder={this._getLocalization(
                            "add_order_form.business_comment",
                        )}
                        autosize={this.commentsAutoSize}
                    />

                    <DecoratedTextArea
                        errors={errors}
                        defaultGetValueProps
                        fieldValue={_.get(fields, "recommendation")}
                        formItem
                        disabled={areCommentsForbidden}
                        label={this._getLocalization(
                            "add_order_form.service_recommendations",
                        )}
                        getFieldDecorator={getFieldDecorator}
                        field="recommendation"
                        initialValue={_.get(
                            fetchedOrder,
                            "order.recommendation",
                        )}
                        rules={this.commentsRules}
                        placeholder={this._getLocalization(
                            "add_order_form.service_recommendations",
                        )}
                        autosize={this.commentsAutoSize}
                    />
                </TabPane>
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        disabled={isHistoryForbidden}
                        tab={
                            formatMessage({
                                id: "order_form_table.history",
                            }) +
                            (isHistoryForbidden
                                ? ""
                                : ` (${orderHistory.orders.length})`)
                        }
                        key="5"
                    >
                        <HistoryTable
                            orderHistory={orderHistory}
                            fetchOrderForm={fetchOrderForm}
                            fetchOrderTask={fetchOrderTask}
                            user={user}
                        />
                    </TabPane>
                )}
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        disabled={areCallsForbidden}
                        tab={
                            formatMessage({
                                id: "order_form_table.calls",
                            }) +
                            (areCallsForbidden ? "" : ` (${orderCalls.length})`)
                        }
                        key="6"
                    >
                        <CallsTable orderCalls={orderCalls} />
                    </TabPane>
                )}
                <TabPane
                    forceRender
                    // disabled={ areCallsForbidden }
                    tab={
                        formatMessage({
                            id: "order_form_table.station",
                        }) + ` (${stationsCount ? stationsCount.length : 0})`
                    }
                    key="7"
                >
                    <StationsTable
                        errors={errors}
                        initialBeginDatetime={initialBeginDatetime}
                        initialStation={initialStation}
                        fields={stationLoadsFieldsProps}
                        form={form}
                        schedule={schedule}
                        stations={stations}
                        availableHours={availableHours}
                        stationLoads={stationLoads}
                        user={user}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
