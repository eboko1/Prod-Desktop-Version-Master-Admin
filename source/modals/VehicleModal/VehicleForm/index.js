//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row, Input, Button } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    formModes,
} from 'core/forms/reportAnalyticsForm/duck';

//own
import Styles from './styles.m.css'
import {
    DecoratedSelect,
    DecoratedInput,
    DecoratedDatePicker,
} from "forms/DecoratedFields";
const FItem = Form.Item;

@injectIntl
class VehicleFormClass extends React.Component {
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


        // const initValues = {
        //     catalogName: analyticsEntity.analyticsName
        // }
        
        const fieldsDisabled = false;//(mode == formModes.VIEW);

        return (
            <Form>
                <Row className={Styles.row}>
                    <Col span={6}>vehicleNumber: </Col>
                    <Col span={12}>
                        <FItem>
                            {
                                getFieldDecorator('vehicleNumber', {
                                    rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.catalog_name_is_required_message'}) }],
                                    // initialValue: initValues.catalogName
                                })(
                                    <Input
                                        disabled={fieldsDisabled}
                                    />
                                )
                            }
                        </FItem>
                    </Col>
                    <Col span={6}> <Button type="primary" >Get vin</Button> </Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleVin: </Col>
                    <Col span={12}>
                        <FItem>
                            {
                                getFieldDecorator('vehicleVin', {
                                    rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.catalog_name_is_required_message'}) }],
                                    // initialValue: initValues.catalogName
                                })(
                                    <Input
                                        disabled={fieldsDisabled}
                                    />
                                )
                            }
                        </FItem>
                    </Col>
                    <Col span={6}> <Button type="primary" >Get car</Button> </Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleYear: </Col>
                    <Col span={12}>                        
                        <FItem>
                            {
                                getFieldDecorator('vehicleYear', {
                                    rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.catalog_name_is_required_message'}) }],
                                    // initialValue: initValues.catalogName
                                })(
                                    <Input
                                        disabled={fieldsDisabled}
                                    />
                                )
                            }
                        </FItem>
                    </Col>
                    <Col span={6}></Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleMake: </Col>
                    <Col span={12}>
                        <DecoratedSelect
                                field="makeId"
                                showSearch
                                hasFeedback
                                formItem
                                getFieldDecorator={getFieldDecorator}
                                rules={[
                                    {
                                        required: true,
                                        message: this.props.intl.formatMessage({
                                            id: "required_field",
                                        }),
                                    },
                                ]}
                                placeholder={"Enter here"}
                                // disabled={
                                //     ![
                                //         YEAR_VEHICLES_INFO_FILTER_TYPE,
                                //         MAKE_VEHICLES_INFO_FILTER_TYPE,
                                //         MODEL_VEHICLES_INFO_FILTER_TYPE,
                                //     ].includes(lastFilterAction)
                                // }
                                onSelect={value => {
                                    // const filters = _.pick(
                                    //     { ...vehicle, makeId: value },
                                    //     ["year", "makeId"],
                                    // );
                                    // this.props.fetchVehiclesInfo(
                                    //     MAKE_VEHICLES_INFO_FILTER_TYPE,
                                    //     filters,
                                    // );
                                    console.log("Select performed. Fetch next field data!");
                                }}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                <Option value={1} key={v4()}>
                                    Test 1
                                </Option>
                                <Option value={2} key={v4()}>
                                    1945
                                </Option>
                                {/* {makes.map(({ id, name }) => (
                                    <Option value={id} key={v4()}>
                                        {name}
                                    </Option>
                                ))} */}
                            </DecoratedSelect>
                    </Col>
                    <Col span={6}></Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleModel: </Col>
                    <Col span={12}>
                        <FItem>
                            {
                                getFieldDecorator('vehicleModel', {
                                    rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.catalog_name_is_required_message'}) }],
                                    // initialValue: initValues.catalogName
                                })(
                                    <Input
                                        disabled={fieldsDisabled}
                                    />
                                )
                            }
                        </FItem>
                    </Col>
                    <Col span={6}></Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleModification: </Col>
                    <Col span={12}>
                        <FItem>
                            {
                                getFieldDecorator('vehicleModification', {
                                    rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.catalog_name_is_required_message'}) }],
                                    // initialValue: initValues.catalogName
                                })(
                                    <Input
                                        disabled={fieldsDisabled}
                                    />
                                )
                            }
                        </FItem>
                    </Col>
                    <Col span={6}></Col>
                </Row>
            </Form>
        );
    }
}

// @injectIntl
// class ReportAnalytics extends React.Component {
//     constructor(props) {
//         super(props);

//         const {getFormRefCB} = this.props;

//         //Callback to get form instance (warppedComponentRef does not work)
//         getFormRefCB && getFormRefCB(this.props.form);
        
//     }

//     render() {
//         const { getFieldDecorator } = this.props.form;

//         const {
//             analyticsCatalogs,
//             analyticsCatalogsLoading,
//             mode,
//             analyticsEntity,
//             intl: {formatMessage}
//         } = this.props;

//         //Initial values are generally used for EDIT or VIEW mode
//         const initValues = {
//             catalogId: analyticsEntity.analyticsParentId,
//             analyticsName: analyticsEntity.analyticsName,
//             bookkeepingAccount: analyticsEntity.analyticsBookkeepingAccount,
//             orderType: analyticsEntity.analyticsOrderType

//         };

//         //Disable all fields in VIEW mode
//         const fieldsDisabled = (mode == formModes.VIEW);

//         const orderTypes = [
//             {
//                 value: 'INCOME',
//                 label: formatMessage({id: 'report_analytics_page.income_cash_order'})
//             },
//             {
//                 value: 'EXPENSE',
//                 label: formatMessage({id: 'report_analytics_page.expense_cash_order'})
//             }
//         ];
        
//         return (
//             <Form layout='vertical'>
//                 <Row className={Styles.row}>
//                     <Col span={6}><FormattedMessage id='report_analytics_form.select_catalog'/>: </Col>
//                     <Col span={18}>
//                         <FItem>
//                             <DecoratedSelect
//                                 field="catalogId"
//                                 showSearch
//                                 loading={analyticsCatalogsLoading}
//                                 disabled={analyticsCatalogsLoading || (fieldsDisabled)}
//                                 allowClear
//                                 formItem
//                                 initialValue={initValues.catalogId}
//                                 style={{width: '100%'}}
//                                 getFieldDecorator={getFieldDecorator}
//                                 getPopupContainer={trigger =>
//                                     trigger.parentNode
//                                 }
//                                 rules={[
//                                     { required: true, message: formatMessage({id: 'report_analytics_form.catalog_must_be_selected_message'}) },
//                                 ]}
//                                 options={analyticsCatalogs}
//                                 optionValue="analyticsId" //Will be sent as var
//                                 optionLabel="analyticsName"
//                             />
//                         </FItem>
//                     </Col>
//                 </Row>
//                 {/* ==================================================== */}
//                 <Row className={Styles.row}>
//                     <Col span={6}><FormattedMessage id='report_analytics_form.analytics_name'/>: </Col>
//                     <Col span={18}>
//                         <FItem>
//                             {
//                                 getFieldDecorator('analyticsName', {
//                                     rules: [{ required: true, whitespace: true, message: formatMessage({id: 'report_analytics_form.analytics_name_message'}) }],
//                                     initialValue: initValues.analyticsName,
//                                 })(
//                                     <Input
//                                         disabled={(fieldsDisabled)}
//                                     />
//                                 )
//                             }
//                         </FItem>
//                     </Col>
//                 </Row>
//                 {/* ==================================================== */}
//                 <Row className={Styles.row}>
//                     <Col span={6}><FormattedMessage id='report_analytics_form.bookkeeping_account'/>: </Col>
//                     <Col span={18}>
//                         <FItem>
//                             {
//                                 getFieldDecorator('bookkeepingAccount', {
//                                     initialValue: initValues.bookkeepingAccount,
//                                     rules: [
//                                         { pattern: /^\d+$/, message: formatMessage({id: 'report_analytics_form.invalid_bookkeeping_account_message'}) }
//                                     ]
//                                 })(
//                                     <Input
//                                         disabled={(fieldsDisabled)}
//                                     />
//                                 )
//                             }
//                         </FItem>
//                     </Col>
//                 </Row>
//                 {/* ==================================================== */}
//                 <Row className={Styles.row}>
//                     <Col span={6}><FormattedMessage id='report_analytics_form.order_type'/>: </Col>
//                     <Col span={18}>
//                         <FItem>
//                             <DecoratedSelect
//                                 field="orderType"
//                                 showSearch
//                                 allowClear
//                                 formItem
//                                 disabled={(fieldsDisabled || !_.isEmpty(analyticsEntity.analyticsDefaultOrderType) )} //Disable if analytics is default somewhere
//                                 style={{width: '100%'}}
//                                 getFieldDecorator={getFieldDecorator}
//                                 initialValue={initValues.orderType}
//                                 getPopupContainer={trigger =>
//                                     trigger.parentNode
//                                 }
//                                 rules= {[
//                                     { required: true, message: formatMessage({id: 'report_analytics_form.order_type_must_me_selected_message'}) }
//                                 ]}
//                                 options={orderTypes}
//                                 optionValue="value" //Will be sent as var
//                                 optionLabel="label"
//                             />
//                         </FItem>
//                     </Col>
//                 </Row>
//                 <Row className={Styles.row}>
//                     <Col span={6}><FormattedMessage id='report_analytics_form.make_default'/>: </Col>
//                     <Col span={18} style={{display: 'flex', alignItems: 'flex-start'}}>
//                         <DecoratedCheckbox
//                             field="makeDefaultForCurrentCashOrderType"
//                             style={{height: '2em'}}
//                             formItem
//                             disabled={(fieldsDisabled)}
//                             getFieldDecorator={getFieldDecorator}
//                             getPopupContainer={trigger =>
//                                 trigger.parentNode
//                             }
//                         />
//                     </Col>
//                 </Row>
//             </Form>
//         );
//     }
// }

export default Form.create({name: 'report_analytics_catalog_form'})(VehicleFormClass);
// export const ReportAnalyticsForm = Form.create({name: 'report_analytics_form'})(ReportAnalytics);