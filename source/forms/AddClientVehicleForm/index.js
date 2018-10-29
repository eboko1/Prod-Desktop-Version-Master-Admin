// vendor
import React, { Component } from 'react';
import { Button, Row, Col, Form, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { withReduxForm2 } from 'utils';

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
const FormItem = Form.Item;
const Option = Select.Option;
const findLabel = (arr, id, keyName) => [ keyName, _.get(_.find(arr, { id }), 'name') ];

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

    render() {
        const { makes, models, modifications, lastFilterAction } = this.props;

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
                <Row gutter={ 8 } type='flex' align='bottom'>
                    <Col span={ 3 + (this.props.onlyVehicles ? 1 : 0) }>
                        { years && (
                            <DecoratedSelect
                                field={ 'year' }
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
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            >
                                { years.sort((a, b) => b - a).map(year => (
                                    <Option value={ year } key={ v4() }>
                                        { String(year) }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        ) }
                    </Col>
                    <Col span={ 3 + (this.props.onlyVehicles ? 1 : 0) }>
                        { years && (
                            <DecoratedSelect
                                field='makeId'
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
                    <Col span={ 4 + (this.props.onlyVehicles ? 1 : 0) }>
                        { years && (
                            <DecoratedSelect
                                field='modelId'
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
                    <Col span={ 4 + (this.props.onlyVehicles ? 2 : 0) }>
                        { years && (
                            <DecoratedSelect
                                field={ 'modificationId' }
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
                                rules={ [
                                    {
                                        required: true,
                                        message:  this.props.intl.formatMessage({
                                            id: 'required_field',
                                        }),
                                    },
                                ] }
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
                    { !this.props.onlyVehicles && (
                        <Col span={ 3 }>
                            <DecoratedInput
                                hasFeedback
                                formItem
                                rules={ [
                                    {
                                        required: true,
                                        message:  this.props.intl.formatMessage({
                                            id: 'required_field',
                                        }),
                                    },
                                ] }
                                label={
                                    <FormattedMessage id='add_client_form.number' />
                                }
                                getFieldDecorator={ getFieldDecorator }
                                field='number'
                            />
                        </Col>
                    ) }
                    { !this.props.onlyVehicles && (
                        <Col span={ 3 }>
                            <DecoratedInput
                                hasFeedback
                                formItem
                                label={
                                    <FormattedMessage id='add_client_form.vin' />
                                }
                                getFieldDecorator={ getFieldDecorator }
                                field='vin'
                            />
                        </Col>
                    ) }
                    <Col span={ 4 + (this.props.onlyVehicles ? 1 : 0) }>
                        <Row type='flex' justify='end'>
                            <FormItem>
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

                                                const modif = _.find(
                                                    modifications,
                                                    filter,
                                                );

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
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
            </Form>
        );
    }
}
