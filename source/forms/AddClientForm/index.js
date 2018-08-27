// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import { Form, Select, Row, Col, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

// proj
import {
    MAKE_VEHICLES_INFO_FILTER_TYPE,
    YEAR_VEHICLES_INFO_FILTER_TYPE,
    MODEL_VEHICLES_INFO_FILTER_TYPE,
} from 'core/forms/addClientForm/duck';

import {
    DecoratedSelect,
    DecoratedInput,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';

import { ClientsVehiclesTable } from 'components/OrderForm/OrderFormTables';
import { ArrayInput } from 'components';

const FormItem = Form.Item;
const Option = Select.Option;

const findLabel = (arr, id, keyName) => [ keyName, (_(arr).find({ id }) || {}).name ];

@injectIntl
export class AddClientForm extends Component {
    render() {
        const {
            handleAddClientModalSubmit,
            addClientFormData,
            vehicles,
            makes,
            models,
            modifications,
            lastFilterAction,
        } = this.props;

        const {
            getFieldDecorator,
            getFieldsValue,
            validateFields,
        } = this.props.form;

        const { years } = addClientFormData;
        const { vehicle = {} } = getFieldsValue();

        return (
            <Form
                layout='vertical'
                onSubmit={ () => handleAddClientModalSubmit() }
            >
                <div>
                    <ClientsVehiclesTable
                        removeClientVehicle={ this.props.removeClientVehicle }
                        vehicles={ vehicles }
                    />
                    <br />
                </div>

                <Row gutter={ 8 } type='flex' align='bottom'>
                    <Col span={ 3 }>
                        { years && (
                            <DecoratedSelect
                                field={ 'vehicle.year' }
                                showSearch
                                formItem
                                hasFeedback
                                label={
                                    <FormattedMessage id='add_client_form.year' />
                                }
                                getFieldDecorator={ getFieldDecorator }
                                rules={ [
                                    {
                                        required: true,
                                        message:  this.props.intl.formatMessage({
                                            id:
                                                'add_client_form.required_field',
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
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            >
<<<<<<< HEAD
                                { years.sort((a, b) => b - a).map(year => (
=======
                                { years.sort((v1, v2) => v2 - v1).map(year => (
>>>>>>> dev
                                    <Option value={ year } key={ v4() }>
                                        { String(year) }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        ) }
                    </Col>
                    <Col span={ 3 }>
                        { years && (
                            <DecoratedSelect
                                field='vehicle.makeId'
                                showSearch
                                label={
                                    <FormattedMessage id='add_client_form.make' />
                                }
                                hasFeedback
                                formItem
                                getFieldDecorator={ getFieldDecorator }
                                rules={ [
                                    {
                                        required: true,
                                        message:  this.props.intl.formatMessage({
                                            id:
                                                'add_client_form.required_field',
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
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            >
                                { makes.map(({ id, name }) => (
                                    <Option value={ id } key={ v4() }>
                                        { name }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        ) }
                    </Col>
                    <Col span={ 4 }>
                        { years && (
                            <DecoratedSelect
                                field='vehicle.modelId'
                                showSearch
                                hasFeedback
                                formItem
                                label={
                                    <FormattedMessage id='add_client_form.model' />
                                }
                                getFieldDecorator={ getFieldDecorator }
                                rules={ [
                                    {
                                        required: true,
                                        message:  this.props.intl.formatMessage({
                                            id:
                                                'add_client_form.required_field',
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
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            >
                                { models.map(({ id, name }) => (
                                    <Option value={ id } key={ v4() }>
                                        { name }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        ) }
                    </Col>
                    <Col span={ 4 }>
                        { years && (
                            <DecoratedSelect
                                field={ 'vehicle.modificationId' }
                                showSearch
                                formItem
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
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            >
                                { modifications.map(({ id, name }) => (
                                    <Option value={ id } key={ v4() }>
                                        { name }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        ) }
                    </Col>
                    <Col span={ 3 }>
                        <DecoratedInput
                            hasFeedback
                            formItem
                            rules={ [
                                {
                                    required: true,
                                    message:  this.props.intl.formatMessage({
                                        id: 'add_client_form.required_field',
                                    }),
                                },
                            ] }
                            label={
                                <FormattedMessage id='add_client_form.number' />
                            }
                            getFieldDecorator={ getFieldDecorator }
                            field='vehicle.number'
                        />
                    </Col>
                    <Col span={ 3 }>
                        <DecoratedInput
                            hasFeedback
                            formItem
                            label={
                                <FormattedMessage id='add_client_form.vin' />
                            }
                            getFieldDecorator={ getFieldDecorator }
                            field='vehicle.vin'
                        />
                    </Col>
                    <Col span={ 4 }>
                        <Row type='flex' justify='end'>
                            <FormItem>
                                <Button
                                    onClick={ () => {
                                        validateFields(
                                            [ 'vehicle.modelId', 'vehicle.makeId', 'vehicle.year', 'vehicle.vin', 'vehicle.number', 'vehicle.modificationId' ],
                                            (err, values) => {
                                                if (!err) {
                                                    const { vehicle } = values;
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

                                                    this.props.addClientVehicle(
                                                        {
                                                            ...vehicle,
                                                            ...names,
                                                        },
                                                    );
                                                }
                                            },
                                        );
                                    } }
                                >
                                    <FormattedMessage id='add_client_form.add_vehicle' />
                                </Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={ 8 }>
                    <Col span={ 5 }>
                        <DecoratedInput
                            field={ 'name' }
                            label={
                                <FormattedMessage id='add_client_form.name' />
                            }
                            formItem
                            hasFeedback
                            getPopupContainer={ trigger => trigger.parentNode }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            rules={ [
                                {
                                    required: true,
                                    message:  this.props.intl.formatMessage({
                                        id: 'add_client_form.required_field',
                                    }),
                                },
                            ] }
                        />
                    </Col>
                    <Col span={ 5 }>
                        <DecoratedInput
                            field='patronymic'
                            label={
                                <FormattedMessage id='add_client_form.patronymic' />
                            }
                            formItem
                            getPopupContainer={ trigger => trigger.parentNode }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />
                    </Col>
                    <Col span={ 5 }>
                        <DecoratedInput
                            field='surname'
                            label={
                                <FormattedMessage id='add_client_form.surname' />
                            }
                            formItem
                            getPopupContainer={ trigger => trigger.parentNode }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />
                    </Col>
                    <Col span={ 9 }>
                        <Row gutter={ 8 } type='flex' justify='end'>
                            <Col span={ 7 }>
                                <DecoratedSelect
                                    field='sex'
                                    formItem
                                    hasFeedback
                                    getFieldDecorator={ getFieldDecorator }
                                    getPopupContainer={ trigger =>
                                        trigger.parentNode
                                    }
                                    label={
                                        <FormattedMessage id='add_client_form.sex' />
                                    }
                                    options={ [
                                        {
                                            id:    'male',
                                            title: this.props.intl.formatMessage(
                                                {
                                                    id: 'add_client_form.male',
                                                },
                                            ),
                                        },
                                        {
                                            id:    'femail',
                                            title: this.props.intl.formatMessage(
                                                {
                                                    id:
                                                        'add_client_form.female',
                                                },
                                            ),
                                        },
                                    ] }
                                    optionValue='id'
                                    optionLabel='title'
                                />
                            </Col>
                            <Col span={ 7 }>
                                <DecoratedSelect
                                    field='status'
                                    formItem
                                    hasFeedback
                                    getFieldDecorator={ getFieldDecorator }
                                    getPopupContainer={ trigger =>
                                        trigger.parentNode
                                    }
                                    label={
                                        <FormattedMessage id='add_client_form.status' />
                                    }
                                    options={ [
                                        {
                                            id:    'permanent',
                                            title: this.props.intl.formatMessage(
                                                {
                                                    id:
                                                        'add_client_form.permanent',
                                                },
                                            ),
                                        },
                                        {
                                            id:    'premium',
                                            title: this.props.intl.formatMessage(
                                                {
                                                    id:
                                                        'add_client_form.premium',
                                                },
                                            ),
                                        },
                                    ] }
                                    optionValue='id'
                                    optionLabel='title'
                                />
                            </Col>
                            <Col span={ 7 }>
                                <DecoratedDatePicker
                                    field='birthday'
                                    label={
                                        <FormattedMessage id='add_client_form.birthday' />
                                    }
                                    formItem
                                    formatMessage={
                                        this.props.intl.formatMessage
                                    }
                                    getFieldDecorator={ getFieldDecorator }
                                    value={ null }
                                    getCalendarContainer={ trigger =>
                                        trigger.parentNode
                                    }
                                    format='YYYY-MM-DD'
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={ 8 }>
                    <Col span={ 6 }>
                        <ArrayInput
                            optional={ false }
                            form={ this.props.form }
                            rules={ [
                                {
                                    required: true,
                                    message:  this.props.intl.formatMessage({
                                        id: 'add_client_form.required_field',
                                    }),
                                },
                            ] }
                            fieldName='phones'
                            fieldTitle={
                                <FormattedMessage id='add_client_form.phones' />
                            }
                            buttonText={
                                <FormattedMessage id='add_client_form.add_phone' />
                            }
                        />
                    </Col>
                    <Col span={ 6 }>
                        <ArrayInput
                            optional
                            rules={ [
                                {
                                    type: 'email',
                                },
                            ] }
                            form={ this.props.form }
                            fieldName='emails'
                            fieldTitle={
                                <FormattedMessage id='add_client_form.emails' />
                            }
                            buttonText={
                                <FormattedMessage id='add_client_form.add_email' />
                            }
                        />
                    </Col>
                </Row>
            </Form>
        );
    }
}
