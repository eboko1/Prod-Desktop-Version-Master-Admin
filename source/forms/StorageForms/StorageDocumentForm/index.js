// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Table, Select, Icon, DatePicker, AutoComplete, InputNumber, Modal, TreeSelect, notification, Checkbox, Badge } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher, Numeral } from 'commons';
import { Barcode } from "components";
import { withReduxForm, isForbidden, permissions, goTo } from "utils";
import { DetailStorageModal } from "modals";
import {MODALS} from 'core/modals/duck';
import book from "routes/book";

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
const disabledSelectText = {color: 'var(--text)'};
const mask = "0,0.00";
const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      RESERVE = 'RESERVE',
      SUPPLIER = 'SUPPLIER',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTION = 'OWN_CONSUMPTION',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT',
      ORDERINCOME = 'ORDERINCOME',
      ORDER = 'ORDER',
      NEW = 'NEW',
      DONE = 'DONE',
      MAIN = 'MAIN',
      TOOL = 'TOOL',
      REPAIR_AREA= 'REPAIR_AREA';

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
            },
            warning: false,
        };
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.editProduct = this.editProduct.bind(this);
    }

    editProduct(key, warning=false) {
        this.setState({
            editKey: key,
            warning: warning,
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
            warning: false,
            editKey: undefined,
        })
    }

    getClientOption() {
        if(this.props.formData.documentType == CLIENT && this.props.formData.counterpartId && !this.state.counterpartOptionInfo.value) {
            const client = this.props.clientList.find((client)=>client.clientId==this.props.formData.counterpartId);
            if(client) {
                this.setState({
                    counterpartOptionInfo: {
                        value: this.props.formData.counterpartId,
                        children: `${client.surname || ""} ${client.name} ${client.middleName || ""} ${client.phones[0]}`
                    }
                })
            }
        }
    }

    _redirectToCashFlow = () => {
        if (!isForbidden(this.props.user, permissions.ACCESS_ACCOUNTING)) {
            goTo(book.cashFlowPage, {
                cashFlowFilters: {
                    storeDocId: this.props.id,
                },
            });
        }
    };

    componentDidUpdate() {
       this.getClientOption();
    }

    componentDidMount() {
        this.getClientOption();
    }
 
    render() {
        const { editKey, modalVisible, clientSearchValue, counterpartOptionInfo, warning } = this.state;
        const {
            id,
            addDocProduct,
            updateFormData,
            typeToDocumentType,
            warehouses,
            counterpartSupplier,
            employees,
            brands,
            deleteDocProduct,
            editDocProduct,
            clientList,
            loading,
            user,
            mainWarehouseId,
            reserveWarehouseId,
            toolWarehouseId,
            repairAreaWarehouseId,
            setModal,
        } = this.props;

        const {
            type,
            documentType,
            supplierDocNumber,
            counterpartId,
            docProducts,
            status,
            sum,
            sellingSum,
            payUntilDatetime,
            incomeWarehouseId,
            expenseWarehouseId,
            remainSum,
        } = this.props.formData;
        const dateFormat = 'DD.MM.YYYY';
        const disabled = status == DONE;
        const onlySum = type == TRANSFER || type == ORDER || documentType == OWN_CONSUMPTION || documentType == INVENTORY;
        
        return (
            <div>
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
                            style={disabledSelectText}
                            onChange={(value)=>{
                                if(value == INCOME || value == ORDER) {
                                    updateFormData({
                                        incomeWarehouseId: mainWarehouseId,
                                        expenseWarehouseId: undefined,
                                    })
                                }
                                else if(value == EXPENSE) {
                                    updateFormData({
                                        incomeWarehouseId: undefined,
                                        expenseWarehouseId: mainWarehouseId,
                                    })
                                }
                                else if(value == TRANSFER) {
                                    updateFormData({
                                        incomeWarehouseId: mainWarehouseId,
                                        expenseWarehouseId: reserveWarehouseId,
                                    })
                                }

                                updateFormData({
                                    type: value,
                                    documentType: typeToDocumentType[value.toLowerCase()].documentType[0],
                                    counterpartId: undefined,
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
                                value={ORDER}
                            >
                                <FormattedMessage id='storage.ORDER'/>
                            </Option>
                        </Select>
                    </div>
                    <div>
                        <FormattedMessage id='storage_document.document_type'/>{requiredField()}
                        <Select
                            disabled={disabled || status==NEW}
                            value={documentType}
                            style={disabledSelectText}
                            onChange={(value)=>{
                                if(value == TRANSFER) {
                                    updateFormData({
                                        incomeWarehouseId: mainWarehouseId,
                                        expenseWarehouseId: reserveWarehouseId,
                                    })
                                } else if(value == RESERVE) {
                                    updateFormData({
                                        incomeWarehouseId: reserveWarehouseId,
                                        expenseWarehouseId: mainWarehouseId,
                                    })
                                } else if (value == REPAIR_AREA) {
                                    updateFormData({
                                        incomeWarehouseId: toolWarehouseId,
                                        expenseWarehouseId: repairAreaWarehouseId,
                                    })
                                } else if (value == TOOL) {
                                    updateFormData({
                                        incomeWarehouseId: repairAreaWarehouseId,
                                        expenseWarehouseId: toolWarehouseId,
                                    })
                                }
                                updateFormData({
                                    documentType: value,
                                    counterpartId: undefined,
                                })
                            }}
                        >
                            {type && 
                                typeToDocumentType[type.toLowerCase()].documentType.map((documentType, i)=>{
                                    return (
                                        <Option
                                            value={documentType}
                                            key={i}
                                        >
                                            <FormattedMessage id={`storage_document.docType.${type}.${documentType}`}/>
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    {(
                        documentType == CLIENT ||
                        documentType == SUPPLIER ||
                        documentType == ADJUSTMENT ||
                        documentType == ORDERINCOME ||
                        documentType == TOOL ||
                        documentType == REPAIR_AREA ||
                        documentType == OWN_CONSUMPTION
                    ) && 
                    <div style={{position: 'relative'}}>
                        <FormattedMessage id={`storage.${
                            documentType == ORDERINCOME || documentType == ADJUSTMENT ? 'supplier' :
                            documentType == TOOL || documentType == REPAIR_AREA || documentType == OWN_CONSUMPTION ? 'employee' :
                            documentType.toLowerCase()}`
                        }/>{requiredField()}
                        <Select
                            showSearch
                            disabled={disabled || status==NEW}
                            value={counterpartId}
                            style={disabledSelectText}
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
                                const searchValue = option.props.children.toLowerCase().replace(/[+()-\s]/g,'');
                                const inputValue = input.toLowerCase();
                                return searchValue.indexOf(inputValue) >= 0;
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
                            {(documentType == SUPPLIER || documentType == ADJUSTMENT || documentType == ORDERINCOME) &&
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
                            {(documentType == TOOL || documentType == REPAIR_AREA || documentType == OWN_CONSUMPTION) && 
                                employees.map((employee, i)=>{
                                    return (
                                        <Option
                                            key={i}
                                            value={employee.id}
                                        >
                                            {`${employee.surname || ""} ${employee.name || ""} ${employee.phone}`}
                                        </Option>
                                    )
                                })
                            }
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
                        <FormattedMessage id='storage_document.storage_expenses'/>{(type == EXPENSE || type == TRANSFER) && requiredField()}
                        <Select
                            disabled={
                                type == INCOME || 
                                type == ORDER || 
                                documentType == TOOL ||
                                documentType == REPAIR_AREA ||
                                disabled}
                            value={expenseWarehouseId}
                            style={disabledSelectText}
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
                        <FormattedMessage id='storage_document.storage_income'/>{(type == INCOME || type == TRANSFER) && requiredField()}
                        <Select
                            disabled={
                                type == EXPENSE ||
                                type == ORDER || 
                                documentType == RESERVE ||
                                documentType == TOOL ||
                                documentType == REPAIR_AREA ||
                                disabled
                            }
                            value={incomeWarehouseId}
                            style={disabledSelectText}
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
                            style={{color: 'var(--text3)'}}
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
                    {onlySum ? 
                        <div
                            className={Styles.sumWrapper}
                            style={{
                                background: 'var(--static)',
                                fontSize: 16,
                                height: '100%',
                                margin: '15px 0px',
                                justifyContent: 'center'
                            }}
                        >
                            <p
                                style={{
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                }}
                            >
                                <FormattedMessage id="sum" />
                                <Numeral
                                    mask={mask}
                                    className={Styles.sumNumeral}
                                    nullText="0"
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                >
                                    {sum}
                                </Numeral>
                            </p>
                        </div> :
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
                                        {type == EXPENSE ? sellingSum : sum}
                                    </Numeral>
                                </div>
                                <div className={Styles.sumWrapper} style={{color: onlySum ? 'var(--text2)' : null}}>
                                    <FormattedMessage id="paid" />
                                    <Numeral
                                        mask={mask}
                                        className={Styles.totalSum}
                                        currency={this.props.intl.formatMessage({
                                            id: "currency",
                                        })}
                                        nullText="0"
                                    >
                                        {type == EXPENSE ? sellingSum - remainSum : sum - remainSum}
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
                                        color: null
                                    }}
                                >
                                    <FormattedMessage id="remain" />
                                    <span
                                        onClick={()=>this._redirectToCashFlow()}
                                        className={Styles.remainSum}
                                    >
                                        <Numeral
                                            mask={mask}
                                            className={Styles.sumNumeral}
                                            nullText="0"
                                            currency={this.props.intl.formatMessage({
                                                id: "currency",
                                            })}
                                        >
                                            {remainSum}
                                        </Numeral>
                                    </span>
                                </p>
                            </div>
                        </div>
                    }
                   {(type == INCOME || type == EXPENSE || type == ORDER) && 
                   <div>
                        <FormattedMessage id="storage_document.pay_until" />
                        <DatePicker
                            style={{
                                width: '100%',
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
                    loading={loading}
                    docProducts={docProducts}
                    disabled={disabled || !(status)}
                    updateFormData={updateFormData}
                    businessSupplierId={counterpartId}
                    deleteDocProduct={deleteDocProduct}
                    editProduct={this.editProduct}
                    showModal={this.showModal}
                    type={type}
                    sellingPrice={type == EXPENSE}
                    user={user}
                />
                { !disabled ? 
                    <AddProductModal
                        visible={modalVisible}
                        hideModal={this.hideModal}
                        businessSupplierId={(type == ORDER || type == INCOME) && counterpartId}
                        type={type}
                        brands={brands}
                        addDocProduct={addDocProduct}
                        product={editKey !== undefined ? docProducts[editKey] : undefined}
                        editKey={editKey}
                        editDocProduct={editDocProduct}
                        isIncome={type == INCOME}
                        priceDisabled={type == TRANSFER || documentType == OWN_CONSUMPTION}
                        warehouses={warehouses}
                        warehouseId={incomeWarehouseId || expenseWarehouseId}
                        warning={warning}
                        user={user}
                        sellingPrice={type == EXPENSE}
                        maxOrdered={type == ORDER && documentType == ADJUSTMENT}
                    /> 
                : null}
            </div>
            </div>
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
                title:     ()=> !this.props.disabled && (
                                <div>
                                    <Barcode
                                        button
                                        disabled={this.props.disabled || isForbidden(this.props.user, permissions.ACCESS_STOCK)}
                                    />
                                </div>
                            ),
                width:     actionColWidth,
                key:       'edit',
                render:     (elem)=>{
                    const accessForbidden = isForbidden(this.props.user, permissions.ACCESS_STOCK);
                    return this.props.disabled ? null :
                        !elem.detailCode ?
                            <Button
                                disabled={accessForbidden}
                                onClick={()=>{
                                    if(!accessForbidden) this.props.showModal();
                                }}
                            >
                                <Icon type='plus'/>
                            </Button> :
                            elem.productId ? 
                                <Button
                                    disabled={this.props.disabled || accessForbidden}
                                    type='primary'
                                    onClick={()=>{
                                        if(!accessForbidden) this.props.editProduct(elem.key);
                                    }}
                                >
                                    <Icon type='edit' />
                                </Button> :
                                <Button
                                    disabled={this.props.disabled || accessForbidden}
                                    type='primary'
                                    style={{
                                        backgroundColor: 'var(--approve)'
                                    }}
                                    onClick={()=>{
                                        if(!accessForbidden) this.props.editProduct(elem.key, true);
                                    }}
                                >
                                    <Icon type='warning'/>
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
                key:       'detailCode',
                dataIndex: 'detailCode',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:      <span><FormattedMessage id='order_form_table.detail_code' /> (<FormattedMessage id='storage.supplier'/>)</span>,
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
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <div style={{textAlign: 'right'}}><FormattedMessage id='order_form_table.price' /></div>,
                key:       'stockPrice',
                dataIndex: 'stockPrice',
                render:     (data, elem)=>{
                    const price = this.props.sellingPrice ? elem.sellingPrice : data;
                    let strVal = Number(price).toFixed(2);
                    return (
                        <div style={{textAlign: 'right'}}>
                            {price ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : <FormattedMessage id='long_dash' />}
                        </div>
                    )
                }
            },
            {
                title:     <div style={{textAlign: 'right'}}><FormattedMessage id='order_form_table.count' /></div>,
                key:       'quantity',
                dataIndex: 'quantity',
                render:     (data, elem)=>{
                    return (
                        <div style={{textAlign: 'right'}}>
                            {data || <FormattedMessage id='long_dash' />}
                        </div>
                    )
                }
            },
            {
                title:     <div style={{textAlign: 'right'}}><FormattedMessage id='order_form_table.sum' /></div>,
                key:       'sum',
                dataIndex: 'sum',
                render:     (data, elem)=>{
                    const sum = this.props.sellingPrice ? elem.sellingSum : data;
                    let strVal = Number(sum).toFixed(2);
                    return (
                        <div style={{textAlign: 'right'}}>
                            {sum ? `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : <FormattedMessage id='long_dash' />}
                        </div>
                    )
                }
            },
            {
                width:     actionColWidth,
                key:       'delete',
                render:     (elem)=>{
                    return this.props.disabled ? null : (
                        <Button
                            disabled={this.props.disabled || !elem.detailCode || isForbidden(this.props.user, permissions.ACCESS_STOCK)}
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

        this.purchaseColumn = {
            title:     <FormattedMessage id='order_form_table.purchasePrice' />,
            key:       'purchasePrice',
            dataIndex: 'purchasePrice',
            render:     (data, elem)=>{
                return (
                    <div style={{textAlign: 'right'}}>
                        {data ?`${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : <FormattedMessage id='long_dash' />}
                    </div>
                )
            }
        };
    }

    render() {
        const { disabled, docProducts, loading, type } = this.props;
        const tblColumns = [...this.columns];
        if(type == EXPENSE) {
            tblColumns.splice( 7, 0, this.purchaseColumn);
        }
        var tableData = docProducts;
        tableData = tableData.filter((elem)=>elem.detailCode);
        if(!disabled && (!tableData.length || tableData[tableData.length-1].detailCode)) {
            tableData.push({
                key: tableData.length,
                productId: undefined,
            })
        }
        return (
            <Table
                columns={tblColumns}
                dataSource={tableData}
                pagination={false}
                loading={loading}
            />
        );
    }
}

@injectIntl
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
            sellingPrice: 0,
            stockPrice: 0,
            quantity: 1,
            detailCodeSearch: '',
            storageBalance: [
                {messageId: 'storage.in_stock', count: 0},
                {messageId: 'storage.reserve', count: 0},
                {messageId: 'storage.in_orders', count: 0},
                {messageId: 'storage.ordered', count: 0},
                {messageId: 'storage.deficit', count: 0},
                {messageId: 'storage.min', count: 0},
                {messageId: 'storage.max', count: 0},
                {messageId: 'storage.to_order', count: 0},
            ]
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
        let url = __API_URL__ + `/store_products?all=true`;
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
                storageProducts: data.list
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    buildStoreGroupsTree(data) {
        var treeData = [];
        for (let i = 0; i < data && data.length ? data.length : 0; i++) {
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
                        priceGroup: lastNode.priceGroupNumber,
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
                            priceGroup: elem.priceGroupNumber,
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

    getCurrentPrice(detailCode, businessSupplierId) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_suppliers/pricelists?partNumber=${detailCode}&businessSupplierId=${businessSupplierId}`;
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
            if(data.length) {   
                that.setState({
                    stockPrice: data[0].purchasePrice,
                })
            }
            
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    getProductId(detailCode, brandId, productId) {
        const { storageProducts, storageBalance, detailName, quantity, tradeCode } = this.state;
        var storageProduct;
        if(productId) {
            storageProduct = storageProducts.find((elem)=>elem.id==productId);
        } else {
            storageProduct = storageProducts.find((elem)=>elem.code==detailCode && (!brandId || elem.brandId == brandId));
        }
        if(storageProduct) {
            storageBalance[0].count = storageProduct.countInWarehouses;
            storageBalance[1].count = storageProduct.reservedCount;
            storageBalance[2].count = storageProduct.countInOrders;
            storageBalance[3].count = storageProduct.countInStoreOrders;
            storageBalance[4].count = storageProduct.lack;
            storageBalance[5].count = storageProduct.min;
            storageBalance[6].count = storageProduct.max;
            storageBalance[7].count = storageProduct.quantity;
            this.setState({
                groupId: storageProduct.groupId,
                productId: storageProduct.id,
                detailName: storageProduct.name,
                brandId: storageProduct.brandId,
                brandName: storageProduct.brand && storageProduct.brand.name,
                tradeCode: storageProduct.tradeCode,
                quantity: storageProduct.quantity || 1,
                stockPrice: (this.props.sellingPrice ? 
                    storageProduct.stockPrice * (storageProduct.group && storageProduct.group.multiplier || 1.4) : 
                    storageProduct.stockPrice) || 0,
            })
            this.getCurrentPrice(detailCode, this.props.businessSupplierId);
            return true;
        }
        else {
            storageBalance[0].count = 0;
            storageBalance[1].count = 0;
            storageBalance[2].count = 0;
            storageBalance[3].count = 0;
            storageBalance[4].count = 0;
            storageBalance[5].count = 0;
            storageBalance[6].count = 0;
            storageBalance[7].count = 0;
            this.setState({
                groupId: undefined,
                productId: undefined,
                detailName: this.props.warning ? detailName : undefined,
                quantity: quantity || 1,
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
            tradeCode,
            sellingPrice,
        } = productData;

        if(!this.props.warning) {
            this.props.addDocProduct({
                productId: productId,
                detailCode: detailCode,
                brandName: brandName,
                brandId: brandId,
                tradeCode: tradeCode,
                detailName: detailName,
                stockPrice: stockPrice,
                sellingPrice: sellingPrice,
                quantity: quantity,
                sum: quantity*stockPrice,
            });
            this.setState({
                alertModalVisible: false,
            });
        } else {
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
                    sellingPrice: sellingPrice,
                    quantity: quantity,
                    sum: quantity*stockPrice,
                }
            );
        }
        this.handleCancel();
        this.getStorageProducts();
    }

    cancelAlertModal() {
        this.setState({
            alertModalVisible: false,
        })
    }

    handleOk() {
        const { intl: {formatMessage} } = this.props;
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
            sellingPrice,
        } = this.state;

        if(!brandId || !detailCode) {
            notification.error({
                message: formatMessage({id: 'storage_document.error.required_fields'}),
            });
            return;
        }

        if(!this.getProductId(detailCode, brandId)) {
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
                        sellingPrice: sellingPrice,
                        quantity: quantity,
                        groupId: groupId,
                        sum: quantity*stockPrice,
                        sellingSum: quantity*sellingPrice,
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
                    sellingPrice: sellingPrice,
                    sum: quantity*stockPrice,
                    sellingSum: quantity*sellingPrice,
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
            sellingPrice: 0,
            stockPrice: 0,
            quantity: 1,
        });
        this.props.hideModal();
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.visible && this.props.visible) {
            this.getStorageProducts();
            const { product } = this.props;
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
                    ordersAppurtenancies: product.ordersAppurtenancies,
                    sellingPrice: product.sellingPrice,
                })
            }
        }
    }

    selectProduct = (productId) => {
        const { storageBalance } = this.state;
        const product = this.state.storageProducts.find((product)=>product.id == productId);
        if(product) {
            storageBalance[0].count = product.countInWarehouses;
            storageBalance[1].count = product.reservedCount;
            storageBalance[2].count = product.countInOrders;
            storageBalance[3].count = product.countInStoreOrders;
            storageBalance[4].count = product.lack;
            storageBalance[5].count = product.min;
            storageBalance[6].count = product.max;
            storageBalance[7].count = product.quantity;
            this.setState({
                productId: product.id,
                brandId: product.brandId,
                brandName: product.brand && product.brand.name,
                detailCode: product.code,
                detailName: product.name,
                tradeCode: product.tradeCode,
                stockPrice: Math.round(product.stockPrice*10)/10 || 0,
                sellingPrice: product.salePrice || Math.round(product.stockPrice * 10 *((product.priceGroup && product.priceGroup.multiplier) || 1.4))/10 || 0,
                quantity: product.quantity || 1,
            })
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
            storageBalance,
            sellingPrice,
        } = this.state;

        return (
            <Modal
                visible={this.props.visible}
                width={'fit-content'}
                onOk={()=>{
                    this.handleOk();
                }}
                onCancel={()=>{
                    this.handleCancel();
                }}
                maskClosable={false}
                zIndex={200}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        margin: '24px 0 0 0'
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
                                    tradeCode: undefined,
                                    detailCodeSearch: value,
                                });
                                this.getProductId(value, brandId);
                            }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    detailCode: option.props.code,
                                    detailName: option.props.detail_name,
                                    stockPrice: option.props.price,
                                    detailCodeSearch: "",
                                });
                                this.getProductId(undefined, undefined, value);
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
                                storageProducts.map((elem, key)=>{
                                    return (
                                        <Option
                                            key={key}
                                            value={String(elem.id)}
                                            detail_name={elem.name}
                                            price={0}
                                            trade_code={elem.tradeCode}
                                            code={elem.code}
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
                    <DetailStorageModal
                        brandFilter={brandName}
                        codeFilter={detailCode}
                        brandId={brandId}
                        stockMode={true}
                        user={this.props.user}
                        selectProduct={this.selectProduct}
                    />
                    <div className={Styles.addProductItemWrap} style={{minWidth: 140}}>
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
                                    tradeCode: undefined,
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
                   {(this.props.isIncome && !this.props.priceDisabled) &&
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
                    {!this.props.priceDisabled &&
                    <div className={Styles.addProductItemWrap}>
                        <div><FormattedMessage id='order_form_table.price' /></div>
                        <InputNumber
                            disabled={this.props.priceDisabled || this.props.maxOrdered}
                            value={this.props.sellingPrice ? sellingPrice : stockPrice}
                            style={{
                                //marginLeft: 10,
                            }}
                            min={0}
                            onChange={(value)=>{
                                if(this.props.sellingPrice) {
                                    this.setState({
                                        sellingPrice: value
                                    })
                                } else {
                                    this.setState({
                                        stockPrice: value
                                    })
                                }
                            }}
                        />
                    </div>}
                    <div className={Styles.addProductItemWrap}>
                        <div><FormattedMessage id='order_form_table.count' /></div>
                        <InputNumber
                            value={quantity}
                            style={{
                                //marginLeft: 10,
                            }}
                            min={1}
                            max={this.props.maxOrdered ? storageBalance[3].count : undefined}
                            onChange={(value)=>{
                                this.setState({
                                    quantity: value
                                })
                            }}
                        />
                    </div>
                    {!this.props.priceDisabled &&
                    <div className={Styles.addProductItemWrap}>
                        <div><FormattedMessage id='order_form_table.sum' /></div>
                        <InputNumber
                            disabled
                            style={{
                                color: 'black',
                                //marginLeft: 10,
                            }}
                            value={Math.round(quantity*(this.props.sellingPrice ? sellingPrice : stockPrice)*10)/10}
                        />
                    </div>}
                </div>
                <AddStoreProductModal
                    alertVisible={alertModalVisible}
                    brands={this.props.brands}
                    confirmAlertModal={this.confirmAlertModal}
                    cancelAlertModal={this.cancelAlertModal}
                    storeGroupsTree={storeGroupsTree}
                    warehouses={this.props.warehouses}
                    warehouseId={this.props.warehouseId}
                    {...this.state}
                >
                    <FormattedMessage id='storage_document.error.product_not_found'/>
                </AddStoreProductModal>
                {this.props.type == ORDER && 
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {storageBalance.map((elem, key)=>{
                        const message = this.props.intl.formatMessage({id: elem.messageId}) || elem.messageId;
                        return (
                            <div className={Styles.addProductItemWrap} key={key} style={{padding: '0 5px'}}>
                                <div>{message}</div>
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.count}
                                />
                            </div>
                        )
                    })}
                </div>}
            </Modal>
        );
    }
}

const measureUnitsOptions = Object.freeze({
    PIECE: 'PIECE',
    LITER: 'LITER',
});

@injectIntl
export class AddStoreProductModal extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            visible: false,
            detailCodeSearch: "",
            brandSearchValue: "",
            measureUnit: measureUnitsOptions.PIECE,
            tradeCode: undefined,
            certificate: undefined,
            barcode: undefined,
            priceGroupNumber: undefined,
            priceGroups: [],
            defaultWarehouseId: undefined,
            storeInWarehouse: false,
            multiplicity: 1,
            min: 1,
            max: 1,
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

    ordersAppurtenancies(orderIds = [], productId, code, brandId) {
        const postData = [];
        if(orderIds.length) {
            postData.push({
                ordersAppurtenancies: [...orderIds],
                productId: productId
            });
        } else {
            postData.push({
                checkEverywhere: true,
                productId: productId,
                code: code,
                brandId: brandId,
            });
        }

        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/orders/update_orders_appurtenancies_from_stock`;
        fetch(url, {
            method: "PUT",
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
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    postStoreProduct() {
        const { intl: {formatMessage} } = this.props;
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
            barcode,
            defaultWarehouseId,
            multiplicity,
            min,
            max,
            storeInWarehouse,
            ordersAppurtenancies,
        } = this.state;

        if(!brandId || !detailCode || !groupId || !detailName) {
            notification.error({
                message: formatMessage({id: 'storage_document.error.required_fields'}), 
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
            barcode: undefined,
            priceGroupNumber: priceGroupNumber,
            defaultWarehouseId: defaultWarehouseId,
        }

        if(storeInWarehouse) {
            postData.min = min*multiplicity;
            postData.max = max*multiplicity;
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
            that.setState({visible: false});
            //that.ordersAppurtenancies(ordersAppurtenancies, data.id, detailCode, brandId);
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
                ...this.props,
                defaultWarehouseId: this.props.warehouseId
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
            defaultWarehouseId,
            tradeCode,
            certificate,
            barcode,
            storeInWarehouse,
            multiplicity,
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
                    maskClosable={false}
                    zIndex={300}
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
                    maskClosable={false}
                    zIndex={350}
                >
                    <div className={Styles.addProductModalOtemWrap}>
                        <FormattedMessage id='order_form_table.detail_code' />{requiredField()}
                        <AutoComplete
                            value={detailCode}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            onChange={(value)=>{
                                this.setState({
                                    detailCode: value,
                                    detailCodeSearch: value,
                                });
                                this.getProductId(value, brandId);
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
                    <div className={Styles.addProductModalOtemWrap}>
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
                    <div className={Styles.addProductModalOtemWrap}>
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
                                    priceGroupNumber: option.props.priceGroup || undefined,
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductModalOtemWrap}>
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
                    <div className={Styles.addProductModalOtemWrap}>
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
                    <div className={Styles.addProductModalOtemWrap}>
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
                    <div className={Styles.addProductModalOtemWrap}>
                        <FormattedMessage id='storage.default_warehouse' />
                        <Select
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            value={defaultWarehouseId}
                            onSelect={(value)=>{
                                this.setState({
                                    defaultWarehouseId: value,
                                })
                            }}
                        >
                            {this.props.warehouses.map((elem, i)=>{
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
                    <div className={Styles.addProductModalOtemWrap}>
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
                    <div className={Styles.addProductModalOtemWrap}>
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
                    <div className={Styles.addProductModalOtemWrap}>
                        <FormattedMessage id='navigation.barcode' />
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Input
                                value={barcode}
                                disabled
                                onChange={(event)=>{
                                    this.setState({
                                        barcode: event.target.value,
                                    })
                                }}
                            />
                            <Barcode
                                value={barcode}
                                iconStyle={{
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            />
                        </div>
                    </div>
                    <div className={Styles.addProductModalOtemWrap}>
                        <FormattedMessage id='storage_document.store_in_warehouse' />
                        <Checkbox
                            style={{marginLeft: 8}}
                            onChange={()=>{
                                this.setState({
                                    storeInWarehouse: !storeInWarehouse,
                                })
                            }}
                        />
                    </div>
                    {storeInWarehouse &&
                        <div className={Styles.addProductModalOtemWrap} style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                <span style={{marginRight: 8}}><FormattedMessage id='storage_document.multiplicity'/></span>
                                <InputNumber
                                    value={multiplicity}
                                    step={1}
                                    min={1}
                                    onChange={(value)=>{
                                        this.setState({
                                            multiplicity: value,
                                        })
                                    }}
                                />
                            </div>
                            <div>
                                <span style={{marginRight: 8}}><FormattedMessage id='storage.min'/></span>
                                <InputNumber
                                    value={min*multiplicity}
                                    step={multiplicity}
                                    min={0}
                                    onChange={(value)=>{
                                        const clearValue = Math.floor(value/multiplicity);
                                        this.setState({
                                            min: Math.floor(value/multiplicity),
                                            //max: max < clearValue ? clearValue : max,
                                        })
                                    }}
                                />
                            </div>
                            <div>
                                <span style={{marginRight: 8}}><FormattedMessage id='storage.max'/></span>
                                <InputNumber
                                    value={max*multiplicity}
                                    step={multiplicity}
                                    min={min*multiplicity}
                                    onChange={(value)=>{
                                        this.setState({
                                            max: Math.floor(value/multiplicity),
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    }
                </Modal>
            </>
        );
    }
}

function requiredField() {
    return <b style={{color: 'var(--required)'}}> *</b>;
}