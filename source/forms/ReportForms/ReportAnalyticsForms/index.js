/*
This module contains two forms, each purpose is to work with specific analytics(one for catalog anlytics and another for ordinar analytics)
*/

//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row, Checkbox, Radio, Tabs, Input } from 'antd';

//proj
import {
    formModes,
} from 'core/forms/reportAnalyticsForm/duck';

//own
import Styles from './styles.m.css'
import {
    DecoratedSelect
} from "forms/DecoratedFields";

const FItem = Form.Item;

@injectIntl
class ReportAnalyticsCatalog extends React.Component {
    constructor(props) {
        super(props);

        const {getFormRefCB} = this.props;

        //Callback to get form instance (warppedComponentRef does not work)
        getFormRefCB && getFormRefCB(this.props.form);

    }

    render() {
        const {
            mode,
            analyticsEntity,
            form
        } = this.props;
        
        const { getFieldDecorator} = form;
        //------------------


        const initValues = {
            catalogName: analyticsEntity.analyticsName
        }
        
        const fieldsDisabled = (mode == formModes.VIEW);

        return (
            <Form>
                <Row className={Styles.row}>
                    <Col span={6}>Catalog name: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('catalogName', {
                                    rules: [{ required: true, whitespace: true, message: 'Catalog name please!!!' }],
                                    initialValue: initValues.catalogName
                                })(
                                    <Input
                                        disabled={fieldsDisabled}
                                    />
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
        const { getFieldDecorator } = this.props.form;

        const {
            analyticsCatalogs,
            analyticsCatalogsLoading,
            mode,
            analyticsEntity,
        } = this.props;

        //Initial values are generally used for EDIT or VIEW mode
        const initValues = {
            catalogId: analyticsEntity.analyticsParentId,
            analyticsName: analyticsEntity.analyticsName,
            bookkeepingAccount: analyticsEntity.analyticsBookkeepingAccount,
            orderType: analyticsEntity.analyticsOrderType

        };

        //Disable all fields in VIEW mode
        const fieldsDisabled = (mode == formModes.VIEW);

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
                <Row className={Styles.row}>
                    <Col span={6}>Select catalog: </Col>
                    <Col span={18}>
                        <FItem>
                            <DecoratedSelect
                                field="catalogId"
                                showSearch
                                loading={analyticsCatalogsLoading}
                                disabled={analyticsCatalogsLoading || (fieldsDisabled)}
                                allowClear
                                formItem
                                initialValue={initValues.catalogId}
                                style={{width: '100%'}}
                                getFieldDecorator={getFieldDecorator}
                                getPopupContainer={trigger =>
                                    trigger.parentNode
                                }
                                rules={[
                                    { required: true, message: 'Catalog must be selected!!!' },
                                ]}
                                options={analyticsCatalogs}
                                optionValue="analyticsId" //Will be sent as var
                                optionLabel="analyticsName"
                            />
                        </FItem>
                    </Col>
                </Row>
                {/* ==================================================== */}
                <Row className={Styles.row}>
                    <Col span={6}>Analytics name: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('analyticsName', {
                                    rules: [{ required: true, whitespace: true, message: 'Analytics name please!!!' }],
                                    initialValue: initValues.analyticsName,
                                })(
                                    <Input
                                        disabled={(fieldsDisabled)}
                                    />
                                )
                            }
                        </FItem>
                    </Col>
                </Row>
                {/* ==================================================== */}
                <Row className={Styles.row}>
                    <Col span={6}>Bookkeeping account: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('bookkeepingAccount', {
                                    initialValue: initValues.bookkeepingAccount,
                                    rules: [
                                        { pattern: /^\d+$/, message: 'Please enter a valid positive number!' }
                                    ]
                                })(
                                    <Input
                                        disabled={(fieldsDisabled)}
                                    />
                                )
                            }
                        </FItem>
                    </Col>
                </Row>
                {/* ==================================================== */}
                <Row className={Styles.row}>
                    <Col span={6}>Order type: </Col>
                    <Col span={18}>
                        <FItem>
                            <DecoratedSelect
                                field="orderType"
                                showSearch
                                allowClear
                                formItem
                                disabled={(fieldsDisabled)}
                                style={{width: '100%'}}
                                getFieldDecorator={getFieldDecorator}
                                initialValue={initValues.orderType}
                                getPopupContainer={trigger =>
                                    trigger.parentNode
                                }
                                rules= {[
                                    { required: true, message: 'Order type must be selected!!!' }
                                ]}
                                options={orderTypes}
                                optionValue="value" //Will be sent as var
                                optionLabel="label"
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