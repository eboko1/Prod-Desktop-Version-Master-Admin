// vendor
import React, { Component } from 'react';
import { Form, Select, Icon, Tooltip } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    DecoratedTextArea,
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
    constructor(props){
        super(props)
        this.state={
            toogleDirectory: false,
        }
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const { num, progressStatusOptions, priorityOptions, stations, managers, orderTasks} = this.props;
        const {toogleDirectory} = this.state
        // const {
        //     disabledDate,
        //     disabledHours,
        //     disabledMinutes,
        //     disabledSeconds,
        //     disabledTime,
        // } = getDateTimeConfig(beginDatetime, this.props.schedule);
        const textDirectory=  <div className={ Styles.directory }>
            <Icon onClick={ ()=>this.setState({toogleDirectory: false}) } 
                type='close-circle-o' />
            <div>
                <div><span>Калькуляция</span>:<span>М/п готовит калькуляцию</span></div>	
                <div><span>Согласование</span>:<span>Коммуникация с клиентом, обычно после Калькуляции или Диагностики</span></div>
                <div><span>Ожидание заезда</span>:<span>Все согласовано, ждем заезда</span></div>	
                <div><span>Приемка</span>:<span>М/п принимает авто</span></div>	
                <div><span>Диагностика</span>:<span>Проходит диагностика авто</span></div>	
                <div><span>Ожидание ремонта</span>:<span>Авто ждет ремонта в цеху или на территории		</span></div>	
                <div><span>Ожидание з/ч</span>:<span>Авто ожидает з/ч</span></div>	
                <div><span>Ремонт</span>:<span>Идет ремонт</span></div>	
                <div><span>Выдача</span>:<span>Ремонт выполнен, ожидание оплаты и возврата авто</span></div>	
                <div><span>Закрыто</span>:<span>Ремонт закрыт</span></div>	
                <div><span>Другое</span>:<span>Кастомные задачи	</span></div>
            </div>	
        </div> 
        
        const popup = <span                            
            className={ Styles.statusTooltip }
            onClick={ ()=>this.setState({toogleDirectory: !toogleDirectory}) }
        >Открыть справочник по статусам</span>

        return (
            <Form layout='horizontal'>
                <div className={ Styles.orderDescription }> 
                    <div>
                        { ' ' }
                        <FormattedMessage id='order-task-modal.order_number' />:{ ' ' }
                        { num }
                    </div>
                    { orderTasks.length>0?
                        <div>
                            <FormattedMessage id='order-task-modal.vehicle' />:{ ' ' }
                            { orderTasks[ 0 ].vehicleMakeName } { orderTasks[ 0 ].vehicleModelName }
                        </div>
                        :null }
                </div>
                <div>
                    <DecoratedSelect
                        field={ 'status' }
                        showSearch
                        formItem
                        hasFeedback
                        label={ <FormattedMessage id='status' />
                        // <div >
                        //     <FormattedMessage id='status' />
                        //     <Tooltip placement='bottom' 
                        //         title={ popup }
                        //         getPopupContainer={ trigger => trigger.parentNode }
                        //     >
                        //         <Icon 
                        //             // className={ Styles.questionIcon }
                        //             type='question-circle-o'/>
                        //     </Tooltip>
                        //     </div> 
                        }
                        getFieldDecorator={ getFieldDecorator }
                        className={ Styles.statusSelect }
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
                    <Tooltip placement='bottom' 
                        title={ popup }

                        getPopupContainer={ trigger => trigger.parentNode }
                    >
                        <Icon 

                            type='question-circle-o'/>
                    </Tooltip>
                </div>
                { toogleDirectory?<div>{ textDirectory }</div>:<div>
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
                    <div className={ Styles.dateTimePickerBlock }> 
                        <DecoratedDatePicker
                            field='deadlineDate'
                            label={ <FormattedMessage id='deadlineDate' /> }
                            formItem
                            formatMessage={ formatMessage }
                            className={ Styles.selectMargin }
                            getFieldDecorator={ getFieldDecorator }
                            value={ null }
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
                    <DecoratedTextArea
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
                </div> }
            </Form>
        );
    }
}
