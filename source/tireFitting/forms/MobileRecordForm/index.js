// vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import {
    Form,
    Button,
    Input,
    Select,
    Modal,
    Icon,
    Upload,
    notification,
    InputNumber,
    Tabs,
} from "antd";
import { v4 } from "uuid";
import _ from "lodash";
import moment from "moment";

// proj
import { OrderMobileForm } from './OrderMobileForm';
import book from "routes/book";
import { onChangeOrderForm } from "core/forms/orderForm/duck";

import { permissions, isForbidden } from "utils";

import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
    HistoryTable,
} from "../OrderForm/OrderFormTables";

const Option = Select.Option;
const TabPane = Tabs.TabPane;

@injectIntl
export class MobileRecordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detailsTreeData: [],
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

    componentDidMount() {;
        if (this.props.allDetails.brands.length) {
            this._fetchLaborsAndDetails();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(!this.state.detailsTreeData.length && this.details.length) {
            this.buildStoreGroupsTree();
        }
    }


    render() {
        const {
            isMobile,
            orderStatus,
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
            fetchedOrder,
            order,
            fetchOrderForm,
        } = this.props;
        const { formatMessage } = this.props.intl;

        const orderServices = _.get(fetchedOrder, "orderServices", []);
        const orderDetails = _.get(fetchedOrder, "orderDetails", []);

        var orderServicesSize = 0,
            orderDetailsSize = 0;

        orderServices.map((x)=>{if(x.id) orderServicesSize++});
        orderDetails.map((x)=>{if(x.id) orderDetailsSize++});

        var countDetails = orderServices.length,
            priceDetails = 0,
            totalDetailsProfit = 0,
            detailsDiscount = order.detailsDiscount;
        for (let i = 0; i < orderDetails.length; i++) {
            if (orderDetails[i].agreement != "REJECTED") {
                priceDetails += orderDetails[i].sum;
                totalDetailsProfit +=
                    orderDetails[i].sum -
                    (orderDetails[i].sum * detailsDiscount) / 100 -
                    orderDetails[i].purchasePrice *
                        orderDetails[i].count;
            }
        }
        priceDetails = Math.round(priceDetails);
        totalDetailsProfit = Math.round(totalDetailsProfit);

        var countServices = orderServices.length,
            priceServices = 0,
            totalServicesProfit = 0,
            servicesDiscount = order.servicesDiscount;
        for (let i = 0; i < orderServices.length; i++) {
            if (orderServices[i].agreement != "REJECTED") {
                priceServices += orderServices[i].sum;
                totalServicesProfit +=
                    orderServices[i].sum -
                    (orderServices[i].sum * servicesDiscount) / 100 -
                    orderServices[i].purchasePrice *
                        orderServices[i].count;
            }
        }
        priceServices = Math.round(priceServices);
        totalServicesProfit = Math.round(totalServicesProfit);

        console.log(this);

        return (
            <Tabs

            >
                <TabPane
                    forceRender
                    tab={formatMessage({
                        id: "add_order_form.general",
                        defaultMessage: "General",
                    })}
                    key="general"
                >
                    <OrderMobileForm
                        orderStatus={ orderStatus }
                        wrappedComponentRef={ wrappedComponentRef }
                        onStatusChange={ onStatusChange }
                        user={ user }
                        orderTasks={ orderTasks }
                        orderHistory={ orderHistory }
                        orderId={ orderId }
                        allDetails={ allDetails }
                        onClose={ onClose }
                    />
                </TabPane>
                <TabPane
                    forceRender
                    tab={`${formatMessage({
                        id: "add_order_form.services",
                        defaultMessage: "Services",
                    })} (${orderServicesSize})`}
                    key="services"
                >
                    <ServicesTable
                        isMobile={isMobile}
                        orderId={ orderId }
                        user={user}
                        fetchedOrder={fetchedOrder}
                        orderServices={ orderServices }
                        employees={ employees }
                        defaultEmployeeId={this.props.order.employeeId}
                        labors={allServices}
                        details={this.details}
                    />
                </TabPane>
                <TabPane
                    forceRender
                    tab={`${formatMessage({
                        id: "add_order_form.details",
                        defaultMessage: "Details",
                    })} (${orderDetailsSize})`}
                    key="details"
                >
                    <DetailsTable
                        isMobile={isMobile}
                        orderId={orderId}
                        labors={allServices}
                        details={this.details}
                        orderDetails={orderDetails}
                        allDetails={allDetails}
                        user={user}
                        reloadOrderForm={this.props.reloadOrderForm}
                        detailsTreeData={this.state.detailsTreeData}
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
        )
    }
}