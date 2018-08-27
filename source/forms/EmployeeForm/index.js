// vendor
import React, { Component } from 'react';
import {Form, Button, Select, Icon, Tooltip, Input} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';
import moment from 'moment'
//proj
import { onChangeEmployeeForm } from 'core/forms/employeeForm/duck';

import { withReduxForm, getDateTimeConfigs } from 'utils';

// own
import {
    DecoratedInputPhone,
    DecoratedInput,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import Styles from './styles.m.css';
@injectIntl
@withReduxForm({
    name:    'employeeForm',
    actions: {
        change: onChangeEmployeeForm,
    },
})
export class EmployeeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toogleDirectory: false,
        };
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const {
            initialEmployee,
            saveEmployee,
        } = this.props;


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
                        initialValue={ initialEmployee&&initialEmployee.name }
                        rules={ [
                            {
                                required: true,
                                message:  '',
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
                        initialValue={ initialEmployee&&initialEmployee.surname }

                        rules={ [
                            {
                                required: true,
                                message:  '',
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
                        colon={ false }
                        initialValue={ initialEmployee&&initialEmployee.phone }

                        rules={ [
                            {
                                required: true,
                                message:  '',
                            },

                            {
                                validator: (rule, value, callback)=>{
                                    let reg = /^\d+$/;

                                    if(reg.test(value)){
                                        callback()
                                    }else{
                                        callback(
                                            new Error(
                                                formatMessage({
                                                    id: 'employee.only_numbers',
                                                }), 
                                            ), 
                                        )
                                    }

                                    return true
                                },
                                message: '',
                            },
                            {
                                validator: (rule, value, callback)=>{
                                    if(value&&value.length===10){
                                        callback()
                                    }else{
                                        callback(new Error(
                                            formatMessage({
                                                id: 'employee.full_phone',
                                            }),
                                        ))
                                    }

                                    return true
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
                        initialValue={ initialEmployee&&initialEmployee.email }

                        autosize={ { minRows: 2, maxRows: 6 } }
                        rules={ [
                            {
                                required: true,
                                message:  '',
                            },
                            {
                                validator: (rule, value, callback)=>{
                                    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

                                    if(re.test(value)){
                                        callback()
                                    }else{
                                        callback(
                                            new Error(
                                                formatMessage({
                                                    id: 'employee.enter_correct_email',
                                                }), 
                                            ), 
                                        )
                                    }

                                    return true
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
                        initialValue={ initialEmployee&&initialEmployee.jobTitle }

                        autosize={ { minRows: 2, maxRows: 6 } }
                        rules={ [
                            {
                                max:     2000,
                                message: 'Too much',
                            },
                        ] }
                        className={ Styles.selectMargin }
                        getPopupContainer={ trigger => trigger.parentNode }
                        getFieldDecorator={ getFieldDecorator }
                    />
                    <div className={ Styles.dateTimePickerBlock }>
                        <DecoratedDatePicker
                            field='hireDate'
                            label={ <FormattedMessage id='employee.hireDate' /> }
                            formItem
                            formatMessage={ formatMessage }
                            className={ Styles.selectMargin }
                            getFieldDecorator={ getFieldDecorator }
                            getCalendarContainer={ trigger =>
                                trigger.parentNode
                            }
                            initialValue={ initialEmployee&&moment(initialEmployee.hireDate) }
                            rules={ [
                                {
                                    required: true,
                                    message:  '',
                                },
                            ] }
                            format={ 'YYYY-MM-DD' }
                            placeholder={
                                <FormattedMessage id='order_task_modal.deadlineDate_placeholder' />
                            }
                        />

                        
                    </div>
                    <Button
                        type='primary'
                        onClick={ () => saveEmployee() }
                    >
                        <FormattedMessage id='save' />
                    </Button>
                </div>
                
            </Form>
        );
    }
}
