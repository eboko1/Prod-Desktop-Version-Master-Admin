// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Table, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { Numeral } from "commons";
// own
import Styles from './styles.m.css';
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};
const mask = "0,0.00";

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
        return (
            <>
            <Form
                {...formItemLayout}
                style={{
                    marginTop: 15,
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
                        label={<FormattedMessage id='storage_document.supplier'/>}
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="№"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div
                    style={{
                        width: "20%"
                    }}
                >
                <Form.Item
                        label={<FormattedMessage id='storage_document.storage_expenses'/>}
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Select />
                    </Form.Item>
                    <Form.Item
                        label={<FormattedMessage id='storage_document.storage_income'/>}
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Select />
                    </Form.Item>
                </div>
                <div
                    style={{
                        width: "35%"
                    }}
                >
                    <Form.Item className={Styles.sumBlock}>
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
                            <span className={Styles.sumWrapper}>
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
                            <span className={Styles.sumWrapper}>
                                <FormattedMessage id="header.until" />
                                <Numeral
                                    mask={mask}
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                    nullText="0"
                                >
                                    0
                                </Numeral>
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
