// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import { Form, Select, Row, Col, notification } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
    DecoratedSelect,
    DecoratedInput,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';

import { ClientsVehiclesTable } from 'forms/OrderForm/OrderFormTables';
import { AddClientVehicleForm } from 'forms';
import { ArrayInput } from 'components';

const FormItem = Form.Item;
const Option = Select.Option;

const openNotificationWithIcon = (type, message, description) => {
    notification[ type ]({
        message,
        description,
    });
};

@injectIntl
export class AddClientForm extends Component {
    constructor(props) {
        super(props);

        this.apiErrorsMap = {
            CLIENT_EXISTS: props.intl.formatMessage({
                id: 'add_client_form.client_exists_error',
            }),
        };
    }

    render() {
        const { vehicles, errors } = this.props;
        const { getFieldDecorator } = this.props.form;

        if (errors.length) {
            const currentComponentErrors = errors.filter(({ response }) =>
                _.keys(this.apiErrorsMap).includes(_.get(response, 'message')));

            _.each(currentComponentErrors, componentError => {
                const description = this.apiErrorsMap[
                    componentError.response.message
                ];

                const errorTitle = this.props.intl.formatMessage({
                    id: 'add_client_form.error_title',
                });

                openNotificationWithIcon('error', errorTitle, description);
                this.props.handleError(componentError.id);
            });
        }

        return (
            <Form layout='vertical'>
                <AddClientVehicleForm
                    addClientVehicle={ this.props.addClientVehicle }
                />
                <Row gutter={ 8 }>
                    <Col span={ 5 }>
                        <DecoratedInput
                            field='name'
                            label={
                                <FormattedMessage id='add_client_form.name' />
                            }
                            formItem
                            hasFeedback
                            getPopupContainer={ trigger => trigger.parentNode }
                            getFieldDecorator={ getFieldDecorator }
                            rules={ [
                                {
                                    required: true,
                                    message:  this.props.intl.formatMessage({
                                        id: 'required_field',
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
                            getFieldDecorator={ getFieldDecorator }
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
                            getFieldDecorator={ getFieldDecorator }
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
                            phone
                            rules={ [
                                {
                                    required: true,
                                    message:  this.props.intl.formatMessage({
                                        id: 'required_field',
                                    }),
                                },
                                {
                                    pattern:   /^[\d]{9}$/,
                                    transform: value => String(value),
                                    message:   this.props.intl.formatMessage({
                                        id:
                                            'add_client_form.invalid_phone_format',
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
                <ClientsVehiclesTable
                    removeClientVehicle={ this.props.removeClientVehicle }
                    vehicles={ vehicles }
                />
            </Form>
        );
    }
}
