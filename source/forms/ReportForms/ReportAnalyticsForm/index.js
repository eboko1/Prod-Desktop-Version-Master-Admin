//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Modal, Form, Button, Col, Row, Checkbox, Radio, Tabs, Input, Select } from 'antd';
import moment from 'moment';

//proj


//own
import Styles from './styles.m.css'
import {
    DecoratedSelect
} from "forms/DecoratedFields";

const FItem = Form.Item;
const RGroup = Radio.Group;
const CGroup = Checkbox.Group;
const TPane = Tabs.TabPane;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


@injectIntl
class ReportAnalyticsCatalog extends React.Component {
    constructor(props) {
        super(props);

        const {getFormRefCB} = this.props;

        //Callback to get form instance (warppedComponentRef does not work)
        getFormRefCB && getFormRefCB(this.props.form);

    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const {
        } = this.props;

        
        return (
            <Form>
                <Row>
                    <Col span={6}>Catalog name: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('catalogName', {
                                    rules: [{ required: true, message: 'Please catalog name!!!' }]
                                })(
                                    <Input />
                                )
                            }
                        </FItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

@injectIntl
class ReportAnalytics extends React.Component {
    constructor(props) {
        super(props);

        const {getFormRefCB} = this.props;

        //Callback to get form instance (warppedComponentRef does not work)
        getFormRefCB && getFormRefCB(this.props.form);
        
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const {
            analyticsCatalogs
        } = this.props;

        const orderTypes = [
            {
                value: 'INCOME',
                label: 'Income'
            },
            {
                value: 'EXPENSE',
                label: 'Expense'
            }
        ];

        
        return (
            <Form>
                <Row>
                    <Col span={6}>Select catalog: </Col>
                    <Col span={18}>
                        <FItem>
                            <DecoratedSelect
                                field="catalogId"
                                showSearch
                                allowClear
                                getFieldDecorator={getFieldDecorator}
                                getPopupContainer={trigger =>
                                    trigger.parentNode
                                }
                                options={analyticsCatalogs}
                                optionValue="analyticsId" //Will be sent as var
                                optionLabel="analyticsName"
                                // initialValue={status}
                            />
                        </FItem>
                    </Col>
                </Row>
                {/* ==================================================== */}
                <Row>
                    <Col span={6}>Analytics name: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('analyticsName')(
                                    <Input />
                                )
                            }
                        </FItem>
                    </Col>
                </Row>
                {/* ==================================================== */}
                <Row>
                    <Col span={6}>Bookkeeping account: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('bookkeepingAccount')(
                                    <Input />
                                )
                            }
                        </FItem>
                    </Col>
                </Row>
                {/* ==================================================== */}
                <Row>
                    <Col span={6}>Order type: </Col>
                    <Col span={18}>
                        <FItem>
                            <DecoratedSelect
                                field="orderType"
                                showSearch
                                allowClear
                                getFieldDecorator={getFieldDecorator}
                                getPopupContainer={trigger =>
                                    trigger.parentNode
                                }
                                options={orderTypes}
                                optionValue="value" //Will be sent as var
                                optionLabel="label"
                                // initialValue={status}
                            />
                        </FItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export const ReportAnalyticsCatalogForm = Form.create({name: 'report_analytics_catalog_form'})(ReportAnalyticsCatalog);
export const ReportAnalyticsForm = Form.create({name: 'report_analytics_form'})(ReportAnalytics);