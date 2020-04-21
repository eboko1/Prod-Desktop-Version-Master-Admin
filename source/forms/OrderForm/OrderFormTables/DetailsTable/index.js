// vendor
import React, { Component } from "react";
import { Table, InputNumber, Icon, Popconfirm, Select, Button, Input, Modal } from "antd";
import { defaultMemoize } from "reselect";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { MODALS } from "core/modals/duck";

import { Catcher } from "commons";
import { TecDocActionsContainer } from "containers";
import {
    DecoratedInput,
    DecoratedInputNumber,
    LimitedDecoratedSelect,
    DecoratedSelect,
    DecoratedCheckbox,
    DecoratedAutoComplete,
} from "forms/DecoratedFields";
import {
    permissions,
    isForbidden,
    CachedInvoke,
    numeralFormatter,
    numeralParser,
} from "utils";
import { DetailProductModal, DetailStorageModal } from 'modals'

// own
import Styles from "./styles.m.css";
const Option = Select.Option;

@injectIntl
export default class DetailsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productModalVisible: false,
            productModalKey: 0,
            storageModalVisible: false,
            storageModalKey: 0,
            dataSource: [],
        }

        this.updateDetail = this.updateDetail.bind(this);

        this.details = this.props.allDetails.details.map(
            ({ id, name }) => (
                <Option value={String(id)} key={`allDetails-${id}`}>
                    {name}
                </Option>
            ),
        );

        this.brands = this.props.allDetails.brands.map(
            ({ supplierId, brandId, brandName }) => (
                <Option value={String(brandId)} key={`allBrands-${brandId}`}>
                    {brandName}
                </Option>
            ),
        );

        this.columns = [
            {
                width: "20%",
                key: "buttonGroup",
                dataIndex: "key",
                render: (data, elem) => {
                    const confirmed = elem.agreement.toLowerCase();
                    return (
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            <Button
                                disabled={confirmed != "undefined"}
                                onClick={()=>{
                                    this.showDetailProductModal(data)
                                }}
                            >
                                <span>ТОВАР</span>
                            </Button>
                            <Button
                                disabled={confirmed != "undefined"}
                                onClick={()=>{
                                    this.showDetailStorageModal(data)
                                }}
                            >
                                <span>СКЛАД</span>
                            </Button>
                            <Button
                                disabled={confirmed != "undefined"}
                            >
                                <span>КАТАЛОГ</span>
                            </Button>
                        </div>
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.detail_name" />,
                width: "15%",
                key: "detail",
                dataIndex: 'detailName',
                render: (data) => {
                        return (
                            data ? data : <FormattedMessage id="long_dash"/>
                        )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.brand" />,
                width: "10%",
                key: "brand",
                dataIndex: 'brandName',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.detail_code" />,
                width: "10%",
                key: "code",
                dataIndex: 'detailCode',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.purchasePrice" />,
                width: "8%",
                key: "purchasePrice",
                dataIndex: 'purchasePrice',
                render: (data) => {
                    return (
                        <span>
                            {data ? data : 0} <FormattedMessage id="cur" />
                        </span> 
                    )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.price" />,
                width: "8%",
                key: "price",
                dataIndex: 'price',
                render: (data) => {
                    return (
                        <span>
                            {data ? data : 0} <FormattedMessage id="cur" />
                        </span> 
                    )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.count" />,
                width: "8%",
                key: "count",
                dataIndex: 'count',
                render: (data) => {
                    return (
                        <span>
                            {data ? data : 0} <FormattedMessage id="pc" />
                        </span> 
                    )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.sum" />,
                width: "10%",
                key: "sum",
                dataIndex: 'sum',
                render: (data) => {
                    return (
                        <span>
                            {data ? data : 0} <FormattedMessage id="cur" />
                        </span> 
                    )
                },
            },
            {
                title:  <FormattedMessage id='order_form_table.status' />,
                width: "8%",
                key: 'agreement',
                dataIndex: 'agreement',
                render: (data, elem) => {
                    const key = elem.key;
                    const confirmed = this.state.dataSource[key].agreement.toLowerCase();
                    let color;
                    switch(confirmed) {
                        case "rejected":
                            color = 'rgb(255, 126, 126)';
                            break;
                        case "agreed":
                            color = 'rgb(81, 205, 102)';
                            break;
                        default:
                            color = null;
                    }
                    return (
                        <Input
                            disabled
                            style={{color: color}}
                            value={this.props.intl.formatMessage({
                                id: `status.${confirmed}`,
                            })}
                        />
                    )
                },
            },
            {
                title: "",
                width: "3%",
                key: "delete",
                render: () => {
                    return (
                        <Popconfirm
                            title={
                                <FormattedMessage id="add_order_form.delete_confirm" />
                            }
                            onConfirm={()=>{
                                alert('d')
                            }}
                        >
                            <Icon type="delete" className={Styles.deleteIcon} />
                        </Popconfirm>
                    );
                },
            },
        ]
    }

    showDetailProductModal(key) {
        this.setState({
            productModalVisible: true,
            productModalKey: key,
        })
    }
    hideDetailProductModal() {
        this.setState({
            productModalVisible: false,
        })
    }

    showDetailStorageModal(key) {
        this.setState({
            storageModalVisible: true,
            storageModalKey: key,
        })
    }
    hideDetailStorageModal() {
        this.setState({
            storageModalVisible: false,
        })
    }

    updateDetail(key, detail) {
        this.state.dataSource[key] = detail;
        this.setState({
            update: true,
        })
    }

    componentDidMount() {
        let tmp = [...this.props.orderDetails];
        tmp.map((elem,i)=>elem.key=i);
        this.setState({
            dataSource: tmp,
        })
    }

    render() {
        const columns = this.columns;
        if(this.state.dataSource.length == 0  || this.state.dataSource[this.state.dataSource.length-1].detailName != undefined) {
            this.state.dataSource.push({
                key: this.state.dataSource.length,
                id: undefined,
                storeGroupId: undefined,
                detailId: undefined,
                detailName: undefined,
                detailCode: undefined,
                brandId: undefined,
                brandName: undefined,
                comment: undefined,
                count: 0,
                price: 0,
                purchasePrice: 0,
                sum: 0,
                agreement: "UNDEFINED",
            })
        }

        return (
            <Catcher>
                <Table
                    className={Styles.detailsTable}
                    loading={
                        this.props.detailsSuggestionsFetching ||
                        this.props.suggestionsFetching
                    }
                    columns={columns}
                    dataSource={this.state.dataSource}
                    pagination={false}
                />
                <DetailProductModal
                    visible={this.state.productModalVisible}
                    orderId={this.props.orderId}
                    hideModal={()=>{this.hideDetailProductModal()}}
                    brands={this.props.allDetails.brands}
                    detail={this.state.dataSource[this.state.productModalKey]}
                    tableKey={this.state.productModalKey}
                    updateDetail={this.updateDetail}
                />
                <DetailStorageModal
                    visible={this.state.storageModalVisible}
                    hideModal={()=>{this.hideDetailStorageModal()}}
                />
            </Catcher>
        );
    }
}
