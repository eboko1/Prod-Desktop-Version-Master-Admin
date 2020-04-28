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


@injectIntl
class DetailStorageModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fetched: false,
            dataSource: [],
            brandFilter: [],
        }
        this.columns = [
            {
                title:  'PHOTO',
                key:       'photo',
                width:     '10%',
                render: (elem)=>{
                    const pictureName = elem.images[0].pictureName;
                    return(
                        <img
                            style={ { cursor: 'pointer' } }
                            onError={ e => {
                                e.target.onerror = null;
                                e.target.src = `${__TECDOC_IMAGES_URL__}/not_found.png`;
                            } }
                            width={ 75 }
                            src={ `${__TECDOC_IMAGES_URL__}/${
                                elem.supplierId
                            }/${pictureName}` }
                        />
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
                                    console.log(tmp);
                                    this.setState({
                                        brandFilter: tmp,
                                        update: true,
                                    });
                                }}
                            >
                                {this.props.brandOptions}
                            </Select>
                        </div>
                    )
                },
                key:       'brand',
                dataIndex: 'supplierName',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <>
                            <div>{data}</div>
                            <div>{getSupplier(elem.suplierId, elem.partNumber)}</div>
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
                key:       'description',
                dataIndex: 'description',
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
                render: (elem)=>{
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.props.onSelect(elem.partNumber);
                                this.setState({
                                    visible: false,
                                })
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
            visible: false,
        })
    };

    fetchData() {
        console.log(this.props.tecdocId, this.props.storeGroupId)
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
            console.log(data);
            data.map((elem, i)=>{
                elem.key = i;
            })
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
                        />
                </Modal>
            </div>
        )
    }
}
export default DetailStorageModal;