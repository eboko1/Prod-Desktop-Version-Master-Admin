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
    fetchVehicleDataByVin,
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
    fetchVehicleDataByVin,

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
            fetchVehicleDataByVin,

            setVehicleNumber,
            setVehicleVin,
            setVehicleYear,
            setVehicleMakeId,
            setVehicleModelId,
            setVehicleModificationId,
            form,
            intl: {formatMessage},
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
                            {<FormattedMessage id='add_client_form.number' />}
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
                            {<FormattedMessage id='add_order_form.vin' />}
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
                        <Col span={6}> <Button type="primary" onClick={() => fetchVehicleDataByVin()}>Get car</Button> </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={6}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_client_form.year' />}
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
                                    placeholder={formatMessage({id:'add_client_form.year_placeholder'})}
                                    initialValue={initValues.year}
                                    disabled={false}
                                    onSelect={value => {
                                        setVehicleYear({year: value});
                                        fetchVehicleMakes();
                                        resetFields();
                                    }}
                                    getPopupContainer={trigger => trigger.parentNode}
                                    options={_.map((years || []).reverse(), year => ({year: String(year)}))} //Convert array of years into array of objects each of them contains "year" field of type String(else error will be thrown)
                                    optionValue={'year'}
                                    optionLabel={'year'}
                                />
                        </Col>
                        <Col span={6}></Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={6}>
                            <div className={Styles.colText}>
                                {<FormattedMessage id='add_client_form.make' />}
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
                                    placeholder={formatMessage({id:'add_client_form.make_placeholder'})}
                                    initialValue={initValues.makeId}
                                    disabled={!_.get(fields, 'year')}
                                    onSelect={value => {
                                        setVehicleMakeId({makeId: value});
                                        fetchVehicleModels();
                                        resetFields();
                                    }}
                                    getPopupContainer={trigger => trigger.parentNode}
                                    options={makes || {}}
                                    optionValue={'id'}
                                    optionLabel={'name'}
                                />
                        </Col>
                        <Col span={6}></Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={6}>
                            <div className={Styles.colText}>
                                {<FormattedMessage id='add_client_form.model' />}
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
                                    placeholder={formatMessage({id:'add_client_form.model_placeholder'})}
                                    initialValue={initValues.modelId}
                                    disabled={!_.get(fields, 'makeId')}
                                    disabled={!_.get(fields, 'makeId')}
                                    onSelect={value => {
                                        setVehicleModelId({modelId: value});
                                        fetchVehicleModifications();
                                        resetFields();
                                    }}
                                    getPopupContainer={trigger => trigger.parentNode}
                                    options={models || {}}
                                    optionValue={'id'}
                                    optionLabel={'name'}
                                />
                        </Col>
                        <Col span={6}></Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={6}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_client_form.modification' />}
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
                                    placeholder={formatMessage({id:'add_client_form.modification_placeholder'})}
                                    initialValue={initValues.modificationId}
                                    disabled={!_.get(fields, 'modelId')}
                                    onSelect={value => {
                                        setVehicleModificationId({modificationId: value});
                                        resetFields();
                                    }}
                                    getPopupContainer={trigger => trigger.parentNode}
                                    options={modifications || {}}
                                    optionValue={'id'}
                                    optionLabel={'name'}
                                />
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                </Form>
            );
    }
}