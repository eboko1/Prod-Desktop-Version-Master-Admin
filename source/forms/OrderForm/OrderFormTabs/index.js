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
    WorkshopTable,
    StockTable,
    RepairMapTable,
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
        this.state = {
            activeKey: 'map',
            action: undefined,
            detailsTreeData: [],
        }
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
        this._setActiveTab = this._setActiveTab.bind(this);
    }

    buildStoreGroupsTree() {
        var treeData = [];
        console.log(this.props.details);
        for (let i = 0; i < this.props.details.length; i++) {
            const parentGroup = this.props.details[ i ];
            treeData.push({
                title:      `${parentGroup.name} (#${parentGroup.id})`,
                name:       parentGroup.name,
                value:      parentGroup.id,
                className:  Styles.groupTreeOption,
                key:        `${i}`,
                selectable: false,
                children:   [],
                multiplier: parentGroup.priceGroupMultiplier,
            });
            for (let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[ j ];
                treeData[ i ].children.push({
                    title:      `${childGroup.name} (#${childGroup.id})`,
                    name:       childGroup.name,
                    value:      childGroup.id,
                    className:  Styles.groupTreeOption,
                    key:        `${i}-${j}`,
                    selectable: false,
                    children:   [],
                    multiplier: childGroup.priceGroupMultiplier,
                });
                for (let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[ k ];
                    treeData[ i ].children[ j ].children.push({
                        title:     `${lastNode.name} (#${lastNode.id})`,
                        name:      lastNode.name,
                        value:     lastNode.id,
                        className: Styles.groupTreeOption,
                        key:       `${i}-${j}-${k}`,
                        children:  [],
                        multiplier: lastNode.priceGroupMultiplier,
                    });
                    for (let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[ l ];
                        treeData[ i ].children[ j ].children[ k ].children.push({
                            title:     `${elem.name} (#${elem.id})`,
                            name:      elem.name,
                            value:     elem.id,
                            className: Styles.groupTreeOption,
                            key:       `${i}-${j}-${k}-${l}`,
                            multiplier: elem.priceGroupMultiplier,
                        });
                    }
                }
            }
        }
        this.setState({
            detailsTreeData: treeData,
        })
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
        if(!prevProps.showOilModal && this.props.showOilModal) {
            this.setState({
                activeKey: 'details',
            })
        }
        if(this.props.scrollToMapId) {
            this.setState({
                activeKey: 'map',
            });
            await document.getElementById(this.props.scrollToMapId).scrollIntoView({behavior: "smooth", block: "center"});
            await this.props.scrollToMap(undefined);
        }
        if(!this.state.detailsTreeData.length) {
            this.buildStoreGroupsTree();
        }
        if(prevState.action) {
            this.setState({action: undefined});
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
            clientNameInputRef,
        } = this.props;

        var orderServicesSize = 0,
            orderDetailsSize = 0;

        orderServices.map((x)=>{if(x.id) orderServicesSize++});
        orderDetails.map((x)=>{if(x.id) orderDetailsSize++});

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
        const areDiagnosticForbidden = isForbidden(
            user,
            ACCESS_ORDER_DIAGNOSTICS,
        );
        const clodedEditing =
            (this.props.orderStatus == "success" ||
                this.props.orderStatus == "cancel") &&
            isForbidden(user, UPDATE_SUCCESS_ORDER);

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
            <Tabs
                type="card"
                className={Styles.orderFormsTabs}
                activeKey={this.state.activeKey}
                onTabClick={(key)=>{
                    this.setState({
                        activeKey: key,
                        action: undefined,
                    });
                }}
            >
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        tab={formatMessage({
                            id: "order_tabs.map",
                        })}
                        key="map"
                    >
                        <RepairMapTable
                            user={user}
                            orderId={orderId}
                            repairMap={repairMap}
                            setActiveTab={this._setActiveTab}
                            setModal={ setModal }
                            modals={ modals }
                            download={ download }
                            activeKey={this.state.activeKey}
                            repairMapData={repairMapData}
                            fetchRepairMapData={fetchRepairMapData}
                            clientNameInputRef={clientNameInputRef}
                        />
                    </TabPane>
                )}
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        disabled={areDiagnosticForbidden}
                        tab={formatMessage({
                            id: "order_form_table.diagnostic",
                        })}
                        key='diagnostic'
                    >
                        <DiagnosticTable
                            disabled={
                                this.props.orderStatus == "success" ||
                                this.props.orderStatus == "cancel"
                            }
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
                            labors={labors}
                            details={details}
                            reloadOrderPageComponents={
                                this.props.reloadOrderPageComponents
                            }
                            action={this.state.action}
                        />
                    </TabPane>
                )}
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        tab={`${formatMessage({
                            id: "add_order_form.services",
                            defaultMessage: "Services",
                        })} (${orderServicesSize})`}
                        key="services"
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
                                "order.agreementCompleted",
                            )}
                            selectedClient={selectedClient}
                            fetchTecdocSuggestions={fetchTecdocSuggestions}
                            completedDiagnostic={
                                orderDiagnostic
                                    ? orderDiagnostic.completed
                                    : null
                            }
                            reloadOrderForm={this.props.reloadOrderForm}
                            activeKey={this.state.activeKey}
                            detailsTreeData={this.state.detailsTreeData}
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
                        })} (${orderDetailsSize})`}
                        key="details"
                    >
                        <DetailsTable
                            disabled={clodedEditing}
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
                            fetchTecdocDetailsSuggestions={
                                fetchTecdocDetailsSuggestions
                            }
                            detailsSuggestions={detailsSuggestions}
                            clearTecdocDetailsSuggestions={
                                clearTecdocDetailsSuggestions
                            }
                            clearTecdocSuggestions={clearTecdocSuggestions}
                            suggestions={suggestions}
                            detailsSuggestionsFetching={
                                detailsSuggestionsFetching
                            }
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
                            fetchRecommendedPrice={
                                this.props.fetchRecommendedPrice
                            }
                            setModal={setModal}
                            completedDiagnostic={
                                orderDiagnostic
                                    ? orderDiagnostic.completed
                                    : null
                            }
                            agreementCompleted={_.get(
                                fetchedOrder,
                                "order.agreementCompleted",
                            )}
                            reloadOrderForm={this.props.reloadOrderForm}
                            clientVehicleVin={this.props.clientVehicleVin}
                            showOilModal= { showOilModal }
                            oilModalData = { oilModalData }
                            clearOilData = { clearOilData }
                            activeKey={this.state.activeKey}
                            detailsTreeData={this.state.detailsTreeData}
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
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        tab={formatMessage({
                            id: "order_tabs.workshop",
                        })}
                        key="workshop"
                    >
                        <WorkshopTable
                            user={user}
                            orderId={orderId}
                            orderServices={orderServices}
                            reloadOrderForm={this.props.reloadOrderForm}
                            activeKey={this.state.activeKey}
                        />
                    </TabPane>
                )}
                {!addOrderForm && (
                    <TabPane
                        forceRender
                        tab={formatMessage({
                            id: "order_tabs.stock",
                        })}
                        key="stock"
                    >
                        <StockTable
                            user={user}
                            orderId={orderId}
                            orderDetails={orderDetails}
                            reloadOrderForm={this.props.reloadOrderForm}
                            activeKey={this.state.activeKey}
                        />
                    </TabPane>
                )}
                <TabPane
                    forceRender
                    key="comments"
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
                        autoSize={this.commentsAutoSize}
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
                        autoSize={this.commentsAutoSize}
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
                        autoSize={this.commentsAutoSize}
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
                        autoSize={this.commentsAutoSize}
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
                        key="history"
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
                        key="calls"
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
                    key="station"
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
