// vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import {
    Form,
    Button,
    Input,
    Select,
    Icon,
    Tabs,
} from "antd";
import { v4 } from "uuid";
import _ from "lodash";
import moment from "moment";

// proj
import { OrderMobileFormFields } from './OrderMobileFormFields';
import book from "routes/book";
import { resetModal } from "core/modals/duck";
import { withReduxForm } from "utils";
import { permissions, isForbidden } from "utils";
import {
    onChangeOrderForm,
    selectCashSum,
    setClientSelection,
} from "core/forms/orderForm/duck";
import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
    HistoryTable,
} from "../OrderForm/OrderFormTables";

const Option = Select.Option;
const TabPane = Tabs.TabPane;

@injectIntl
@withReduxForm({
    name: "orderForm",
    /*debouncedFields: [
        "comment",
        "recommendation",
        "vehicleCondition",
        "businessComment",
    ],*/
    actions: {
        change: onChangeOrderForm,
        setClientSelection,
        resetModal,
    },
    mapStateToProps: state => ({
        modal:                      state.modals.modal,
        user:                       state.auth,
        cashSum:                    selectCashSum(state),
        schedule:                   state.forms.orderForm.schedule,
        stationLoads:               state.forms.orderForm.stationLoads,
        addClientFormData:          state.forms.addClientForm.data,
        isMobile:                   state.ui.views.isMobile,
    }),
})
export class MobileRecordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detailsTreeData: [],
            fetchedOrder: undefined,
        };

        this.details = [];
    }

    _fetchLaborsAndDetails = async () => {
        var that = this;
        let token = localStorage.getItem("_my.carbook.pro_token");
        let url = __API_URL__ + `/store_groups`;
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
            data.map((elem, index) => {
                elem.key = index;
            });
            that.details = data;
            that.setState({
                details: data,
            });
        })
        .catch(function(error) {
            console.log("error", error);
        });
    };

    _reloadOrderForm = (callback) => {
        var that = this;
        let token = localStorage.getItem("_my.carbook.pro_token");
        let url = __API_URL__;
        let params = `/orders/${this.props.orderId}?onlyLabors=true&onlyDetails=true`;
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
                console.log(data);
                if(callback) callback(data);
                that.setState({
                    fetchedOrder: data,
                })
            })
            .catch(function(error) {
                console.log("error", error);
            });
    }

    buildStoreGroupsTree() {
        var treeData = [];
        for (let i = 0; i < this.details.length; i++) {
            const parentGroup = this.details[ i ];
            treeData.push({
                title:      `${parentGroup.name} (#${parentGroup.id})`,
                name:       parentGroup.name,
                value:      parentGroup.id,
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

    componentDidMount() {
        this._reloadOrderForm();
        if (this.props.allDetails.brands.length) {
            this._fetchLaborsAndDetails();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(!this.state.fetchedOrder) {
            this._reloadOrderForm();
        }
        if(!this.state.detailsTreeData.length && this.details.length) {
            this.buildStoreGroupsTree();
        }
    }


    render() {
        const {
            orderFetching,
            isMobile,
            orderStatus,
            selectedClient,
            wrappedComponentRef,
            onStatusChange,
            user,
            orderTasks,
            orderHistory,
            orderId,
            allDetails,
            allServices,
            onClose,
            employees,
            fetchOrderForm,
            setAddClientModal,
            form,
            schedule,
            modal,
            resetModal,
            addClientFormData,
            stationLoads,
            searchClientsResult,
            managers,
            stations,
            cashSum,
        } = this.props;
        const { formatMessage } = this.props.intl;

        const { fetchedOrder } = this.state;
        const order = _.get(fetchedOrder, "order", {});

        console.log(this);

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

        const orderServices = _.get(fetchedOrder, "orderServices", []);
        const orderDetails = _.get(fetchedOrder, "orderDetails", []);
        
        return (
            <Form layout="horizontal">
                <Tabs
                    type='line'
                    size='default'
                >
                    <TabPane
                        forceRender
                        tab={formatMessage({
                            id: "add_order_form.general",
                            defaultMessage: "General",
                        })}
                        key="general"
                    >
                        <OrderMobileFormFields
                            form={form}
                            orderStatus={ orderStatus }
                            wrappedComponentRef={ wrappedComponentRef }
                            onStatusChange={ onStatusChange }
                            user={ user }
                            orderTasks={ orderTasks }
                            orderHistory={ orderHistory }
                            orderId={ orderId }
                            allDetails={ allDetails }
                            onClose={ onClose }
                            totalSum={ totalSum }
                            totalSumWithTax={ totalSumWithTax }
                            isTaxPayer={ isTaxPayer }
                            cashSum={ cashSum }
                            setAddClientModal={ setAddClientModal }
                            schedule={ schedule }
                            modal={ modal }
                            resetModal={ resetModal }
                            addClientFormData={ addClientFormData }
                            stationLoads={ stationLoads }
                            order={ order }
                            selectedClient={ selectedClient }
                            searchClientsResult={ searchClientsResult }
                            managers={ managers }
                            employees={ employees }
                            stations={ stations }
                            fetchedOrder={ fetchedOrder }
                        />
                    </TabPane>
                    <TabPane
                        forceRender
                        tab={`${formatMessage({
                            id: "add_order_form.services",
                            defaultMessage: "Services",
                        })} (${orderServices.length})`}
                        key="services"
                    >
                        <ServicesTable
                            orderFetching={orderFetching}
                            isMobile={isMobile}
                            orderId={ orderId }
                            user={user}
                            fetchedOrder={fetchedOrder}
                            orderServices={ orderServices }
                            employees={ employees }
                            defaultEmployeeId={this.props.order.employeeId}
                            labors={allServices}
                            details={this.details}
                            reloadOrderForm={()=>{
                                this._reloadOrderForm()
                            }}
                        />
                        <DiscountPanel
                            isMobile={isMobile}
                            form={form}
                            forbidden={isForbidden(user, permissions.ACCESS_ORDER_LABORS_DISCOUNTS)}
                            price={servicesSum}
                            discountFieldName={"servicesDiscount"}
                            fetchedOrder={fetchedOrder}
                            totalServicesProfit={servicesSumDiscount}
                            servicesMode
                            reloadOrderForm={()=>{
                                this._reloadOrderForm()
                            }}
                            orderId={ orderId }
                        />
                    </TabPane>
                    <TabPane
                        forceRender
                        tab={`${formatMessage({
                            id: "add_order_form.details",
                            defaultMessage: "Details",
                        })} (${orderDetails.length})`}
                        key="details"
                    >
                        <DetailsTable
                            orderFetching={orderFetching}
                            isMobile={isMobile}
                            orderId={orderId}
                            labors={allServices}
                            details={this.details}
                            orderDetails={orderDetails}
                            allDetails={allDetails}
                            user={user}
                            reloadOrderForm={()=>{
                                this._reloadOrderForm()
                            }}
                            detailsTreeData={this.state.detailsTreeData}
                        />
                        <DiscountPanel
                            isMobile={isMobile}
                            form={form}
                            forbidden={isForbidden(user, permissions.ACCESS_ORDER_DETAILS_DISCOUNTS)}
                            price={detailsSum}
                            discountFieldName={"detailsDiscount"}
                            fetchedOrder={fetchedOrder}
                            totalServicesProfit={detailsSumDiscount}
                            detailsMode
                            reloadOrderForm={()=>{
                                this._reloadOrderForm()
                            }}
                            orderId={ orderId }
                        />
                    </TabPane>
                    <TabPane
                        forceRender
                        tab={
                            formatMessage({
                                id: "order_form_table.history",
                            }) + ` (${orderHistory.orders.length})`
                        }
                        key="history"
                    >
                        <HistoryTable
                            isMobile={isMobile}
                            orderHistory={orderHistory}
                            fetchOrderForm={fetchOrderForm}
                            user={user}
                        />
                    </TabPane>
                </Tabs>
            </Form>
        )
    }
}