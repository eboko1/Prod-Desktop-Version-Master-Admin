//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

//proj
import { Spinner } from 'commons';
import {
    fetchAllVehicleData,
    fetchVehicleMakes,
    fetchVehicleModels,
    fetchVehicleModifications,

    selectFields,
    selectYears,
    selectMakes,
    selectModels,
    selectModifications,
    selectFetchingAllVehicleData,

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

const mapStateToProps = state => ({
    user: state.auth,
    fields: selectFields(state),
    years: selectYears(state),
    makes: selectMakes(state),
    models:selectModels(state),
    modifications: selectModifications(state),
    fetchingAllVehicleData: selectFetchingAllVehicleData(state,)
});

const mapDispatchToProps = {
    fetchAllVehicleData,
    fetchVehicleMakes,
    fetchVehicleModels,
    fetchVehicleModifications,

    setVehicleNumber,
    setVehicleVin,
    setVehicleYear,
    setVehicleMakeId,
    setVehicleModelId,
    setVehicleModificationId,
};

/**
 * This form is used to edit vehicle. It contains all needed logic to edit vehicle.
 * 
 * @param {Function} getFormRefCB - callback, takes one argument(form refference)
 * @param {number} vehicleId - Id of a vehicle you wnat to edit
 */
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
@Form.create({name: 'vehicle_edit_from'})
export default class VehicleEditFormClass extends React.Component {
    constructor(props) {
        super(props);

        const {getFormRefCB} = this.props;
        getFormRefCB && getFormRefCB(this.props.form); //Callback to get form instance (warppedComponentRef does not work)
    }

    componentDidMount() {
        const {vehicleId} = this.props;
        this.props.fetchAllVehicleData({vehicleId});
    }

    render() {
        const {
            fields,
            years,
            makes,
            models,
            modifications,
            fetchingAllVehicleData,

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
        
        return fetchingAllVehicleData
            ? (<Spin />)
            : (
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
                                    {
                                        years
                                            ? years.map((year) => (
                                                <Option value={year} key={v4()}>
                                                    {year}
                                                </Option>
                                            ))
                                            : <Option value={123} key={v4()}>Empty</Option>
                                    }
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
                                    {
                                        makes
                                            ? makes.map(({ id, name }) => (
                                                <Option value={id} key={v4()}>
                                                    {name}
                                                </Option>
                                            ))
                                            : <Option value={123} key={v4()}>Empty</Option>
                                    }
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
                                    disabled={!_.get(fields, 'makeId')}
                                    onSelect={value => {
                                        setVehicleModelId({modelId: value});
                                        fetchVehicleModifications();
                                        resetFields();
                                    }}
                                    getPopupContainer={trigger => trigger.parentNode}
                                >
                                    {
                                        models
                                            ? models.map(({ id, name }) => (
                                                <Option value={id} key={v4()}>
                                                    {name}
                                                </Option>
                                            ))
                                            : <Option value={123} key={v4()}>Empty</Option>
                                    }
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
                                    {
                                        modifications
                                            ? modifications.map(({ id, name }) => (
                                                <Option value={id} key={v4()}>
                                                    {name}
                                                </Option>
                                            ))
                                            : <Option value={123} key={v4()}>Empty</Option>
                                    }
                                </DecoratedSelect>
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                </Form>
            );
    }
}