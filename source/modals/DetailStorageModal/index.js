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
class DetailStorageModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
                {
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
                title:  ()=>{
                    return (
                        <div>
                            <span>CODE</span>
                            <Input
                                allowClear
                            />
                        </div>
                    )
                },
                key:       'code',
                dataIndex: 'code',
                width:     '12%',
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
                dataIndex: 'brand',
                width:     '12%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <span>GROUP</span>
                            <Input
                                allowClear
                            />
                        </div>
                    )
                },
                key:       'storeGroup',
                dataIndex: 'storeGroup',
                width:     '15%',
                
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <span>NAME</span>
                            <Input
                                allowClear
                            />
                        </div>
                    )
                },
                key:       'name',
                dataIndex: 'name',
                width:     '20%',
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '6%',
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '6%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <span>STORE </span>
                            <Checkbox/>
                        </div>
                    )
                },
                key:       'store',
                dataIndex: 'store',
                width:     '6%',
            },
            {
                title:  "SUM",
                key:       'sum',
                dataIndex: 'sum',
                width:     '8%',
            },
            {
                key:       'select',
                width:     '5%',
                render: ()=>{
                    return (
                        <Button>
                            Select
                        </Button>
                    )
                }
            },
        ];
    }
    
    handleCancel = () => {
        this.props.hideModal();
    };
    
    componentWillMount() {
    }

    render() {
        const { visible } = this.props;
        return (
            <div>
                <Modal
                    width="85%"
                    visible={visible}
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