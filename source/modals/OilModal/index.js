// vendor
import React, { Component } from 'react';
import { Button, Modal, Icon, Select, Input, InputNumber, Spin, Table, TreeSelect, Checkbox, AutoComplete } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { permissions, isForbidden } from "utils";
import { DetailSupplierModal } from 'modals';
import { AvailabilityIndicator } from 'components';
// own
import Styles from './styles.m.css';
const Option = Select.Option;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


@injectIntl
class OilModal extends React.Component{
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
            brandFilter: undefined,
            brandSearchValue: "",
            productNameOptions: [],
            productNameFilter: [],
            codeOptions: [],
            codeFilter: undefined,
            inStock: false,
            typeFilter: undefined,
            saeFilter: [],
            aceaFilter: [],
            apiFilter: [],
            oeCodeFilter: [],
            oemFilter: undefined,
            oeCodeFilter: [],
            filters: {
                acea: [],
                api: [],
                oeCode: [],
                oem: [],
                sae: [],
                type: [],
            }
        }

        this.setSupplier = this.setSupplier.bind(this);

        this.columns = [
            {
                title:  ()=>(
                    <div>
                        <p>
                            <FormattedMessage id="order_form_table.detail_code" />
                        </p>
                        <p>
                            <FormattedMessage id="order_form_table.brand" /> / Линейка
                        </p>
                        <div>
                            <AutoComplete
                                allowClear
                                defaultValue={this.props.codeFilter}
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                filterOption={(input, option) => {
                                    return (
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    )
                                }}
                                onChange={(value)=>{
                                    this.setState({
                                        codeFilter: value
                                    })
                                }}
                            >
                                {this.state.codeOptions.map((option, i)=>
                                    <Option key={i} value={option}>
                                        {option}
                                    </Option>
                                )}
                            </AutoComplete>
                        </div>
                        <Select
                            allowClear
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.brand'})}
                            style={{
                                minWidth: 100
                            }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onChange={(value)=>{
                                this.setState({
                                    brandFilter: value
                                })
                            }}
                        >
                            {this.state.brandOptions.map((brand,i)=>(
                                <Option key={i} value={brand.id}>
                                    {brand.name}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder='Линейка'
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            style={{
                                minWidth: 100
                            }}
                            onChange={(value)=>{
                                this.setState({
                                    productNameFilter: value
                                })
                            }}
                        >
                            {this.state.productNameOptions.map((product,i)=>(
                                <Option key={i} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                    </div>
                ),
                key:       'code',
                dataIndex: 'partNumber',
                width:     'auto',
                render: (data, elem)=>{
                    return(
                        <div>
                            <div style={{fontWeight: 'bold'}}>{data}</div>
                            <div>{elem.brandName} {elem.productName}</div>
                        </div>
                    )
                }
            },
            {
                title:  ()=>(
                    <div>
                        Тип
                        <Select
                            allowClear
                            showSearch
                            placeholder='Тип'
                            style={{
                                minWidth: 100
                            }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            onChange={(value)=>{
                                this.setState({
                                    typeFilter: value
                                })
                            }}
                        >
                            {this.state.filters.type.map((option,i)=>(
                                <Option key={i} value={option}>
                                    {option}
                                </Option>
                            ))}
                        </Select>
                    </div>
                ),
                key:       'type',
                dataIndex: 'type',
                width:     'auto',
                render: (data, elem)=>{
                    return(
                        <div>
                            <div>{data}</div>
                        </div>
                    )
                }
            },
            {
                title:  ()=>(
                    <div>
                        SAE
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder='SAE'
                            defaultValue={this.props.oilModalData && this.props.oilModalData.sae ? this.props.oilModalData.sae : undefined}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            style={{
                                minWidth: 100
                            }}
                            onChange={(value)=>{
                                this.setState({
                                    saeFilter: value
                                })
                            }}
                        >
                            {this.state.filters.sae.map((product,i)=>(
                                <Option key={i} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                    </div>
                ),
                key:       'sae',
                dataIndex: 'sae',
                width:     'auto',
                render: (data, elem)=>{
                    var saeCode;
                    elem.sae.map((code)=>{
                        if(this.state.saeFilter.indexOf(code) >= 0) {
                            saeCode = code;
                        }
                    })
                    return(
                        <div>
                            <div>{this.state.saeFilter.length ? saeCode : elem.sae && elem.sae.length ? elem.sae[0] : <FormattedMessage id="long_dash"/>}</div>
                        </div>
                    )
                }
            },
            {
                title:  ()=>(
                    <div>
                        ACEA / API
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder='ACEA'
                            defaultValue={this.props.oilModalData && this.props.oilModalData.acea ? this.props.oilModalData.acea : undefined}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            style={{
                                minWidth: 100
                            }}
                            onChange={(value)=>{
                                this.setState({
                                    aceaFilter: value
                                })
                            }}
                        >
                            {this.state.filters.acea.map((product,i)=>(
                                <Option key={i} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder='API'
                            defaultValue={this.props.oilModalData && this.props.oilModalData.api ? this.props.oilModalData.api : undefined}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            style={{
                                minWidth: 100
                            }}
                            onChange={(value)=>{
                                this.setState({
                                    apiFilter: value
                                })
                            }}
                        >
                            {this.state.filters.api.map((product,i)=>(
                                <Option key={i} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                    </div>
                ),
                key:       'acea',
                width:     'auto',
                render: (elem)=>{
                    var aceaCode;
                    elem.acea.map((code)=>{
                        if(this.state.aceaFilter.indexOf(code) >= 0) {
                            aceaCode = code;
                        }
                    })
                    var apiCode;
                    elem.api.map((code)=>{
                        if(this.state.apiFilter.indexOf(code) >= 0) {
                            apiCode = code;
                        }
                    })
                    return(
                        <div>
                            <div>{this.state.aceaFilter.length ? aceaCode : elem.acea && elem.acea.length ? elem.acea[0] : <FormattedMessage id="long_dash"/>}</div>
                            <div>{this.state.apiFilter.length ? apiCode : elem.api && elem.api.length ? elem.api[0] : <FormattedMessage id="long_dash"/>}</div>
                        </div>
                    )
                }
            },
            {
                title:  ()=>(
                    <div>
                        OE / Допуск
                        <Select
                            allowClear
                            showSearch
                            placeholder='OE'
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            defaultValue={this.props.oilModalData && this.props.oilModalData.oem ? this.props.oilModalData.oem : undefined}
                            style={{
                                minWidth: 100
                            }}
                            onChange={(value)=>{
                                this.setState({
                                    oemFilter: value
                                })
                            }}
                        >
                            {this.state.filters.oem.map((product,i)=>(
                                <Option key={i} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder='Допуск'
                            defaultValue={this.props.oilModalData && this.props.oilModalData.oeCode ? this.state.oeCodeFilter : undefined}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            style={{
                                minWidth: 100
                            }}
                            onChange={(value)=>{
                                this.setState({
                                    oeCodeFilter: value
                                })
                            }}
                        >
                            {this.state.filters.oeCode.map((product,i)=>(
                                <Option key={i} value={product}>
                                    {product}
                                </Option>
                            ))}
                        </Select>
                    </div>
                ),
                key:       'oem',
                width:     'auto',
                render: (elem)=>{
                    var oeCode;
                    elem.oeCode.map((code)=>{
                        if(this.state.oeCodeFilter.indexOf(code) >= 0) {
                            oeCode = code;
                        }
                    })
                    return (
                        <div>
                            <div>{this.state.oemFilter ? this.state.oemFilter : elem.oem && elem.oem.length ? elem.oem[0] : null}</div>
                            <div>{this.state.oeCodeFilter.length ? oeCode : elem.oeCode && elem.oeCode.length ? elem.oeCode[0] : null}</div>
                        </div>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.supplier" />,
                key:       'businessSupplierName',
                dataIndex: 'businessSupplierName',
                width:     'auto',
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
                                user={this.props.user}
                                setStoreSupplier={this.setSupplier}
                                keyValue={elem.key}
                                brandId={elem.brandId}
                                detailCode={elem.partNumber}
                                storeGroupId={this.props.storeGroupId || elem.storeGroupId}
                            />
                        </div>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     'auto',
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
                width:     '8%',
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
                            <FormattedMessage id="order_form_table.store" />
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
                width:     '8%',
                sorter: (a, b) => {
                    let aStore = a.store ? a.store[0] : 0;
                    let bStore = b.store ? b.store[0] : 0;
                    return Number(aStore) - Number(bStore);
                },
                sortDirections: ['descend', 'ascend'],
                render: (store) => {
                    return (
                        <AvailabilityIndicator
                            indexArray={store}
                        />
                    )
                },
            },
            {
                key:       'select',
                width:     '5%',
                render: (elem)=>{
                    var supplierBrandId = elem.supplierBrandId ? elem.supplierBrandId : (elem.price ? elem.price.supplierBrandId : undefined);
                    var brandId = elem.brandId ? elem.brandId : (elem.price ? elem.price.brandId : undefined);
                    var name = elem.storeGroupId == 1000000 ? elem.productName : elem.storeGroupName;
                    var supplierOriginalCode = elem.price ? elem.price.supplierOriginalCode : undefined;
                    var supplierProductNumber = elem.price ? elem.price.supplierProductNumber : undefined;
                    var supplierPartNumber = elem.price ? elem.price.supplierPartNumber : undefined;
                    console.log(elem)
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.props.onSelect(elem.partNumber, brandId, elem.storeId, this.props.tableKey, elem.storeGroupId, name, supplierOriginalCode, supplierProductNumber, supplierPartNumber);
                                this.props.setSupplier(elem.businessSupplierId, elem.businessSupplierName, supplierBrandId, elem.purchasePrice, elem.salePrice, elem.store, supplierOriginalCode, supplierProductNumber, supplierPartNumber, this.props.tableKey);
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

    setSupplier(supplierId, businessSupplierName, supplierBrandId, purchasePrice, price, store, supplierOriginalCode, supplierProductNumber, supplierPartNumber, key) {
        this.state.dataSource[key].businessSupplierId = supplierId;
        this.state.dataSource[key].businessSupplierName = businessSupplierName;
        this.state.dataSource[key].purchasePrice = purchasePrice;
        this.state.dataSource[key].supplierBrandId = supplierBrandId;
        this.state.dataSource[key].salePrice = price;
        this.state.dataSource[key].store = store;
        this.state.dataSource[key].price.supplierOriginalCode = supplierOriginalCode;
        this.state.dataSource[key].price.supplierProductNumber = supplierProductNumber;
        this.state.dataSource[key].price.supplierPartNumber = supplierPartNumber;
        this.setState({
            update: true
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            fetched: false,
            dataSource: [],
        })
    };

    componentDidUpdate(prevProps) {
        if(this.state.fetched && this.props.showOilModal) {
            const oeCodeTmp = [];
            this.props.oilModalData.oeCode.map((code)=>{
                if(this.state.filters.oeCode.findIndex((elem)=>elem==code) >= 0) {
                    oeCodeTmp.push(code);
                }
            })
            this.setState({
                oemFilter: this.props.oilModalData.oem,
                oeCodeFilter: oeCodeTmp,
                aceaFilter: this.props.oilModalData.acea,
                apiFilter: this.props.oilModalData.api,
                saeFilter: this.props.oilModalData.sae,
                visible: true,
            });
            this.props.clearOilData();
        }
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/tecdoc/oils';
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
                
                let brandOptions = [],
                    productNameOptions = [],
                    codeOptions = [];
                data.parts.map((elem, i)=>{
                    elem.key = i;
                    if(!elem.acea) elem.acea = [];
                    if(!elem.api) elem.api = [];
                    if(!elem.sae) elem.sae = [];
                    if(!elem.oem) elem.oem = [];
                    if(!elem.oeCode) elem.oeCode = [];
                    if(elem.price) {
                        elem.storeId = elem.price.id;
                        elem.store = elem.price.store;
                        elem.purchasePrice = elem.price.purchasePrice;
                        elem.businessSupplierId = elem.price.businessSupplierId;
                        elem.businessSupplierName = elem.price.businessSupplierName;
                        elem.salePrice = elem.price.purchasePrice * (elem.price.markup ? elem.price.markup : 1.4);
                    }
                    if(brandOptions.findIndex((brand)=>brand.id == elem.brandId) < 0) {
                        brandOptions.push({
                            id: elem.brandId,
                            name: elem.brandName,
                        })
                    }
                    if(productNameOptions.findIndex((product)=>product == elem.productName) < 0) {
                        productNameOptions.push(elem.productName);
                    }
                    if(codeOptions.findIndex((code)=>code == elem.partNumber) < 0) {
                        codeOptions.push(elem.partNumber);
                    }
                })
                brandOptions.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
                productNameOptions.sort((a, b) => a < b ? -1 : (a > b ? 1 : 0));
                codeOptions.sort((a, b) => a < b ? -1 : (a > b ? 1 : 0));
                console.log(data, productNameOptions);
                that.setState({
                    codeOptions: codeOptions,
                    brandOptions: brandOptions,
                    productNameOptions: productNameOptions,
                    dataSource: data.parts,
                    filters: data.filters,
                    fetched: true,
                    codeFilter: that.props.codeFilter,
                })
            })
            .catch(function (error) {
                console.log('error', error)
                that.setState({
                    fetched: true,
                })
            });
    }

    componentDidMount() {
        this._isMounted = true;
        if(!this.state.fetched) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const { dataSource, productNameFilter, brandFilter, codeFilter, typeFilter, saeFilter, aceaFilter, apiFilter, oemFilter, oeCodeFilter, inStock } = this.state;
        const disabled = this.props.disabled || isForbidden(this.props.user, permissions.ACCESS_TECDOC_MODAL_WINDOW);

        let tblData = [...dataSource];

        if(productNameFilter.length) tblData = tblData.filter((elem)=>productNameFilter.indexOf(elem.productName) >= 0);
        if(brandFilter) tblData = tblData.filter((elem)=>elem.brandId == brandFilter);
        if(codeFilter) tblData = tblData.filter((elem)=>elem.partNumber.toLowerCase().indexOf(codeFilter.toLowerCase()) >= 0 );
        if(typeFilter) tblData = tblData.filter((elem)=>elem.type == typeFilter);
        if(saeFilter.length) tblData = tblData.filter((elem)=>{
            var inArray = false;
            elem.sae.map((code)=>{
                if(this.state.saeFilter.indexOf(code) >= 0) {
                    inArray = true;
                    return;
                }
            })
            return inArray;
        });
        if(aceaFilter.length) tblData = tblData.filter((elem)=>{
            var inArray = false;
            elem.acea.map((code)=>{
                if(this.state.aceaFilter.indexOf(code) >= 0) {
                    inArray = true;
                    return;
                }
            })
            return inArray;
        });
        if(apiFilter.length) tblData = tblData.filter((elem)=>{
            var inArray = false;
            elem.api.map((code)=>{
                if(this.state.apiFilter.indexOf(code) >= 0) {
                    inArray = true;
                    return;
                }
            })
            return inArray;
        });
        if(oemFilter) tblData = tblData.filter((elem)=>elem.oem.indexOf(oemFilter) >= 0);
        if(oeCodeFilter.length) tblData = tblData.filter((elem)=>{
            var inArray = false;
            elem.oeCode.map((code)=>{
                if(this.state.oeCodeFilter.indexOf(code) >= 0) {
                    inArray = true;
                    return;
                }
            })
            return inArray;
        });
        if(inStock) tblData = tblData.filter((elem)=>elem.store);
        return (
            <div>
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
                            mask: `url(${images.oilIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.oilIcon}) no-repeat center / contain`,
                        }}
                    ></div>
                </Button>
                <Modal
                    width="95%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="details_table.oils_and_liquids" />}
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
export default OilModal;