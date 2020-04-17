// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, AutoComplete, Table, TreeSelect } from 'antd';
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
class DetailProductModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mainTableSource: [
                {
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    sefl: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                }
            ],
            relatedDetailsSource: [
                {
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    sefl: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                },
                {
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    sefl: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                },
                {
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    sefl: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                },
            ],
            relatedServicesSource: [
                {
                    defaultName: undefined,
                    name: undefined,
                    comment: undefined,
                    employee: undefined,
                    hours: undefined,
                    sefl: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                }
            ]
        }
        this.labors = [];
        this.storeGroups = [];
        this.treeData = [];
        this.mainTableColumns = [
            {
                title:  "GROUP",
                key:       'storeGroup',
                dataIndex: 'storeGroup',
                width:     '15%',
                render: ()=>{
                    return (
                        <TreeSelect
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.treeData}
                            placeholder="Please select"
                            filterTreeNode={(input, node) => (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(node.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={(value, option)=>{
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
                
            },
            {
                title:  "NAME",
                key:       'name',
                dataIndex: 'name',
                width:     '20%',
                render: ()=>{
                    return (
                        <Input
                        />
                    )
                }
            },
            {
                title:  "COMMENT",
                key:       'comment',
                dataIndex: 'comment',
                width:     '10%',
                render: ()=>{
                    return (
                        <Button>
                            CMNT
                        </Button>
                    )
                }
            },
            {
                title:  "BRAND",
                key:       'brand',
                dataIndex: 'brand',
                width:     '13%',
                render: ()=>{
                    return (
                        <Select
                            widh="100%"
                        />
                    )
                }
            },
            {
                title:  "CODE",
                key:       'code',
                dataIndex: 'code',
                width:     '13%',
                render: ()=>{
                    return (
                        <Input
                        />
                    )
                }
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            min={0}
                        />
                    )
                }
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "COUNT",
                key:       'count',
                dataIndex: 'count',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "SUM",
                key:       'sum',
                dataIndex: 'sum',
                width:     '8%',
                render: ()=>{
                    return (
                        <InputNumber
                            disabled
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '3%',
                render: ()=>{
                    return (
                        <Icon
                            type="delete"
                        />
                    )
                }
            },
        ];
        this.relatedServicesColumns = [
            {
                title:  "SERVICE",
                key:       'defaultName',
                dataIndex: 'defaultName',
                width:     '15%',
                render: ()=>{
                    return (
                        <TreeSelect
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.treeData}
                            placeholder="Please select"
                            filterTreeNode={(input, node) => (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(node.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={(value, option)=>{
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
                
            },
            {
                title:  "NAME",
                key:       'name',
                dataIndex: 'name',
                width:     '20%',
                render: ()=>{
                    return (
                        <Input
                        />
                    )
                }
            },
            {
                title:  "COMMENT",
                key:       'comment',
                dataIndex: 'comment',
                width:     '10%',
                render: ()=>{
                    return (
                        <Button>
                            CMNT
                        </Button>
                    )
                }
            },
            {
                title:  "EMPLOYEE",
                key:       'employee',
                dataIndex: 'employee',
                width:     '13%',
                render: ()=>{
                    return (
                        <Select
                            widh="100%"
                        />
                    )
                }
            },
            {
                title:  "HOURS",
                key:       'hours',
                dataIndex: 'hours',
                width:     '13%',
                render: ()=>{
                    return (
                        <Input
                        />
                    )
                }
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            min={0}
                        />
                    )
                }
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "COUNT",
                key:       'count',
                dataIndex: 'count',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "SUM",
                key:       'sum',
                dataIndex: 'sum',
                width:     '8%',
                render: ()=>{
                    return (
                        <InputNumber
                            disabled
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '3%',
                render: ()=>{
                    return (
                        <Icon
                            type="delete"
                        />
                    )
                }
            },
        ]
    }

    handleOk = () => {
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.props.hideModal();
    };

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/labors`;
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
            data.labors.map((elem, index)=>{
                elem.key = index;
                elem.laborCode = `${elem.masterLaborId}-${elem.productId}`;
            })
            that.labors = data.labors;
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/store_groups`;
        url = API_URL + params;
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
            that.storeGroups = data;
            that.buildStoreGroupsTree();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    buildStoreGroupsTree() {
        var treeData = [];
        for(let i = 0; i < this.storeGroups.length; i++) {
            const parentGroup = this.storeGroups[i];
            treeData.push({
                title: parentGroup.name,
                value: parentGroup.id,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: childGroup.name,
                    value: childGroup.id,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: lastNode.name,
                        value: lastNode.id,
                        key: `${i}-${j}-${k}`,
                    })
                }
            }
        }
        console.log('buildStoreGroupsTree', treeData);
        this.treeData = treeData;
    }

    componentWillMount() {
        this.fetchData();
    }

    render() {
        console.log(this);
        const { visible } = this.props;
        return (
            <div>
                <Modal
                    width="85%"
                    visible={visible}
                    title="PRODUCT"
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <span>Узел/деталь</span>
                        </div>
                        <Table
                            style={{width: "90%"}}
                            dataSource={this.state.mainTableSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <span>Сопутствующие товары</span>
                        </div>
                        <Table
                            style={{width: "90%"}}
                            dataSource={this.state.relatedDetailsSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <span>Сопутствующие работы</span>
                        </div>
                        <Table
                            style={{width: "90%"}}
                            dataSource={this.state.relatedServicesSource}
                            columns={this.relatedServicesColumns}
                            pagination={false}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}
export default DetailProductModal;