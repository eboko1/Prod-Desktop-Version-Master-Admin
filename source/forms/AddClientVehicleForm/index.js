// vendor
import React, { Component } from 'react';
import { Button, Row, Col, Form, Select, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { withReduxForm2 } from 'utils';
import { VehicleNumberHistory } from 'components';
import {
    MAKE_VEHICLES_INFO_FILTER_TYPE,
    YEAR_VEHICLES_INFO_FILTER_TYPE,
    MODEL_VEHICLES_INFO_FILTER_TYPE,
    onChangeAddClientVehicleForm,
    resetAddClientVehicleForm,
    fetchVehiclesInfo,
} from 'core/forms/addClientVehicleForm/duck';
import { DecoratedSelect, DecoratedInput } from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

const findLabel = (arr, id, keyName) => [ keyName, _.get(_.find(arr, { id }), 'name') ];

const formItemLayout = {
    labelCol:   { span: 6 },
    wrapperCol: { span: 18 },
    colon:      false,
};

@injectIntl
@withReduxForm2({
    name:    'addClientVehicleForm',
    actions: {
        change: onChangeAddClientVehicleForm,
        resetAddClientVehicleForm,
        fetchVehiclesInfo,
    },
})
export class AddClientVehicleForm extends Component {
    constructor(props) {
        super(props);
    }

    /* eslint-disable complexity */
    render() {
        const { makes, models, modifications, lastFilterAction, editableVehicle } = this.props;

        const years = Array(new Date().getFullYear() - 1900 + 1)
            .fill(1900)
            .map((val, index) => val + index)
            .reverse();

        const {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
        } = this.props.form;

        const vehicle = getFieldsValue();

        return (
            <Form>
                { editableVehicle && 
                    <div className={ Styles.editableVehicle }>
                        <Icon type='car' className={ Styles.carIcon } />
                        <ul>
                            <li className={ Styles.listItem }>
                                <FormattedMessage id='add_client_form.year' />:{' '}
                                { editableVehicle.year && editableVehicle.year }
                            </li>
                            <li className={ Styles.listItem }>
                                <FormattedMessage id='add_client_form.make' />:{' '}
                                { editableVehicle.make && editableVehicle.make }
                            </li>
                            <li className={ Styles.listItem }>
                                <FormattedMessage id='add_client_form.model' />:{' '}
                                { editableVehicle.model && editableVehicle.model }
                            </li>
                            <li className={ Styles.listItem }>
                                <FormattedMessage id='add_client_form.modification' />:{' '}
                                { editableVehicle.modification && editableVehicle.modification } { editableVehicle.horsePower && `(${ editableVehicle.horsePower })`}
                            </li>
                        </ul>
                    </div>
                }
                { years && (
                    <DecoratedSelect
                        field={ 'year' }
                        showSearch
                        formItem
                        formItemLayout={ formItemLayout }
                        hasFeedback
                        label={ <FormattedMessage id='add_client_form.year' /> }
                        getFieldDecorator={ getFieldDecorator }
                        rules={ [
                            {
                                required: true,
                                message:  this.props.intl.formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        placeholder={
                            <FormattedMessage id='add_client_form.year_placeholder' />
                        }
                        onSelect={ value => {
                            const filters = { year: value };
                            this.props.fetchVehiclesInfo(
                                YEAR_VEHICLES_INFO_FILTER_TYPE,
                                filters,
                            );
                        } }
                        optionFilterProp='children'
                        getPopupContainer={ trigger => trigger.parentNode }
                    >
                        { years.sort((a, b) => b - a).map(year => (
                            <Option value={ year } key={ v4() }>
                                { String(year) }
                            </Option>
                        )) }
                    </DecoratedSelect>
                ) }

                { years && (
                    <DecoratedSelect
                        field='makeId'
                        showSearch
                        label={ <FormattedMessage id='add_client_form.make' /> }
                        hasFeedback
                        formItem
                        formItemLayout={ formItemLayout }
                        getFieldDecorator={ getFieldDecorator }
                        rules={ [
                            {
                                required: true,
                                message:  this.props.intl.formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        placeholder={
                            <FormattedMessage id='add_client_form.make_placeholder' />
                        }
                        disabled={
                            ![ YEAR_VEHICLES_INFO_FILTER_TYPE, MAKE_VEHICLES_INFO_FILTER_TYPE, MODEL_VEHICLES_INFO_FILTER_TYPE ].includes(lastFilterAction)
                        }
                        onSelect={ value => {
                            const filters = _.pick(
                                { ...vehicle, makeId: value },
                                [ 'year', 'makeId' ],
                            );
                            this.props.fetchVehiclesInfo(
                                MAKE_VEHICLES_INFO_FILTER_TYPE,
                                filters,
                            );
                        } }
                        getPopupContainer={ trigger => trigger.parentNode }
                        dropdownMatchSelectWidth={ false }
                    >
                        { makes.map(({ id, name }) => (
                            <Option value={ id } key={ v4() }>
                                { name }
                            </Option>
                        )) }
                    </DecoratedSelect>
                ) }

                { years && (
                    <DecoratedSelect
                        field='modelId'
                        showSearch
                        hasFeedback
                        formItem
                        formItemLayout={ formItemLayout }
                        label={ <FormattedMessage id='add_client_form.model' /> }
                        getFieldDecorator={ getFieldDecorator }
                        rules={ [
                            {
                                required: true,
                                message:  this.props.intl.formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        placeholder={
                            <FormattedMessage id='add_client_form.model_placeholder' />
                        }
                        disabled={
                            ![ MAKE_VEHICLES_INFO_FILTER_TYPE, MODEL_VEHICLES_INFO_FILTER_TYPE ].includes(lastFilterAction)
                        }
                        onSelect={ value => {
                            const filters = _.pick(
                                { ...vehicle, modelId: value },
                                [ 'modelId', 'year', 'makeId' ],
                            );
                            this.props.fetchVehiclesInfo(
                                MODEL_VEHICLES_INFO_FILTER_TYPE,
                                filters,
                            );
                        } }
                        getPopupContainer={ trigger => trigger.parentNode }
                        dropdownMatchSelectWidth={ false }
                    >
                        { models.map(({ id, name }) => (
                            <Option value={ id } key={ v4() }>
                                { name }
                            </Option>
                        )) }
                    </DecoratedSelect>
                ) }
                { years && (
                    <DecoratedSelect
                        field={ 'modificationId' }
                        showSearch
                        formItem
                        formItemLayout={ formItemLayout }
                        hasFeedback
                        label={
                            <FormattedMessage id='add_client_form.modification' />
                        }
                        getFieldDecorator={ getFieldDecorator }
                        placeholder={
                            <FormattedMessage id='add_client_form.modification_placeholder' />
                        }
                        disabled={
                            ![ MODEL_VEHICLES_INFO_FILTER_TYPE ].includes(
                                lastFilterAction,
                            )
                        }
                        rules={ [
                            {
                                required: true,
                                message:  this.props.intl.formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        getPopupContainer={ trigger => trigger.parentNode }
                        dropdownMatchSelectWidth={ false }
                    >
                        { modifications.map(({ id, name }) => (
                            <Option value={ id } key={ v4() }>
                                { name }
                            </Option>
                        )) }
                    </DecoratedSelect>
                ) }

                { !this.props.onlyVehicles && (
                    <FormItem
                        { ...formItemLayout }
                        label={ <FormattedMessage id='add_client_form.number' /> }
                        hasFeedback
                    >
                        <DecoratedInput
                            field='number'
                            // hasFeedback
                            // formItem
                            // formItemLayout={ formItemLayout }
                            rules={ [
                                {
                                    required: true,
                                    message:  this.props.intl.formatMessage({
                                        id: 'required_field',
                                    }),
                                },
                            ] }
                            // label={
                            //     <FormattedMessage id='add_client_form.number' />
                            // }
                            getFieldDecorator={ getFieldDecorator }
                        />

                        { /* <FormItem> */ }
                        <VehicleNumberHistory vehicleNumber={ vehicle.number } />
                        { /* </FormItem> */ }
                    </FormItem>
                ) }
                { !this.props.onlyVehicles && (
                    <DecoratedInput
                        field='vin'
                        hasFeedback
                        formItem
                        formItemLayout={ formItemLayout }
                        label={ <FormattedMessage id='add_client_form.vin' /> }
                        getFieldDecorator={ getFieldDecorator }
                    />
                ) }
                <div className={ Styles.addButtonWrapper }>
                    <Button
                        type='primary'
                        onClick={ () => {
                            validateFields((err, values) => {
                                if (!err) {
                                    const vehicle = values;
                                    const names = _([
                                        findLabel(
                                            makes,
                                            vehicle.makeId,
                                            'makeName',
                                        ),
                                        findLabel(
                                            models,
                                            vehicle.modelId,
                                            'modelName',
                                        ),
                                        findLabel(
                                            modifications,
                                            vehicle.modificationId,
                                            'modificationName',
                                        ),
                                    ])
                                        .fromPairs()
                                        .value();

                                    const filter = {
                                        id: vehicle.modificationId,
                                    };

                                    const modif = _.find(modifications, filter);

                                    this.props.resetAddClientVehicleForm();
                                    this.props.addClientVehicle({
                                        ...vehicle,
                                        ...names,
                                        ...this.props.tecdoc
                                            ? {
                                                tecdocId: _.get(
                                                    modif,
                                                    'tecdocId',
                                                ),
                                            }
                                            : {},
                                    });
                                }
                            });
                        } }
                    >
                        <FormattedMessage id='add_client_form.add_vehicle' />
                    </Button>
                </div>
            </Form>
        );
    }
}
