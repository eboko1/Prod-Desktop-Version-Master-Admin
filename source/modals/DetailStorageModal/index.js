// vendor
import React, { Component } from 'react';
import { Button, Modal, Icon, Select, Input, InputNumber, Spin, Table, TreeSelect, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { permissions, isForbidden, fetchAPI } from "utils";
import { DetailSupplierModal, StoreProductTrackingModal } from 'modals';
import { AvailabilityIndicator, WarehouseSelect } from 'components';
// own
import Styles from './styles.m.css';
const { info } = Modal;
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
            storeOptions: [],
            storeFilter: undefined,
            brandOptions: [],
            brandFilter: [],
            codeFilter: undefined,
            attributesFilters: [],
            inStock: false,
            reserveModalVisible: false,
            reserveModalData: undefined,
        }

        this.setSupplier = this.setSupplier.bind(this);

        this.columns = [
            {
                title:  <FormattedMessage id="photo" />,
                key:       'photo',
                render: (elem)=>{
                    const src = elem.images[0] ? 
                        `${__TECDOC_IMAGES_URL__}/${elem.supplierId}/${elem.images[0].pictureName}` : 
                        `${__TECDOC_IMAGES_URL__}/not_found.png`;
                    return(
                        <PhotoModal
                            src={src}
                            attributes={elem.attributes}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.detail_code" />
                            {this.state.storeOptions.length ? 
                                <Select
                                    showSearch
                                    value={this.state.storeFilter}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 380 }}
                                    placeholder={this.props.intl.formatMessage({id: 'order_form_table.store_group'})}
                                    filterOption={(input, option) => {
                                        return (
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                            String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                        )
                                    }}
                                    onSelect={(value, option)=>{
                                        this.setState({
                                            storeFilter: value,
                                        });
                                    }}
                                >
                                    {this.state.storeOptions.map((elem, i)=>(
                                        <Option key={i} value={elem.id}>
                                            {elem.name}
                                        </Option>
                                    ))}
                                </Select> : null
                            }
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
                sorter: (a, b) => a.partNumber.localeCompare(b.partNumber),
                sortDirections: ['descend', 'ascend'],
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
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
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
                sorter: (a, b) => a.supplierName && a.supplierName.localeCompare(b.supplierName),
                sortDirections: ['descend', 'ascend'],
                render: (data, elem)=>{
                    //<div>{getSupplier(elem.suplierId, elem.partNumber)}</div>
                    return (
                       <div>{data}</div>
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
                render: (attributes, elem)=>{
                    let title = '';
                    let data = '';
                    for (let i = 0; i < attributes.length; i++) {
                        const attribute = attributes[i];
                        title += `${attribute.description}: ${attribute.value}\n`;
                        data += `${attribute.value}`;
                        if( i == attributes.length-1) {
                            data += '. ';
                        }
                        else {
                            data += ', ';
                        }
                    }
                    data += elem.productId + '.';
                    return (
                        <div
                            title={title}
                            style={{textTransform: 'capitalize'}}
                        >
                            {data}
                        </div>
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            {!this.props.stockMode ?
                                <FormattedMessage id="order_form_table.supplier" /> :
                                <><FormattedMessage id="storage" /> / <FormattedMessage id="wms.cell" /></>
                            }
                            <WarehouseSelect 
                                onChange={ (warehouseId) => this.fetchData(warehouseId) }
                            />
                        </div>
                    )
                },
                key:       'businessSupplierName',
                dataIndex: 'businessSupplierName',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            <Input
                                style={{maxWidth: 180, color: 'black'}}
                                value={elem.cellAddress || data}
                                disabled
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.supplier'})}
                            />
                            {this.props.stockMode ?
                                <DetailWarehousesCountModal
                                    productId={elem.id}
                                    onSelect={async (cellAddress, warehouseId, warehouseName)=>{
                                        elem.cellAddress = cellAddress;
                                        elem.warehouseId = warehouseId;
                                        await this.setState({});
                                        await this.handleOk(elem);
                                    }}
                                /> :
                                <DetailSupplierModal
                                    disabled={this.props.stockMode}
                                    user={this.props.user}
                                    setStoreSupplier={this.setSupplier}
                                    keyValue={elem.key}
                                    brandId={elem.brandId}
                                    detailCode={elem.partNumber}
                                    storeGroupId={this.props.storeGroupId || elem.storeGroupId}
                                />
                            }
                        </div>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
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
                key:       'salePrice',
                dataIndex: 'salePrice',
                sorter: (a, b) => {
                    if(!this.state.inStock) {
                        this.setState({
                            inStock: true,
                        })
                    }
                    if(!b.salePrice) return -1;
                    return Number(a.salePrice) - Number(b.salePrice);
                },
                sortDirections: ['descend', 'ascend'],
                render: (data) => {
                    let strVal = String(Math.round(data*10)/10);
                    return (
                            data ? <span>{`${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span> : <FormattedMessage id="long_dash"/>
                    )
                },
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            {
                                this.props.stockMode ? 
                                    <span><FormattedMessage id="storage.in_stock" /> / <FormattedMessage id="storage.available" /></span> :
                                    <FormattedMessage id="order_form_table.store" />
                            }
                            <div style={{fontWeight: '400', fontSize: 12}}>
                                <FormattedMessage id='in_stock' />
                                <Checkbox
                                    checked={this.state.inStock}
                                    onChange={()=>{
                                        this.setState({
                                            inStock: !this.state.inStock,
                                        })
                                    }}
                                /> 
                            </div>
                        </div>
                    )
                },
                key:       'store',
                dataIndex: 'store',
                sorter: (a, b) => {
                    let aStore = a.store ? a.store[0] : 0;
                    let bStore = b.store ? b.store[0] : 0;
                    return Number(aStore) - Number(bStore);
                },
                sortDirections: ['descend', 'ascend'],
                render: (store, elem) => {
                    return this.props.stockMode ? 
                    (
                        <span
                            style={{color: 'var(--link)', textDecoration: 'underline', cursor: 'pointer'}}
                            onClick={()=>this.setState({
                                reserveModalVisible: true,
                                reserveModalId: elem.id,
                            })}
                        >
                            {elem.countInWarehouses} / {elem.available}
                        </span>
                    ) :
                    (
                        <AvailabilityIndicator
                            indexArray={store}
                        />
                    )
                },
            },
            {
                key:       'select',
                render: (elem)=>{
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.handleOk(elem);
                            }}
                        >
                            <FormattedMessage id="select" />
                        </Button>
                    )
                }
            },
        ];
    }

    handleOk(elem) {
        var supplierBrandId = elem.supplierBrandId ? elem.supplierBrandId : (elem.price ? elem.price.supplierBrandId : undefined);
        var brandId = elem.brandId ? elem.brandId : (elem.price ? elem.price.brandId : undefined);
        var name = elem.storeGroupId == 1000000 ? elem.description : elem.storeGroupName;
        var supplierOriginalCode = elem.price ? elem.price.supplierOriginalCode : undefined;
        var supplierProductNumber = elem.price ? elem.price.supplierProductNumber : undefined;
        var supplierPartNumber = elem.price ? elem.price.supplierPartNumber : undefined;
        var isFromStock = elem.price ? elem.price.isFromStock : undefined;
        var defaultWarehouseId = elem.price ? elem.price.defaultWarehouseId : undefined;

        if(this.props.onSelect) {
            this.props.onSelect(
                elem.partNumber,
                brandId,
                elem.productId,
                this.props.tableKey,
                elem.storeGroupId,
                name,
                supplierOriginalCode,
                supplierProductNumber,
                supplierPartNumber,
            );
        }
        if(this.props.setSupplier) {
            this.props.setSupplier(
                elem.businessSupplierId,
                elem.businessSupplierName,
                supplierBrandId,
                elem.purchasePrice,
                elem.salePrice,
                elem.store,
                supplierOriginalCode,
                supplierProductNumber,
                supplierPartNumber,
                this.props.tableKey,
                isFromStock,
                defaultWarehouseId,
                elem.productId,
                brandId,
                elem.cellAddress,
                elem.warehouseId,
            );
        }
        if(this.props.selectProduct) {
            this.props.selectProduct({
                warehouseId: elem.warehouseId,
                productId: elem.productId,
                cellAddress: elem.cellAddress
            })
        }
        this.handleCancel();
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

    setSupplier(supplierId, businessSupplierName, supplierBrandId, purchasePrice, price, store, supplierOriginalCode, supplierProductNumber, supplierPartNumber, key, isFromStock, defaultWarehouseId, productId) {
        this.state.dataSource[key].businessSupplierId = supplierId;
        this.state.dataSource[key].businessSupplierName = businessSupplierName;
        this.state.dataSource[key].purchasePrice = purchasePrice;
        this.state.dataSource[key].supplierBrandId = supplierBrandId;
        this.state.dataSource[key].salePrice = price;
        this.state.dataSource[key].store = store;
        this.state.dataSource[key].price.supplierOriginalCode = supplierOriginalCode;
        this.state.dataSource[key].price.supplierProductNumber = supplierProductNumber;
        this.state.dataSource[key].price.supplierPartNumber = supplierPartNumber;
        this.state.dataSource[key].price.isFromStock = isFromStock;
        this.state.dataSource[key].price.defaultWarehouseId = defaultWarehouseId;
        this.state.dataSource[key].productId = productId;
        this.setState({
            update: true,
        });

        this.handleOk(this.state.dataSource[key]);
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            fetched: false,
            dataSource: [],
            brandOptions: [],
            brandFilter: [],
            storeFilter: undefined,
            storeOptions: [],
            codeFilter: undefined,
            attributesFilters: [],
            inStock: false,
        });
        if(this.props.hideModal) this.props.hideModal();
    };

    fetchData(warehouseId) {
        if(this.props.stockMode) {
            var that = this;
            let token = localStorage.getItem('_my.carbook.pro_token');
            let url = __API_URL__ + `/store_products?all=true`;
            if(warehouseId) url += `&warehouseId=${warehouseId}`;
            fetch(url, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }
                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const brandOptions = [];
                data.list.map((elem, key)=>{
                    elem.key = key;
                    elem.productId = elem.id;
                    elem.images = [];
                    elem.attributes = [];
                    elem.supplierId = elem.brand && elem.brand.id;
                    elem.supplierName = (elem.brand && elem.brand.name) || "";
                    elem.businessSupplierId = 0;
                    elem.businessSupplierName = that.props.intl.formatMessage({id: 'navigation.storage'});
                    elem.purchasePrice = elem.stockPrice;
                    elem.salePrice = elem.stockPrice * (elem.priceGroup ? elem.priceGroup.multiplier : 1.4);
                    elem.partNumber = elem.code;
                    elem.description = elem.name;
                    elem.storeGroupId = elem.groupId;
                    elem.storeGroupName = elem.name;
                    elem.price = {
                        isFromStock: true,
                        defaultWarehouseId: elem.defaultWarehouseId,
                    };
                    elem.store = [elem.available, 0, 0, 0];

                    if(that.state.brandFilter.length == 0 && that.props.brandFilter == elem.supplierName) {
                        that.state.brandFilter.push(elem.supplierId);
                    }

                    if(brandOptions.findIndex((brand)=>brand.id == elem.supplierId)==-1 && elem.supplierId) {
                        brandOptions.push({
                            id: elem.supplierId,
                            name: elem.supplierName,
                        })
                    }
                })

                that.setState({
                    fetched: true,
                    dataSource: data.list,
                    brandOptions: brandOptions,
                    codeFilter: that.props.codeFilter,
                })
            })
            .catch(function(error) {
                console.log("error", error);
                that.setState({
                    fetched: true,
                    codeFilter: that.props.codeFilter,
                })
            });
            return;
        }
        if(this.props.codeSearch) {
            var that = this;
            let token = localStorage.getItem('_my.carbook.pro_token');
            let url = API_URL;
            let params = `/tecdoc/replacements?query=${String(this.props.codeFilter).replace(' ', '')}`;
            //if(this.props.storeGroupId) params += `&storeGroupId=${this.props.storeGroupId}`
            if(this.props.brandId) params += `&brandIds=[${this.props.brandId}]`
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
                var storeOptions = [];
                let defaultBrand = [], brandsWithSupplier = [], otherBrands = [];
                data.map((elem, i)=>{
                    elem.key = i;
                    if(elem.price) {
                        elem.productId = elem.price.id;
                        elem.store = elem.price.store;
                        elem.purchasePrice = elem.price.purchasePrice;
                        elem.businessSupplierId = elem.price.businessSupplierId;
                        elem.businessSupplierName = elem.price.businessSupplierName;
                        elem.salePrice = elem.price.purchasePrice * (elem.price.markup ? elem.price.markup : 1.4);
                    }
                    if(brandOptions.findIndex((brand)=>brand.id == elem.supplierId)==-1) {
                        if(that.state.brandFilter.length == 0 && that.props.brandFilter == elem.supplierName) {
                            that.state.brandFilter.push(elem.supplierId);
                        }
                        brandOptions.push({
                            id: elem.supplierId,
                            name: elem.supplierName,
                        })
                        if(elem.supplierName == that.props.defaultBrandName) {
                            defaultBrand.push({
                                id: elem.supplierId,
                                name: elem.supplierName,
                            })
                        }
                        else if(elem.price) {
                            brandsWithSupplier.push({
                                id: elem.supplierId,
                                name: elem.supplierName,
                            })
                        }
                        else {
                            otherBrands.push({
                                id: elem.supplierId,
                                name: elem.supplierName,
                            })
                        }
                    }
                    if(storeOptions.findIndex((store)=>store.id == elem.storeGroupId)==-1) {
                        storeOptions.push({
                            id: elem.storeGroupId,
                            name: elem.storeGroupName,
                        })
                    }
                })
                brandsWithSupplier.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
                otherBrands.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
                brandOptions=[...defaultBrand, ...brandsWithSupplier, ...otherBrands];
                that.setState({
                    fetched: true,
                    dataSource: data,
                    brandOptions: brandOptions,
                    storeOptions: storeOptions,
                })
            })
            .catch(function (error) {
                console.log('error', error)
                that.setState({
                    fetched: true,
                })
            });
            return;
        }
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/tecdoc/products/parts?modificationId=${this.props.tecdocId}&storeGroupId=${this.props.storeGroupId}`;
        if(this.props.supplierId) params += `&businessSupplierId=${this.props.supplierId}`
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
            let defaultBrand = [], brandsWithSupplier = [], otherBrands = [];
            data.map((elem, i)=>{
                elem.key = i;
                if(elem.price) {
                    elem.productId = elem.price.id;
                    elem.store = elem.price.store;
                    elem.purchasePrice = elem.price.purchasePrice;
                    elem.businessSupplierId = elem.price.businessSupplierId;
                    elem.businessSupplierName = elem.price.businessSupplierName;
                    elem.salePrice = elem.price.purchasePrice * (elem.price.markup ? elem.price.markup : 1.4);
                }
                if(brandOptions.findIndex((brand)=>brand.id == elem.supplierId)==-1) {
                    if(that.state.brandFilter.length == 0 && that.props.brandFilter == elem.supplierName) {
                        that.state.brandFilter.push(elem.supplierId);
                    }
                    brandOptions.push({
                        id: elem.supplierId,
                        name: elem.supplierName,
                    })
                    if(elem.supplierName == that.props.defaultBrandName) {
                        defaultBrand.push({
                            id: elem.supplierId,
                            name: elem.supplierName,
                        })
                    }
                    else if(elem.price) {
                        brandsWithSupplier.push({
                            id: elem.supplierId,
                            name: elem.supplierName,
                        })
                    }
                    else {
                        otherBrands.push({
                            id: elem.supplierId,
                            name: elem.supplierName,
                        })
                    }
                }
            })
            brandsWithSupplier.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            otherBrands.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            brandOptions=[...defaultBrand, ...brandsWithSupplier, ...otherBrands];
            that.setState({
                fetched: true,
                dataSource: data,
                brandOptions: brandOptions,
                codeFilter: that.props.codeFilter,
            })
        })
        .catch(function (error) {
            console.log('error', error)
            that.setState({
                fetched: true,
            })
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

    componentDidUpdate(prevProps, prevState) {
        if(this.props.visible && !prevProps.visible) {
            this.fetchData();
            this.setState({
                visible: true,
            })
        }
    }

    render() {
        const { dataSource, storeFilter, brandFilter, codeFilter, inStock, reserveModalVisible, reserveModalData } = this.state;
        const disabled = this.props.disabled || this.props.stockMode && isForbidden(this.props.user, permissions.ACCESS_STOCK) || isForbidden(this.props.user, permissions.ACCESS_TECDOC_MODAL_WINDOW);
        let tblData = [...dataSource];

        if(storeFilter) tblData = tblData.filter((elem)=>String(elem.storeGroupId).toLowerCase().indexOf(String(storeFilter).toLowerCase()) >= 0 );
        if(brandFilter.length) tblData = tblData.filter((elem)=>brandFilter.indexOf(elem.supplierId)!=-1);
        if(codeFilter) tblData = tblData.filter((elem)=>elem.partNumber.replace(' ', '').toLowerCase().indexOf(codeFilter.replace(' ', '').toLowerCase()) >= 0 );
        if(inStock) {
            if(this.props.stockMode) tblData = tblData.filter((elem)=>elem.store[0]);
            else tblData = tblData.filter((elem)=>elem.store);
        }
        tblData = this.filterDataSourceByAttribute(tblData, 1);
        tblData = this.filterDataSourceByAttribute(tblData, 2);
        tblData = this.filterDataSourceByAttribute(tblData, 3);
        tblData = this.filterDataSourceByAttribute(tblData, 4);

        return (
            <div style={{display: 'flex'}}>
                {!this.props.hideButton &&
                    <Button
                        type='primary'
                        disabled={disabled}
                        onClick={()=>{
                            this.fetchData();
                            this.setState({
                                visible: true,
                            })
                        }}
                        title={this.props.intl.formatMessage({id: "details_table.details_catalogue"})}
                    >
                        <div
                            style={{
                                width: 18,
                                height: 18,
                                backgroundColor: disabled ? 'black' : 'white',
                                mask: `url(${this.props.stockMode ? images.stockIcon : images.bookIcon}) no-repeat center / contain`,
                                WebkitMask: `url(${this.props.stockMode ? images.stockIcon : images.bookIcon}) no-repeat center / contain`,
                            }}
                        ></div>
                    </Button>
                }
                <Modal
                    width="90%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="order_form_table.catalog" />}
                    onCancel={this.handleCancel}
                    footer={null}
                    maskClosable={false}
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
                {this.props.stockMode && 
                    <StoreProductTrackingModal
                        visible={reserveModalVisible}
                        productId={reserveModalData}
                        hideModal={()=>{
                            this.setState({
                                reserveModalVisible: false,
                                reserveModalData: undefined,
                            })
                        }}
                    />
                }
            </div>
        )
    }
}
export default DetailStorageModal;


export class PhotoModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible: false,
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    render() {
        return(
            <div>
                <div style={{verticalAlign: 'middle'}}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                        })
                    }}
                >
                    <img
                        style={ { cursor: 'pointer' } }
                        width={ 80 }
                        src={ this.props.src }
                        onError={ e => {
                            e.target.onerror = null;
                            e.target.src = `${__TECDOC_IMAGES_URL__}/not_found.png`;
                        } }
                    />
                </div>
                <Modal
                    width='45%'
                    visible={this.state.visible}
                    footer={null}
                    title={<FormattedMessage id="photo" />}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <div style={{textAlign: 'center'}}>
                        <img
                            style={ { cursor: 'pointer' } }
                            width={ '70%' }
                            src={ this.props.src }
                            onError={ e => {
                                e.target.onerror = null;
                                e.target.src = `${__TECDOC_IMAGES_URL__}/not_found.png`;
                            } }
                        />
                    </div>
                    <div>
                        {this.props.attributes.map((attribute, i)=>(
                            <div key={i} style={{border: '1px solid', padding: '5pxs'}}>
                                {attribute.description}: {attribute.value}
                            </div>
                        ))}
                    </div>
                </Modal>
            </div>
        )
    }
}

export class DetailWarehousesCountModal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            warehousesData: [],
        };

        this.columns = [
            {
                title: <FormattedMessage id='wms.cell' />,
                dataIndex: 'cellAddress',
            },
            {
                title: <FormattedMessage id='order_form_table.count' />,
                dataIndex: 'count',
            },
            {
                with: 'fit-content',
                render: row => {
                    return (
                        <Button
                            type='primary'
                            onClick={()=>{
                                this.handleCancel();
                                if(this.props.onSelect) this.props.onSelect(row.cellAddress, row.warehouseId);
                            }}
                        >
                            <FormattedMessage id='select'/>
                        </Button>
                    )
                }
            }
        ];
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
        if(this.props.hideModal) this.props.hideModal();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.visible && !prevProps.visible) {
            this.fetchData();
            this.setState({
                visible: true,
            })
        }
    }

    fetchData = async () => {
        let warehousesData = [];

        const product = await fetchAPI('GET', `store_products/${this.props.productId}`);

        const warehouses = await fetchAPI('GET', `warehouses`);
        warehouses.map(({id, name})=>{
            warehousesData.push({
                id: id,
                name: name,
                count: 0,
                childs: [],
            })
        })

        const productWarehouses = await fetchAPI('GET', `store_products/${this.props.productId}/warehouses`);

        for (const [key, value] of Object.entries(productWarehouses)) {
            const index = warehousesData.findIndex(({id})=>id==key);
            warehousesData[index].count = Number(value);
        }

        const payload = await fetchAPI('GET', 'wms/cells/statuses', {storeProductId: this.props.productId});
        
        payload.list.map((elem)=>{
            if(elem.warehouse.id) {
                const index = warehousesData.findIndex(({id})=>id==elem.warehouse.id);
                warehousesData[index].childs.push({
                    cellAddress: elem.wmsCellOptions.address,
                    count: elem.sum,
                })
                
            }
        });
        warehousesData = warehousesData.filter(({count})=>count>0);
        await this.setState({
            warehousesData,
            code: _.get(product, 'code'),
            brandName: _.get(product, 'brand.name'),
            name: _.get(product, 'name'),
        })
    }

    render() {
        const { code, name, brandName, warehousesData, visible } = this.state;
        return(
            <div>
                {!this.props.hideButton &&
                    <Button
                        type='primary'
                        onClick={()=>{
                            this.fetchData();
                            this.setState({
                                visible: true
                            });
                        }}
                    >
                        <div
                            style={{
                                width: 18,
                                height: 18,
                                backgroundColor: 'white',
                                mask: `url(${images.stockIcon}) no-repeat center / contain`,
                                WebkitMask: `url(${images.stockIcon}) no-repeat center / contain`,
                            }}
                        ></div>
                    </Button>
                }
                <Modal
                    visible={visible}
                    footer={null}
                    title={<FormattedMessage id="storage.in_stock" />}
                    onCancel={this.handleCancel}
                    style={{
                        maxWidth: 680,
                        fontSize: 16,
                    }}
                    maskClosable={false}
                >
                    <div
                        style={{
                            padding: '0px 4px 14px'
                        }}
                    >
                        <p
                            style={{
                                fontSize: 16,
                                fontWeight: 500,
                            }}
                        >
                            {brandName} {code}
                        </p>
                        <p>
                            {name}
                        </p>
                    </div>
                    {warehousesData.map((warehouse, key)=>(
                        warehouse.childs.length ?
                        <Table
                            key={key}
                            rowKey='cellAddress'
                            columns={this.columns}
                            dataSource={warehouse.childs}
                            style={{
                                marginBottom: 8
                            }}
                            bordered
                            size={'small'}
                            pagination={{
                                hideOnSinglePage: true
                            }}
                            title={() => (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    {warehouse.name} ({warehouse.count})
                                    <Button
                                        type='primary'
                                        onClick={()=>{
                                            this.handleCancel();
                                            if(this.props.onSelect) this.props.onSelect(undefined, warehouse.id, warehouse.name);
                                        }}
                                    >
                                        <FormattedMessage id='select'/>
                                    </Button>
                                </div>
                            )}
                        /> :
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 8,
                                borderRadius: 4,
                                border: '1px solid #e8e8e8',
                                marginBottom: 8
                            }}
                        >
                            {warehouse.name} ({warehouse.count})
                            <Button
                                type='primary'
                                onClick={()=>{
                                    this.handleCancel();
                                    if(this.props.onSelect) this.props.onSelect(undefined, warehouse.id, warehouse.name);
                                }}
                            >
                                <FormattedMessage id='select'/>
                            </Button>
                        </div>
                    ))}
                </Modal>
            </div>
        )
    }
}