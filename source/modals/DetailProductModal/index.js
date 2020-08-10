// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, Radio, Table, TreeSelect, Checkbox } from 'antd';
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
                width:     '3%',
                render: (elem)=>{
                    let color = 'brown',
                        title = 'Поставщик не выбран!';
                    if(elem.store){
                        title=  `Сегодня: ${elem.store[0]} шт.\n` +
                                `Завтра: ${elem.store[1]} шт.\n` +
                                `Послезавтра: ${elem.store[2]} шт.\n` +
                                `Позже: ${elem.store[3]} шт.`;
                        if(elem.store[0] != '0') {
                            color = 'rgb(81, 205, 102)';
                        }
                        else if(elem.store[1] != 0) {
                            color = 'yellow';
                        }
                        else if(elem.store[2] != 0) {
                            color = 'orange';
                        }
                        else if(elem.store[3] != 0) {
                            color = 'red';
                        }
                    }
                    else {
                        color = 'grey';
                        
                    }
                    
                    return (
                        <div
                            style={{borderRadius: '50%', width: 18, height: 18, backgroundColor: color}}
                            title={title}
                        ></div>
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
        let url = API_URL;
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

        url = __API_URL__ + '/business_suppliers?super=true';
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
        this.servicesOptions = this.labors.map((elem, index)=>(
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
                            <div style={{display: 'block'}}><FormattedMessage id="order_form_table.diagnostic.detail"/></div>
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