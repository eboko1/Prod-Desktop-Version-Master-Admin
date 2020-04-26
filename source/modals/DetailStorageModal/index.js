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
import { DetailSupplierModal } from 'modals'
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;


@injectIntl
class DetailStorageModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
        }
        this.columns = [
            {
                title:  'PHOTO',
                key:       'photo',
                dataIndex: 'photo',
                width:     '10%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <span>CODE</span>
                            <Input
                                allowClear
                            />
                            <Input
                                allowClear
                            />
                        </div>
                    )
                },
                key:       'code',
                dataIndex: 'code',
                width:     '15%',
                render: (data, elem)=>{
                    return(
                        <div>
                            <div>{data}</div>
                            <div>{elem.name}</div>
                        </div>
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <span>BRAND</span>
                            <Input
                                allowClear
                            />
                        </div>
                    )
                },
                key:       'brand',
                dataIndex: 'brandName',
                width:     '10%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <div>INFO</div>
                            <div style={{display: 'flex'}}><Input/><Input/></div>
                            <div style={{display: 'flex'}}><Input/><Input/></div>
                        </div>
                    )
                },
                key:       'info',
                dataIndex: 'info',
                width:     '25%',
            },
            {
                title:  "SUPPLIER",
                key:       'supplier',
                dataIndex: 'supplier',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            <Input
                                style={{maxWidth: 180}}
                                disabled
                                placeholder="SUPPLIER"
                            />
                            <DetailSupplierModal/>
                        </div>
                    )
                }
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '10%',
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <div>STORE</div>
                            <div><Checkbox/> В наличии</div>
                        </div>
                    )
                },
                key:       'store',
                dataIndex: 'store',
                width:     '10%',
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
        let params = `/store_products`;
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
            data.list.map((elem, i)=>{
                elem.key = i;
                elem.brandName = elem.brand.name;
            })
            that.setState({
                dataSource: data.list
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    
    componentWillMount() {
        this.fetchData();
    }

    render() {
        return (
            <div>
                <Button
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
export default DetailStorageModal;