// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Table, Select, Icon, DatePicker, AutoComplete, InputNumber } from 'antd';
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

@withReduxForm({
    name: "storageDocumentForm",
})
@injectIntl
class StorageDocumentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        const { formData, updateFormData, typeToDocumentType, warehouses, counterpartSupplier, updateDocProducts } = this.props;
        const { type, documentType, supplierDocNumber, counterpartId, docProducts, doneDatetime, status, sum } = this.props.formData;
        const dateFormat = 'DD.MM.YYYY';
        const disabled = status == 'DONE';
        
        return (
            <>
            <Form
                {...formItemLayout}
                style={{
                    margin: "15px 0",
                    padding: "0 0 15px 0",
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
                        <FormattedMessage id='storage.type'/>
                        <Select
                            disabled={disabled}
                            value={type}
                            onChange={(value)=>{
                                updateFormData({
                                    type: value,
                                    documentType: undefined,
                                })
                            }}
                        >
                            <Option
                                value='INCOME'
                            >
                                <FormattedMessage id='storage.INCOME'/>
                            </Option>
                            <Option
                                value='EXPENSE'
                            >
                                <FormattedMessage id='storage.EXPENSE'/>
                            </Option>
                        </Select>
                    </div>
                    <div>
                        <FormattedMessage id='storage_document.document_type'/>
                        <Select
                            disabled={!type || disabled}
                            value={documentType}
                            onChange={(value)=>{
                                updateFormData({
                                    documentType: value,
                                })
                            }}
                        >
                            {type && typeToDocumentType[type.toLowerCase()].documentType.map((docType, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={docType}
                                    >
                                        <FormattedMessage id={`storage_document.${String(docType).toLowerCase()}`}/>
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div>
                        <FormattedMessage id='storage_document.supplier'/>
                        <Select
                            disabled={disabled}
                            value={counterpartId}
                            onChange={(value)=>{
                                updateFormData({
                                    counterpartId: value,
                                })
                            }}
                        >
                            {counterpartSupplier.map((elem, i)=>{
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
                        <Icon
                            type='edit'
                            style={{
                                position: 'absolute',
                                right: '-25px',
                                top: '10px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        width: "30%"
                    }}
                >
                    <div>
                        <FormattedMessage id='storage_document.storage_expenses'/>
                        <Select
                            disabled={type!='EXPENSE' || disabled}
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
                        <FormattedMessage id='storage_document.storage_income'/>
                        <Select
                            disabled={type!='INCOME' || disabled}
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
                    </div>
                </div>
                <div
                    style={{
                        width: "30%"
                    }}
                >
                    <div>
                        <div className={Styles.sum}>
                            <span className={Styles.sumWrapper}>
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
                            </span>
                            <span
                                className={Styles.sumWrapper}
                                style={{
                                    background: 'var(--static)',
                                    fontSize: 16
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
                                    {sum || 0}
                                </Numeral>
                            </span>
                        </div>
                        <div className={Styles.sum}>
                            <span className={Styles.sumWrapper}>
                                <FormattedMessage id="remain" />
                                <Numeral
                                    mask={mask}
                                    className={Styles.totalSum}
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                    nullText="0"
                                >
                                    {sum - sum}
                                </Numeral>
                            </span>
                            <span className={Styles.sumWrapper}>
                                <FormattedMessage id="header.until" />: 
                                <DatePicker
                                    disabled={disabled}
                                    format={dateFormat}
                                    onChange={()=>{
                                        updateFormData({
                                            payUntileDatetime: event.target.value,
                                        })
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </Form>
            <div style={{
                margin: "24px",
            }}>
                <DocProductsTable
                    docProducts={docProducts}
                    disabled={disabled}
                    updateFormData={updateFormData}
                    updateDocProducts={updateDocProducts}
                    businessSupplierId={counterpartId}
                />
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
            tableData: this.props.docProducts
        }
        this.columns = [
            {
                title:     "№",
                width:     '5%',
                key:       'key',
                dataIndex: 'key',
                render:     (data, elem)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                width:     '20%',
                key:       'brandId',
                dataIndex: 'brandId',
                render:     (data, elem)=>{
                    return this.props.disabled && elem.product ?  (
                        elem.product.brandName
                    ) : (
                        <Select>

                        </Select>
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                width:     '20%',
                key:       'producrId',
                dataIndex: 'producrId',
                render:     (data, elem)=>{
                    return this.props.disabled && elem.product ?  (
                        elem.product.code
                    ) : (
                        <AutoComplete>

                        </AutoComplete>
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
                render:     (data, elem)=>{
                    return this.props.disabled && elem.product ?  (
                        elem.product.name
                    ) : (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.purchasePrice' />,
                key:       'stockPrice',
                dataIndex: 'stockPrice',
                width:     '10%',
                render:     (data, elem)=>{
                    return this.props.disabled ?  (
                        elem.purchasePrice
                    ) : (
                        <InputNumber
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                elem.stockPrice = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'quantity',
                dataIndex: 'quantity',
                width:     '10%',
                render:     (data, elem)=>{
                    return this.props.disabled ?  (
                        elem.quantity
                    ) : (
                        <InputNumber
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                elem.quantity = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render:     (data, elem)=>{
                    return this.props.disabled ?  (
                        elem.purchaseSum
                    ) : (
                        <InputNumber
                            disabled
                            style={{
                                color: 'black'
                            }}
                            value={elem.quantity*elem.stockPrice}
                        />
                    )
                }
            },
        ];
    }

    getOptions() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_suppliers/pricelists`;
        if(this.props.businessSupplierId) url += `?businessSupplierId=${this.props.businessSupplierId}`;
        console.log(url)
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
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.businessSupplierId != this.props.businessSupplierId) {
            this.getOptions()
        }
    }

    componentDidMount() {
    }

    render() {
        const { disabled, docProducts } = this.props;
        const tableData = docProducts;
        if(!disabled && (!tableData.length || tableData[tableData.length - 1].producrId)) {
            tableData.push({
                key: tableData.length,
                brandId: undefined,
                producrId: undefined,
                quantity: 1,
                stockPrice: 0,
            })
        }
        return (
            <Table
                columns={this.columns}
                dataSource={tableData}
            />
        );
    }
}
