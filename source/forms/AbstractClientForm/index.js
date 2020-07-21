// vendor
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Row, Col, notification } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import {
    DecoratedSelect,
    DecoratedInput,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';

import { ArrayInput } from 'components';

// own
import Styles from './styles.m.css';

const openNotificationWithIcon = (type, message, description) => {
    notification[ type ]({
        message,
        description,
    });
};

@injectIntl
export class AbstractClientForm extends Component {
    constructor(props) {
        super(props);

        this.apiErrorsMap = {
            CLIENT_EXISTS: props.intl.formatMessage({
                id: 'add_client_form.client_exists_error',
            }),
        };
    }

    render() {
        const { client, errors } = this.props;
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
            <Form layout='vertical' className={ Styles.form }>
                {window.innerWidth >= 1200 ? 
                <>
                <Row gutter={ 24 } type='flex'>
                    <Col span={ 8 }>
                        <DecoratedInput
                            field='name'
                            label={
                                <FormattedMessage id='add_client_form.name' />
                            }
                            formItem
                            hasFeedback
                            initialValue={ _.get(client, 'name') }
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
                    <Col span={ 8 }>
                        <DecoratedInput
                            field='patronymic'
                            initialValue={ _.get(client, 'middleName') }
                            label={
                                <FormattedMessage id='add_client_form.patronymic' />
                            }
                            formItem
                            getPopupContainer={ trigger => trigger.parentNode }
                            getFieldDecorator={ getFieldDecorator }
                        />
                    </Col>
                    <Col span={ 8 }>
                        <DecoratedInput
                            field='surname'
                            label={
                                <FormattedMessage id='add_client_form.surname' />
                            }
                            initialValue={ _.get(client, 'surname') }
                            formItem
                            getPopupContainer={ trigger => trigger.parentNode }
                            getFieldDecorator={ getFieldDecorator }
                        />
                    </Col>
                </Row>

                <Row gutter={ 24 } type='flex'>
                    <Col span={ 8 }>
                        <DecoratedSelect
                            field='sex'
                            formItem
                            hasFeedback
                            initialValue={ _.get(client, 'sex') }
                            getFieldDecorator={ getFieldDecorator }
                            getPopupContainer={ trigger => trigger.parentNode }
                            label={
                                <FormattedMessage id='add_client_form.sex' />
                            }
                            options={ [
                                {
                                    id:    'male',
                                    title: this.props.intl.formatMessage({
                                        id: 'add_client_form.male',
                                    }),
                                },
                                {
                                    id:    'femail',
                                    title: this.props.intl.formatMessage({
                                        id: 'add_client_form.female',
                                    }),
                                },
                            ] }
                            optionValue='id'
                            optionLabel='title'
                        />
                    </Col>
                    <Col span={ 8 }>
                        <DecoratedSelect
                            field='status'
                            initialValue={ _.get(client, 'status') }
                            formItem
                            hasFeedback
                            getFieldDecorator={ getFieldDecorator }
                            getPopupContainer={ trigger => trigger.parentNode }
                            label={
                                <FormattedMessage id='add_client_form.status' />
                            }
                            options={ [
                                {
                                    id:    'permanent',
                                    title: this.props.intl.formatMessage({
                                        id: 'add_client_form.permanent',
                                    }),
                                },
                                {
                                    id:    'premium',
                                    title: this.props.intl.formatMessage({
                                        id: 'add_client_form.premium',
                                    }),
                                },
                            ] }
                            optionValue='id'
                            optionLabel='title'
                        />
                    </Col>
                    <Col span={ 8 }>
                        <DecoratedDatePicker
                            field='birthday'
                            initialValue={
                                _.get(client, 'birthday')
                                    ? moment(_.get(client, 'birthday'))
                                    : void 0
                            }
                            label={
                                <FormattedMessage id='add_client_form.birthday' />
                            }
                            formItem
                            formatMessage={ this.props.intl.formatMessage }
                            getFieldDecorator={ getFieldDecorator }
                            value={ null }
                            getCalendarContainer={ trigger => trigger.parentNode }
                            format='YYYY-MM-DD'
                            cnStyles={ Styles.datePicker }
                        />
                    </Col>
                </Row>

                <Row gutter={ 24 } type='flex'>
                    <Col span={ 8 }>
                        <ArrayInput
                            form={ this.props.form }
                            phone
                            initialValue={
                                _.get(client, 'phones')
                                    ? _.get(client, 'phones').filter(Boolean)
                                    : void 0
                            }
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
                    <Col span={ 8 }>
                        <ArrayInput
                            optional
                            initialValue={
                                _.get(client, 'emails')
                                    ? _.isArray(client.emails)
                                        ? _.get(client, 'emails').filter(
                                            Boolean,
                                        )
                                        : void 0
                                    : void 0
                            }
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
                </>
                : 
                <div>
                    <DecoratedInput
                        field='name'
                        label={
                            <FormattedMessage id='add_client_form.name' />
                        }
                        formItem
                        hasFeedback
                        initialValue={ _.get(client, 'name') }
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
                    <DecoratedInput
                        field='surname'
                        label={
                            <FormattedMessage id='add_client_form.surname' />
                        }
                        initialValue={ _.get(client, 'surname') }
                        formItem
                        getPopupContainer={ trigger => trigger.parentNode }
                        getFieldDecorator={ getFieldDecorator }
                    />
                    <ArrayInput
                        form={ this.props.form }
                        phone
                        initialValue={
                            _.get(client, 'phones')
                                ? _.get(client, 'phones').filter(Boolean)
                                : void 0
                        }
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
                </div>}
            </Form>
        );
    }
}
