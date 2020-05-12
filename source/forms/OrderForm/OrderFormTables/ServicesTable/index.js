// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, InputNumber, Icon, Popconfirm, Select, Input, Button, Modal } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { images } from 'utils';
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { FavouriteServicesModal, AddServiceModal } from 'modals'

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
class ServicesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceModalVisible: false,
            serviceModalKey: 0,
            dataSource: [],
        }

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
                                disabled={confirmed != "undefined"}
                                onClick={()=>{
                                    this.showServiceProductModal(data)
                                }}
                            >
                                <div
                                    style={{
                                        width: 18,
                                        height: 18,
                                        backgroundColor: 'white',
                                        mask: `url(${images.partsIcon}) no-repeat center / contain`,
                                        WebkitMask: `url(${images.partsIcon}) no-repeat center / contain`,
                                    }}
                                ></div>
                            </Button>
                            {!(elem.laborId) ? 
                                <FavouriteServicesModal
                                    tecdocId={this.props.tecdocId}
                                    orderId={this.props.orderId}
                                    updateDataSource={this.updateDataSource}
                                />
                            :
                                <PriceCountModal
                                    disabled={confirmed != "undefined" || !(elem.laborId)}
                                    detail={elem}
                                    onConfirm={this.updateDetail}
                                    detailKey={elem.key}
                                />
                            }
                        </div>
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.service_type" />,
                width: "15%",
                key: "defaultName",
                dataIndex: 'defaultName',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.detail_name" />,
                width: "15%",
                key: "serviceName",
                dataIndex: 'serviceName',
                render: (data) => {
                        return (
                            data ? data : <FormattedMessage id="long_dash"/>
                        )
                },
            },
            {
                title: <FormattedMessage id="order_form_table.master" />,
                width: "10%",
                key: "employeeId",
                dataIndex: 'employeeId',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title: <FormattedMessage id="order_form_table.prime_cost" />,
                width: "8%",
                key: "purchasePrice",
                dataIndex: 'purchasePrice',
                render: (data) => {
                    let strVal = String(Math.round(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="cur" />
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
                    let strVal = String(Math.round(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="cur" />
                        </span> 
                    )
                },
            },
            {
                title: <FormattedMessage id="hours" />,
                width: "8%",
                key: "hours",
                dataIndex: 'hours',
                render: (data) => {
                    let strVal = String(data);
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="order_form_table.hours_short" />
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
                    let strVal = String(Math.round(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        <span>
                            {data ? strVal : 0} <FormattedMessage id="cur" />
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
                width: "2%",
                key: "favourite",
                render: (elem)=>{
                    return(
                        <Popconfirm
                            title={
                                <FormattedMessage id="add_order_form.favourite_confirm" />
                            }
                            onConfirm={async ()=>{
                                this.state.dataSource[elem.key].frequentLaborId = !Boolean(this.state.dataSource[elem.key].frequentLaborId);
                                    this.setState({
                                        update: true,
                                    })
                            }}
                        >
                            <Icon
                                type="star"
                                theme={elem.frequentLaborId ? 'filled' : ''}
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
                    return (
                        <Popconfirm
                            title={
                                <FormattedMessage id="add_order_form.delete_confirm" />
                            }
                            onConfirm={async ()=>{
                                var that = this;
                                let token = localStorage.getItem('_my.carbook.pro_token');
                                let url = API_URL;
                                let params = `/orders/${this.props.orderId}/labors?ids=[${elem.id}] `;
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
                            <Icon type="delete" className={Styles.deleteIcon} />
                        </Popconfirm>
                    );
                },
            },
        ]
    }

    showServiceProductModal(key) {
        this.setState({
            serviceModalVisible: true,
            serviceModalKey: key,
        })
    }
    hideServicelProductModal() {
        this.setState({
            serviceModalVisible: false,
        })
    }

    updateDataSource() {
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
            console.log(data);
            data.labors.map((elem, index)=>{
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
        /*this.state.dataSource[key] = detail;
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
                    purchasePrice: detail.purchasePrice,
                    count: detail.count,
                    price: detail.price,
                    comment: detail.comment,
                }
            ]
        }
        console.log(data);
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
        })*/
    }

    componentDidMount() {
        let tmp = [...this.props.orderServices];
        tmp.map((elem,i)=>elem.key=i);
        this.setState({
            dataSource: tmp,
        })
    }

    render() {
        console.log(this.props.orderServices);
        if(this.state.dataSource.length == 0  || this.state.dataSource[this.state.dataSource.length-1].serviceName != undefined) {
            this.state.dataSource.push({
                key: this.state.dataSource.length,
                id: undefined,
                laborId: undefined,
                serviceName: undefined,
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
                    className={ Styles.serviceTable }
                    dataSource={ this.state.dataSource }
                    columns={ this.columns }
                    pagination={false}
                />
                <AddServiceModal
                    visible={this.state.serviceModalVisible}
                    labor={this.state.dataSource[this.state.serviceModalKey]}
                    hideModal={()=>this.hideServicelProductModal()}
                    orderId={this.props.orderId}
                />
            </Catcher>
        );
    }
}

export default ServicesTable;

class PriceCountModal extends React.Component{
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
                            value={data ? data : 0}
                            min={0}
                            formatter={(value)=>{
                                let strVal = String(Math.round(value));
                                for(let i = strVal.length-3; i >= 0; i-=3) {
                                    strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                                }
                                return strVal;
                            }}
                            parser={value => value.replace(' ', '')}
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
                            value={data ? data : 0}
                            min={0}
                            formatter={(value)=>{
                                let strVal = String(Math.round(value));
                                for(let i = strVal.length-3; i >= 0; i-=3) {
                                    strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                                }
                                return strVal;
                            }}
                            parser={value => value.replace(' ', '')}
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
                            value={data ? data : 0}
                            min={0}
                            formatter={(value)=>{
                                let strVal = String(value);
                                for(let i = strVal.length-3; i >= 0; i-=3) {
                                    strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                                }
                                return strVal;
                            }}
                            parser={value => value.replace(' ', '')}
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
                            style={{color: 'black'}}
                            value={data}
                            formatter={(value)=>{
                                let strVal = String(Math.round(value));
                                for(let i = strVal.length-3; i >= 0; i-=3) {
                                    strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                                }
                                return strVal;
                            }}
                            parser={value => value.replace(' ', '')}
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