// vendor
import React, { Component } from "react";
import { Table, InputNumber, Icon, Popconfirm, Select, Button, Input, Modal } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { Catcher } from "commons";
import { permissions, isForbidden, images } from 'utils';
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { DetailProductModal, FavouriteDetailsModal } from 'modals'

// own
import Styles from "./styles.m.css";
import { value } from "numeral";
const Option = Select.Option;

@injectIntl
export default class DetailsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productModalVisible: false,
            productModalKey: 0,
            dataSource: [],
        }

        this.updateDetail = this.updateDetail.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);

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
                                type='primary'
                                disabled={confirmed != "undefined" || this.props.disabled}
                                onClick={()=>{
                                    this.showDetailProductModal(data)
                                }}
                            >
                                <div
                                    style={{
                                        width: 18,
                                        height: 18,
                                        backgroundColor: confirmed != "undefined" || this.props.disabled ? 'black' : 'white',
                                        mask: `url(${images.partsIcon}) no-repeat center / contain`,
                                        WebkitMask: `url(${images.partsIcon}) no-repeat center / contain`,
                                    }}
                                ></div>
                            </Button>
                            {!(elem.detailName) ? 
                                <FavouriteDetailsModal
                                    disabled={this.props.disabled}
                                    user={this.props.user}
                                    tecdocId={this.props.tecdocId}
                                    orderId={this.props.orderId}
                                    brands={this.props.allDetails.brands}
                                    detail={this.state.dataSource[this.state.productModalKey]}
                                    updateDataSource={this.updateDataSource}
                                />
                            :
                                <QuickEditModal
                                    disabled={confirmed != "undefined" || !(elem.detailName) || this.props.disabled}
                                    detail={elem}
                                    onConfirm={this.updateDetail}
                                    tableKey={elem.key}
                                />
                            }
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
                title: <FormattedMessage id="order_form_table.supplier" />,
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
                title: <div title={this.props.intl.formatMessage({id: 'order_form_table.AI_title'})}>
                            <FormattedMessage id="order_form_table.AI" />
                        </div>,
                width: "3%",
                key: "AI",
                render: (elem)=>{
                    let color = 'brown',
                        title = 'Поставщик не выбран!';
                    if(elem.store){
                        title=  `Сегодня: ${elem.store[0]} шт.\n` +
                                `Завтра: ${elem.store[1]} шт.\n` +
                                `Послезавтра: ${elem.store[2]} шт.\n` +
                                `Позже: ${elem.store[3]} шт.`;
                        if(elem.store[0] != '0') {
                            color = 'rgb(81, 205, 102)';
                        }
                        else if(elem.store[1] != 0) {
                            color = 'yellow';
                        }
                        else if(elem.store[2] != 0) {
                            color = 'orange';
                        }
                        else if(elem.store[3] != 0) {
                            color = 'red';
                        }
                    }
                    else {
                        color = 'grey';
                        
                    }
                    
                    return (
                        <div
                            style={{borderRadius: '50%', width: 18, height: 18, backgroundColor: color}}
                            title={title}
                        ></div>
                    )
                }
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.purchasePrice" />
                        </div>,
                className: Styles.numberColumn,
                width: "5%",
                key: "purchasePrice",
                dataIndex: 'purchasePrice',
                render: (data) => {
                    let strVal = String(Math.round(data*10)/10);
                    return (
                        <span>
                            {data ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}
                        </span> 
                    )
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.price" />
                        </div>,
                className: Styles.numberColumn,
                width: "5%",
                key: "price",
                dataIndex: 'price',
                render: (data) => {
                    let strVal = String(Math.round(data*10)/10);
                    return (
                        <span>
                            {data ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}
                        </span> 
                    )
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.count" />
                        </div>,
                className: Styles.numberColumn,
                width: "5%",
                key: "count",
                dataIndex: 'count',
                render: (data) => {
                    return (
                        <span>
                            {data ? `${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0} <FormattedMessage id="pc" />
                        </span> 
                    )
                },
            },
            {
                title:  <div className={Styles.numberColumn}>
                            <FormattedMessage id="order_form_table.sum" />
                        </div>,
                className: Styles.numberColumn,
                width: "8%",
                key: "sum",
                dataIndex: 'sum',
                render: (data) => {
                    let strVal = String(Math.round(data*10)/10);
                    return (
                        <span>
                            {data ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}
                        </span> 
                    )
                },
            },
            {
                title:  <FormattedMessage id='order_form_table.status' />,
                width: "10%",
                key: 'agreement',
                dataIndex: 'agreement',
                render: (data, elem) => {
                    const key = elem.key;
                    const confirmed = data.toLowerCase();
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
                        <Select
                            disabled={isForbidden(
                                this.props.user,
                                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
                            )}
                            style={{color: color}}
                            value={confirmed}
                            onChange={(value)=>{
                                elem.agreement = value.toUpperCase();
                                this.updateDetail(key, elem);
                            }}
                        >
                            <Option key={0} value={'undefined'}>
                                <FormattedMessage id='status.undefined'/>
                            </Option>
                            <Option key={1} value={'agreed'} style={{color: 'rgb(81, 205, 102)'}}>
                                <FormattedMessage id='status.agreed'/>
                            </Option>
                            <Option key={2} value={'rejected'} style={{color: 'rgb(255, 126, 126)'}}>
                                <FormattedMessage id='status.rejected'/>
                            </Option>
                        </Select>
                    )
                },
            },
            {
                width: "2%",
                key: "favourite",
                render: (elem)=>{
                    return(
                        <Popconfirm
                            title={
                                elem.frequentDetailId ?
                                    <FormattedMessage id="add_order_form.favourite_remove" />
                                :
                                    <FormattedMessage id="add_order_form.favourite_confirm" />
                            }
                            onConfirm={async ()=>{
                                var that = this;
                                let token = localStorage.getItem('_my.carbook.pro_token');
                                let url = API_URL;
                                let params = `/orders/frequent/details`;
                                if(elem.frequentDetailId) params += `?ids=[${elem.frequentDetailId}]`;
                                else params += `?storeGroupIds=[${elem.storeGroupId}]`;
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method: elem.frequentDetailId ? 'DELETE' : 'POST',
                                        headers: {
                                            'Authorization': token,
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const result = await response.json();
                                    if(result.success) {
                                        that.updateDataSource();
                                    }
                                    else {
                                        console.log("BAD", result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            }}
                        >
                            <Icon
                                type="star"
                                theme={elem.frequentDetailId ? 'filled' : ''}
                                style={{color: 'gold', fontSize: 18}}
                            />
                        </Popconfirm>
                    )
                }
            },
            {
                width: "3%",
                key: "delete",
                render: (elem) => {
                    const confirmed = elem.agreement.toLowerCase();
                    const disabled = confirmed != "undefined" || this.props.disabled;
                    return (
                        <Popconfirm
                            disabled={disabled}
                            title={
                                <FormattedMessage id="add_order_form.delete_confirm" />
                            }
                            onConfirm={async ()=>{
                                var that = this;
                                let token = localStorage.getItem('_my.carbook.pro_token');
                                let url = API_URL;
                                let params = `/orders/${this.props.orderId}/details?ids=[${elem.id}] `;
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method: 'DELETE',
                                        headers: {
                                            'Authorization': token,
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const result = await response.json();
                                    if(result.success) {
                                        that.updateDataSource();
                                    }
                                    else {
                                        console.log("BAD", result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            }}
                        >
                            <Icon type="delete" className={disabled ? Styles.disabledIcon : Styles.deleteIcon} />
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

    updateDataSource() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}/details`;
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
            data.details.map((elem, index)=>{
                elem.key = index;
            })
            that.setState({
                dataSource: data.details,
            })
            that.props.reloadOrderForm();
        })
        .catch(function (error) {
            console.log('error', error)
        });
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
                    productCode: detail.detailCode ? detail.detailCode : null,
                    supplierId: detail.supplierId ? detail.supplierId : null,
                    supplierBrandId: detail.supplierBrandId ? detail.supplierBrandId : null,
                    brandName: detail.brandName ? detail.brandName : null,
                    purchasePrice: Math.round(detail.purchasePrice*10)/10 || 0,
                    count: detail.count ? detail.count : 1,
                    price: detail.price ? Math.round(detail.price*10)/10 : 1,
                    comment: detail.comment,
                }
            ]
        }
        if(!isForbidden(this.props.user, permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,)) {
            data.details[0].agreement = detail.agreement;
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
                this.props.reloadOrderForm();
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }

        await this.updateDataSource();

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
                    user={this.props.user}
                    tecdocId={this.props.tecdocId}
                    visible={this.state.productModalVisible}
                    orderId={this.props.orderId}
                    hideModal={()=>{this.hideDetailProductModal()}}
                    brands={this.props.allDetails.brands}
                    detail={this.state.dataSource[this.state.productModalKey]}
                    tableKey={this.state.productModalKey}
                    updateDetail={this.updateDetail}
                    updateDataSource={this.updateDataSource}
                />
            </Catcher>
        );
    }
}

class QuickEditModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible: false,
        }
        this.columns = [
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
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
                title:  <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            value={data ? Math.round(data*10)/10 : 0}
                            className={Styles.detailNumberInput}
                            min={0}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
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
                title:  <FormattedMessage id="order_form_table.price" />,
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            value={data ? Math.round(data*10)/10 : 0}
                            className={Styles.detailNumberInput}
                            min={0}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
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
                title:  <FormattedMessage id="order_form_table.count" />,
                key:       'count',
                dataIndex: 'count',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            value={data ? Math.round(data*10)/10 : 0}
                            className={Styles.detailNumberInput}
                            min={0.1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
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
                title:  <FormattedMessage id="order_form_table.sum" />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render: (data)=>{
                    return(
                        <InputNumber
                            disabled
                            className={Styles.detailNumberInput}
                            style={{color: 'black'}}
                            value={Math.round(data*10)/10}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
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
        this.props.onConfirm(this.props.tableKey, this.state.dataSource[0]);
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
                    type='primary'
                    disabled={this.props.disabled}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                            dataSource: [this.props.detail]
                        })
                    }}
                >
                    <div
                        style={{
                            width: 18,
                            height: 18,
                            backgroundColor: this.props.disabled ? 'black' : 'white',
                            mask: `url(${images.pencilIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.pencilIcon}) no-repeat center / contain`,
                        }}
                    ></div>
                </Button>
                <Modal
                    width='80%'
                    visible={this.state.visible}
                    title={<FormattedMessage id='order_form_table.quick_edit'/>}
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
