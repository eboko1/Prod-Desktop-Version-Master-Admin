// vendor
import React, { Component } from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, AutoComplete, Table, TreeSelect, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;


@injectIntl
class DetailSupplierModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            visible: false,
            dataSource: [],
        }
        this.columns = [
            {
                title:  <FormattedMessage id="order_form_table.detail_code" />,
                key:       'code',
                dataIndex: 'partNumber',
                width:     '10%',
            },
            {
                title:  <FormattedMessage id="order_form_table.supplier_code" />,
                key:       'supplierCode',
                dataIndex: 'supplierPartNumber',
                width:     '10%',
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'name',
                dataIndex: 'itemName',
                width:     '15%',
            },
            {
                title:  <FormattedMessage id="order_form_table.brand" />,
                key:       'brand',
                dataIndex: 'brandName',
                width:     '10%',
            },
            {
                title:  <FormattedMessage id="order_form_table.supplier" />,
                key:       'supplier',
                dataIndex: 'businessSupplierName',
                width:     '10%',
            },
            {
                title:  <FormattedMessage id="date" />,
                key:       'date',
                dataIndex: 'pricelistDate',
                width:     '10%',
                render: (date)=>`${moment(date).format('YYYY-MM-DD')}`
            },
            {
                title:  <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
                render: (data) => {
                    let strVal = String(Math.round(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        data ? <span>{strVal} <FormattedMessage id="cur" /></span> : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title:  <FormattedMessage id="order_form_table.price" />,
                key:       'price',
                width:     '10%',
                render: (elem) => {
                    const price = Number(elem.purchasePrice) * Number(elem.markup);
                    let strVal = String(Math.round(price));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        elem.markup ? <span>{strVal} <FormattedMessage id="cur" /></span> : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title:  <FormattedMessage id="order_form_table.store" />,
                key:       'store',
                width:     '10%',
                render: (elem)=>`${elem.availableIn0}/${elem.availableIn1}/${elem.availableIn2}/${elem.availableInx}`
            },
            {
                key:       'select',
                width:     'auto',
                render: (elem)=>{
                    const markup = elem.markup ? elem.markup : 1.4;
                    const price = Number(elem.purchasePrice) * Number(markup);
                    const store = [elem.availableIn0, elem.availableIn1, elem.availableIn2, elem.availableInx];
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                if(this.props.onSelect) {
                                    this.props.onSelect(elem.businessSupplierId, elem.businessSupplierName, elem.supplierBrandId, elem.purchasePrice, price, store);
                                }
                                else {
                                    this.props.setStoreSupplier(elem.businessSupplierId, elem.businessSupplierName, elem.supplierBrandId, elem.purchasePrice, price, store, this.props.keyValue);
                                }
                                this.handleCancel();
                            }}
                        >
                            <FormattedMessage id="select" />
                        </Button>
                    )
                }
            },
        ];
    }

    handleCancel = () => {
        this.setState({
            fetched: false,
            dataSource: [],
            visible: false,
        })
    };

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/business_suppliers/pricelists?partNumber=${this.props.detailCode}&brandId=${this.props.brandId}&storeGroupId=${this.props.storeGroupId}`;
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
            data.map((elem, i)=>elem.key = i)
            that.setState({
                fetched: true,
                dataSource: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    render() {
        return (
            <div>
                <Button
                    type='primary'
                    disabled={this.props.disabled}
                    onClick={()=>{
                        this.fetchData();
                        this.setState({
                            visible: true,
                        })
                    }}
                >
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            backgroundColor: this.props.disabled ? 'black' : 'white',
                            mask: `url(${images.craneIcon}) no-repeat center / contain`,
                            '-webkit-mask': `url(${images.craneIcon}) no-repeat center / contain`,
                        }}
                    ></div>
                </Button>
                <Modal
                    width="85%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="order_form_table.supplier" />}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                        <Table
                            dataSource={this.state.dataSource}
                            columns={this.columns}
                            pagination={false}
                        />
                </Modal>
            </div>
        )
    }
}
export default DetailSupplierModal;