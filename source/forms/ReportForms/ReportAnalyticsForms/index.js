/*
This module contains two forms, each purpose is to work with specific analytics(one for catalog anlytics and another for ordinar analytics)
*/

//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row, Input } from 'antd';

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
            form,
            intl: {formatMessage}
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
                    <Col span={6}><FormattedMessage id='report_analytics_form.catalog_name'/>: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('catalogName', {
                                    rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.catalog_name_is_required_message'}) }],
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
            intl: {formatMessage}
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
                label: formatMessage({id: 'report_analytics_page.income_cash_order'})
            },
            {
                value: 'EXPENSE',
                label: formatMessage({id: 'report_analytics_page.expense_cash_order'})
            }
        ];
        
        return (
            <Form>
                <Row className={Styles.row}>
                    <Col span={6}><FormattedMessage id='report_analytics_form.select_catalog'/>: </Col>
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
                                    { required: true, message: formatMessage({id: 'report_analytics_form.catalog_must_be_selected_message'}) },
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
                    <Col span={6}><FormattedMessage id='report_analytics_form.analytics_name'/>: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('analyticsName', {
                                    rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.analytics_name_message'}) }],
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
                    <Col span={6}><FormattedMessage id='report_analytics_form.bookkeeping_account'/>: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('bookkeepingAccount', {
                                    initialValue: initValues.bookkeepingAccount,
                                    rules: [
                                        { pattern: /^\d+$/, message: formatMessage({id: 'report_analytics_form.invalid_bookkeeping_account_message'}) }
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
                    <Col span={6}><FormattedMessage id='report_analytics_form.order_type'/>: </Col>
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
                                    { required: true, message: formatMessage({id: 'report_analytics_form.order_type_must_me_selected_message'}) }
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