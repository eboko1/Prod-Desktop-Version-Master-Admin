// vendor
import React, { Component } from 'react';
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
            visible: false,
            dataSource: [
                {
                    key: 0,
                    storeGroup: "undefined",
                    name: "undefined",
                    brand: "undefined",
                    code: "undefined",
                    self: "undefined",
                    price: "undefined",
                    store: "undefined",
                    sum: "undefined",
                }
            ],
        }
        this.columns = [
            {
                title:  'CODE',
                key:       'code',
                dataIndex: 'code',
                width:     '30%',
            },
            {
                title:  'BRAND',
                key:       'brand',
                dataIndex: 'brand',
                width:     '30%',
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '15%',
            },
            {
                title:  'STORE',
                key:       'store',
                dataIndex: 'store',
                width:     '15%',
            },
            {
                key:       'select',
                width:     'auto',
                render: ()=>{
                    return (
                        <Button
                            type="primary"
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
            visible: false,
        })
    };

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/tecdoc/products/suppliers`;
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
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    
    componentWillMount() {
        //this.fetchData();
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
                    width="75%"
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