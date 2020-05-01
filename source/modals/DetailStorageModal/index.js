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
import { getSupplier } from 'components/PartSuggestions/supplierConfig.js';
import { DetailSupplierModal } from 'modals'
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const Option = Select.Option;


@injectIntl
class DetailStorageModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fetched: false,
            dataSource: [],
            brandOptions: [],
            brandFilter: [],
            codeFilter: undefined,
        }
        this.columns = [
            {
                title:  'PHOTO',
                key:       'photo',
                width:     '10%',
                render: (elem)=>{
                    const src = elem.images[0] ? 
                        `${__TECDOC_IMAGES_URL__}/${elem.supplierId}/${elem.images[0].pictureName}` : 
                        `${__TECDOC_IMAGES_URL__}/not_found.png`;
                    return(
                        <div style={{verticalAlign: 'middle'}}>
                            <img
                                style={ { cursor: 'pointer' } }
                                width={ 80 }
                                src={ src }
                                onError={ e => {
                                    e.target.onerror = null;
                                    e.target.src = `${__TECDOC_IMAGES_URL__}/not_found.png`;
                                } }
                            />
                        </div>
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <span>CODE</span>
                            <Input
                                disabled
                                value={this.props.storeGroupId}
                            />
                            <Input
                                allowClear
                                placeholder='CODE'
                                value={this.state.codeFilter}
                                onChange={(event)=>{
                                    this.setState({
                                        codeFilter: event.target.value,
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'code',
                dataIndex: 'partNumber',
                width:     '15%',
                render: (data, elem)=>{
                    return(
                        <div>
                            <div style={{fontWeight: 'bold'}}>{data}</div>
                            <div>{elem.description}</div>
                        </div>
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <span>BRAND</span>
                            <Select
                                allowClear
                                showSearch
                                mode="multiple"
                                placeholder="BRAND"
                                value={this.state.brandFilter}
                                style={{minWidth: 130}}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                                filterOption={(input, option) => {
                                    return (
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                        String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                    )
                                }}
                                onSelect={(value, option)=>{
                                    this.state.brandFilter.push(value);
                                    this.setState({
                                        update: true,
                                    });
                                }}
                                onDeselect={(value, option)=>{
                                    const index = this.state.brandFilter.indexOf(value);
                                    const tmp = this.state.brandFilter.filter((_, i)=>i!=index);
                                    this.setState({
                                        brandFilter: tmp,
                                        update: true,
                                    });
                                }}
                            >
                                {this.state.brandOptions.map((elem, i)=>(
                                    <Option key={i} value={elem.id}>
                                        {elem.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    )
                },
                key:       'brand',
                dataIndex: 'supplierName',
                width:     '10%',
                render: (data, elem)=>{
                    //<div>{getSupplier(elem.suplierId, elem.partNumber)}</div>
                    return (
                        <>
                            <div>{data}</div>
                        </>
                    )
                }
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
                key:       'attributes',
                dataIndex: 'attributes',
                width:     '25%',
                render: (attributes)=>(
                    attributes.map((attribute, i)=>(
                        <div key={i}>
                            <span style={{fontWeight: 'bold'}}>{attribute.description}: </span>
                            <span>{attribute.value}</span>
                        </div>
                    ))
                )
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
                width:     '6%',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '6%',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <div>STORE</div>
                            <div style={{fontWeight: '400', fontSize: 12}}><Checkbox/> В наличии</div>
                        </div>
                    )
                },
                key:       'store',
                dataIndex: 'store',
                width:     '8%',
                render: (data) => {
                    return (
                        data ? data : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                key:       'select',
                width:     '5%',
                render: (elem)=>{
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.props.onSelect(elem.partNumber, elem.supplierName);
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
            dataSource: [],
            visible: false,
            fetched: false,
            brandOptions: [],
            brandFilter: [],
            codeFilter: undefined,
        })
    };

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/tecdoc/products/parts?modificationId=${this.props.tecdocId}&storeGroupId=${this.props.storeGroupId}`;
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
            var brandOptions = [];
            console.log(data);
            data.map((elem, i)=>{
                elem.key = i;
                if(brandOptions.findIndex((brand)=>brand.id == elem.supplierId)==-1) {
                    brandOptions.push({
                        id: elem.supplierId,
                        name: elem.supplierName,
                    })
                }
            })
            that.setState({
                fetched: true,
                dataSource: data,
                brandOptions: brandOptions,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/tecdoc/filtering_attributes?modificationId=${this.props.tecdocId}&storeGroupId=${this.props.storeGroupId}`;
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
            console.log(data);
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
        const { dataSource, brandFilter, codeFilter } = this.state;
        let tblData = [...dataSource];
        if(brandFilter.length) tblData = tblData.filter((elem)=>brandFilter.indexOf(elem.supplierId)!=-1);
        if(codeFilter) tblData = tblData.filter((elem)=>elem.partNumber.toLowerCase().indexOf(codeFilter.toLowerCase()) >= 0 );
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
                    width="90%"
                    visible={this.state.visible}
                    title="STORAGE"
                    onCancel={this.handleCancel}
                    footer={null}
                >
                        <Table
                            rowClassName={Styles.tableRow}
                            pagination={{ pageSize: 6 }}
                            dataSource={tblData}
                            columns={this.columns}
                        />
                </Modal>
            </div>
        )
    }
}
export default DetailStorageModal;