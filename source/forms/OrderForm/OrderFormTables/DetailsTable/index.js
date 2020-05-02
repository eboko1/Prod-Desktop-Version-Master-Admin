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
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { DetailProductModal } from 'modals'

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
                width: "8%",
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
                                <Icon type="check"/>
                            </Button>
                            <PriceCountModal
                                disabled={confirmed != "undefined" || !(elem.storeGroupId)}
                                detail={elem}
                                onConfirm={this.updateDetail}
                                detailKey={elem.key}
                            />
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
                title: <FormattedMessage id="SUPPLIER" />,
                width: "10%",
                key: "supplierName",
                dataIndex: 'supplierName',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="ИН" />,
                width: "3%",
                key: "in",
                render: () => {
                    return (
                       <div style={{borderRadius: '50%', width: 18, height: 18, backgroundColor: 'rgb(81, 205, 102)'}}></div>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.purchasePrice" />,
                width: "5%",
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
                width: "5%",
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
                width: "5%",
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
                                alert('delete')
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

    async updateDetail(key, detail) {
        this.state.dataSource[key] = detail;
        const data = {
            updateMode: true,
            details: [
                {
                    id: detail.id,
                    storeGroupId: detail.storeGroupId,
                    name: detail.detailName,
                    productCode: detail.detailCode,
                    supplierBrandId: detail.brandId,
                    brandName: detail.brandName,
                    purchasePrice: detail.purchasePrice,
                    count: detail.count,
                    price: detail.price,
                    comment: detail.comment,
                }
            ]
        }

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if(result.success) {
                //console.log("OK", result);
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }

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
                    tecdocId={this.props.tecdocId}
                    visible={this.state.productModalVisible}
                    orderId={this.props.orderId}
                    hideModal={()=>{this.hideDetailProductModal()}}
                    brands={this.props.allDetails.brands}
                    detail={this.state.dataSource[this.state.productModalKey]}
                    tableKey={this.state.productModalKey}
                    updateDetail={this.updateDetail}
                />
            </Catcher>
        );
    }
}

class PriceCountModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible: false,
        }
        this.columns = [
            {
                title:  'NAME',
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
            },
            {
                title: <FormattedMessage id="order_form_table.brand" />,
                width: "20%",
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
                width: "20%",
                key: "code",
                dataIndex: 'detailCode',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title:  'PURCHASE',
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            value={data ? data : 0}
                            onChange={(value)=>{
                                this.state.dataSource[0].purchasePrice = value;
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  'PRICE',
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            value={data ? data : 0}
                            onChange={(value)=>{
                                this.state.dataSource[0].price = value;
                                this.state.dataSource[0].sum = value * this.state.dataSource[0].count;
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  'COUNT',
                key:       'count',
                dataIndex: 'count',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            value={data ? data : 0}
                            onChange={(value)=>{
                                this.state.dataSource[0].count = value;
                                this.state.dataSource[0].sum = value * this.state.dataSource[0].price;
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  'SUM',
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            disabled
                            style={{color: 'black'}}
                            value={data}
                        />
                    )
                }
            },
        ]
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.onConfirm(this.props.detailKey, this.state.dataSource[0]);
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    render() {
        return(
            <>
                <Button
                    disabled={this.props.disabled}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                            dataSource: [this.props.detail]
                        })
                    }}
                >
                    <Icon type="check"/>
                </Button>
                <Modal
                    width='80%'
                    visible={this.state.visible}
                    title='priceEdit'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                        <Table
                            columns={this.columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                        />
                </Modal>
            </>
        )
    }
}
