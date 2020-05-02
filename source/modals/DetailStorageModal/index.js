// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, Spin, Table, TreeSelect, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { getSupplier } from 'components/PartSuggestions/supplierConfig.js';
import { DetailSupplierModal } from 'modals'
// own
import Styles from './styles.m.css';
const Option = Select.Option;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


@injectIntl
class DetailStorageModal extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fetched: false,
            dataSource: [],
            brandOptions: [],
            brandFilter: [],
            codeFilter: undefined,
            attributesFilters: [],
            inStock: false,
        }

        this.setSupplier = this.setSupplier.bind(this);

        this.columns = [
            {
                title:  <FormattedMessage id="photo" />,
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
                            <FormattedMessage id="order_form_table.detail_code" />
                            <Input
                                disabled
                                value={this.props.storeGroupId}
                            />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
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
                            <FormattedMessage id="order_form_table.brand" />
                            <Select
                                showSearch
                                mode="multiple"
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.brand'})}
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
                            <FormattedMessage id="order_form_table.info" />
                            <div style={{display: 'flex'}}>
                                {this.getAttributeFilter(1)}
                                {this.getAttributeFilter(2)}
                            </div>
                            <div style={{display: 'flex'}}>
                                {this.getAttributeFilter(3)}
                                {this.getAttributeFilter(4)}
                            </div>
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
                title:  <FormattedMessage id="order_form_table.supplier" />,
                key:       'businessSupplierName',
                dataIndex: 'businessSupplierName',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            <Input
                                style={{maxWidth: 180, color: 'black'}}
                                value={data}
                                disabled
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.supplier'})}
                            />
                            <DetailSupplierModal
                                setStoreSupplier={this.setSupplier}
                                keyValue={elem.key}
                                brandName={elem.supplierName}
                                detailCode={elem.partNumber}
                                storeGroupId={this.props.storeGroupId}
                            />
                        </div>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '6%',
                render: (data) => {
                    let strVal = String(Math.ceil(data));
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
                dataIndex: 'price',
                width:     '6%',
                render: (data) => {
                    let strVal = String(Math.ceil(data));
                    for(let i = strVal.length-3; i >= 0; i-=3) {
                        strVal =  strVal.substr(0,i) + ' ' +  strVal.substr(i);
                    }
                    return (
                        data ? <span>{strVal} <FormattedMessage id="cur" /></span> : <FormattedMessage id="long_dash"/>
                    );
                },
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.store" />
                            <div style={{fontWeight: '400', fontSize: 12}}>
                                <Checkbox
                                    checked={this.state.inStock}
                                    onChange={()=>{
                                        this.setState({
                                            inStock: !this.state.inStock,
                                        })
                                    }}
                                /> 
                                В наличии
                            </div>
                        </div>
                    )
                },
                key:       'store',
                dataIndex: 'store',
                width:     '8%',
                render: (store) => {
                    return (
                        store ? `${store[0]}/${store[1]}/${store[2]}/${store[3]}` : <FormattedMessage id="long_dash"/>
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
                                this.props.setSupplier(elem.bussinesSupplierId, elem.businessSupplierName, elem.purchasePrice, elem.price, elem.store);
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

    getAttributeFilter(key) {
        if(this.state.attributesFilters[`index${key}`] == undefined) return null;
        return( 
            <Select
                allowClear
                value={this.state.attributesFilters[`index${key}`].current}
                placeholder={this.state.attributesFilters[`index${key}`].description}
                style={{display: 'block', width: '50%', textTransform: 'capitalize'}}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", textTransform: 'capitalize' }}
                onChange={(value)=>{
                    this.state.attributesFilters[`index${key}`].current = value;
                    this.setState({
                        update: true,
                    })
                }}
            >
                {this.state.attributesFilters[`index${key}`].values.map((option, i)=>
                    <Option value={option} key={i}>
                        {option}
                    </Option>
                )}
            </Select>
        )
    }

    filterDataSourceByAttribute(data, key) {
        const { attributesFilters } = this.state;
        if(attributesFilters[`index${key}`] && attributesFilters[`index${key}`].current) {
            data = data.filter((elem)=>{
                const dataAttributes = elem.attributes.find((attr)=>attr.description==attributesFilters[`index${key}`].description);
                if(dataAttributes && dataAttributes.value == attributesFilters[`index${key}`].current) {
                    return true;
                }
                return false;
            });
        }
        return data;
    }

    setSupplier(supplierId, businessSupplierName, purchasePrice, price, store, key) {
        this.state.dataSource[key].bussinesSupplierId = supplierId;
        this.state.dataSource[key].businessSupplierName = businessSupplierName;
        this.state.dataSource[key].purchasePrice = purchasePrice;
        this.state.dataSource[key].price = price;
        this.state.dataSource[key].store = store;
        this.setState({
            update: true
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            fetched: false,
            dataSource: [],
            brandOptions: [],
            brandFilter: [],
            codeFilter: undefined,
            attributesFilters: [],
            inStock: false,
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
            data.map((elem, i)=>{
                elem.key = i;
                if(brandOptions.findIndex((brand)=>brand.id == elem.supplierId)==-1) {
                    if(that.props.brandFilter == elem.supplierName) {
                        that.state.brandFilter.push(elem.supplierId);
                    }
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
            that.setState({
                attributesFilters: {
                    index1: data[0],
                    index2: data[1],
                    index3: data[2],
                    index4: data[3],
                },
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { dataSource, brandFilter, codeFilter, inStock } = this.state;
        let tblData = [...dataSource];

        if(brandFilter.length) tblData = tblData.filter((elem)=>brandFilter.indexOf(elem.supplierId)!=-1);
        if(codeFilter) tblData = tblData.filter((elem)=>elem.partNumber.toLowerCase().indexOf(codeFilter.toLowerCase()) >= 0 );
        if(inStock) tblData = tblData.filter((elem)=>elem.store);
        tblData = this.filterDataSourceByAttribute(tblData, 1);
        tblData = this.filterDataSourceByAttribute(tblData, 2);
        tblData = this.filterDataSourceByAttribute(tblData, 3);
        tblData = this.filterDataSourceByAttribute(tblData, 4);

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
                            mask: `url(${images.bookIcon}) no-repeat center / contain`,
                            '-webkit-mask': `url(${images.bookIcon}) no-repeat center / contain`,
                        }}
                    ></div>
                </Button>
                <Modal
                    width="90%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="order_form_table.catalog" />}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {this.state.fetched ? 
                        <Table
                            rowClassName={Styles.tableRow}
                            pagination={{ pageSize: 6 }}
                            dataSource={tblData}
                            columns={this.columns}
                        />
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </div>
        )
    }
}
export default DetailStorageModal;