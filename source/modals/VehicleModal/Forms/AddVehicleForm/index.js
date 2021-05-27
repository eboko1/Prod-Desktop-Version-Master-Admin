//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row, Button } from 'antd';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

//proj
import {
    fetchVehicleYears,
    fetchVehicleMakes,
    fetchVehicleModels,
    fetchVehicleModifications,

    setClientId,
    selectFields,
    selectYears,
    selectMakes,
    selectModels,
    selectModifications,

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
});

const mapDispatchToProps = {
    fetchVehicleYears,
    fetchVehicleMakes,
    fetchVehicleModels,
    fetchVehicleModifications,

    setClientId,
    setVehicleNumber,
    setVehicleVin,
    setVehicleYear,
    setVehicleMakeId,
    setVehicleModelId,
    setVehicleModificationId,
};

/**
 * This form is used to create vehicle, it contains all required actions to fetch data and create vehicles
 * 
 * @param {Function} getFormRefCB -  callback, takes one argument(form refference)
 */
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
@Form.create({name: 'vehicle_add_from'})
export default class AddVehicleFormClass extends React.Component {
    constructor(props) {
        super(props);

        const {getFormRefCB} = this.props;
        getFormRefCB && getFormRefCB(this.props.form); //Callback to get form instance (warppedComponentRef does not work)

    }

    componentDidMount() {
        const {clientId} = this.props.modalProps;
        this.props.fetchVehicleYears();
        this.props.setClientId({clientId});
    }

    render() {
        const {
            fields,
            years,
            makes,
            models,
            modifications,

            fetchVehicleMakes,
            fetchVehicleModels,
            fetchVehicleModifications,

            setVehicleNumber,
            setVehicleVin,
            setVehicleYear,
            setVehicleMakeId,
            setVehicleModelId,
            setVehicleModificationId,
            form,
        } = this.props;
        
        const { getFieldDecorator, resetFields} = form;

        const initValues = {
            number: fields.number,
            vin: fields.vin,
            year: fields.year,
            makeId: fields.makeId,
            modelId: fields.modelId,
            modificationId: fields.modificationId,
        }
        
        return (
            <Form>
                <Row className={Styles.row}>
                    <Col span={6}>
                        <div className={Styles.colText}>
                            vehicleNumber: 
                        </div>
                    </Col>
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
                    <Col span={6}>
                        <div className={Styles.colText}>
                            vehicleVin: 
                        </div>
                    </Col>
                    <Col span={12}>
                        <DecoratedInput
                            field="vin"
                            initialValue={initValues.vin}
                            hasFeedback
                            formItem
                            onChange={(e) => setVehicleVin({vin: e.target.value})}
                            getFieldDecorator={getFieldDecorator}
                        />
                    </Col>
                    <Col span={6}> <Button type="primary" >Get car</Button> </Col>
                </Row>

                <Row className={Styles.row}>
                    <Col span={6}>
                        <div className={Styles.colText}>
                            vehicleYear: 
                        </div>
                    </Col>
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
                                    fetchVehicleMakes();
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
                    <Col span={6}>
                        <div className={Styles.colText}>
                            vehicleMake: 
                        </div>
                    </Col>
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
                                    fetchVehicleModels();

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
                    <Col span={6}>
                        <div className={Styles.colText}>
                            vehicleModel: 
                        </div>
                    </Col>
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
                                    fetchVehicleModifications();
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
                    <Col span={6}>
                        <div className={Styles.colText}>
                            vehicleModification: 
                        </div>
                    </Col>
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
