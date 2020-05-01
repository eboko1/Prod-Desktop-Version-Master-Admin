// vendor
import React, { Component } from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, AutoComplete, Table, TreeSelect, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import {
    API_URL,
    confirmDiagnostic,
    createAgreement,
    lockDiagnostic,
} from 'core/forms/orderDiagnosticForm/saga';
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
                title:  'CODE',
                key:       'code',
                dataIndex: 'partNumber',
                width:     '10%',
            },
            {
                title:  'SUPPLIER CODE',
                key:       'supplierCode',
                dataIndex: 'supplierPartNumber',
                width:     '10%',
            },
            {
                title:  'NAME',
                key:       'name',
                dataIndex: 'itemName',
                width:     '15%',
            },
            {
                title:  'BRAND',
                key:       'brand',
                dataIndex: 'brandName',
                width:     '15%',
            },
            {
                title:  'SUPPLIER',
                key:       'supplier',
                dataIndex: 'businessSupplierName',
                width:     '15%',
            },
            {
                title:  'DATE',
                key:       'date',
                dataIndex: 'pricelistDate',
                width:     '10%',
                render: (date)=>`${moment(date).format('YYYY-MM-DD')}`
            },
            {
                title:  "PURCHASE",
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
            },
            {
                title:  'STORE',
                key:       'store',
                width:     '10%',
                render: (elem)=>`${elem.availableIn0}/${elem.availableIn1}/${elem.availableIn2}/${elem.availableInx}`
            },
            {
                key:       'select',
                width:     'auto',
                render: (elem)=>{
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.props.onSelect(elem.businessSupplierName);
                                this.handleCancel();
                            }}
                        >
                            Select
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
        let params = `/business_suppliers/pricelists?partNumber=341822&brandName=KYB`;
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
            that.setState({
                fetched: true,
                dataSource: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    
    componentDidUpdate() {
        if(this.state.dataSource.length == 0 && !this.state.fetched) {
            this.fetchData();
        }
    }

    render() {
        return (
            <div>
                <Button
                    disabled={this.props.disabled}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                        })
                    }}
                >
                    <Icon type='check'/>
                </Button>
                <Modal
                    width="85%"
                    visible={this.state.visible}
                    title="STORAGE"
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