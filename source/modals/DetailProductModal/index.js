// vendor
import React, { Component } from 'react';
import { Button, Modal, Icon, Select, Input, InputNumber, Radio, Table, TreeSelect, Checkbox, Spin, Slider } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { DetailStorageModal, DetailSupplierModal, OilModal } from 'modals';
import { AvailabilityIndicator } from 'components';
import { images } from 'utils';
// own
import Styles from './styles.m.css';
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { TreeNode } = TreeSelect;
const Option = Select.Option;

@injectIntl
class DetailProductModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            radioValue: 1,
            mainTableSource: [],
            relatedDetails: [],
            relatedServices: [],
            relatedDetailsCheckbox: false,
            relatedServicesCheckbox: false,
            brandSearchValue: "",
            defaultBrandName: undefined,
        }
        this.labors = [];
        this.storeGroups = [];
        this.suppliers = [];
        this.treeData = [];
        this.servicesOptions = [];
        this.suppliersOptions = [];

        this.setCode = this.setCode.bind(this);
        this.setSupplier = this.setSupplier.bind(this);
        this.setVinDetail = this.setVinDetail.bind(this);

        this.mainTableColumns = [
            {
                key:       'checked',
                dataIndex: 'checked',
                width: 'min-content',
                render: (data, elem)=>{
                    return elem.related ? (
                        <Checkbox
                            checked={data}
                            onChange={({target})=>{
                                elem.checked = target.checked;
                                this.setState({});
                            }}
                        />
                    ) : null
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.store_group" />,
                key:       'storeGroupId',
                dataIndex: 'storeGroupId',
                width:     '12%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled={this.state.editing || elem.related}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.store_group'})}
                            style={{maxWidth: 180, color: 'var(--text)'}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.props.treeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                elem.storeGroupId = value;
                                elem.detailName = option.props.name;
                                if(this.state.radioValue != 2) this.getDefaultValues(value);
                                if(!elem.related) this.getRelatedDetails(value);
                                this.filterOptions(value);
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                width: 'auto',
                key: 'vin',
                render: (elem)=>{
                    return (
                        <VinCodeModal
                            setVinDetail={this.setVinDetail}
                            disabled={false}
                            storeGroupId={elem.storeGroupId}
                            vin={this.props.clientVehicleVin}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
                render: (data, elem)=>{
                    return (
                        <Input
                            disabled={elem.storeGroupId == null && this.state.radioValue == 1}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            style={{minWidth: 150}}
                            value={data}
                            onChange={(event)=>{
                                elem.detailName = event.target.value;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="comment" />,
                key:       'comment',
                dataIndex: 'comment',
                width:     '3%',
                render: (data, elem)=>{
                    var detail = String(elem.detailName);
                    if(detail && detail.indexOf(' - ') > -1) {
                        detail = detail.slice(0, detail.indexOf(' - '));
                    }
                    return (
                        <CommentaryButton
                            disabled={elem.storeGroupId == null && (this.state.radioValue != 2 || this.state.radioValue != 4)}
                            commentary={
                                data || 
                                {
                                    comment: undefined,
                                    positions: [],
                                }
                            }
                            detail={detail}
                            setComment={(comment, positions)=>{
                                elem.comment = {
                                    comment: comment,
                                    positions: positions,
                                };
                                elem.detailName = comment || elem.detailName;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.brand" />,
                key:       'brandId',
                dataIndex: 'brandId',
                width:     '10%',
                className: Styles.brandColumn,
                render: (data, elem)=>{
                    if(elem.brandName && !(elem.brandId)) {
                        const defaultBrand = this.props.brands.find((brand)=>brand.brandName==elem.brandName);
                        if(defaultBrand) {
                            elem.brandId = defaultBrand.brandId;
                            this.setState({});
                        }
                    }
                    return (
                        <Select
                            showSearch
                            allowClear
                            disabled={elem.storeGroupId == null && this.state.radioValue == 1}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.brand'})}
                            value={data ? data : undefined}
                            style={{maxWidth: 180, minWidth: 100}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onChange={(value, option)=>{
                                this.unsetSupplier(elem.key, elem.related);
                                elem.detailCode = undefined;
                                elem.purchasePrice = 0;
                                elem.price = 1;
                                elem.count = 1;
                                elem.sum = undefined;
                                elem.brandId = value;
                                elem.brandName = option ? option.props.children : undefined;
                                if(!option) this.state.relatedDetails = []; 
                                this.setState({});
                            }}
                            onSearch={(input)=>{
                                this.setState({
                                    brandSearchValue: input,
                                })
                            }}
                            onBlur={()=>{
                                this.setState({
                                    brandSearchValue: "",
                                })
                            }}
                        >
                            {
                                this.state.brandSearchValue.length > 1 ? 
                                    this.props.brands.map((elem, index)=>(
                                        <Option key={index} value={elem.brandId} supplier_id={elem.supplierId}>
                                            {elem.brandName}
                                        </Option>
                                    )) :
                                    elem.brandId ? 
                                    <Option key={0} value={elem.brandId}>
                                        {elem.brandName}
                                    </Option> : 
                                    []
                            }
                        </Select>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_code" />,
                key:       'detailCode',
                dataIndex: 'detailCode',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            <Input
                                allowClear
                                style={{minWidth: 80, color: 'black'}}
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                                value={data}
                                disabled={elem.storeGroupId == null && this.state.radioValue == 1}
                                onChange={({target})=>{
                                    const { value }= target;
                                    elem.detailCode = value;
                                    if(!value) {
                                        this.unsetSupplier();
                                    }
                                    this.unsetSupplier(elem.key, elem.related);
                                    this.setState({});
                                }}
                            />
                            {this.state.radioValue != 4 ?
                            <DetailStorageModal
                                user={this.props.user}
                                tableKey={elem.key}
                                onSelect={(...args)=>{
                                    this.setCode(elem.related , ...args);
                                }}
                                disabled={
                                    elem.storeGroupId == null && this.state.radioValue != 3 && this.state.radioValue != 5 
                                    || this.state.radioValue == 2 
                                    || this.state.radioValue == 3 && (data || '').length < 3
                                }
                                codeSearch={this.state.radioValue == 3}
                                tecdocId={this.props.tecdocId}
                                storeGroupId={elem.storeGroupId}
                                setSupplier={(...args)=>{
                                    this.setSupplier(elem.related, ...args);
                                }}
                                brandFilter={elem.brandName}
                                supplierId={elem.supplierId}
                                codeFilter={elem.detailCode}
                                brandId={elem.brandId == 8000 ? undefined : elem.brandId}
                                defaultBrandName={this.state.defaultBrandName}
                                stockMode={this.state.radioValue == 5}
                            /> :
                            <OilModal
                                brands={this.props.brands}
                                user={this.props.user}
                                tableKey={elem.key}
                                onSelect={(...args)=>{
                                    this.setCode(elem.related, ...args);
                                }}
                                tecdocId={this.props.tecdocId}
                                storeGroupId={elem.storeGroupId}
                                setSupplier={(...args)=>{
                                    this.setSupplier(elem.related, ...args)
                                }}
                                codeFilter={elem.detailCode}
                                showOilModal={ this.props.showOilModal }
                                oilModalData={ this.props.oilModalData }
                                clearOilData={ this.props.clearOilData }
                            />}
                        </div>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.supplier" />,
                key:       'supplier',
                dataIndex: 'supplierName',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            {this.state.radioValue == 2 ?
                                <Select
                                    showSearch
                                    placeholder={this.props.intl.formatMessage({id: 'order_form_table.supplier'})}
                                    value={elem.supplierId ? elem.supplierId : undefined}
                                    style={{minWidth: 160, maxWidth: 200}}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                    filterOption={(input, option) => {
                                        return (
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                            String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                        )
                                    }}
                                    onSelect={(value, option)=>{
                                        this.unsetSupplier(elem.key, elem.related);
                                        elem.supplierId = value;
                                        this.setState({});
                                    }}
                                >
                                    {this.suppliersOptions}
                                </Select>
                                :
                                <Input
                                    style={{minWidth: 80, maxWidth: 180, color: 'black'}}
                                    disabled
                                    placeholder={this.props.intl.formatMessage({id: 'order_form_table.supplier'})}
                                    value={data}
                                />
                            }
                            <DetailSupplierModal
                                user={this.props.user}
                                tableKey={elem.key}
                                disabled={
                                    (this.state.radioValue != 2 && this.state.radioValue != 3 && elem.storeGroupId == null) || 
                                    !(elem.detailCode) || 
                                    !(elem.brandName) ||
                                    this.state.radioValue == 5
                                }
                                onSelect={(...args)=>{
                                    this.setSupplier(elem.related, ...args);
                                }}
                                storeGroupId={elem.storeGroupId}
                                brandId={elem.brandId}
                                detailCode={elem.detailCode}
                            />
                        </div>
                    )
                }
            },
            {
                title:  <div title={this.props.intl.formatMessage({id: 'order_form_table.AI_title'})}>
                            <FormattedMessage id="order_form_table.AI" />
                        </div>,
                key:       'AI',
                dataIndex: 'store',
                width:     '3%',
                render: (store)=>{
                    return (
                        <AvailabilityIndicator
                            indexArray={store}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null && this.state.radioValue != 2}
                            value={Math.round(data*10)/10 || 0}
                            className={Styles.detailNumberInput}
                            min={0}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                elem.purchasePrice = value;
                                this.setState({});
                            }}
                        />
                    )
                }
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
                key:       'price',
                dataIndex: 'price',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null && this.state.radioValue != 2}
                            value={Math.round(data*10)/10 || 1}
                            className={Styles.detailNumberInput}
                            min={1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                elem.price = value;
                                telem.sum = value * elem.count;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.count" />,
                key:       'count',
                dataIndex: 'count',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null && this.state.radioValue != 2}
                            value={Math.round(data*10)/10 || 1}
                            className={Styles.detailNumberInput}
                            min={0.1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                elem.count = value;
                                elem.sum = value * elem.price;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.sum' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'sum',
                width:     '5%',
                render: (elem)=>{
                    const sum = elem.price * (elem.count || 1);
                    return (
                        <InputNumber
                            disabled
                            className={Styles.detailNumberInput}
                            value={sum ? Math.round(sum*10)/10 : 1}
                            style={{color: "black"}}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
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
                                elem.storeGroupId = this.state.editing || elem.related ? elem.storeGroupId : undefined;
                                elem.detailName = undefined;
                                elem.comment = {
                                    comment: undefined,
                                    positions: [],
                                };
                                elem.brandId = undefined;
                                elem.brandName = undefined;
                                elem.detailCode = undefined;
                                elem.supplierName = undefined;
                                elem.supplierId = undefined;
                                elem.supplierBrandId = undefined;
                                elem.store = null;
                                elem.purchasePrice = 0;
                                elem.price = 1;
                                elem.count = 1;
                                elem.sum = undefined;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
        ];
    }

    handleOk = () => {
        const { editing, mainTableSource, relatedServices, relatedDetails, relatedDetailsCheckbox } = this.state;
        if(editing) {
            this.props.updateDetail(this.props.tableKey, {...mainTableSource[0]});
        }
        else {
            var data = {
                insertMode: true,
                details: [],
                services: [],
            }
            mainTableSource.map((element)=>{
                if(!element.productId) {
                    data.details.push({
                        storeGroupId: element.storeGroupId,
                        name: element.detailName,
                        productCode: element.detailCode,
                        supplierId: element.supplierId,
                        supplierBrandId: element.supplierBrandId || element.brandId,
                        supplierOriginalCode: element.supplierOriginalCode,
                        supplierProductNumber: element.supplierProductNumber,
                        supplierPartNumber: element.supplierPartNumber,
                        reservedFromWarehouseId: element.reservedFromWarehouseId || null,
                        purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                        count: element.count ? element.count : 1,
                        price: element.price ? Math.round(element.price*10)/10 : 1,
                        comment: element.comment || {
                            comment: undefined,
                            positions: [],
                        },
                    })
                } else {
                    data.details.push({
                        storeGroupId: element.storeGroupId,
                        name: element.detailName,
                        productId: element.productId,
                        productCode: element.detailCode,
                        supplierBrandId: element.supplierBrandId || element.brandId,
                        purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                        count: element.count ? element.count : 1,
                        price: element.price ? Math.round(element.price*10)/10  : 1,
                        reservedFromWarehouseId: element.reservedFromWarehouseId || null,
                        supplierId: element.supplierId,
                        comment: element.comment || {
                            comment: undefined,
                            positions: [],
                        },
                    })
                }
            });
            if(relatedDetailsCheckbox) {
                relatedDetails.map((element)=>{
                    if(element.checked) {
                        if(!element.productId) {
                            data.details.push({
                                storeGroupId: element.storeGroupId,
                                name: element.detailName,
                                productCode: element.detailCode,
                                supplierId: element.supplierId,
                                supplierBrandId: element.supplierBrandId || element.brandId,
                                supplierOriginalCode: element.supplierOriginalCode,
                                supplierProductNumber: element.supplierProductNumber,
                                supplierPartNumber: element.supplierPartNumber,
                                reservedFromWarehouseId: element.reservedFromWarehouseId || null,
                                purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                                count: element.count ? element.count : 1,
                                price: element.price ? Math.round(element.price*10)/10 : 1,
                                comment: element.comment || {
                                    comment: undefined,
                                    positions: [],
                                },
                            })
                        } else {
                            data.details.push({
                                storeGroupId: element.storeGroupId,
                                name: element.detailName,
                                productId: element.productId,
                                productCode: element.detailCode,
                                supplierBrandId: element.supplierBrandId || element.brandId,
                                purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                                count: element.count ? element.count : 1,
                                price: element.price ? Math.round(element.price*10)/10  : 1,
                                reservedFromWarehouseId: element.reservedFromWarehouseId || null,
                                supplierId: element.supplierId,
                                comment: element.comment || {
                                    comment: undefined,
                                    positions: [],
                                },
                            })
                        }
                    }
                });
            }
            relatedServices.map((element)=>{
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
        }
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.setState({
            radioValue: 1,
            mainTableSource: [],
            relatedDetails: [],
            relatedDetailsCheckbox: false,
        });
        this.props.hideModal();
    };

    async getRelatedDetails(id) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_groups/related?id=${id}&limit=3&excludePricelist=false`;
        if(this.props.tecdocId) url += `&modificationId=${this.props.tecdocId}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            console.log(result)
            this.setState({
                relatedDetails: result.storeGroups.map((detail, key)=>{
                    let formattedDetail = {
                        ...detail,
                        key: key,
                        related: true,
                        detailName: detail.name,
                        storeGroupId: detail.id,
                        detailCode: detail.partNumber,
                        comment: {
                            comment: undefined,
                            positions: [],
                            problems: [],
                        },
                        checked: true,
                    };

                    delete formattedDetail.supplierName;
                    delete formattedDetail.supplierId;

                    if(detail.price) {
                        const { id, itemName, partNumber, supplierBrandId, businessSupplierId, businessSupplierName, store, purchasePrice, supplierOriginalCode, supplierProductNumber, supplierPartNumber, isFromStock, defaultWarehouseId } = detail.price;
                        let markup = detail.markup ? detail.markup : 1.4;

                        formattedDetail={
                            ...formattedDetail,
                            detailName: itemName,
                            supplierBrandId: supplierBrandId,
                            supplierId: businessSupplierId,
                            supplierName: businessSupplierName,
                            productId: businessSupplierId == 0 ? id : undefined,
                            store: store,
                            purchasePrice: Math.round(purchasePrice*10)/10,
                            price: Math.round(purchasePrice * markup*10)/10,
                            supplierOriginalCode: supplierOriginalCode,
                            supplierProductNumber: supplierProductNumber,
                            supplierPartNumber: supplierPartNumber,
                            isFromStock: isFromStock,
                            defaultWarehouseId: defaultWarehouseId,
                        };
                    }

                    return formattedDetail;
                })
            })
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    async getDefaultValues(storeGroupId) {
        if(storeGroupId == undefined) {
            return;
        }
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/store_groups/default_detail?storeGroupId=${storeGroupId}&modificationId=${this.props.tecdocId}`;
        if(this.state.editing) params += `&excludePricelist=true`;
        url += params;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if(result) {
                let brands = that.props.brands.slice(0);
                brands.sort((x,y)=>{ 
                    return x.brandId == result.brandId ? -1 : y.brandId == result.brandId ? 1 : 0; 
                });
                that.state.defaultBrandName = result.brandName;
                if(!that.state.editing) {
                    this.state.mainTableSource[0]={
                            ...this.state.mainTableSource[0],
                            brandId: result.brandId,
                            brandName: result.brandName,
                            detailCode: result.partNumber,
                            count: 1,
                        };
                    if(result.price) {
                        const { id, supplierBrandId, businessSupplierId, businessSupplierName, store, purchasePrice, supplierOriginalCode, supplierProductNumber, supplierPartNumber, isFromStock, defaultWarehouseId } = result.price;
                        let markup = result.markup ? result.markup : 1.4;

                        this.state.mainTableSource[0]={
                            ...this.state.mainTableSource[0],
                            supplierBrandId: supplierBrandId,
                            supplierId: businessSupplierId,
                            supplierName: businessSupplierName,
                            productId: businessSupplierId == 0 ? id : undefined,
                            store: store,
                            purchasePrice: Math.round(purchasePrice*10)/10,
                            price: Math.round(purchasePrice * markup*10)/10,
                            supplierOriginalCode: supplierOriginalCode,
                            supplierProductNumber: supplierProductNumber,
                            supplierPartNumber: supplierPartNumber,
                            isFromStock: isFromStock,
                            defaultWarehouseId: defaultWarehouseId,
                        };
                    }
                }
                that.setState({});
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    setCode(related, code, brandId, productId, key, storeGroupId, storeGroupName, supplierOriginalCode, supplierProductNumber, supplierPartNumber) {
        const { mainTableSource, relatedDetails, radioValue } = this.state;
        const brand = this.props.brands.find((elem)=>elem.brandId==brandId);
        const currentDetail = related ? relatedDetails[key] : mainTableSource[key];
        this.unsetSupplier(key, related);

        currentDetail.detailCode = code;
        currentDetail.brandId = brandId;
        currentDetail.brandName = brand.brandName;
        currentDetail.productId = productId;
        currentDetail.supplierOriginalCode = supplierOriginalCode;
        currentDetail.supplierProductNumber = supplierProductNumber;
        currentDetail.supplierPartNumber = supplierPartNumber;
        if(radioValue == 3 || radioValue == 4 || radioValue == 5) {
            currentDetail.storeGroupId = storeGroupId;
            currentDetail.detailName = String(storeGroupName);
        }

        if(related) relatedDetails[key] = currentDetail;
        else mainTableSource[key] = currentDetail;

        this.setState({});
    }

    setSupplier(related, supplierId, supplierName, supplierBrandId, purchasePrice, price, store, supplierOriginalCode, supplierProductNumber, supplierPartNumber, key, isFromStock, defaultWarehouseId, productId, brandId) {
        const { mainTableSource, relatedDetails } = this.state;
        const brand = this.props.brands.find((elem)=>elem.brandId==brandId);
        const currentDetail = related ? relatedDetails[key] : mainTableSource[key];

        currentDetail.supplierId = supplierId;
        currentDetail.supplierName = supplierName;
        currentDetail.supplierBrandId = supplierBrandId;
        currentDetail.purchasePrice = purchasePrice;
        currentDetail.price = price;
        currentDetail.store = store;
        currentDetail.supplierOriginalCode = supplierOriginalCode;
        currentDetail.supplierProductNumber = supplierProductNumber;
        currentDetail.supplierPartNumber = supplierPartNumber;
        currentDetail.isFromStock = isFromStock;
        currentDetail.reservedFromWarehouseId = defaultWarehouseId;
        currentDetail.productId = isFromStock ? productId : undefined;
        if(brand) {
            currentDetail.brandId = brandId;
            currentDetail.brandName = brand && brand.brandName;
        }

        if(related) relatedDetails[key] = currentDetail;
        else mainTableSource[key] = currentDetail;

        this.setState({});
    }

    unsetSupplier(key = 0, related) {
        const { mainTableSource, relatedDetails, radioValue } = this.state;
        const currentDetail = related ? relatedDetails[key] : mainTableSource[key];
        if(radioValue == 5) {
            currentDetail.supplierId = 0;
            currentDetail.supplierName = this.props.intl.formatMessage({id: 'navigation.storage'});
        } else {
            currentDetail.productId = undefined;
            currentDetail.isFromStock = false;
            currentDetail.supplierId = null;
            currentDetail.supplierName = undefined;
            currentDetail.supplierBrandId = undefined;
            currentDetail.supplierOriginalCode = undefined;
            currentDetail.supplierProductNumber = undefined;
            currentDetail.supplierPartNumber = undefined;
            currentDetail.store = undefined;
            currentDetail.reservedFromWarehouseId = undefined;
        }

        if(related) relatedDetails[key] = currentDetail;
        else mainTableSource[key] = currentDetail;

        this.setState({});
    }

    setVinDetail(code, name, key, related) {
        this.state.mainTableSource[0].detailName = name;
        this.state.mainTableSource[0].detailCode = code;
        
        const oesBrand = this.props.brands.find((brand)=>brand.brandId==8000);
        this.state.mainTableSource[0].brandName = oesBrand ? oesBrand.brandName : undefined;
        this.state.mainTableSource[0].brandId = oesBrand ? oesBrand.brandId : undefined;
        this.state.radioValue = 3;

        this.state.mainTableSource[0].purchasePrice = undefined;
        this.state.mainTableSource[0].price = 0;
        this.state.mainTableSource[0].count = 1;

        this.setState({});
    }

    async addDetailsAndLabors(data) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
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
                this.props.updateDataSource();
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    fetchData() {
        this.labors = this.props.labors;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url =  __API_URL__ + '/business_suppliers?all=true';
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
            data.map((elem, index)=>{
                elem.key = index;
            })
            that.suppliers = data;
            that.getOptions();
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }


    getOptions() {
        this.servicesOptions = this.props.labors.map((elem, index)=>(
            <Option key={index} value={elem.laborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                {elem.name ? elem.name : elem.defaultName}
            </Option>
        ));
        
        this.suppliersOptions = this.suppliers.map((elem, index)=>(
            <Option key={index} value={elem.id}>
                {elem.name}
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

    componentDidUpdate(prevProps) {
        if(prevProps.visible == false && this.props.visible) {
            const editing = Boolean(this.props.detail.storeGroupId);
            this.setState({
                editing: editing,
                mainTableSource: [{...this.props.detail, key: 0}],
            })
            this.getDefaultValues(this.props.detail.storeGroupId);
        }
        if(!prevProps.showOilModal && this.props.showOilModal) {
            this.setState({
                radioValue: 4,
            })
        }
    }

    render() {
        const { visible, tableMode } = this.props;
        return (
            <div>
                <Modal
                    width="95%"
                    visible={visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    <div>
                        <Radio.Group 
                            value={this.state.radioValue}
                            onChange={(event)=>{
                                if(event.target.value == 5) {
                                    this.unsetSupplier();
                                    this.state.mainTableSource[0].supplierId = 0;
                                    this.state.mainTableSource[0].supplierName = this.props.intl.formatMessage({id: 'navigation.storage'});
                                }
                                this.setState({
                                    radioValue: event.target.value,
                                })
                            }} 
                        >
                            <Radio value={1}><FormattedMessage id="details_table.selection_by_car"/></Radio>
                            <Radio value={2}><FormattedMessage id="details_table.direct_editing"/></Radio>
                            <Radio value={3}><FormattedMessage id="details_table.selection_by_product_code"/></Radio>
                            <Radio value={4}><FormattedMessage id="details_table.oils_and_liquids"/></Radio>
                            <Radio value={5}><FormattedMessage id="navigation.storage"/></Radio>
                        </Radio.Group>
                    </div>
                    <div className={Styles.tableWrap} style={{overflowX: 'scroll'}}>
                        <div className={Styles.modalSectionTitle}>
                            <div style={{display: 'block'}}>
                                <FormattedMessage id="order_form_table.diagnostic.detail"/>
                            </div>
                        </div>
                        <Table
                            dataSource={this.state.mainTableSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                    <div style={{marginTop: 15}}>
                        <FormattedMessage id="add_order_form.related"/>: <FormattedMessage id="add_order_form.details"/>
                        <Checkbox
                            style={{marginLeft: 5}}
                            disabled={this.state.editing}
                            checked={this.state.relatedDetailsCheckbox}
                            onChange={()=>{
                                this.setState({
                                    relatedDetailsCheckbox: !this.state.relatedDetailsCheckbox
                                })
                            }}
                        /> 
                    </div>
                    {this.state.relatedDetailsCheckbox &&
                        <div className={Styles.tableWrap} style={{overflowX: 'scroll'}}>
                            <Table
                                dataSource={this.state.relatedDetails}
                                columns={this.mainTableColumns}
                                pagination={false}
                            />
                        </div>
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
            currentCommentaryProps: {
                name: props.detail,
                positions : [],
            },
            currentCommentary: undefined,
        }
        this.commentaryInput = React.createRef();
        this.positions = [
            "front_axle",
            "ahead",
            "overhead",
            "rear_axle",
            "behind",
            "down_below",
            "Right_wheel",
            "on_right",
            "outside",
            "left_wheel",
            "left",
            "inside",
            "lever_arm",
            "at_both_sides",
            "centered",
        ];
        this._isMounted = false;
    }

    showModal = () => {
        this.setState({
            currentCommentary: this.props.commentary.comment ? this.props.commentary.comment : this.props.detail,
            visible: true,
        });
        if(this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    };

    handleOk = async () => {
        const {currentCommentary, currentCommentaryProps} = this.state;
        this.setState({
            loading: true,
        });
        this.props.setComment(currentCommentary, currentCommentaryProps.positions);
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 500);
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            currentCommentary: this.props.detail, 
            currentCommentaryProps: {
                name: this.props.detail,
                positions : [],
            },
        });
    };

    renderHeader = () => {
        return (
            <div>
              <p>
                  {this.props.detail}
              </p>
            </div>
          );
    }

    getCommentary() {
        const { currentCommentaryProps } = this.state;
        var currentCommentary = this.props.detail;

        if(currentCommentaryProps.positions.length) {
            currentCommentary += ' -'
            currentCommentary += currentCommentaryProps.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) + ';';
        }
        this.setState({
            currentCommentary: currentCommentary
        });
    }

    setCommentaryPosition(position) {
        const { currentCommentaryProps } = this.state;
        const positionIndex = currentCommentaryProps.positions.indexOf(position);
        if(positionIndex == -1) {
            currentCommentaryProps.positions.push(position);
        }
        else {
            currentCommentaryProps.positions = currentCommentaryProps.positions.filter((value, index)=>index != positionIndex);
        }
        this.getCommentary();
    }


    componentDidMount() {
        this._isMounted = true;
        const { commentary, detail } = this.props;
        if(this._isMounted) {
            this.setState({
                currentCommentaryProps: {
                    name: detail,
                    positions: commentary.positions || [],
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading, currentCommentaryProps, currentCommentary } = this.state;
        const { disabled, commentary } = this.props;
        const { positions } = this;

        return (
            <div>
                {commentary.comment ? (
                    <Button
                        className={Styles.commentaryButton}
                        onClick={this.showModal}
                        title={this.props.intl.formatMessage({id: "commentary.edit"})}
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
                        title={this.props.intl.formatMessage({id: "commentary.add"})}
                    >
                        <Icon type="message" />
                    </Button>
                )}
                <Modal
                    visible={visible}
                    title={this.renderHeader()}
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
                    <>
                    <div className={Styles.commentaryVehicleSchemeWrap}>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='commentary_modal.where'/>?
                        </p>
                        <div className={Styles.blockButtonsWrap}>
                            {positions.map((position, key)=> {
                                return (
                                    <Button
                                        key={key}
                                        type={currentCommentaryProps.positions.findIndex((elem)=>position==elem) > -1 ? 'normal' : 'primary'}
                                        className={Styles.commentaryBlockButton}
                                        onClick={()=>{this.setCommentaryPosition(position)}}
                                    >
                                        <FormattedMessage id={position}/>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='order_form_table.diagnostic.commentary' />
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
                    </>
                </Modal>
            </div>
        );
    }
}

class VinCodeModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            displayType: 'list',
            categoryMode: false,
            categories: [],
            visible: false,
            loading: false,
            zoomed: false,
            itemsInfo: [],
            blockPositions: [],
            tableHoverCode: undefined,
            imgHoverCode: undefined,
            imgHoverIndex: undefined,
            checkedCodes: [],
            infoModalVisible: false,
            infoItem: undefined,
            imageList: [],
            image: undefined,
            itemsListEmpty: false,
            zoomMultiplier: 0.75,
            allCategories: [],
            imgSearch: "",
            listItemPreview: [],
            previewIndex: undefined,
            variantRadioValue: 0,
        };
        this.showInfoModal = this.showInfoModal.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);

        this.columns = [
            {
                title:     '№',
                key:       'key',
                dataIndex: 'key',
                width:     'auto',
                render: (data, elem)=>{
                    const itemsInfo = this.state.itemsInfo.length ? this.state.itemsInfo[this.state.itemsInfo.length-1] : [];
                    const isChecked = this.state.checkedCodes.indexOf(elem.codeonimage) >= 0;
                    const isVariant = itemsInfo.findIndex((item)=>item.key == elem.key || item.codeonimage == elem.codeonimage) != elem.key;
                    const outputText = !isVariant || !elem.codeonimage ? elem.codeonimage || data + 1 : 'Var.';
                    return (
                        <span
                            style={{
                                color: isVariant ? 'var(--text2)' : 'var(--text1)',
                                fontSize: 12,
                            }}
                        >
                            {isChecked ? 
                                <Radio
                                    checked={this.state.variantRadioValue == data}
                                    onChange={(event)=>{
                                        this.setState({
                                            variantRadioValue: data,
                                        })
                                    }}
                                >
                                    {outputText}
                                </Radio> :
                                outputText
                            }
                        </span>
                    )
                }
            },
            {
                title:     <FormattedMessage id="order_form_table.detail_code" />,
                key:       'oem',
                dataIndex: 'oem',
                width:     'auto',
                render: (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id="order_form_table.detail_name" />,
                key:       'name',
                dataIndex: 'name',
                width:     'auto',
                render: (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                key:       'action',
                width:     'auto',
                className: Styles.infoActionButtonCol,
                render: (elem)=>{
                    var title = '';
                    if(elem.attributes && elem.attributes.length) {
                        elem.attributes.map((attr)=>{
                            title += `${attr.name}: ${attr.value}\n`
                        })
                    }
                    return (
                        <Icon
                            title={title}
                            type="question-circle"
                            style={{
                                fontSize: 18,
                                pointerEvents: 'all',
                            }}
                            onClick={()=>this.showInfoModal(elem.name, elem.attributes, elem.codeonimage)}
                        />
                    )
                }
            },
        ]
    }

    showInfoModal(name, attributes, code = -1) {
        this.setState({
            infoItem: {
                name: name,
                body: attributes.map((attr, i)=>
                    <p
                        key={i}
                    >
                        <b>{attr.name}:</b> {attr.value}
                    </p>
                )
            },
            infoModalVisible: true,
        })
    }

    onImgLoad({target:img}) {
        if(this.state.imageList.length) {
            this.state.imageList[this.state.imageList.length-1].height = img.naturalHeight;
            this.state.imageList[this.state.imageList.length-1].width = img.naturalWidth;
        }
        this.setState({});
    }


    handleOk = () => {
        const { checkedCodes, variantRadioValue } = this.state;
        const itemsInfo = this.state.itemsInfo.length ? this.state.itemsInfo[this.state.itemsInfo.length-1] : [];
        const selectedItem = itemsInfo.find((item)=>item.key == variantRadioValue);
        if(selectedItem) this.props.setVinDetail(selectedItem.oem, selectedItem.name);
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            displayType: 'list',
            categoryMode: false,
            categories: [],
            visible: false,
            loading: false,
            zoomed: false,
            itemsInfo: [],
            blockPositions: [],
            tableHoverCode: undefined,
            imgHoverCode: undefined,
            imgHoverIndex: undefined,
            checkedCodes: [],
            infoModalVisible: false,
            infoItem: undefined,
            imageList: [],
            image: undefined,
            itemsListEmpty: false,
            zoomMultiplier: 0.75,
            allCategories: [],
            imgSearch: "",
            listItemPreview: [],
            previewIndex: undefined,
            variantRadioValue: 0,
        })
    }

    handleBack = () => {
        if(this.state.categoryMode && !this.props.storeGroupId) {
            this.setState({
                categories: this.state.allCategories,
                categoryMode: true,
            })
        }
        else {
            if(this.state.itemsInfo.length > 1) {
                const itemsInfo = this.state.itemsInfo.pop();
                const blockPositions = this.state.blockPositions.pop();
                const imageList = this.state.imageList.pop();
                this.setState({
                    itemsInfo: itemsInfo,
                    blockPositions: blockPositions,
                    imageList: imageList,
                    checkedCodes: [],
                })
            }
            else {
                this.setState({
                    categoryMode: true,
                    checkedCodes: [],
                })
            }
        }
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        if(this.props.storeGroupId) {
            let url =  __API_URL__ + `/vin/list_quick_detail?vin=${this.props.vin}&storeGroupId=${this.props.storeGroupId}`;
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
                if(data) {
                    const { catalog, ssd, vehicleid } = data.vehicle;
                    const categoriesArray = data.categories;
                    const normalizedCategories = [];

                    if(categoriesArray.length) {
                        categoriesArray.map((elem)=>{
                            if(elem.units.length == 1) {
                                elem.name = elem.units[0].name;
                                normalizedCategories.push({
                                    catalog: catalog,
                                    vehicleId: vehicleid,
                                    ssd: ssd,
                                    ...elem,
                                    unit: {...elem.units[0]},
                                });
                            }
                            else {
                                elem.units.map((unit)=>{
                                    elem.name = unit.name;
                                    normalizedCategories.push({
                                        catalog: catalog,
                                        vehicleId: vehicleid,
                                        ssd: ssd,
                                        ...elem,
                                        unit: unit,
                                    });
                                })
                            }
                            
                        })
                    }
                    if(normalizedCategories.length == 1) {
                        that.setState({
                            loading: false,
                            categoryMode: false,
                            categories: normalizedCategories,
                            displayType: 'grid',
                        })
                        that.fetchItemsList(normalizedCategories[0].unit.ssd, normalizedCategories[0].unit.unitid, normalizedCategories[0].catalog);
                    }
                    else {
                        for (var i = 0; i < normalizedCategories.length % 3; i++) {
                            normalizedCategories.push({
                                emptyElement: true,
                            })
                        }
                        that.setState({
                            loading: false,
                            displayType: 'grid',
                            categoryMode: normalizedCategories.length,
                            categories: normalizedCategories,
                        })
                    }
                }
                else {
                    that.setState({
                        loading: false,
                        itemsListEmpty: true,
                    })
                }
            })
            .catch(function (error) {
                console.log('error', error);
                that.setState({
                    loading: false,
                    itemsListEmpty: true,
                })
            })
        }
        else {
            let url =  __API_URL__ + `/vin/categories?vin=${this.props.vin}`;
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
            .then(function ({data}) {
                if(data) {
                    const { catalog, ssd, vehicleid } = data.response.FindVehicle.response.FindVehicle[0].row[0].$;
                    const categoriesArray = data.response.ListCategories[0].row;
                    const normalizedCategories = [];

                    if(categoriesArray.length) {
                        categoriesArray.map((elem)=>{
                            normalizedCategories.push({
                                catalog: catalog,
                                vehicleId: vehicleid,
                                ...elem.$,
                                unit: {...elem.$},
                            });
                        })
                    }
                    if(normalizedCategories.length == 1) {
                        that.setState({
                            loading: false,
                            categoryMode: false,
                            categories: normalizedCategories,
                        })
                        that.fetchItemsList(normalizedCategories[0].unit.ssd, normalizedCategories[0].unit.unitid, normalizedCategories[0].catalog);
                    }
                    else {
                        if(that.state.displayType == 'grid') {
                            for (var i = 0; i < normalizedCategories.length % 5; i++) {
                                normalizedCategories.push({
                                    emptyElement: true,
                                })
                            }
                        }
                        that.setState({
                            loading: false,
                            categoryMode: normalizedCategories.length,
                            categories: normalizedCategories,
                            allCategories: normalizedCategories,
                        })
                    }
                    if(that.state.displayType == 'list' && normalizedCategories.length) {
                        that.fetchCategoryItemsList(
                            normalizedCategories[0].ssd,
                            normalizedCategories[0].catalog,
                            normalizedCategories[0].categoryid,
                            normalizedCategories[0].vehicleId,
                            true,
                            0
                        )
                    }
                }
                else {
                    that.setState({
                        loading: false,
                        itemsListEmpty: true,
                    })
                }
            })
            .catch(function (error) {
                console.log('error', error);
                that.setState({
                    loading: false,
                    itemsListEmpty: true,
                })
            })
        }
    }

    fetchItemsList(ssd, unitId, catalog) {
        this.setState({
            loading: true,
        })
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url =  __API_URL__ +`/vin/list_detail_by_unit_id?ssd=${ssd}`+
                                `&unitId=${unitId}&catalog=${catalog}`;
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
        .then(function ({data}) {
            const itemsInfo = [];
            const blockPositions = [];
            const image = data.response.GetUnitInfo[0].row[0].$;
            data.response.ListDetailsByUnit[0].row.map(({$: item, attribute}, key)=>{
                itemsInfo.push({
                    key: key,
                    ...item,
                    attributes: attribute && attribute.map((attr)=>attr.$),
                })
            });
            data.response.ListImageMapByUnit[0].row.map(({$: position}, key)=>{
                blockPositions.push({
                    ...position,
                    key: key,
                });
            })
            that.setState({
                loading: false,
                imageList: [image],
                itemsInfo: [itemsInfo],
                blockPositions: [blockPositions],
                categoryMode: false,
            })
        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({
                loading: false,
                itemsInfo: [],
                blockPositions: [],
                categoryMode: false,
            })
        })
    }

    fetchCategoryItemsList(ssd, catalog, categoryid, vehicleId, previewMode = false, index) {
        if(!previewMode) {
            this.setState({
                loading: true,
            })
        }
        else {
            this.setState({
                previewIndex: index,
            })
        }
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url =  __API_URL__ + `/vin/list_units?catalog=${catalog}&vehicleid=${vehicleId}&categoryId=${categoryid}&ssd=${ssd}`
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
        .then(function ({data}) {
            if(data) {
                const categoriesArray = data.response.ListUnits[0].row;
                const normalizedCategories = [];

                if(categoriesArray.length) {
                    categoriesArray.map((elem)=>{
                        normalizedCategories.push({
                            catalog: catalog,
                            vehicleId: vehicleId,
                            ...elem.$,
                            unit: {...elem.$},
                        });
                    })
                }
                if(previewMode) {
                    for (var i = 0; i < normalizedCategories.length % 3; i++) {
                        normalizedCategories.push({
                            emptyElement: true,
                        })
                    }
                    that.setState({
                        loading: false,
                        listItemPreview: normalizedCategories,
                        
                    })
                }
                else {
                    if(normalizedCategories.length == 1) {
                        that.setState({
                            loading: false,
                            categoryMode: false,
                            categories: normalizedCategories,
                        })
                        that.fetchItemsList(normalizedCategories[0].unit.ssd, normalizedCategories[0].unit.unitid, normalizedCategories[0].catalog);
                    }
                    else {
                        for (var i = 0; i < normalizedCategories.length % 5; i++) {
                            normalizedCategories.push({
                                emptyElement: true,
                            })
                        }
                        that.setState({
                            loading: false,
                            categoryMode: normalizedCategories.length,
                            categories: normalizedCategories,
                        })
                    }
                }
            }
            else {
                that.setState({
                    loading: false,
                    itemsListEmpty: true,
                })
            }
        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({
                loading: false,
                itemsInfo: [],
                blockPositions: [],
                categoryMode: true,
            })
        })
    }

    searchImage(code) {
        this.setState({
            loading: true,
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(!prevState.visible && this.state.visible) {
            this.setState({
                loading: true,
            })
            this.fetchData()
        }
    }

    render() {
        const { disabled } = this.props;
        const {
            displayType,
            visible,
            zoomed,
            positions,
            tableHoverCode,
            imgHoverCode,
            imgHoverIndex,
            checkedCodes,
            infoItem,
            infoModalVisible,
            loading,
            categories,
            categoryMode,
            imageList,
            itemsListEmpty,
            zoomMultiplier,
            allCategories,
            imgSearch,
            listItemPreview,
            previewIndex,
        } = this.state;

        const itemsInfo = this.state.itemsInfo.length ? this.state.itemsInfo[this.state.itemsInfo.length-1] : [];
        const blockPositions = this.state.blockPositions.length ? this.state.blockPositions[this.state.blockPositions.length-1] : [];
        const image = this.state.imageList.length ? this.state.imageList[this.state.imageList.length-1] : undefined;

        return (
            <>
                <Button
                    type='primary'
                    disabled={disabled}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                        })
                    }}
                >
                    VIN
                </Button>
                <Modal
                    width='fit-content'
                    style={{
                        maxWidth: '95%',
                        minWidth: displayType == 'list' ? '85%' : '70%'
                    }}
                    visible={visible}
                    title={<FormattedMessage id='add_order_form.vin'/>}
                    footer={null}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {
                        !loading && !itemsListEmpty && categoryMode && !this.props.storeGroupId && allCategories && allCategories == categories &&
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                margin: '-16px 0 8px 0'
                            }}
                        >
                            <div style={{fontSize: 18}}>
                                {(displayType == 'list' && categories.length > previewIndex) ? categories[previewIndex].name : null}
                            </div>
                            <Radio.Group
                                value={displayType}
                                buttonStyle="solid"
                                onChange={(event)=>{
                                    this.setState({
                                        displayType: event.target.value,
                                    })
                                }}
                            >
                                <Radio.Button value="list">
                                    <Icon
                                        type="unordered-list"
                                        style={{
                                            fontSize: 18,
                                            verticalAlign: 'middle'
                                        }}
                                    />
                                </Radio.Button>
                                <Radio.Button value="grid">
                                    <div
                                        style={{

                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 18,
                                                height: 18,
                                                backgroundColor: displayType == 'grid' ? 'white' : 'var(--text3)',
                                                mask: `url(${images.gridIcon}) no-repeat center / contain`,
                                                WebkitMask: `url(${images.gridIcon}) no-repeat center / contain`,
                                                display: 'inline-block',
                                                verticalAlign: 'middle'
                                            }}
                                        ></div>
                                    </div>
                                </Radio.Button>
                            
                            </Radio.Group>
                        </div>
                    }
                    {!loading && !itemsListEmpty && (!categoryMode || !this.props.storeGroupId && allCategories && allCategories != categories) &&
                        <div 
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                margin: '-16px 0 8px 0'
                            }}
                        >
                            <div
                                style={{display: 'none'}}
                            >
                                <Input 
                                    onChange={(event)=>{
                                        this.setState({
                                            imgSearch: event.target.value,
                                        })
                                    }}
                                />
                                <Button
                                    onClick={()=>{
                                        this.searchImage(imgSearch);
                                    }}
                                >
                                    <FormattedMessage id='back' />
                                </Button>
                            </div>
                            <Button key="back" onClick={this.handleBack}>
                                <FormattedMessage id='step_back'/>
                            </Button>
                            <Button disabled={checkedCodes.length == 0} key="submit" type="primary" onClick={this.handleOk} style={{marginLeft: 10}}>
                                <FormattedMessage id='select'/>
                            </Button>
                        </div>
                    }
                    {loading ? <Spin indicator={spinIcon} /> :
                    categoryMode && !itemsListEmpty ? 
                    <div className={Styles.categoryList}>
                        {displayType == 'grid' ?
                            categories.map((category, key)=>{
                                return category.emptyElement ? <div key={key} className={Styles.emptyItem} style={{pointerEvents: 'none'}}></div> : 
                                <div
                                    className={Styles.categoryItem}
                                    key={key}
                                    onClick={()=>{
                                        if(category.unit.imageurl)
                                            this.fetchItemsList(category.unit.ssd, category.unit.unitid, category.catalog);
                                        else 
                                            this.fetchCategoryItemsList(category.ssd, category.catalog, category.categoryid, category.vehicleId)
                                    }}
                                >
                                {category.unit.imageurl &&
                                    <img
                                        title={category.unit.name}
                                        src={category.unit.imageurl.replace('%size%', 'source')}
                                        style={{
                                            cursor: 'pointer',
                                            width: '100%'
                                        }}
                                    />}
                                    <div
                                        className={Styles.categoryName}
                                    >
                                        {category.name}
                                    </div>
                                </div>
                            }) :
                            <>
                            <div className={Styles.allCategoriesList}>
                                {categories.map((category, key)=>{
                                    return category.emptyElement ? <div key={key} className={Styles.emptyItem} style={{pointerEvents: 'none'}}></div> : 
                                    <div
                                        className={Styles.categoryListItem}
                                        style={previewIndex == key ? {
                                            backgroundColor: 'var(--db_reserve)'
                                        } : {}}
                                        key={key}
                                        onClick={()=>{
                                            this.fetchCategoryItemsList(category.ssd, category.catalog, category.categoryid, category.vehicleId, true, key)
                                        }}
                                    >
                                        <div
                                            className={Styles.categoryListName}
                                        >
                                            {category.name}
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className={Styles.previewBLock}>
                                {listItemPreview.length == 0 ? <FormattedMessage id='no_data' /> :
                                    listItemPreview.map((item, key)=>{
                                        return item.emptyElement ? <div key={key} className={Styles.emptyItem} style={{pointerEvents: 'none', width: '33%'}}></div> : 
                                            <div
                                                key={key}
                                                className={Styles.categoryItem}
                                                style={{
                                                    width: '33%',
                                                    height: 'fit-content',
                                                }}
                                                onClick={()=>{
                                                    this.fetchItemsList(item.unit.ssd, item.unit.unitid, item.catalog);
                                                }}
                                            >
                                                <img
                                                    title={item.unit.name}
                                                    src={item.unit.imageurl.replace('%size%', 'source')}
                                                    style={{
                                                        cursor: 'pointer',
                                                        width: '100%'
                                                    }}
                                                />
                                                <div
                                                    className={Styles.categoryName}
                                                >
                                                    {item.name}
                                                </div>
                                            </div>
                                    })
                                }
                            </div>
                            </>
                        }
                    </div> : 
                    !itemsListEmpty ? <>
                    <div
                        className={Styles.categoryTitle}
                    >
                        {image && image.name}
                    </div>
                    <div className={Styles.vinModal}>
                        <div className={Styles.imgWrap}>
                            <div className={Styles.zoomActionBlock}>
                                <Icon
                                    type={zoomed ? 'zoom-out' : 'zoom-in'}
                                    style={{
                                        fontSize: 24,
                                        zIndex: 9999,
                                    }}
                                    onClick={()=>{
                                        this.setState({
                                            zoomed: !zoomed,
                                        })
                                    }}
                                />
                                <Icon
                                    type='minus'
                                    style={{
                                        marginLeft: 15,
                                    }}
                                />
                                <Slider
                                    dots
                                    value={zoomMultiplier}
                                    step={0.1}
                                    min={0.25}
                                    max={2}
                                    style={{
                                        minWidth: 200,
                                    }}
                                    onChange={(value)=>{
                                        this.setState({zoomMultiplier: value})
                                    }}
                                />
                                <Icon type='plus'/>
                            </div>
                            <div
                                className={Styles.zoomBlock}
                                style={{
                                    width: `${100*zoomMultiplier}%`
                                }}
                            >
                                {blockPositions.map((item, key)=>{
                                    const code = item.code;
                                    const mainItem = itemsInfo.find((elem)=>elem.codeonimage == code);
                                    const title = mainItem ? mainItem.name : "";
                                    const isHovered =  imgHoverCode == code || imgHoverIndex == key;
                                    const isChecked = checkedCodes.indexOf(code) >= 0;
                                    return (
                                        <div
                                            className={`${Styles.zoomBlockItem} ${isHovered && Styles.hoveredItem} ${isChecked && Styles.checkedItem}`}
                                            key={key}
                                            style={{
                                                left: `${(item.x1 / image.width)*100}%`,
                                                top: `${(item.y1 / image.height)*100}%`,
                                                width: `${((item.x2-item.x1) / image.width)*100}%`,
                                                height: `${((item.y2-item.y1) / image.height)*100}%`,
                                            }}
                                            title={title}
                                            onMouseEnter={(event)=>{
                                                this.setState({
                                                    tableHoverCode: code,
                                                    imgHoverIndex: key,
                                                })
                                            }}
                                            onMouseLeave={(event)=>{
                                                this.setState({
                                                    tableHoverCode: undefined,
                                                    imgHoverIndex: undefined,
                                                })
                                            }}
                                            onClick={(event)=>{
                                                if(event.ctrlKey) {
                                                    if(!isChecked) {
                                                        checkedCodes.push(code);
                                                        this.setState({});
                                                    }
                                                    else {
                                                        this.setState({
                                                            checkedCodes: checkedCodes.filter((index)=>index!=code),
                                                        })
                                                    }
                                                }
                                                else {
                                                    this.setState({
                                                        checkedCodes: [code],
                                                        variantRadioValue: mainItem.key,
                                                    })
                                                }
                                                
                                            }}
                                        >
                                        </div>
                                    )
                                })}
                                <img
                                    width={`${100}%`}
                                    src={`${image && image.imageurl.replace('%size%', 'source')}`}
                                    onLoad={this.onImgLoad}
                                />
                                <Modal
                                    visible={zoomed}
                                    title={image && image.name.toUpperCase()}
                                    footer={[]}
                                    width={'85%'}
                                    onCancel={()=>{
                                        this.setState({
                                            zoomed: false,
                                        })
                                    }}
                                >
                                    <img
                                        width='100%'
                                        src={`${image && image.imageurl.replace('%size%', 'source')}`}
                                    />
                                </Modal>
                            </div>
                        </div>
                        <div className={Styles.listWrap}>
                            <Table
                                bordered
                                loading={loading}
                                columns={this.columns}
                                dataSource={itemsInfo}
                                rowClassName={(record, rowIndex)=>{
                                    const code = record.codeonimage;
                                    const isHovered = tableHoverCode == code;
                                    const isChecked = checkedCodes.indexOf(code) >= 0;
                                    return `${Styles.listTableRow} ${isHovered && Styles.tableRowHovered} ${isChecked && Styles.checkedRow}`
                                }}
                                onRow={(record, rowIndex) => {
                                    const code = record.codeonimage;
                                    return {
                                      onClick: event => {
                                        if(event.ctrlKey) {
                                            const isChecked = checkedCodes.indexOf(code) >= 0;
                                            if(!isChecked) {
                                                checkedCodes.push(code);
                                                this.setState({});
                                            }
                                            else {
                                                this.setState({
                                                    checkedCodes: checkedCodes.filter((index)=>index!=code),
                                                })
                                            }
                                        }
                                        else {
                                            this.setState({
                                                checkedCodes: [code],
                                                variantRadioValue: record.key,
                                            })
                                        }
                                      },
                                      onMouseEnter: event => {
                                        this.setState({
                                            imgHoverCode: code,
                                        })
                                      },
                                      onMouseLeave: event => {
                                        this.setState({
                                            imgHoverCode: undefined,
                                        })
                                      },
                                    };
                                }}
                                pagination={false}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'none',
                            textAlign: 'end',
                            fontSize: 12,
                            color: 'var(--text2)',
                        }}
                    >
                        <i style={{color: 'var(--required)'}}>* </i>Ctrl + click to select multiple item
                    </div>
                    </> :
                    <FormattedMessage id='no_data' />}
                    <Modal
                        visible={infoModalVisible}
                        title={infoItem && infoItem.name.toUpperCase()}
                        footer={[]}
                        onCancel={()=>{
                            this.setState({
                                infoModalVisible: false,
                            })
                        }}
                    >
                        {infoItem && infoItem.body}
                    </Modal>
                </Modal>
            </>
        )
    }
}