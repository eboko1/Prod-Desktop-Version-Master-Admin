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
                key:       'code',
                dataIndex: 'detailCode',
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                width:     '20%',
                key:       'brand',
                dataIndex: 'brandName',
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
            },
            {
                title:     <FormattedMessage id='order_form_table.purchasePrice' />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'count',
                dataIndex: 'count',
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
        console.log(this);
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
                    <Form.Item
                        {...formItemStyle}
                        label={<FormattedMessage id='storage.type'/>}
                        name="type"
                        rules={[{ required: true}]}
                    >
                        <Select />
                    </Form.Item>
                    <Form.Item
                        {...formItemStyle}
                        label={<FormattedMessage id='storage_document.document_type'/>}
                        name="username"
                        rules={[{ required: true}]}
                    >
                        <Select />
                    </Form.Item>
                    <Form.Item
                        {...formItemStyle}
                        label={<FormattedMessage id='storage_document.supplier'/>}
                        name="username"
                        rules={[{ required: true}]}
                    >
                        <Input />
                        <Icon
                            type='edit'
                            style={{
                                position: 'absolute',
                                right: '-25px',
                                top: '10px',
                                cursor: 'pointer'
                            }}
                        />
                    </Form.Item>
                </div>
                <div
                    style={{
                        width: "30%"
                    }}
                >
                    <Form.Item
                        {...formItemStyle}
                        label={<FormattedMessage id='storage_document.storage_expenses'/>}
                        name="username"
                    >
                        <Select />
                    </Form.Item>
                    <Form.Item
                        {...formItemStyle}
                        label={<FormattedMessage id='storage_document.storage_income'/>}
                        name="username"
                    >
                        <Select />
                    </Form.Item>
                    <Form.Item
                        {...formItemStyle}
                        label={<FormattedMessage id='storage.document_num'/>}
                        name="username"
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div
                    style={{
                        width: "25%"
                    }}
                >
                    <Form.Item className={Styles.sumBlock} {...formItemStyle}>
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
                                    0
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
                                    0
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
                                    0
                                </Numeral>
                            </span>
                            <span style={{
                                minWidth: '125px',
                            }}>
                                <FormattedMessage id="header.until" />: 
                                {` ${moment().format('DD MMMM YYYY')}`}
                            </span>
                        </div>
                    </Form.Item>
                </div>
            </Form>
            <div style={{
                margin: "24px",
            }}>
                <Table
                    columns={this.columns}
                />
            </div>
            </>
        );
    }
}

export default StorageDocumentForm;
