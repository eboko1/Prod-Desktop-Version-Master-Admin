// vendor
import React, { Component } from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, Spin, AutoComplete, Table, TreeSelect, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { permissions, isForbidden } from "utils";
import { AvailabilityIndicator } from 'components';
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


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
                sorter: (a, b) => a.partNumber.localeCompare(b.partNumber),
                sortDirections: ['descend', 'ascend'],
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
                sorter: (a, b) => a.brandName.localeCompare(b.brandName),
                sortDirections: ['descend', 'ascend'],
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
                    let strVal = String(Math.round(data*10)/10);
                    return (
                            data ? <span>{`${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span> : <FormattedMessage id="long_dash"/>
                    )
                },
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.price' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'price',
                width:     '10%',
                sorter: (a, b) => Number(a.purchasePrice) * Number(a.markup) - Number(b.purchasePrice) * Number(b.markup),
                sortDirections: ['descend', 'ascend'],
                render: (elem) => {
                    const price = Number(elem.purchasePrice) * Number(elem.markup);
                    let strVal = String(Math.round(price*10)/10);
                    return (
                        price ? <span>{`${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span> : <FormattedMessage id="long_dash"/>
                    )
                },
            },
            {
                title:  <div title={this.props.intl.formatMessage({id: 'order_form_table.AI_title'})}>
                            <FormattedMessage id="order_form_table.AI" />
                        </div>,
                key:       'store',
                width:     '10%',
                sorter: (a, b) => Number(a.availableIn0) - Number(b.availableIn0),
                sortDirections: ['descend', 'ascend'],
                render: (elem)=>{
                    return (
                        <AvailabilityIndicator
                            indexArray={[
                                elem.availableIn0,
                                elem.availableIn1,
                                elem.availableIn2,
                                elem.availableIn3,
                            ]}
                        />
                    )
                }
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
                                    this.props.onSelect(elem.businessSupplierId, elem.businessSupplierName, elem.supplierBrandId, elem.purchasePrice, price, store, elem.supplierOriginalCode, elem.supplierProductNumber, elem.supplierPartNumber, this.props.tableKey, elem.isFromStock, elem.defaultWarehouseId, elem.id, elem.brandId);
                                }
                                else {
                                    this.props.setStoreSupplier(elem.businessSupplierId, elem.businessSupplierName, elem.supplierBrandId, elem.purchasePrice, price, store, elem.supplierOriginalCode, elem.supplierProductNumber, elem.supplierPartNumber, this.props.keyValue, elem.isFromStock, elem.defaultWarehouseId, elem.id);
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
        let params = `/business_suppliers/pricelists?partNumber=${this.props.detailCode}&brandId=${this.props.brandId}`;
        if(this.props.storeGroupId) params += `&storeGroupId=${this.props.storeGroupId}`;
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
            data.map((elem, i)=>elem.key = i)
            that.setState({
                fetched: true,
                dataSource: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
            that.setState({
                fetched: true,
            })
        });
    }

    render() {
        const disabled = this.props.disabled || isForbidden(this.props.user, permissions.ACCESS_SUPPLIER_MODAL_WINDOW);
        return (
            <div>
                <Button
                    type='primary'
                    disabled={disabled}
                    onClick={()=>{
                        this.fetchData();
                        this.setState({
                            visible: true,
                        })
                    }}
                    title={this.props.intl.formatMessage({id: "details_table.details_supplier"})}
                >
                    <div
                        style={{
                            width: 18,
                            height: 18,
                            backgroundColor: disabled ? 'black' : 'white',
                            mask: `url(${images.deliveryTruckIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.deliveryTruckIcon}) no-repeat center / contain`,
                        }}
                    ></div>
                </Button>
                <Modal
                    width="85%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="order_form_table.supplier" />}
                    onCancel={this.handleCancel}
                    footer={null}
                    maskClosable={false}
                >
                    {this.state.fetched ? 
                        <Table
                            dataSource={this.state.dataSource}
                            columns={this.columns}
                            pagination={false}
                        />
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </div>
        )
    }
}
export default DetailSupplierModal;