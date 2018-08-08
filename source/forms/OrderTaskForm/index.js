// vendor
import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedDatePicker,
    DecoratedTimePicker,
} from 'forms/DecoratedFields';
import { v4 } from 'uuid';
//proj
import { onChangeOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import { withReduxForm, getDateTimeConfig } from 'utils';
const Option = Select.Option;


// own

import Styles from './styles.m.css';
import Item from '../../../node_modules/antd/lib/list/Item';
@injectIntl
@withReduxForm({
    name:    'orderTaskForm',
    actions: {
        change: onChangeOrderTasksForm,
    },
})
export class OrderTaskForm extends Component {
    
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        const { num, progressStatusOptions, priorityOptions, stations, managers} = this.props;
        // const {
        //     disabledDate,
        //     disabledHours,
        //     disabledMinutes,
        //     disabledSeconds,
        //     disabledTime,
        // } = getDateTimeConfig(beginDatetime, this.props.schedule);

        return (
            <Form layout='horizontal'>
                <div>
                    { ' ' }
                    <FormattedMessage id='order-task-modal.order_number' />:{ ' ' }
                    { num }
                </div>

                <DecoratedSelect
                    field={ 'status' }
                    showSearch
                    formItem
                    hasFeedback
                    label={ <FormattedMessage id='status' /> }
                    getFieldDecorator={ getFieldDecorator }
                    className={ Styles.selectMargin }
                    placeholder={
                        <FormattedMessage id='order_task_modal.progressStatus_placeholder' />
                    }
                    rules={ [
                        {
                            required: true,
                            message:  'you must add status',
                        },
                    ] }
                    getPopupContainer={ trigger => trigger.parentNode }
                >
                    { progressStatusOptions.map(({id, value})=>{
                        return <Option value={ id } key={ v4() }>
                            { value }
                        </Option>
                    }) }
                    
                    
                </DecoratedSelect>
                <DecoratedSelect
                    field={ 'priority' }
                    showSearch
                    formItem
                    hasFeedback
                    label={ <FormattedMessage id='priority' /> }
                    getFieldDecorator={ getFieldDecorator }
                    className={ Styles.selectMargin }
                    placeholder={
                        <FormattedMessage id='order_task_modal.priority_placeholder' />
                    }
                    // optionFilterProp='children'
                    getPopupContainer={ trigger => trigger.parentNode }
                >
                    { priorityOptions.map(({id, value})=>{
                        return <Option value={ id } key={ v4() }>
                            { value }
                        </Option>
                    }) }
                </DecoratedSelect>
                <DecoratedSelect
                    field={ 'stationName' }
                    showSearch
                    formItem
                    hasFeedback
                    className={ Styles.selectMargin }
                    label={ <FormattedMessage id='stationName' /> }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={
                        <FormattedMessage id='order_task_modal.post_placeholder' />
                    }
                    // optionFilterProp='children'
                    getPopupContainer={ trigger => trigger.parentNode }
                >
                    { stations.map(({name, num})=>{
                        return <Option value={ num } key={ v4() }>
                            { name }
                        </Option>
                    }) } 
                    
                </DecoratedSelect>
                <DecoratedSelect
                    field={ 'responsible' }
                    showSearch
                    formItem
                    hasFeedback
                    className={ Styles.selectMargin }
                    label={ <FormattedMessage id='responsible' /> }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={
                        <FormattedMessage id='order_task_modal.responsible_placeholder' />
                    }
                    rules={ [
                        {
                            required: true,
                            message:  'you must add responsible',
                        },
                    ] }
                    // optionFilterProp='children'
                    getPopupContainer={ trigger => trigger.parentNode }
                >
                    { managers.map(({managerName, managerSurname, id})=>{

                        return <Option value={ id } key={ v4() }>
                            { `${managerName} ${managerSurname}` }
                        </Option>
                    }) } 
                    
                </DecoratedSelect>
                <div className={ Styles.dateTimePickers }> 
                    <DecoratedDatePicker
                        field='deadlineDate'
                        label={ <FormattedMessage id='deadlineDate' /> }
                        formItem
                        formatMessage={ formatMessage }
                        className={ Styles.selectMargin }
                        getFieldDecorator={ getFieldDecorator }
                        // value={ null }
                        getCalendarContainer={ trigger => trigger.parentNode }
                        format={ 'YYYY-MM-DD' }
                        
                        placeholder={
                            <FormattedMessage id='order_task_modal.deadlineDate_placeholder' />
                        }
                    />
                    <DecoratedTimePicker
                        field='deadlineTime'
                        label={ <FormattedMessage id='deadlineTime' /> }
                        formItem
                        formatMessage={ formatMessage }
                        className={ Styles.selectMargin }
                        getFieldDecorator={ getFieldDecorator }
                        value={ null }
                        format={ 'HH:mm' }
                          
                        getPopupContainer={ trigger => trigger.parentNode }
                        placeholder={
                            formatMessage({
                                id: 'order_task_modal.deadlineTime_placeholder',
                            })                           }
                    />
                </div>
                <DecoratedInput
                    field='comment'
                    label={ <FormattedMessage id='comment' /> }
                    placeholder={ formatMessage({
                        id: 'order_task_modal.comment_placeholder',
                    }) }
                    formItem
                    className={ Styles.selectMargin }
                    getPopupContainer={ trigger => trigger.parentNode }
                    getFieldDecorator={ getFieldDecorator }
                />
            </Form>
        );
    }
}
