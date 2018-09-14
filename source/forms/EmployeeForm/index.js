// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button } from 'antd';
import moment from 'moment';

//proj
import { onChangeEmployeeForm } from 'core/forms/employeeForm/duck';

import {
    DecoratedInputPhone,
    DecoratedInput,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import { withReduxForm2, permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';

const formItemLayout = {
    labelCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 8 },
        xl:  { span: 6 },
        xxl: { span: 4 },
    },
    wrapperCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 16 },
        xl:  { span: 18 },
        xxl: { span: 20 },
    },
    colon: false,
};

@injectIntl
@withReduxForm2({
    name:    'employeeForm',
    actions: {
        change: onChangeEmployeeForm,
    },
})
export class EmployeeForm extends Component {
    state = {
        toogleDirectory: false,
    };

    render() {
        const { initialEmployee, saveEmployee, fireEmployee } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Form layout='horizontal'>
                <div>
                    <DecoratedInput
                        field='name'
                        label={ <FormattedMessage id='employee.name' /> }
                        placeholder={ formatMessage({
                            id: 'employee.name_placeholder',
                        }) }
                        formItem
                        formItemLayout={ formItemLayout }
                        initialValue={ initialEmployee && initialEmployee.name }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        className={ Styles.selectMargin }
                        getPopupContainer={ trigger => trigger.parentNode }
                        getFieldDecorator={ getFieldDecorator }
                    />
                    <DecoratedInput
                        field='surname'
                        label={ <FormattedMessage id='employee.surname' /> }
                        placeholder={ formatMessage({
                            id: 'employee.surname_placeholder',
                        }) }
                        formItem
                        formItemLayout={ formItemLayout }
                        initialValue={
                            initialEmployee && initialEmployee.surname
                        }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        className={ Styles.selectMargin }
                        getPopupContainer={ trigger => trigger.parentNode }
                        getFieldDecorator={ getFieldDecorator }
                    />
                    <DecoratedInputPhone
                        field='phone'
                        label={ <FormattedMessage id='employee.phone' /> }
                        placeholder={ formatMessage({
                            id: 'employee.phone_placeholder',
                        }) }
                        formItem
                        formItemLayout={ formItemLayout }
                        initialValue={ initialEmployee && initialEmployee.phone }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                            {
                                validator: (rule, value, callback) => {
                                    let reg = /^\d+$/;
                                    if (reg.test(value)) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                formatMessage({
                                                    id: 'employee.only_numbers',
                                                }),
                                            ),
                                        );
                                    }

                                    return true;
                                },
                                message: '',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (value && value.length === 10) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                formatMessage({
                                                    id: 'employee.full_phone',
                                                }),
                                            ),
                                        );
                                    }

                                    return true;
                                },
                                message: '',
                            },
                        ] }
                        className={ Styles.selectMargin }
                        getPopupContainer={ trigger => trigger.parentNode }
                        getFieldDecorator={ getFieldDecorator }
                    />
                    <DecoratedInput
                        field='email'
                        label={ <FormattedMessage id='employee.email' /> }
                        placeholder={ formatMessage({
                            id: 'employee.email_placeholder',
                        }) }
                        formItem
                        formItemLayout={ formItemLayout }
                        initialValue={ initialEmployee && initialEmployee.email }
                        autosize={ { minRows: 2, maxRows: 6 } }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                            {
                                validator: (rule, value, callback) => {
                                    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

                                    if (re.test(value)) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                formatMessage({
                                                    id:
                                                        'employee.enter_correct_email',
                                                }),
                                            ),
                                        );
                                    }

                                    return true;
                                },
                                message: '',
                            },
                        ] }
                        className={ Styles.selectMargin }
                        getPopupContainer={ trigger => trigger.parentNode }
                        getFieldDecorator={ getFieldDecorator }
                    />
                    <DecoratedInput
                        field='jobTitle'
                        label={ <FormattedMessage id='employee.jobTitle' /> }
                        placeholder={ formatMessage({
                            id: 'employee.jobTitle_placeholder',
                        }) }
                        formItem
                        formItemLayout={ formItemLayout }
                        initialValue={
                            initialEmployee && initialEmployee.jobTitle
                        }
                        autosize={ { minRows: 2, maxRows: 6 } }
                        rules={ [
                            {
                                required: true,
                                max:      2000,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        className={ Styles.selectMargin }
                        getPopupContainer={ trigger => trigger.parentNode }
                        getFieldDecorator={ getFieldDecorator }
                    />

                    <DecoratedDatePicker
                        field='hireDate'
                        label={ <FormattedMessage id='employee.hireDate' /> }
                        formItem
                        formItemLayout={ formItemLayout }
                        formatMessage={ formatMessage }
                        // className={ Styles.selectMargin }
                        getFieldDecorator={ getFieldDecorator }
                        getCalendarContainer={ trigger => trigger.parentNode }
                        initialValue={
                            initialEmployee && moment(initialEmployee.hireDate)
                        }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        format={ 'YYYY-MM-DD' }
                        placeholder={
                            <FormattedMessage id='order_task_modal.deadlineDate_placeholder' />
                        }
                    />

                    <div className={ Styles.ButtonGroup }>
                        { initialEmployee && !initialEmployee.fireDate ? (
                            <Button
                                type='danger'
                                disabled={ isForbidden(
                                    this.props.user,
                                    permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                                ) }
                                onClick={ () => fireEmployee() }
                            >
                                <FormattedMessage id='employee.fire_employee' />
                            </Button>
                        ) : null }
                        <Button
                            disabled={ isForbidden(
                                this.props.user,
                                permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                            ) }
                            type='primary'
                            onClick={ () => saveEmployee() }
                        >
                            <FormattedMessage id='save' />
                        </Button>
                    </div>
                </div>
            </Form>
        );
    }
}
