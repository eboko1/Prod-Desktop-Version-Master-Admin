// vendor
import React, { Component } from 'react';
import { Button, Modal, Icon, Select, Input, InputNumber, Radio, Table, TreeSelect, Checkbox, Spin, Slider } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { DetailStorageModal, DetailSupplierModal, OilModal } from 'modals';
import { AvailabilityIndicator } from 'components';
import { permissions, isForbidden, images } from 'utils';
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
                            style={{minWidth: 240, color: 'var(--text)'}}
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
                                elem.multiplier = option.props.multiplier;
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
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'detailName',
                dataIndex: 'detailName',
                render: (data, elem)=>{
                    return (
                        <Input
                            disabled={elem.storeGroupId == null && this.state.radioValue == 1}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            style={{minWidth: 240}}
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
                                elem.sum = value * elem.count;
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
        this.unsetSupplier(key, related);
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

    getMobileForm() {
        const { mainTableSource } = this.state;
        const dataSource = mainTableSource[0] || {};
        const columns = [...this.mainTableColumns];
        columns.pop();

        return columns.map(({title, key, render, dataIndex})=>{
            return (
                <div>
                    {title}
                    <div>
                        {dataIndex ? 
                            render(dataSource[dataIndex], dataSource) :
                            render(dataSource)
                        }
                    </div>
                </div>
            )
        })
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
        if(isForbidden(this.props.user, permissions.ACCESS_ORDER_DETAILS_FIND_FROM_VEHICLE) && this.state.radioValue == 1) {
            this.setState({radioValue: 2});
        }
    }

    render() {
        const { visible, tableMode, isMobile } = this.props;
        return (
            <div>
                <Modal
                    visible={visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    maskClosable={false}
                    style={!isMobile ? {
                        minWidth: 560,
                        width: '"min-content',
                    } : {
                        width: '95%',
                    }}
                >
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <div style={{display: 'block'}}>
                                <FormattedMessage id="order_form_table.diagnostic.detail"/>
                            </div>
                        </div>
                        {!isMobile ?
                            <Table
                                dataSource={this.state.mainTableSource}
                                columns={this.mainTableColumns}
                                pagination={false}
                            /> :
                            this.getMobileForm()
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}
export default DetailProductModal;