//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row, Button, AutoComplete } from 'antd';
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
    fetchVehicleDataByVin,
    setSelectType,
} from '../../redux/duck';

//own
import Styles from './styles.m.css'
import {
    DecoratedSelect,
    DecoratedInput,
    DecoratedAutoComplete
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
    fetchVehicleDataByVin,

    setClientId,
    setVehicleNumber,
    setVehicleVin,
    setVehicleYear,
    setVehicleMakeId,
    setVehicleModelId,
    setVehicleModificationId,
    setSelectType,
};

/**
 * This form is used to create vehicle, it contains all required actions to fetch data and create vehicles
 * 
 * @param {Function} getFormRefCB -  callback, takes one argument(form reference)
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
            fetchVehicleDataByVin,

            setVehicleNumber,
            setVehicleVin,
            setVehicleYear,
            setVehicleMakeId,
            setVehicleModelId,
            setSelectType,
            setVehicleModificationId,
            form,
            intl: {formatMessage},
        } = this.props;
        
        const { getFieldDecorator, resetFields, isFieldTouched} = form;

        const initValues = {
            number: fields.number,
            vin: fields.vin,
            year: fields.year,
            makeId: fields.makeId,
            modelId: fields.modelId,
            modificationId: fields.modificationId,
            makeName: fields.makeName,
            modelName: fields.modelName,
            selectType: fields.selectType
        }

        // if field is touched or default value was provided and model was not selected(automatically or manually) then show a warning
        const showModelIsNotSelectedWarning = Boolean((isFieldTouched("modelId") || _.get(initValues, "modelName")) && !_.get(initValues, "modelId")) ;

        let showModelDropdownOpened = Boolean(fields.selectType === 'NONE' || fields.selectType === 'MULTIPLE');

        return (
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
                                    message: formatMessage({
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
                                        message: formatMessage({
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
                                        message: formatMessage({
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
                        <h1 className={Styles.vehicleDataHint}>{fields.makeId ? null : fields.makeName}</h1>
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
                        <DecoratedAutoComplete
                            field={ "modelId" }
                            formItem
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: "required_field",
                                    }),
                                },
                            ]}
                            formItemLayout={{
                                validateStatus: showModelIsNotSelectedWarning? "warning": undefined,
                                help: showModelIsNotSelectedWarning? formatMessage({id: "vehicle_modal.warning_model_is_not_selected"}): ""
                            }}
                            placeholder={formatMessage({id:'add_client_form.model_placeholder'})}
                            disabled={!_.get(fields, 'makeId')}
                            getFieldDecorator={ getFieldDecorator }
                            initialValue={
                                _.get(_.filter(models, obj => obj.id == initValues.modelId), '[0].name')
                                ||
                                (fields.selectType !== 'NONE' &&
                                    _.get(String(initValues.modelName || '').split(' '), '[0]')
                                )
                            }
                            onSelect={value => {
                                const selectedModelId = _.get(_.filter(models, obj => String(obj.name).toLowerCase() == String(value).toLowerCase()), '[0].id');
                                if(selectedModelId) {
                                    setVehicleModelId({modelId: selectedModelId});
                                    setSelectType({ selectType: undefined});
                                    fetchVehicleModifications();
                                    resetFields();
                                }
                            }}
                            getPopupContainer={trigger => trigger.parentNode}
                            showSearch
                            dropdownMatchSelectWidth={ false }
                        >
                            {
                                (models || []).map(
                                    option => {
                                        return (
                                            <AutoComplete.Option
                                                value={ option.name }
                                                key={ v4() }
                                            >
                                                { option.name }
                                            </AutoComplete.Option>
                                        )
                                    }
                                )
                            }
                        </DecoratedAutoComplete>
                        <h1 className={Styles.vehicleDataHint}> {fields.modelName}</h1>
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
                                        message: formatMessage({
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
