// vendor
import React, { Component } from 'react';
import { Button, Modal, Icon, Select, Input, InputNumber, Radio, Table, TreeSelect, Checkbox, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { DetailStorageModal, DetailSupplierModal } from 'modals';
import { AvailabilityIndicator } from 'components';
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
            relatedDetailsSource: [],
            relatedServicesSource: [],
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
        this.relatedDetailsOptions = [];

        this.setCode = this.setCode.bind(this);
        this.setSupplier = this.setSupplier.bind(this);
        this.setComment = this.setComment.bind(this);

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
                            disabled={this.state.editing}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.store_group'})}
                            style={{maxWidth: 180}}
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
                                if(this.state.radioValue != 2) {
                                    this.getDefaultValues(value);
                                }
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
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
                render: (data, elem)=>{
                    return (
                        <Input
                            disabled={elem.storeGroupId == null && this.state.radioValue != 2}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
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
                title:  <FormattedMessage id="comment" />,
                key:       'comment',
                dataIndex: 'comment',
                width:     '3%',
                render: (data, elem)=>{
                    var detail = elem.detailName;
                    if(detail && detail.indexOf(' - ') > -1) {
                        detail = detail.slice(0, detail.indexOf(' - '));
                    }
                    return (
                        <CommentaryButton
                            disabled={elem.storeGroupId == null && this.state.radioValue != 2}
                            commentary={
                                data || 
                                {
                                    comment: undefined,
                                    positions: [],
                                }
                            }
                            detail={detail}
                            setComment={this.setComment}
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
                            this.state.mainTableSource[0].brandId = defaultBrand.brandId;
                            this.setState({
                                update: true
                            })
                        }
                    }
                    return (
                        <Select
                            showSearch
                            disabled={elem.storeGroupId == null && this.state.radioValue != 2 && this.state.radioValue != 3}
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
                            onSelect={(value, option)=>{
                                this.state.mainTableSource[0].detailCode = undefined;
                                this.state.mainTableSource[0].supplierName = undefined;
                                this.state.mainTableSource[0].supplierBrandId = undefined;
                                this.state.mainTableSource[0].supplierId = undefined;
                                this.state.mainTableSource[0].store = null;
                                this.state.mainTableSource[0].purchasePrice = 0;
                                this.state.mainTableSource[0].price = 1;
                                this.state.mainTableSource[0].count = 1;
                                this.state.mainTableSource[0].sum = undefined;
                                this.state.mainTableSource[0].brandId = value;
                                this.state.mainTableSource[0].brandName = option.props.children;
                                this.setState({
                                    update: true
                                })
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
                                style={{minWidth: 80, color: 'black'}}
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                                value={data}
                                disabled={elem.storeGroupId == null && this.state.radioValue != 2 && this.state.radioValue != 3}
                                onChange={(event)=>{
                                    this.state.mainTableSource[0].detailCode = event.target.value;
                                    this.setState({
                                        update: true
                                    })
                                }}
                            />
                            <DetailStorageModal
                                user={this.props.user}
                                tableKey={0}
                                onSelect={this.setCode}
                                disabled={
                                    elem.storeGroupId == null && this.state.radioValue != 3 
                                    || this.state.radioValue == 2 
                                    || this.state.radioValue == 3 && (data || '').length < 3}
                                codeSearch={this.state.radioValue == 3}
                                tecdocId={this.props.tecdocId}
                                storeGroupId={this.state.mainTableSource[0].storeGroupId}
                                setSupplier={this.setSupplier}
                                brandFilter={elem.brandName}
                                supplierId={elem.supplierId}
                                codeFilter={elem.detailCode}
                                brandId={elem.brandId}
                                defaultBrandName={this.state.defaultBrandName}
                            />
                            <VinCodeModal
                                disabled={!elem.storeGroupId}
                                storeGroupId={elem.storeGroupId}
                                vin={this.props.clientVehicleVin}
                            />
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
                                    style={{maxWidth: 200, minWidth: 160}}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                    filterOption={(input, option) => {
                                        return (
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                            String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                        )
                                    }}
                                    onSelect={(value, option)=>{
                                        this.state.mainTableSource[0].supplierId = value;
                                        this.setState({
                                            update: true
                                        })
                                    }}
                                >
                                    {this.suppliersOptions}
                                </Select>
                                :
                                <Input
                                    style={{maxWidth: 180, color: 'black'}}
                                    disabled
                                    placeholder={this.props.intl.formatMessage({id: 'order_form_table.supplier'})}
                                    value={data}
                                />
                            }
                            <DetailSupplierModal
                                user={this.props.user}
                                tableKey={0}
                                disabled={
                                    (this.state.radioValue != 2 && elem.storeGroupId == null) || 
                                    !(elem.detailCode) || 
                                    !(elem.brandName)
                                }
                                onSelect={this.setSupplier}
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
                title:  <FormattedMessage id="order_form_table.price" />,
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
                title:  <FormattedMessage id="order_form_table.sum" />,
                key:       'sum',
                width:     '5%',
                render: (elem)=>{
                    const sum = elem.price * elem.count;
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
                                this.state.mainTableSource[0].storeGroupId = this.state.editing ? elem.storeGroupId : undefined;
                                this.state.mainTableSource[0].detailName = undefined;
                                this.state.mainTableSource[0].comment = undefined;
                                this.state.mainTableSource[0].brandId = undefined;
                                this.state.mainTableSource[0].brandName = undefined;
                                this.state.mainTableSource[0].detailCode = undefined;
                                this.state.mainTableSource[0].supplierName = undefined;
                                this.state.mainTableSource[0].supplierId = undefined;
                                this.state.mainTableSource[0].supplierBrandId = undefined;
                                this.state.mainTableSource[0].store = null;
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

        ];

        this.relatedServicesColumns = [

        ];
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
                if(element.supplierId !== 0) {
                    data.details.push({
                        storeGroupId: element.storeGroupId,
                        name: element.detailName,
                        productCode: element.detailCode,
                        supplierId: element.supplierId,
                        supplierBrandId: element.supplierBrandId,
                        brandName: element.brandName,
                        purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                        count: element.count ? element.count : 1,
                        price: element.price ? Math.round(element.price*10)/10 : 1,
                        comment: element.comment || {
                            comment: undefined,
                            positions: [],
                        },
                    })
                }
                else {
                    data.details.push({
                        storeGroupId: element.storeGroupId,
                        name: element.detailName,
                        productId: element.storeId,
                        productCode: element.detailCode,
                        purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                        count: element.count ? element.count : 1,
                        price: element.price ? Math.round(element.price*10)/10  : 1,
                        comment: element.comment || {
                            comment: undefined,
                            positions: [],
                        },
                    })
                }
                
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
            this.addDetailsAndLabors(data);
        }
        this.state.radioValue = 1;
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.state.radioValue = 1;
        this.props.hideModal();
    };

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
                    let markup = result.markup ? result.markup : 1.4;
                    let purchasePrice = result.price ? Math.round(result.price.purchasePrice*10)/10 : 0;
                    that.state.mainTableSource[0].brandId = result.brandId;
                    that.state.mainTableSource[0].brandName = result.brandName;
                    that.state.mainTableSource[0].supplierBrandId = result.price ? result.price.supplierBrandId : undefined;
                    that.state.mainTableSource[0].detailCode = result.partNumber;
                    that.state.mainTableSource[0].supplierId = result.price ? result.price.businessSupplierId : undefined;
                    that.state.mainTableSource[0].supplierName = result.price ? result.price.businessSupplierName : undefined;
                    that.state.mainTableSource[0].storeId = result.price ? result.price.id : undefined;
                    that.state.mainTableSource[0].store = result.price ? result.price.store : undefined;
                    that.state.mainTableSource[0].purchasePrice = purchasePrice;
                    that.state.mainTableSource[0].price = purchasePrice * markup;
                    that.state.mainTableSource[0].count = 1;
                }
                that.setState({
                    update: true,
                })
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    setCode(code, brandId, storeId, key, storeGroupId, storeGroupName) {
        const brand = this.props.brands.find((elem)=>elem.brandId==brandId);
        this.state.mainTableSource[key].detailCode = code;
        this.state.mainTableSource[key].brandId = brandId;
        this.state.mainTableSource[key].brandName = brand.brandName;
        this.state.mainTableSource[key].storeId = storeId;
        if(this.state.radioValue == 3) {
            this.state.mainTableSource[key].storeGroupId = storeGroupId;
            this.state.mainTableSource[key].detailName = storeGroupName;
        }
        this.setState({
            update: true
        })
    }

    setComment(comment, positions) {
        this.state.mainTableSource[0].comment = {
            comment: comment,
            positions: positions,
        };
        this.state.mainTableSource[0].detailName = comment || this.state.mainTableSource[0].detailName;
        this.setState({
            update: true
        })
    }

    setSupplier(supplierId, supplierName, supplierBrandId, purchasePrice, price, store, key) {
        this.state.mainTableSource[key].supplierId = supplierId;
        this.state.mainTableSource[key].supplierName = supplierName;
        this.state.mainTableSource[key].supplierBrandId = supplierBrandId;
        this.state.mainTableSource[key].purchasePrice = purchasePrice;
        this.state.mainTableSource[key].price = price;
        this.state.mainTableSource[key].store = store;
        this.setState({
            update: true
        })
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
        let url =  __API_URL__ + '/business_suppliers?super=true';
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

    componentDidUpdate(prevState) {
        if(prevState.visible == false && this.props.visible) {
            const editing = Boolean(this.props.detail.storeGroupId);
            this.setState({
                editing: editing,
                mainTableSource: [{...this.props.detail}],
            })
            this.getDefaultValues(this.props.detail.storeGroupId);
        }
    }

    render() {
        const { visible } = this.props;
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
                            this.setState({
                                radioValue: event.target.value,
                            })
                        }} 
                    >
                        <Radio value={1}><FormattedMessage id="details_table.selection_by_car"/></Radio>
                        <Radio value={2}><FormattedMessage id="details_table.direct_editing"/></Radio>
                        <Radio value={3}><FormattedMessage id="details_table.selection_by_product_code"/></Radio>
                        <Radio value={4} disabled><FormattedMessage id="details_table.oils_and_liquids"/></Radio>
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
                    {this.state.relatedDetailsCheckbox ?
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
                    {this.state.relatedServicesCheckbox ?
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
                    <div style={{marginTop: 15}}>
                        <FormattedMessage id="add_order_form.related"/>: <FormattedMessage id="add_order_form.details"/>
                        <Checkbox
                            style={{marginLeft: 5}}
                            disabled
                            checked={this.state.relatedDetailsCheckbox}
                            onChange={()=>{
                                this.setState({
                                    relatedDetailsCheckbox: !this.state.relatedDetailsCheckbox
                                })
                            }}
                        /> 
                        <FormattedMessage id="add_order_form.services"/>
                        <Checkbox
                            style={{marginLeft: 5}}
                            disabled
                            checked={this.state.relatedServicesCheckbox}
                            onChange={()=>{
                                this.setState({
                                    relatedServicesCheckbox: !this.state.relatedServicesCheckbox
                                })
                            }}
                        />
                    </div>
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

const zoomMultiplier = 1.4;
class VinCodeModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
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
            image: undefined,
            itemsListEmpty: false,
        };
        this.showInfoModal = this.showInfoModal.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);

        this.columns = [
            {
                title:     '№',
                key:       'key',
                dataIndex: 'key',
                width:     '10%',
                render: (data, elem)=>{
                    const isVariant = this.state.itemsInfo.findIndex((item)=>item.key == elem.key || item.codeonimage == elem.codeonimage) != elem.key;
                    return !isVariant || !elem.codeonimage ? (
                        Number(elem.codeonimage) || data + 1
                    ) : (
                        <span
                            style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                            }}
                        >
                            {'Var.'}
                        </span>
                    )
                }
            },
            {
                title:     <FormattedMessage id="order_form_table.detail_code" />,
                key:       'oem',
                dataIndex: 'oem',
                width:     '30%',
                render: (data, elem)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                title:     <FormattedMessage id="order_form_table.detail_name" />,
                key:       'name',
                dataIndex: 'name',
                width:     '50%',
                render: (data, elem)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                key:       'action',
                width:     '10%',
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
        console.log(img.naturalHeight, img.naturalWidth)
        this.setState({
            image:{
                ...this.state.image,
                height: img.naturalHeight,
                width: img.naturalWidth
            }
        });
    }


    handleOk = () => {
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            zoomed: false,
            loading: false,
            categoryMode: false,
        })
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
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
        .then(function ({data}) {
            console.log(data);
            if(data) {
                const { catalog, ssd } = data.response.FindVehicle.response.FindVehicle[0].row[0].$;
                const categoriesArray = data.response.ListQuickDetail[0].Category;
                const normalizedCategories = [];

                if(categoriesArray.length) {
                    categoriesArray.map((elem)=>{
                        normalizedCategories.push({
                            catalog: catalog,
                            ...elem.$,
                            unit: {...elem.Unit[0].$},
                            detail: {
                                ...elem.Unit[0].Detail[0].$,
                                attribute: elem.Unit[0].Detail[0].attribute.map((attr)=>attr.$),
                            }
                        });
                    })
                }

                console.log(normalizedCategories);
                that.setState({
                    loading: false,
                    categoryMode: normalizedCategories.length > 1,
                    categories: normalizedCategories,
                })
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
            console.log(data.response);
            const itemsInfo = [];
            const blockPositions = [];
            const image = data.response.GetUnitInfo[0].row[0].$;
            data.response.ListDetailsByUnit[0].row.map(({$: item, attribute}, key)=>{
                itemsInfo.push({
                    key: key,
                    ...item,
                    attributes: attribute.map((attr)=>attr.$),
                })
            });
            data.response.ListImageMapByUnit[0].row.map(({$: position}, key)=>{
                blockPositions.push({
                    ...position,
                    key: key,
                });
            })
            console.log(itemsInfo, blockPositions, image);
            that.setState({
                loading: false,
                itemsInfo: itemsInfo,
                blockPositions: blockPositions,
                image: image,
                categoryMode: false,
            })
        })
        .catch(function (error) {
            console.log('error', error)
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
            visible,
            zoomed,
            positions,
            itemsInfo,
            blockPositions,
            tableHoverCode,
            imgHoverCode,
            imgHoverIndex,
            checkedCodes,
            infoItem,
            infoModalVisible,
            loading,
            categories,
            categoryMode,
            image,
            itemsListEmpty,
        } = this.state;

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
                    <Icon
                        type="car"
                        style={{
                            fontSize: 18
                        }}
                    />
                </Button>
                <Modal
                    width='fit-content'
                    style={{
                        maxWidth: '90%',
                        minWidth: '40%'
                    }}
                    visible={visible}
                    title={<FormattedMessage id='add_order_form.vin'/>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {loading ? <Spin indicator={spinIcon} /> :
                    categoryMode && !itemsListEmpty ? 
                        (categories.map((category, key)=>{
                            const detail = category.detail;
                            return (
                            <div key={key}>
                                <div
                                    className={Styles.categoryTitle}
                                    key={`category-title-${key}`}
                                >
                                    <a
                                        onClick={()=>{
                                            this.fetchItemsList(category.unit.ssd, category.unit.unitid, category.catalog)
                                        }}
                                    >
                                        {category.name}
                                    </a>
                                </div>
                                <div
                                    className={Styles.vinModal}
                                    key={`category-body-${key}`}
                                    style={{
                                        marginBottom: 15
                                    }}
                                >
                                    <div className={Styles.imgWrap}>
                                        <div
                                            className={Styles.zoomBlock}
                                            style={{
                                                height: '100%',
                                                overflow: 'scroll',
                                            }}
                                        >
                                            <img
                                                src={category.unit.imageurl.replace('%size%', 'source')}
                                                style={{
                                                    cursor: 'pointer',
                                                    width: '100%'
                                                }}
                                                onClick={()=>{
                                                    this.fetchItemsList(category.unit.ssd, category.unit.unitid, category.catalog)
                                                }}
                                            />
                                        </div>
                                        <div className={Styles.imageName}>
                                            <a>{category.unit.name}</a>
                                        </div>
                                    </div>
                                    <div className={Styles.listWrap}>
                                        <Table
                                            bordered
                                            columns={this.columns}
                                            dataSource={[
                                                {
                                                    key: 0,
                                                    oem: detail.oem,
                                                    name: detail.name,
                                                    attributes: detail.attribute,
                                                }
                                            ]}
                                            pagination={false}
                                        />
                                    </div>
                                </div>
                            </div>)
                        })
                    ) : 
                    !itemsListEmpty ? <>
                    <div
                        className={Styles.categoryTitle}
                    >
                        {image && image.name}
                    </div>
                    <div className={Styles.vinModal}>
                        <div className={Styles.imgWrap}>
                            <Icon
                                type={zoomed ? 'zoom-out' : 'zoom-in'}
                                style={{
                                    fontSize: 24,
                                    position: 'absolute',
                                    top: 5,
                                    left: 5,
                                    zIndex: 9999,
                                }}
                                onClick={()=>{
                                    this.setState({
                                        zoomed: !zoomed,
                                    })
                                }}
                            />
                            <div
                                className={Styles.zoomBlock}
                                style={{
                                    
                                }}
                            >
                                {blockPositions.map((item, key)=>{
                                    const code = Number(item.code);
                                    const isHovered =  imgHoverCode == code || imgHoverIndex == key;
                                    const isChecked = checkedCodes.indexOf(code) >= 0;
                                    return (
                                        <div
                                            className={`${Styles.zoomBlockItem} ${isHovered && Styles.hoveredItem} ${isChecked && Styles.checkedItem}`}
                                            key={key}
                                            style={{
                                                left: `${(item.x1 / image.width)*100}%`,
                                                top: `${(item.y1 / image.height)*100}%`,
                                                transform: 'translate(-50%, -50%)'
                                            }}
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
                                                        this.setState({
                                                            update: true,
                                                        })
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
                                                    })
                                                }
                                                
                                            }}
                                        >
                                            {code}
                                        </div>
                                    )
                                })}
                                <img
                                    width='100%'
                                    src={`${image && image.imageurl.replace('%size%', 'source')}`}
                                    onLoad={this.onImgLoad}
                                />
                                <Modal
                                    visible={zoomed}
                                    title={image && image.name.toUpperCase()}
                                    footer={[]}
                                    width={'fit-content'}
                                    onCancel={()=>{
                                        this.setState({
                                            zoomed: false,
                                        })
                                    }}
                                >
                                    <img
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
                                    const code = Number(record.codeonimage)
                                    const isHovered = tableHoverCode == code;
                                    const isChecked = checkedCodes.indexOf(code) >= 0;
                                    return `${Styles.listTableRow} ${isHovered && Styles.tableRowHovered} ${isChecked && Styles.checkedRow}`
                                }}
                                onRow={(record, rowIndex) => {
                                    const code = Number(record.codeonimage);
                                    return {
                                      onClick: event => {
                                        if(event.ctrlKey) {
                                            const isChecked = checkedCodes.indexOf(code) >= 0;
                                            if(!isChecked) {
                                                checkedCodes.push(code);
                                                this.setState({
                                                    update: true,
                                                })
                                            }
                                            else {
                                                this.setState({
                                                    checkedCodes: checkedCodes.filter((index)=>index!=code),
                                                })
                                            }
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