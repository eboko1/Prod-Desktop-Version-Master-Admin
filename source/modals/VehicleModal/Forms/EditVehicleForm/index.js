//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

//proj
import {
    fetchVehicleYears,
    fetchVehicle,

    setClientId,
    selectFields,
    selectYears,
    selectMakes,
    selectModels,
    selectModifications,
    selectVehicle,

    setVehicleNumber,
    setVehicleVin,
    setVehicleYear,
    setVehicleMakeId,
    setVehicleModelId,
    setVehicleModificationId,
} from 'core/forms/vehicleForm/duck';

//own
import Styles from './styles.m.css'
import {
    DecoratedSelect,
    DecoratedInput,
    DecoratedDatePicker,
} from "forms/DecoratedFields";
const FItem = Form.Item;

const mapStateToProps = state => ({
    user: state.auth,
    modalProps: state.modals.modalProps,
    fields: selectFields(state),
    years: selectYears(state),
    makes: selectMakes(state),
    models:selectModels(state),
    modifications: selectModifications(state),
    vehicle: selectVehicle(state),
});

const mapDispatchToProps = {
    fetchVehicleYears,
    fetchVehicle,

    setClientId,
    setVehicleNumber,
    setVehicleVin,
    setVehicleYear,
    setVehicleMakeId,
    setVehicleModelId,
    setVehicleModificationId,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class VehicleFormClass extends React.Component {
    constructor(props) {
        super(props);

        const {getFormRefCB} = this.props;

        getFormRefCB && getFormRefCB(this.props.form); //Callback to get form instance (warppedComponentRef does not work)

    }

    componentDidMount() {
        // const {clientId} = this.props.modalProps;
        // this.props.fetchVehicleYears();
        // this.props.setClientId({clientId});
        const {vehicleId} = this.props;
        this.props.fetchVehicle({vehicleId});
    }

    render() {
        const {
            fields,
            years,
            makes,
            models,
            modifications,
            vehicle,

            setVehicleNumber,
            setVehicleVin,
            setVehicleYear,
            setVehicleMakeId,
            setVehicleModelId,
            setVehicleModificationId,
            form,
            intl: {formatMessage}
        } = this.props;
        
        const { getFieldDecorator, resetFields} = form;
        //------------------

        console.log("Edit form, vehicle: ", vehicle);


        const initValues = {
            number: vehicle.vehicleNumber,
            vin: vehicle.vehicleVin,
            year: vehicle.year,
            makeId: vehicle.makeId,
            modelId: vehicle.vehicleModelId,
            modificationId: vehicle.vehicleModificationId,
        }
        
        const fieldsDisabled = false;//(mode == formModes.VIEW);

        return (
            <Form>
                This is edit form
                <Row className={Styles.row}>
                    <Col span={6}>vehicleNumber: </Col>
                    <Col span={12}>
                        <DecoratedInput
                            field="number"
                            initialValue={initValues.number}
                            hasFeedback
                            formItem
                            rules={[
                                {
                                    required: true,
                                    message: this.props.intl.formatMessage({
                                        id: "required_field",
                                    }),
                                },
                            ]}
                            onChange={(e) => setVehicleNumber({number: e.target.value})}
                            getFieldDecorator={getFieldDecorator}
                        />
                    </Col>
                    <Col span={6}> <Button type="primary" >Get vin</Button> </Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleVin: </Col>
                    <Col span={12}>
                        <DecoratedInput
                            field="vin"
                            initialValue={initValues.vin}
                            hasFeedback
                            formItem
                            rules={[
                                {
                                    required: true,
                                    message: this.props.intl.formatMessage({
                                        id: "required_field",
                                    }),
                                },
                            ]}
                            onChange={(e) => setVehicleVin({number: e.target.value})}
                            getFieldDecorator={getFieldDecorator}
                        />
                    </Col>
                    <Col span={6}> <Button type="primary" >Get car</Button> </Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleYear: </Col>
                    <Col span={12}>
                        <DecoratedSelect
                                field="year"
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
                                initialValue={initValues.year}
                                disabled={false}
                                onSelect={value => {
                                    setVehicleYear({year: value});
                                    resetFields();
                                }}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {years.map((year) => (
                                    <Option value={year} key={v4()}>
                                        {year}
                                    </Option>
                                ))}
                            </DecoratedSelect>
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
                                initialValue={initValues.makeId}
                                disabled={!_.get(fields, 'year')}
                                onSelect={value => {
                                    setVehicleMakeId({makeId: value});
                                    resetFields();
                                }}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {makes.map(({ id, name }) => (
                                    <Option value={id} key={v4()}>
                                        {name}
                                    </Option>
                                ))}
                            </DecoratedSelect>
                    </Col>
                    <Col span={6}></Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleModel: </Col>
                    <Col span={12}>
                        <DecoratedSelect
                                field="modelId"
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
                                initialValue={initValues.modelId}
                                disabled={!_.get(fields, 'makeId')}
                                onSelect={value => {
                                    setVehicleModelId({modelId: value});
                                    resetFields();
                                }}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {models.map(({ id, name }) => (
                                    <Option value={id} key={v4()}>
                                        {name}
                                    </Option>
                                ))}
                            </DecoratedSelect>
                    </Col>
                    <Col span={6}></Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>vehicleModification: </Col>
                    <Col span={12}>
                        <DecoratedSelect
                                field="modificationId"
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
                                initialValue={initValues.modificationId}
                                disabled={!_.get(fields, 'modelId')}
                                onSelect={value => {
                                    setVehicleModificationId({modificationId: value});
                                    resetFields();
                                }}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {modifications.map(({ id, name }) => (
                                    <Option value={id} key={v4()}>
                                        {name}
                                    </Option>
                                ))}
                            </DecoratedSelect>
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