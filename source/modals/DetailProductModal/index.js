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
import { images } from 'utils';
import { DetailStorageModal, DetailSupplierModal } from 'modals'
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const Option = Select.Option;

@injectIntl
class DetailProductModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            mainTableSource: [],
            relatedDetailsSource: [
                /*{
                    key: 0,
                    id: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    self: 0,
                    price: 1,
                    count: 1,
                    sum: undefined,
                },
                {
                    key: 1,
                    id: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    self: 0,
                    price: 1,
                    count: 1,
                    sum: undefined,
                },
                {
                    key: 2,
                    id: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    self: 0,
                    price: 1,
                    count: 1,
                    sum: undefined,
                },*/
            ],
            relatedServicesSource: [
                {
                    key: 0,
                    laborId: undefined,
                    defaultName: undefined,
                    name: undefined,
                    comment: undefined,
                    employee: undefined,
                    hours: undefined,
                    self: 0,
                    price: 1,
                    count: 1,
                    sum: undefined,
                }
            ],
            groupSearchValue: "",
        }
        this.labors = [];
        this.storeGroups = [];
        this.treeData = [];
        this.brandOptions = [];
        this.servicesOptions = [];
        this.relatedDetailsOptions = [];

        this.setCode = this.setCode.bind(this);
        this.setComment = this.setComment.bind(this);

        this.mainTableColumns = [
            {
                title:  "GROUP",
                key:       'storeGroupId',
                dataIndex: 'storeGroupId',
                width:     '12%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled={this.state.editing}
                            showSearch
                            placeholder="GROUP"
                            style={{maxWidth: 180}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.treeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.mainTableSource[0].storeGroupId = value;
                                this.state.mainTableSource[0].detailName = option.props.name;
                                this.filterOptions(value);
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
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
                render: (data, elem)=>{
                    return (
                        <Input
                            disabled={elem.storeGroupId == null}
                            placeholder="NAME"
                            style={{minWidth: 150}}
                            value={data}
                            onChange={(event)=>{
                                this.state.mainTableSource[0].detailName = event.target.value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "COMMENT",
                key:       'comment',
                dataIndex: 'comment',
                width:     '5%',
                render: (data, elem)=>{
                    const detail = {
                        name: this.state.mainTableSource[0].detailName,
                    }
                    return (
                        <CommentaryButton
                            disabled={elem.storeGroupId == null}
                            commentary={{comment: data}}
                            detail={detail}
                            setComment={this.setComment}
                        />
                    )
                }
            },
            {
                title:  "BRAND",
                key:       'brandId',
                dataIndex: 'brandId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <Select
                            showSearch
                            disabled={elem.storeGroupId == null}
                            placeholder="BRAND"
                            value={data ? data : undefined}
                            style={{maxWidth: 180}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.mainTableSource[0].brandId = value;
                                this.state.mainTableSource[0].brandName = option.props.children;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.brandOptions}
                        </Select>
                    )
                }
            },
            {
                title:  "CODE",
                key:       'detailCode',
                dataIndex: 'detailCode',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            <Input
                                style={{maxWidth: 180, color: 'black'}}
                                disabled
                                placeholder="CODE"
                                value={data}
                            />
                            <DetailStorageModal
                                onSelect={this.setCode}
                                disabled={elem.storeGroupId == null}
                                brandOptions={this.brandOptions}
                                tecdocId={this.props.tecdocId}
                                storeGroupId={this.state.mainTableSource[0].storeGroupId}
                            />
                        </div>
                    )
                }
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
                                style={{maxWidth: 180, color: 'black'}}
                                disabled
                                placeholder="SUPPLIER"
                                value={data}
                            />
                            <DetailSupplierModal
                                disabled={elem.storeGroupId == null}    
                            />
                        </div>
                    )
                }
            },
            {
                title:  "ИН",
                key:       'in',
                width:     '3%',
                render: ()=>{
                    return (
                        <div style={{borderRadius: '50%', width: 18, height: 18, backgroundColor: 'rgb(81, 205, 102)'}}></div>
                    )
                }
            },
            {
                title:  "SELF",
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            value={data || 0}
                            min={0}
                            onChange={(value)=>{
                                this.state.mainTableSource[0].purchasePrice = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            value={data || 1}
                            min={1}
                            onChange={(value)=>{
                                this.state.mainTableSource[0].price = value;
                                this.state.mainTableSource[0].sum = value * this.state.mainTableSource[0].count;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "COUNT",
                key:       'count',
                dataIndex: 'count',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            value={data || 1}
                            min={1}
                            onChange={(value)=>{
                                this.state.mainTableSource[0].count = value;
                                this.state.mainTableSource[0].sum = value * this.state.mainTableSource[0].price;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "SUM",
                key:       'sum',
                width:     '5%',
                render: (elem)=>{
                    const sum = this.state.mainTableSource[0].price *  this.state.mainTableSource[0].count;
                    return (
                        <InputNumber
                            disabled
                            value={sum ? sum : 1}
                            style={{color: "black"}}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '3%',
                render: (elem)=>{
                    return (
                        <Icon
                            type="close"
                            onClick={()=>{
                                this.state.mainTableSource[0].storeGroupId = this.state.editing ? elem.storeGroupId : undefined;
                                this.state.mainTableSource[0].detailName = undefined;
                                this.state.mainTableSource[0].comment = undefined;
                                this.state.mainTableSource[0].brandId = undefined;
                                this.state.mainTableSource[0].brandName = undefined;
                                this.state.mainTableSource[0].detailCode = undefined;
                                this.state.mainTableSource[0].purchasePrice = 0;
                                this.state.mainTableSource[0].price = 1;
                                this.state.mainTableSource[0].count = 1;
                                this.state.mainTableSource[0].sum = undefined;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
        ];

        this.relatedDetailsColumns = [
            {
                title:  "GROUP",
                key:       'id',
                dataIndex: 'id',
                width:     '15%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <TreeSelect
                            allowClear
                            showSearch
                            placeholder="GROUP"
                            style={{maxWidth: 180}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.treeData}
                            filterTreeNode={(input, node) => (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(node.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={(value, option)=>{
                                this.state.relatedDetailsSource[key].id = value;
                                this.state.relatedDetailsSource[key].name = option.props.name;
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
                width:     '25%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            placeholder="NAME"
                            value={data}
                            onChange={(value)=>{
                                this.state.relatedDetailsSource[key].name = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "COMMENT",
                key:       'comment',
                dataIndex: 'comment',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    const detail = {
                        name: "test",
                    }
                    const comment = {
                        comment: null,
                    }
                    return (
                        <CommentaryButton
                            commentary={comment}
                            detail={detail}
                        />
                    )
                }
            },
            {
                title:  "BRAND",
                key:       'brand',
                dataIndex: 'brand',
                width:     '15%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Select
                            allowClear
                            placeholder="BRAND"
                            value={data}
                            style={{maxWidth: 180}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            onSelect={(value)=>{
                                this.state.relatedDetailsSource[key].brand = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.brandOptions}
                        </Select>
                    )
                }
            },
            {
                title:  "CODE",
                key:       'code',
                dataIndex: 'code',
                width:     '15%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            style={{maxWidth: 180}}
                            disabled={elem.id == null}
                            placeholder="CODE"
                            value={data}
                            onChange={(event)=>{
                                this.state.relatedDetailsSource[key].code = event.target.value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 0}
                            min={0}
                            onChange={(value)=>{
                                this.state.relatedDetailsSource[key].self = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 1}
                            min={1}
                            onChange={(value)=>{
                                this.state.relatedDetailsSource[key].price = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "COUNT",
                key:       'count',
                dataIndex: 'count',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 1}
                            min={1}
                            onChange={(value)=>{
                                this.state.relatedDetailsSource[key].count = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "SUM",
                key:       'sum',
                width:     '7%',
                render: (elem)=>{
                    const key = elem.key;
                    const sum = this.state.relatedDetailsSource[key].price *  this.state.relatedDetailsSource[key].count;
                    return (
                        <InputNumber
                            disabled
                            value={sum ? sum : 1}
                            style={{color: "black"}}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '3%',
                render: (elem)=>{
                    const key = elem.key;
                    return (
                        <Icon
                            type="delete"
                            onClick={()=>{
                                this.state.relatedDetailsSource[key] = {
                                    key: key,
                                    id: undefined,
                                    name: undefined,
                                    comment: undefined,
                                    brand: undefined,
                                    code: undefined,
                                    self: 0,
                                    price: 1,
                                    count: 1,
                                    sum: undefined,
                                }
                                this.setState({
                                    update: true
                                })
                            }}
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
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Select
                            allowClear
                            showSearch
                            placeholder="SERVICE"
                            value={data}
                            style={{maxWidth: 180}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            filterOption={(input, option)=>(
                                String(option.props.value).toLowerCase().includes(input.toLocaleLowerCase()) ||
                                option.props.children.toLowerCase().includes(input.toLocaleLowerCase())
                            )}
                            onSelect={(value, option)=>{
                                this.state.relatedServicesSource[key].defaultName = option.props.children;
                                this.state.relatedServicesSource[key].laborId = value;
                                this.state.relatedServicesSource[key].name = option.props.children;
                                this.state.relatedServicesSource[key].price = option.props.price;
                                this.state.relatedServicesSource[key].hours = option.props.norm_hours;
                                this.state.relatedServicesSource.push({
                                    key: this.state.relatedServicesSource.length,
                                    laborId: undefined,
                                    defaultName: undefined,
                                    name: undefined,
                                    comment: undefined,
                                    employee: undefined,
                                    hours: undefined,
                                    self: 0,
                                    price: 1,
                                    count: 1,
                                    sum: undefined,
                                })
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.servicesOptions}
                        </Select>
                    )
                }
                
            },
            {
                title:  "NAME",
                key:       'name',
                dataIndex: 'name',
                width:     '25%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            placeholder="NAME"
                            value={data}
                            style={{minWidth: 180}}
                            onChange={(value)=>{
                                this.state.relatedServicesSource[key].name = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "COMMENT",
                key:       'comment',
                dataIndex: 'comment',
                width:     '5%',
                render: ()=>{
                    const detail = {
                        name: "test",
                    }
                    const comment = {
                        comment: null,
                    }
                    return (
                        <CommentaryButton
                            commentary={comment}
                            detail={detail}
                        />
                    )
                }
            },
            {
                title:  "HOURS",
                key:       'hours',
                dataIndex: 'hours',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <div style={{display: 'flex'}}>
                            <InputNumber
                                placeholder="HOURS"
                                value={data || 1}
                                onChange={(value)=>{
                                    this.state.relatedServicesSource[key].hours = value;
                                    this.setState({
                                        update: true
                                    })
                                }}
                            />
                            <Button>
                                <Icon type='check'/>
                            </Button>
                        </div>
                    )
                }
            },
            {
                title:  "EMPLOYEE",
                key:       'employee',
                dataIndex: 'employee',
                width:     '15%',
                render: ()=>{
                    return (
                        <Select
                            allowClear
                            placeholder="EMPLOYEE"
                            style={{maxWidth: 180}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                        />
                    )
                }
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 0}
                            min={0}
                            onChange={(value)=>{
                                this.state.relatedServicesSource[key].self = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 1}
                            min={1}
                            onChange={(value)=>{
                                this.state.relatedServicesSource[key].price = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "COUNT",
                key:       'count',
                dataIndex: 'count',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            value={data || 1}
                            min={1}
                            onChange={(value)=>{
                                this.state.relatedServicesSource[key].count = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  "SUM",
                key:       'sum',
                width:     '7%',
                render: (elem)=>{
                    const key = elem.key;
                    const sum = this.state.relatedServicesSource[key].price * this.state.relatedServicesSource[key].count;
                    return (
                        <InputNumber
                            disabled
                            value={sum ? sum : 1}
                            style={{color: "black"}}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '3%',
                render: (elem)=>{
                    const key = elem.key;
                    return (
                        <Icon
                            type="delete"
                            onClick={()=>{
                                if(this.state.relatedServicesSource.length == 1) {
                                    this.state.relatedServicesSource[key]={
                                        key: key,
                                        laborId: undefined,
                                        defaultName: undefined,
                                        name: undefined,
                                        comment: undefined,
                                        employee: undefined,
                                        hours: undefined,
                                        self: 0,
                                        price: 1,
                                        count: 1,
                                        sum: undefined,
                                    }
                                }
                                else {
                                    this.state.relatedServicesSource = [...this.state.relatedServicesSource.filter((_, i)=>i!=key)];
                                    this.state.relatedServicesSource.map((elem, index)=>elem.key=index);
                                }
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
        ]
    }

    handleOk = () => {
        if(this.state.editing) {
            this.props.updateDetail(this.props.tableKey, {...this.state.mainTableSource[0]});
        }
        else {
            var data = {
                insertMode: true,
                details: [],
                services: [],
            }
            this.state.mainTableSource.map((element)=>{
                data.details.push({
                    storeGroupId: element.storeGroupId,
                    productId: element.productId,
                    detailCode: element.detailCode,
                    brandId: element.brandId,
                    purchasePrice: element.purchasePrice,
                    count: element.count,
                    price: element.price,
                })
            });
            this.state.relatedServicesSource.map((element)=>{
                if(element.laborId) {
                    data.services.push({
                        serviceId: element.laborId,
                        serviceHours: element.hours ? element.hours : 1,
                        servicePrice: element.price ? element.price : 0,
                    })
                }
            });
            console.log(data);
            this.addDetailsAndLabors(data);
            window.location.reload();
        }
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.props.hideModal();
    };

    setCode(code) {
        this.state.mainTableSource[0].detailCode = code;
        this.setState({
            update: true
        })
    }

    setComment(comment) {
        this.state.mainTableSource[0].comment = comment;
        this.setState({
            update: true
        })
    }

    async addDetailsAndLabors(data) {
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
                console.log("OK", result);
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

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
            that.getOptions();
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
                title: `${parentGroup.name} (#${parentGroup.id})`,
                name: parentGroup.name,
                value: parentGroup.id,
                className: Styles.groupTreeOption,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: `${childGroup.name} (#${childGroup.id})`,
                    name: childGroup.name,
                    value: childGroup.id,
                    className: Styles.groupTreeOption,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: `${lastNode.name} (#${lastNode.id})`,
                        name: lastNode.name,
                        value: lastNode.id,
                        className: Styles.groupTreeOption,
                        key: `${i}-${j}-${k}`,
                        children: [],
                    })
                    for(let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[l];
                        treeData[i].children[j].children[k].children.push({
                            title: `${elem.name} (#${elem.id})`,
                            name: elem.name,
                            value: elem.id,
                            className: Styles.groupTreeOption,
                            key: `${i}-${j}-${k}-${l}`,
                        })
                    }
                }
            }
        }
        this.treeData = treeData;
    }

    getOptions() {
        this.brandOptions = this.props.brands.map((elem, index)=>(
            <Option key={index} value={elem.brandId} supplier_id={elem.supplierId}>
                {elem.brandName}
            </Option>
        ));

        this.servicesOptions = this.labors.map((elem, index)=>(
            <Option key={index} value={elem.laborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                {elem.name ? elem.name : elem.defaultName}
            </Option>
        ));
    };

    filterOptions(id) {
        const servicesOptions = [];
        this.labors.map((elem, index)=>{
            if(elem.productId == id) {
                servicesOptions.push(
                    <Option key={index} value={elem.laborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                        {elem.name ? elem.name : elem.defaultName}
                    </Option>
                )
            }
            else return;
        });

        this.servicesOptions = [...servicesOptions];
    }

    componentWillMount() {
        this.fetchData();
    }

    componentDidUpdate(prevState) {
        if(prevState.visible == false && this.props.visible) {
            const editing = Boolean(this.props.detail.storeGroupId);
            this.setState({
                editing: editing,
                mainTableSource: [{...this.props.detail}],
            })
        }
    }

    render() {
        const { visible } = this.props;
        return (
            <div>
                <Modal
                    width="95%"
                    visible={visible}
                    title="PRODUCT"
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    <div>
                        Сопутствующие: детали <Checkbox/> работы <Checkbox/>
                    </div>
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <div style={{display: 'block'}}>Узел/деталь</div>
                        </div>
                        <Table
                            dataSource={this.state.mainTableSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                    {this.state.mainTableSource.length && this.state.mainTableSource[0].storeGroupId && !this.state.editing ? 
                        <>
                            {this.relatedDetailsOptions.length == 0 ?
                            <div className={Styles.tableWrap}>
                                <div className={Styles.modalSectionTitle}>
                                    <span>Сопутствующие товары</span>
                                </div>
                                <Table
                                    dataSource={this.state.relatedDetailsSource}
                                    columns={this.relatedDetailsColumns}
                                    pagination={false}
                                />
                            </div> : null}
                            {this.servicesOptions.length ?
                                <div className={Styles.tableWrap}>
                                    <div className={Styles.modalSectionTitle}>
                                        <span>Сопутствующие работы</span>
                                    </div>
                                    <Table
                                        dataSource={this.state.relatedServicesSource}
                                        columns={this.relatedServicesColumns}
                                        pagination={false}
                                    />
                                </div> : null
                            }
                        </> : null
                    }
                </Modal>
            </div>
        )
    }
}
export default DetailProductModal;

@injectIntl
class CommentaryButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            problems: undefined,
            currentCommentaryProps: {
                rcl: null,
                fcl: null,
                io: null,
                tb: null,
                side: [],
                front: [],
                back: [],
                problems: [],
                mm:null,
                percent: null,
                deg: null,
            },
            currentCommentary: null,
        }
        this.commentaryInput = React.createRef();
    }

    showModal = () => {
        this.setState({
            currentCommentary: this.props.commentary.comment?this.props.commentary.comment:this.state.currentCommentary,
            visible: true,
        });
        if(this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    };

    handleOk = () => {
        this.props.setComment(this.state.currentCommentary);
        this.setState({
            visible: false,
        });
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            currentCommentary: null, 
        });
    };

    rendetHeader = () => {
        return (
            <div>
              <p>
                  {this.props.detail.name}
              </p>
            </div>
          );
    }

    setCurrentCommentaryProps(key, value) {
        const { detail } = this.props;
        if(key == "mm" || key == "percent" || key == "deg" || key == "problems") {
            if(this.state.currentCommentaryProps[key] == value) {
                this.state.currentCommentaryProps[key] = null;
            }
            else {
                this.state.currentCommentaryProps[key] = value;
            }
        }
        else {
            if(this.state.currentCommentaryProps[key].indexOf(value) != -1) {
                this.state.currentCommentaryProps[key] = [...this.state.currentCommentaryProps[key]].filter((data) => data != value);;
            }
            else {
                this.state.currentCommentaryProps[key].push(value);
            }
        }

        const { side, back, front, problems, mm, percent, deg } = this.state.currentCommentaryProps;
        var commentary = `${detail.name} - `;
        if(side.length) commentary += ` ${side.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(front.length) commentary += ` ${front.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(back.length) commentary += ` ${back.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(problems.length) commentary += ` ${problems.map((data)=>data)}. `;
        if(mm) commentary += ` ${mm}mm. `;
        if(percent) commentary += ` ${percent}%. `;
        if(deg) commentary += ` ${deg}°. `;


        this.setState({
            currentCommentary: commentary,
        });
    }

    componentDidMount() {
        this.state.currentCommentaryProps.mm = this.props.commentary.mm ? this.props.commentary.mm : 0;
        this.state.currentCommentaryProps.percent = this.props.commentary.percent ? this.props.commentary.percent : 0;
        this.state.currentCommentaryProps.deg = this.props.commentary.deg ? this.props.commentary.deg : 0;
    }

    componentDidUpdate() {
        
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading, currentCommentaryProps, currentCommentary } = this.state;
        const { commentary } = this.props;
        const { disabled } = this.props;
        return (
            <div>
                {commentary.comment ? (
                    <Button
                        className={Styles.commentaryButton}
                        onClick={this.showModal}
                    >
                        <Icon
                            className={Styles.commentaryButtonIcon}
                            style={{color: "rgba(0, 0, 0, 0.65)"}}
                            type="form"/>
                    </Button>
                ) : (
                    <Button
                        disabled={disabled}
                        type="primary"
                        onClick={this.showModal}
                    >
                        <Icon type="message" />
                    </Button>
                )}
                <Modal
                    visible={visible}
                    title={this.rendetHeader()}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={disabled?(
                        null
                        ):([
                            <Button key="back" onClick={this.handleCancel}>
                                {<FormattedMessage id='cancel' />}
                            </Button>,
                            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                {<FormattedMessage id='save' />}
                            </Button>,
                        ])
                    }
                >
                    {!disabled ? 
                    <div className={Styles.commentaryContentWrap}>
                        <div className={Styles.commentaryVehicleSchemeWrap}>
                            <div style={{
                                width: "360px",
                                height: "160px",
                                margin: "0 auto",
                                position: "relative",
                                backgroundImage: `url('${images.vehicleSchemeSide}')`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("TOP") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'TOP')}}
                                >
                                    <FormattedMessage id='TOP'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("REAR") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", left: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'REAR')}}
                                >
                                    <FormattedMessage id='REAR'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("BOTTOM") != -1 ? null : "primary"}
                                    style={{position: "absolute", bottom: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'BOTTOM')}}
                                >
                                    <FormattedMessage id='BOTTOM'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("FRONT") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", right: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'FRONT')}}
                                >
                                    <FormattedMessage id='FRONT'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("MIDDLE") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'MIDDLE')}}
                                >
                                    <FormattedMessage id='MIDDLE'/>
                                </Button>
                            </div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <div style={{
                                    width: "180px",
                                    height: "160px",
                                    position: "relative",
                                    backgroundImage: `url('${images.vehicleSchemeBack}')`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("LEFT") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "0%", bottom: "0%"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'LEFT')}}
                                    >
                                        <FormattedMessage id='LEFT'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("CENTER") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", bottom: "50%", transform: "translate(-50%, 50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'CENTER')}}
                                    >
                                        <FormattedMessage id='CENTER'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("RIGHT") != -1 ? null : "primary"}
                                        style={{position: "absolute", right: "0%", bottom: "0%"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'RIGHT')}}
                                    >
                                        <FormattedMessage id='RIGHT'/>
                                    </Button>
                                </div>
                                <div style={{
                                    width: "180px",
                                    height: "160px",
                                    position: "relative",
                                    backgroundImage: `url('${images.vehicleSchemeFront}')`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}>
                                    <Button
                                        type={currentCommentaryProps.front.indexOf("IN") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'IN')}}
                                    >
                                        <FormattedMessage id='IN'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.front.indexOf("OUT") != -1 ? null : "primary"}
                                        style={{position: "absolute", right: "0%", top: "50%", transform: "translateY(-50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'OUT')}}
                                    >
                                        <FormattedMessage id='OUT'/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className={Styles.commentarySectionHeader}>Параметры:</p>
                            <div style={{display: "flex"}}>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.mm || 0}
                                        formatter={value => `${value} mm.`}
                                        parser={value => value.replace(' %', '')}
                                        onChange={(mm)=>{this.setCurrentCommentaryProps('mm', mm)}}
                                    />
                                </div>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.percent || 0}
                                        formatter={value => `${value} %`}
                                        parser={value => value.replace(' %', '')}
                                        onChange={(percent)=>{this.setCurrentCommentaryProps('percent', percent)}}
                                    /> 
                                </div>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.deg || 0}
                                        formatter={value => `${value} °`}
                                        parser={value => value.replace(' °', '')}
                                        onChange={(deg)=>{this.setCurrentCommentaryProps('deg', deg)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div> : null}
                    <div>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='order_form_table.diagnostic.commentary' />:
                        </p>
                        <TextArea
                            disabled={disabled}
                            value={currentCommentary}
                            placeholder={`${this.props.intl.formatMessage({id: 'comment'})}...`}
                            autoFocus
                            onChange={()=>{
                                this.setState({
                                    currentCommentary: event.target.value,
                                });
                            }}
                            style={{width: '100%', minHeight: '150px', resize:'none'}}
                            ref={this.commentaryInput}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}