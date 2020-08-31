// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Table, Select, Icon, DatePicker, AutoComplete, InputNumber, Modal, TreeSelect, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { Numeral } from "commons";
import { withReduxForm, isForbidden, permissions } from "utils";
// own
import Styles from './styles.m.css';
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};
const formItemStyle = {
    style: {
        marginBottom: 0,
    }
};
const mask = "0,0.00";
const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      RESERVE = 'RESERVE',
      SUPPLIER = 'SUPPLIER',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTY = 'OWN_CONSUMPTY',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT',
      ORDER = 'ORDER',
      NEW = 'NEW',
      DONE = 'DONE';

@withReduxForm({
    name: "storageDocumentForm",
})
@injectIntl
class StorageDocumentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            editKey: undefined,
            clientSearchValue: "",
            counterpartOptionInfo: {
                value: undefined,
                children: "",
            }
        };
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.editProduct = this.editProduct.bind(this);
    }

    editProduct(key) {
        this.setState({
            editKey: key,
            modalVisible: true,
        })
    }

    showModal() {
        this.setState({
            modalVisible: true,
        })
    }

    hideModal() {
        this.setState({
            modalVisible: false,
            editKey: undefined,
        })
    }

    render() {
        const { editKey, modalVisible, clientSearchValue, counterpartOptionInfo } = this.state;

        const {
            addDocProduct,
            updateFormData,
            typeToDocumentType,
            warehouses,
            counterpartSupplier,
            brands,
            deleteDocProduct,
            editDocProduct,
            clientList
        } = this.props;

        const {
            type,
            documentType,
            supplierDocNumber,
            counterpartId,
            docProducts,
            status,
            sum,
            payUntilDatetime,
            incomeWarehouseId,
            expenseWarehouseId,
        } = this.props.formData;
        const dateFormat = 'DD.MM.YYYY';
        const disabled = status == DONE;
        const onlySum = type == TRANSFER || type == RESERVE || type == ORDER || documentType == OWN_CONSUMPTY || documentType == INVENTORY;
        
        return (
            <>
            <Form
                {...formItemLayout}
                style={{
                    margin: "15px 0",
                    padding: "0 10px 15px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid gray"
                }}
            >
                <div
                    style={{
                        width: "35%"
                    }}
                >
                    <div>
                        <FormattedMessage id='storage.type'/>{requiredField()}
                        <Select
                            disabled={disabled || status==NEW}
                            value={type}
                            onChange={(value)=>{
                                if(value == INCOME || value == ORDER) {
                                    updateFormData({
                                        incomeWarehouseId: warehouses[0].id,
                                        expenseWarehouseId: undefined,
                                    })
                                }
                                else if(value == EXPENSE) {
                                    updateFormData({
                                        incomeWarehouseId: undefined,
                                        expenseWarehouseId: warehouses[0].id,
                                    })
                                }
                                else if(value == TRANSFER || value == RESERVE) {
                                    updateFormData({
                                        incomeWarehouseId: warehouses[1].id,
                                        expenseWarehouseId: warehouses[0].id,
                                    })
                                }

                                updateFormData({
                                    type: value,
                                    documentType: typeToDocumentType[value.toLowerCase()].documentType[0],
                                })
                            }}
                        >
                            <Option
                                value={INCOME}
                            >
                                <FormattedMessage id='storage.INCOME'/>
                            </Option>
                            <Option
                                value={EXPENSE}
                            >
                                <FormattedMessage id='storage.EXPENSE'/>
                            </Option>
                            <Option
                                value={TRANSFER}
                            >
                                <FormattedMessage id='storage.TRANSFER'/>
                            </Option>
                            <Option
                                value={RESERVE}
                            >
                                <FormattedMessage id='storage.RESERVE'/>
                            </Option>
                            <Option
                                value={ORDER}
                            >
                                <FormattedMessage id='storage.ORDER'/>
                            </Option>
                        </Select>
                    </div>
                    {(type == ORDER || type== EXPENSE || type== INCOME) &&
                    <div>
                        <FormattedMessage id='storage_document.document_type'/>{requiredField()}
                        <Select
                            disabled={disabled || status==NEW}
                            value={documentType}
                            onChange={(value)=>{
                                updateFormData({
                                    documentType: value,
                                })
                            }}
                        >
                            {type && 
                                typeToDocumentType[type.toLowerCase()].documentType.map((counterpart, i)=>{
                                    return (
                                        <Option
                                            value={counterpart}
                                            key={i}
                                        >
                                            <FormattedMessage id={`storage_document.docType.${type}.${counterpart}`}/>
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </div>}
                    {(type == INCOME || type == EXPENSE || type == ORDER) &&
                    (documentType == CLIENT || documentType == SUPPLIER || documentType == ADJUSTMENT) && 
                    <div style={{position: 'relative'}}>
                        <FormattedMessage id={`storage.${documentType != ADJUSTMENT ? documentType.toLowerCase() : 'supplier'}`}/>{requiredField()}
                        <Select
                            showSearch
                            disabled={disabled}
                            value={counterpartId}
                            onChange={(value, option)=>{
                                updateFormData({
                                    counterpartId: value,
                                });
                                this.setState({
                                    counterpartOptionInfo: {
                                        value: value,
                                        children: String(option.props.children),
                                    }
                                })
                            }}
                            //optionFilterProp={'children'}
                            filterOption={(input, option) => {
                                return option.props.children.toLowerCase().replace(/[^a-zA_Z0-9]/gim,'').indexOf(input.toLowerCase()) >= 0;
                            }}
                            onSearch={(input)=>{
                                this.setState({
                                    clientSearchValue: input
                                })
                            }}
                            onBlur={()=>{
                                this.setState({
                                    clientSearchValue: ""
                                })
                            }}
                        >
                            {(documentType == SUPPLIER || documentType == ADJUSTMENT) &&
                            counterpartSupplier.map((elem, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={elem.id}
                                    >
                                        {elem.name}
                                    </Option>
                                )
                            })}
                            {documentType == CLIENT ?
                            clientSearchValue.length > 2 ?
                            clientList.map((client, key)=>{
                                return (
                                    <Option
                                        key={key}
                                        value={client.clientId}
                                        phones={client.phones}
                                    >
                                        {`${client.surname || ""} ${client.name} ${client.middleName || ""} ${client.phones[0]}`}
                                    </Option>
                                )
                            }) :
                            counterpartOptionInfo.value && counterpartOptionInfo.children ?
                            <Option
                                value={counterpartOptionInfo.value}
                            >
                                {counterpartOptionInfo.children}
                            </Option> : null: null}
                        </Select>
                    </div>}
                </div>
                <div
                    style={{
                        width: "30%"
                    }}
                >
                    <div>
                        <FormattedMessage id='storage_document.storage_expenses'/>{(type == EXPENSE || type == TRANSFER || type == RESERVE) && requiredField()}
                        <Select
                            disabled={type == INCOME || type == ORDER || disabled}
                            value={expenseWarehouseId}
                            onSelect={(value)=>{
                                updateFormData({
                                    expenseWarehouseId: value,
                                })
                            }}
                        >
                            {warehouses.map((elem, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={elem.id}
                                    >
                                        {elem.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div>
                        <FormattedMessage id='storage_document.storage_income'/>{(type == INCOME || type == TRANSFER || type == RESERVE) && requiredField()}
                        <Select
                            disabled={type == EXPENSE || type == ORDER || type == RESERVE || disabled}
                            value={incomeWarehouseId}
                            onSelect={(value)=>{
                                updateFormData({
                                    incomeWarehouseId: value,
                                })
                            }}
                        >
                            {warehouses.map((elem, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={elem.id}
                                    >
                                        {elem.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                    {(type == INCOME || type == EXPENSE || type == ORDER) && 
                    <div>
                        <FormattedMessage id='storage.document_num'/>
                        <Input
                            disabled={disabled}
                            value={supplierDocNumber}
                            onChange={(event)=>{
                                updateFormData({
                                    supplierDocNumber: event.target.value,
                                })
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    </div>}
                </div>
                <div
                    style={{
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <div className={Styles.sumWrapper}>
                                <FormattedMessage id="sum" />
                                <Numeral
                                    mask={mask}
                                    className={Styles.sumNumeral}
                                    nullText="0"
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                >
                                    {sum || 0}
                                </Numeral>
                            </div>
                            <div className={Styles.sumWrapper} style={{color: onlySum ? 'var(--text2)' : null}}>
                                <FormattedMessage id="remain" />
                                <Numeral
                                    mask={mask}
                                    className={Styles.totalSum}
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                    nullText="0"
                                >
                                    {disabled || onlySum ? 0 : sum}
                                </Numeral>
                            </div>
                        </div>
                        <div
                            className={Styles.sumWrapper}
                            style={{
                                background: 'var(--static)',
                                fontSize: 16,
                                height: 'auto',
                                width: '50%',
                                justifyContent: 'center'
                            }}
                        >
                            <p
                                style={{
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                    color: onlySum ? 'var(--text2)' : null
                                }}
                            >
                                <FormattedMessage id="paid" />
                                <Numeral
                                    mask={mask}
                                    className={Styles.sumNumeral}
                                    nullText="0"
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                >
                                    {!disabled || onlySum ? 0 : sum}
                                </Numeral>
                            </p>
                        </div>
                    </div>
                   {(type == INCOME || type == EXPENSE || type == ORDER) && 
                   <div>
                        <FormattedMessage id="storage_document.pay_until" />
                        <DatePicker
                            style={{
                                width: '100%'
                            }}
                            defaultValue={payUntilDatetime}
                            disabled={disabled || onlySum}
                            format={dateFormat}
                            onChange={(date, stringDate)=>{
                                updateFormData({
                                    payUntilDatetime: date,
                                })
                            }}
                        />
                    </div>}
                </div>
            </Form>
            <div style={{
                margin: "24px",
            }}>
                <DocProductsTable
                    docProducts={docProducts}
                    disabled={disabled}
                    updateFormData={updateFormData}
                    businessSupplierId={counterpartId}
                    deleteDocProduct={deleteDocProduct}
                    editProduct={this.editProduct}
                    showModal={this.showModal}
                />
                { !disabled ? 
                <>
                    <AddProductModal
                        visible={modalVisible}
                        hideModal={this.hideModal}
                        businessSupplierId={(type == ORDER || type == INCOME) && counterpartId}
                        brands={brands}
                        addDocProduct={addDocProduct}
                        product={editKey !== undefined ? docProducts[editKey] : undefined}
                        editDocProduct={editDocProduct}
                        isIncome={type == INCOME}
                        priceDisabled={type == TRANSFER || type == RESERVE || documentType == OWN_CONSUMPTY}
                    /> 
                </>: null}
            </div>
            </>
        );
    }
}

export default StorageDocumentForm;

class DocProductsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            brandSearchValue: "",
            brands: [],
            detailOptions: [],
        }
        const actionColWidth = !this.props.disabled ? '3%' : '0';
        this.columns = [
            {
                width:     actionColWidth,
                key:       'edit',
                render:     (elem)=>{
                    return this.props.disabled ? null :
                        elem.productId ?
                            <Button
                                disabled={this.props.disabled}
                                onClick={()=>{
                                    this.props.editProduct(elem.key);
                                }}
                            >
                                <Icon type='edit' />
                            </Button> : 
                            <Button
                                type='primary'
                                onClick={()=>{
                                    this.props.showModal();
                                }}
                            >
                                <Icon type='plus'/>
                            </Button>
                }
            },
            {
                title:     "№",
                width:     '3%',
                key:       'key',
                dataIndex: 'key',
                render:     (data, elem)=>{
                    return (
                        data+1 || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                width:     '10%',
                key:       'brandName',
                dataIndex: 'brandName',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                width:     '15%',
                key:       'detailCode',
                dataIndex: 'detailCode',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:      <><FormattedMessage id='order_form_table.detail_code' /> (<FormattedMessage id='storage.supplier'/>)</>,
                width:     '10%',
                key:       'tradeCode',
                dataIndex: 'tradeCode',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '15%',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='orders.source' />,
                key:       'source',
                dataIndex: 'source',
                width:     '15%',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.price' />,
                key:       'stockPrice',
                dataIndex: 'stockPrice',
                width:     '10%',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'quantity',
                dataIndex: 'quantity',
                width:     '10%',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                width:     actionColWidth,
                key:       'delete',
                render:     (elem)=>{
                    return this.props.disabled ? null : (
                        <Button
                            disabled={this.props.disabled}
                            type={'danger'}
                            onClick={()=>{
                                this.props.deleteDocProduct(elem.key)
                                this.setState({
                                    update: true,
                                })
                            }}
                        >
                            <Icon type='delete' />
                        </Button>
                    )
                }
            },
        ];
    }

    render() {
        const { disabled, docProducts } = this.props;
        var tableData = docProducts;
        tableData = tableData.filter((elem)=>elem.productId)
        if(!disabled && (!tableData.length || tableData[tableData.length-1].productId)) {
            tableData.push({
                key: tableData.length,
                productId: undefined,
            })
        }
        return (
            <Table
                columns={this.columns}
                dataSource={tableData}
                pagination={false}
            />
        );
    }
}

class AddProductModal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            editMode: false,
            alertModalVisible: false,
            detailOptions: [],
            storeGroupsTree: [],
            storageProducts: [],
            brandSearchValue: "",
            visible: false,
            brandId: undefined,
            brandName: undefined,
            detailCode: undefined,
            groupId: undefined,
            tradeCode: undefined,
            detailName: undefined,
            stockPrice: 0,
            quantity: 1,
            detailCodeSearch: '',
        }

        this.confirmAlertModal = this.confirmAlertModal.bind(this);
        this.cancelAlertModal = this.cancelAlertModal.bind(this);
    }

    getOptions(brandId) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_suppliers/pricelists`;
        if(brandId) url += `?brandId=${brandId}`;
        if(this.props.businessSupplierId) url += `&businessSupplierId=${this.props.businessSupplierId}`
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
            that.setState({
                detailOptions: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getStoreGroups() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_groups`;
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
            data.map((elem, index) => {
                elem.key = index;
            });
            that.buildStoreGroupsTree(data);
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    getStorageProducts() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_products`;
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
            console.log(data.list)
            that.setState({
                storageProducts: data.list
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    buildStoreGroupsTree(data) {
        var treeData = [];
        for (let i = 0; i < data.length; i++) {
            const parentGroup = data[ i ];
            treeData.push({
                title:      `${parentGroup.name} (#${parentGroup.id})`,
                name:       parentGroup.name,
                value:      parentGroup.id,
                className:  Styles.groupTreeOption,
                key:        `${i}`,
                selectable: false,
                children:   [],
            });
            for (let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[ j ];
                treeData[ i ].children.push({
                    title:      `${childGroup.name} (#${childGroup.id})`,
                    name:       childGroup.name,
                    value:      childGroup.id,
                    className:  Styles.groupTreeOption,
                    key:        `${i}-${j}`,
                    selectable: false,
                    children:   [],
                });
                for (let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[ k ];
                    treeData[ i ].children[ j ].children.push({
                        title:     `${lastNode.name} (#${lastNode.id})`,
                        name:      lastNode.name,
                        value:     lastNode.id,
                        className: Styles.groupTreeOption,
                        key:       `${i}-${j}-${k}`,
                        children:  [],
                    });
                    for (let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[ l ];
                        treeData[ i ].children[ j ].children[ k ].children.push({
                            title:     `${elem.name} (#${elem.id})`,
                            name:      elem.name,
                            value:     elem.id,
                            className: Styles.groupTreeOption,
                            key:       `${i}-${j}-${k}-${l}`,
                        });
                    }
                }
            }
        }
        this.setState({
            storeGroupsTree: treeData,
        })
    }

    getProductId(detailCode) {
        const { storageProducts } = this.state;
        const storageProduct = storageProducts.find((elem)=>elem.code==detailCode);
        if(storageProduct) {
            this.setState({
                groupId: storageProduct.groupId,
                productId: storageProduct.id,
                detailName: storageProduct.name,
                brandId: storageProduct.brandId,
                brandName: storageProduct.brand && storageProduct.brand.name,
                tradeCode: storageProduct.tradeCode,
            })
            return true;
        }
        else {
            this.setState({
                productId: undefined,
            })
            return false;
        }
    }

    componentDidMount() {
        this.getStoreGroups();
        this.getStorageProducts();
    }

    confirmAlertModal(productData) {
        const { 
            stockPrice,
            quantity, 
        } = this.state;

        const {
            brandId,
            brandName,
            detailCode,
            detailName,
            productId,
            tradeCode
        } = productData;

        this.props.addDocProduct({
            productId: productId,
            detailCode: detailCode,
            brandName: brandName,
            brandId: brandId,
            tradeCode: tradeCode,
            detailName: detailName,
            stockPrice: stockPrice,
            quantity: quantity,
            sum: quantity*stockPrice,
        });
        this.setState({
            alertModalVisible: false,
        });
        this.handleCancel();
        this.getStorageProducts();
    }

    cancelAlertModal() {
        this.setState({
            alertModalVisible: false,
        })
    }

    handleOk() {
        const { 
            editMode,
            brandId,
            brandName,
            detailCode,
            tradeCode,
            groupId,
            detailName,
            stockPrice,
            quantity, 
            productId,
        } = this.state;

        if(!brandId || !detailCode) {
            notification.error({
                message: 'Заполните все необходимые поля',
            });
            return;
        }

        if(!this.getProductId(detailCode)) {
            this.setState({
                alertModalVisible: true,
            })
        }
        else {
            if(editMode) {
                this.props.editDocProduct(
                    this.props.product.key,
                    {
                        productId: productId,
                        detailCode: detailCode,
                        brandName: brandName,
                        brandId: brandId,
                        tradeCode: tradeCode,
                        detailName: detailName,
                        stockPrice: stockPrice,
                        quantity: quantity,
                        groupId: groupId,
                        sum: quantity*stockPrice,
                    }
                );
                this.handleCancel();
            }
            else {
                this.props.addDocProduct({
                    productId: productId,
                    detailCode: detailCode,
                    brandName: brandName,
                    brandId: brandId,
                    tradeCode: tradeCode,
                    detailName: detailName,
                    stockPrice: stockPrice,
                    quantity: quantity,
                    groupId: groupId,
                    sum: quantity*stockPrice,
                });
                this.handleCancel();
            }
        }
    }

    handleCancel() {
        this.setState({
            brandSearchValue: "",
            visible: false,
            brandId: undefined,
            brandName: undefined,
            detailCode: undefined,
            groupId: undefined,
            tradeCode: undefined,
            detailName: undefined,
            stockPrice: 0,
            quantity: 1,
        });
        this.props.hideModal();
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.visible && this.props.visible) {
            const { product } = this.props;
            console.log(this)
            if(product) {
                this.setState({
                    editMode: true,
                    brandId: product.brandId,
                    brandName: product.brandName,
                    detailCode: product.detailCode,
                    tradeCode: product.tradeCode,
                    groupId: product.groupId,
                    detailName: product.detailName,
                    stockPrice: product.stockPrice,
                    quantity: product.quantity,
                    productId: product.productId,
                })
            }
        }
    }

    render() {
        const {
            storageProducts,
            alertModalVisible,
            detailOptions,
            storeGroupsTree,
            brandId,
            brandName,
            detailCode,
            tradeCode,
            detailName,
            stockPrice,
            quantity,
            detailCodeSearch,
        } = this.state;
        return (
            <Modal
                visible={this.props.visible}
                width='80%'
                onOk={()=>{
                    this.handleOk();
                }}
                onCancel={()=>{
                    this.handleCancel();
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}
                >
                    <div className={Styles.addProductItemWrap} style={{minWidth: 130}}>
                        <FormattedMessage id='order_form_table.brand' />{requiredField()}
                        <Select
                            showSearch
                            value={brandId}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.getOptions(value)
                                this.setState({
                                    brandId: value,
                                    brandName: option.props.children,
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
                                    brandId ? 
                                    <Option key={0} value={brandId}>
                                        {brandName}
                                    </Option> : 
                                    []
                            }
                        </Select>
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_code' />{requiredField()}
                        <AutoComplete
                            value={detailCode}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            onChange={(value)=>{
                                this.setState({
                                    detailCode: value,
                                    detailCodeSearch: value,
                                });
                                this.getProductId(value);
                            }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    detailCode: value,
                                    detailName: option.props.detail_name,
                                    stockPrice: option.props.price,
                                    detailCodeSearch: "",
                                });
                                this.getProductId(value);
                            }}
                            onBlur={()=>{
                                this.setState({
                                    detailCodeSearch: "",
                                })
                            }}
                            filterOption={(input, option) => {
                                return (
                                    String(option.props.value).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                        >
                            {
                                storageProducts.map((elem)=>{
                                    return (
                                        <Option
                                            key={elem.id}
                                            value={elem.code}
                                            detail_name={elem.name}
                                            price={0}
                                            trade_code={elem.tradeCode}
                                        >
                                            {elem.code}
                                        </Option>
                                    )
                                })
                            }
                            {
                                detailCodeSearch.length > 3 ? 
                                detailOptions.map((elem)=>{
                                    return (
                                        <Option
                                            key={elem.id}
                                            value={elem.partNumber}
                                            detail_name={elem.itemName}
                                            price={elem.purchasePrice}
                                            trade_code={elem.supplierPartNumber}
                                        >
                                            {elem.partNumber}
                                        </Option>
                                    )
                                }) :
                                []
                            }
                        </AutoComplete>
                    </div>
                   {this.props.isIncome &&
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_code' /> (<FormattedMessage id='storage.supplier'/>)
                        <Input
                            value={tradeCode}
                            disabled
                            style={{
                                color: 'black'
                            }}
                        />
                    </div>}
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_name' />
                        <Input
                            disabled
                            style={{
                                color: 'black'
                            }}
                            value={detailName}
                            onChange={(event)=>{
                                this.setState({
                                    detailName: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <div><FormattedMessage id='order_form_table.price' /></div>
                        <InputNumber
                            disabled={this.props.priceDisabled}
                            value={stockPrice}
                            style={{
                                //marginLeft: 10,
                            }}
                            min={0}
                            onChange={(value)=>{
                                this.setState({
                                    stockPrice: value
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <div><FormattedMessage id='order_form_table.count' /></div>
                        <InputNumber
                            value={quantity}
                            style={{
                                //marginLeft: 10,
                            }}
                            min={0}
                            onChange={(value)=>{
                                this.setState({
                                    quantity: value
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <div><FormattedMessage id='order_form_table.sum' /></div>
                        <InputNumber
                            disabled
                            style={{
                                color: 'black',
                                //marginLeft: 10,
                            }}
                            value={quantity*stockPrice}
                        />
                    </div>
                </div>
                <AlertModal
                    alertVisible={alertModalVisible}
                    brands={this.props.brands}
                    confirmAlertModal={this.confirmAlertModal}
                    cancelAlertModal={this.cancelAlertModal}
                    storeGroupsTree={storeGroupsTree}
                    {...this.state}
                >
                    Даного товара нет в справочнике товаров. Добавить?
                </AlertModal>
            </Modal>
        );
    }
}

const measureUnitsOptions = Object.freeze({
    PIECE: 'PIECE',
    LITER: 'LITER',
});

@injectIntl
class AlertModal extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            visible: false,
            detailCodeSearch: "",
            brandSearchValue: "",
            measureUnit: measureUnitsOptions.PIECE,
            tradeCode: undefined,
            certificate: undefined,
            priceGroupNumber: undefined,
            priceGroups: [],
            min: 0,
            max: 0,
        }
    }

    getPriceGroups() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/price_groups`;
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
            that.setState({
                priceGroups: data,
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    postStoreProduct() {
        const {
            brandId,
            detailCode,
            groupId,
            detailName,
            measureUnit,
            priceGroupNumber,
            tradeCode,
            brandName,
            certificate,
            min,
            max,
        } = this.state;

        if(!brandId || !detailCode || !groupId || !detailName) {
            notification.error({
                message: 'Заполните все необходимые поля',
            });
            return;
        }

        const postData = {
            name: detailName,
            groupId: groupId,
            code: detailCode,
            brandId: brandId,
            measureUnit: measureUnit,
            tradeCode: tradeCode,
            certificate: certificate,
            priceGroupNumber: priceGroupNumber,
            min: min,
            max: max,
        }

        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_products`;
        fetch(url, {
            method: "POST",
            headers: {
                Authorization: token,
            },
            body: JSON.stringify(postData)
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
            console.log(data);
            that.setState({visible: false});
            that.props.confirmAlertModal({
                brandId: brandId,
                brandName: brandName,
                detailName: detailName,
                detailCode: detailCode,
                tradeCode: tradeCode,
                productId: data.id,
            });
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.alertVisible && this.props.alertVisible) {
            this.setState({
                ...this.props
            })
        }
    }

    componentDidMount() {
        this.getPriceGroups();
    }

    render() {
        const { storeGroupsTree, alertVisible, cancelAlertModal, intl: { formatMessage } } = this.props;
        const {
            visible,
            detailOptions,
            priceGroups,
            brandId,
            brandName,
            detailCode,
            groupId,
            detailName,
            detailCodeSearch,
            brandSearchValue,
            measureUnit,
            priceGroupNumber,
            tradeCode,
            certificate,
            min,
            max,
        } = this.state;
        return (
            <>
                <Modal
                    visible={alertVisible}
                    onOk={()=>{
                        this.setState({
                            visible: true,
                        })
                        cancelAlertModal();
                    }}
                    onCancel={cancelAlertModal}
                >
                    {this.props.children}
                </Modal>
                <Modal
                    width={'50%'}
                    visible={visible}
                    onOk={()=>{
                        this.postStoreProduct();
                    }}
                    onCancel={()=>{
                        this.setState({visible: false});
                    }}
                >
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_code' />{requiredField()}
                        <AutoComplete
                            value={detailCode}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            onChange={(value)=>{
                                this.setState({
                                    detailCode: value,
                                    detailCodeSearch: value,
                                });
                                this.getProductId(value);
                            }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    detailCode: value,
                                    detailName: option.props.detail_name,
                                    tradeCode: option.props.trade_code,
                                    stockPrice: option.props.price,
                                    detailCodeSearch: "",
                                });
                                this.getProductId(value);
                            }}
                            onBlur={()=>{
                                this.setState({
                                    detailCodeSearch: "",
                                })
                            }}
                            filterOption={(input, option) => {
                                return (
                                    String(option.props.value).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                        >
                            {
                                detailCodeSearch.length > 3 ? 
                                detailOptions.map((elem, key)=>{
                                    return (
                                        <Option
                                            key={key}
                                            value={elem.partNumber}
                                            detail_name={elem.itemName}
                                            price={elem.purchasePrice}
                                            trade_code={elem.supplierPartNumber}
                                        >
                                            {elem.partNumber}
                                        </Option>
                                    )
                                }) :
                                []
                            }
                        </AutoComplete>
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.store_group'/>{requiredField()}
                        <TreeSelect
                            showSearch
                            value={groupId}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={storeGroupsTree}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    groupId: value,
                                    detailName: detailName ? detailName : option.props.name,
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_name' />{requiredField()}
                        <Input
                            value={detailName}
                            onChange={(event)=>{
                                this.setState({
                                    detailName: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.brand' />{requiredField()}
                        <Select
                            showSearch
                            value={brandId}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    brandId: value,
                                    brandName: option.props.name,
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
                                brandSearchValue.length > 1 ? 
                                    this.props.brands.map((elem, index)=>(
                                        <Option key={index} value={elem.brandId} supplier_id={elem.supplierId} name={elem.brandName}>
                                            {elem.brandName}
                                        </Option>
                                    )) :
                                    brandId ? 
                                    <Option key={0} value={brandId}>
                                        {brandName}
                                    </Option> : 
                                    []
                            }
                        </Select>
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='storage.measure_units' />
                        <Select
                            value={measureUnit}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            onChange={(value)=>{
                                this.setState({
                                    measureUnit: value,
                                })
                            }}
                        >
                            <Option value={ measureUnitsOptions.PIECE } key={ 'piece' }>
                                { formatMessage({ id: 'storage.measure.piece' }) }
                            </Option>
                            <Option value={ measureUnitsOptions.LITER } key={ 'liter' }>
                                { formatMessage({ id: 'storage.measure.liter' }) }
                            </Option>
                        </Select>
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='storage.trade_code' />
                        <Input
                            value={tradeCode}
                            onChange={(event)=>{
                                this.setState({
                                    tradeCode: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='storage.price_group' />
                        <Select
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            value={priceGroupNumber}
                            onChange={(value, option)=>{
                                this.setState({
                                    priceGroupNumber: value,
                                })
                            }}
                        >
                            { priceGroups && 
                            priceGroups.map(({ number, multiplier }) => (
                                <Option value={ number } key={ number } multiplier={ multiplier }>
                                    <span>
                                        { formatMessage({ id: 'storage.price_group' }) } -{ ' ' }
                                        { number }{ ' ' }
                                    </span>
                                    <span>
                                        ({ formatMessage({ id: 'storage.markup' }) } -{ ' ' }
                                        { multiplier })
                                    </span>
                                </Option>
                            )) }
                        </Select>
                        
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='storage.certificate' />
                        <Input
                            value={certificate}
                            onChange={(event)=>{
                                this.setState({
                                    certificate: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <span style={{marginRight: 8}}>Min.</span>
                            <InputNumber
                                value={min}
                                step={1}
                                min={0}
                                onChange={(value)=>{
                                    this.setState({
                                        min: value,
                                    })
                                }}
                            />
                        </div>
                        <div>
                            <span style={{marginRight: 8}}>Max.</span>
                            <InputNumber
                                
                                value={max}
                                step={1}
                                min={min}
                                onChange={(value)=>{
                                    this.setState({
                                        max: value,
                                    })
                                }}
                            />
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

function requiredField() {
    return <b style={{color: 'var(--required)'}}> *</b>;
  }