// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Table, Select, Icon } from 'antd';
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

        this.columns = [
            {
                title:     "№",
                width:     '5%',
                key:       'key',
                dataIndex: 'key',
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                width:     '20%',
                key:       'producrId',
                dataIndex: 'producrId',
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                width:     '20%',
                key:       'brandId',
                dataIndex: 'brandId',
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
            },
            {
                title:     <FormattedMessage id='order_form_table.purchasePrice' />,
                key:       'stockPrice',
                dataIndex: 'stockPrice',
                width:     '10%',
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'quantity',
                dataIndex: 'quantity',
                width:     '10%',
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
            },
        ];
    }


    render() {
        const { formData, updateFormData, typeToDocumentType, warehouses, counterpartSupplier } = this.props;
        const { type, documentType, supplierDocNumber, counterpartId, docProducts } = this.props.formData;
        const tableData = [...docProducts];
        if(formData.status != 'DONE' && (!tableData.length || !tableData[tableData.length - 1].brandId)) {
            tableData.push({
                key: tableData.length,
                brandId: undefined,
                producrId: undefined,
                quantity: 1,
                stockPrice: 0,
            })
        }
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
                            disabled={!type}
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
                            disabled={type!='EXPENSE'}
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
                            disabled={type!='INCOME'}
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
                                    {formData.sum || 0}
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
                                    {formData.sum || 0}
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
                                    {0}
                                </Numeral>
                            </span>
                            <span className={Styles.sumWrapper}>
                                <FormattedMessage id="header.until" />: 
                                {` ${moment().format('DD MMMM YYYY')}`}
                            </span>
                        </div>
                    </div>
                </div>
            </Form>
            <div style={{
                margin: "24px",
            }}>
                <Table
                    columns={this.columns}
                    dataSource={tableData}
                />
            </div>
            </>
        );
    }
}

export default StorageDocumentForm;
