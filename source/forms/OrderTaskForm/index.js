// vendor
import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import { v4 } from 'uuid';
//proj
import { onChangeOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import { withReduxForm, getDateTimeConfig } from 'utils';
const Option = Select.Option;


// own

import Styles from './styles.m.css';
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

        const { num } = this.props;

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
                    // optionFilterProp='children'
                    getPopupContainer={ trigger => trigger.parentNode }
                >
                    <Option value={ 1 } key={ v4() }>
                        Name2
                    </Option>
                    <Option value={ 12 } key={ v4() }>
                        Name3
                    </Option>
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
                    <Option value={ 1 } key={ v4() }>
                        Name2
                    </Option>
                    <Option value={ 12 } key={ v4() }>
                        Name3
                    </Option>
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
                    <Option value={ 1 } key={ v4() }>
                        Name2
                    </Option>
                    <Option value={ 12 } key={ v4() }>
                        Name3
                    </Option>
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
                    // optionFilterProp='children'
                    getPopupContainer={ trigger => trigger.parentNode }
                >
                    <Option value={ 1 } key={ v4() }>
                        Name2
                    </Option>
                    <Option value={ 12 } key={ v4() }>
                        Name3
                    </Option>
                </DecoratedSelect>
                <DecoratedDatePicker
                    field='deadlineDate'
                    label={ <FormattedMessage id='deadlineDate' /> }
                    formItem
                    formatMessage={ formatMessage }
                    className={ Styles.selectMargin }
                    getFieldDecorator={ getFieldDecorator }
                    value={ null }
                    getCalendarContainer={ trigger => trigger.parentNode }
                    format={ 'YYYY-MM-DD HH:mm' }
                    showTime={ {
                        format: 'HH:mm',
                    } }
                    placeholder={
                        <FormattedMessage id='order_task_modal.deadlineDate_placeholder' />
                    }
                />
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
