//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Modal, Form, Button, Col, Row, Checkbox, Radio, Tabs, Input, Select } from 'antd';
import moment from 'moment';

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
                <Row className={Styles.row}>
                    <Col span={6}>Catalog name: </Col>
                    <Col span={18}>
                        <FItem>
                            {
                                getFieldDecorator('catalogName', {
                                    rules: [{ required: true, whitespace: true, message: 'Catalog name please!!!' }]
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
                                disabled={analyticsCatalogsLoading || (mode == formModes.VIEW)}
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
                                // initialValue={status}
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
                                        disabled={(mode == formModes.VIEW)}
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
                                })(
                                    <Input
                                        disabled={(mode == formModes.VIEW)}
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
                                disabled={(mode == formModes.VIEW)}
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