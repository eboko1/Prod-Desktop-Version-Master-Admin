// vendor
import React, { Component } from 'react';
import { Form, Select, Icon, Tooltip } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

//proj
import { onChangeOrderTasksForm } from 'core/forms/orderTaskForm/duck';
import { withReduxForm } from 'utils';
const Option = Select.Option;

// own
import {
    DecoratedTextArea,
    DecoratedSelect,
    DecoratedDatePicker,
    DecoratedTimePicker,
} from 'forms/DecoratedFields';
import Styles from './styles.m.css';

@injectIntl
@withReduxForm({
    name:    'orderTaskForm',
    actions: {
        change: onChangeOrderTasksForm,
    },
})
export class OrderTaskForm extends Component {
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
            num,
            progressStatusOptions,
            priorityOptions,
            stations,
            managers,
            initialOrderTask,
            orderTasks,
            activeVehicle,
        } = this.props;
        const { toogleDirectory } = this.state;

        const textDirectory = (
            <div className={ Styles.directory }>
                <Icon
                    onClick={ () => this.setState({ toogleDirectory: false }) }
                    type='close-circle-o '
                />
                <div className={ Styles.info }>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='calculation' />
                        </div>
                        <div>
                            <FormattedMessage id='manager_prepares_cost_estimate' />


                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='harmonization' />
                        </div>
                        <div>
                            <FormattedMessage id='communication_with_the_client' />
      
                            
                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='waiting_for_arrival' />:
                        </div>
                        <div>
                            <FormattedMessage id='all_agreed' />

                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='acceptance' />:</div>
                        <div>
                            <FormattedMessage id='manager_accepts_cars' />
                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='diagnostics' />:
                        </div>
                        <div>
                            <FormattedMessage id='passes_car_diagnostics' />

                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='waiting_for_repair' />:
                        </div>
                        <div>
                            <FormattedMessage id='auto_waiting_for_repair' />

                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='waiting_for_spare_parts' />

                            :
                        </div>
                        <div>
                            <FormattedMessage id='auto_expects_spare_parts' />
                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='repairs' />:</div>
                        <div>
                            <FormattedMessage id='there_is_a_repair' />

                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='extradition' />:</div>
                        <div>
                            <FormattedMessage id='repair_is_completed' />
                            
                            
                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='closed' />:</div>
                        <div>
                            <FormattedMessage id='repair_is_closed' />
                        </div>
                    </div>
                    <div className={ Styles.infoDirectory }>
                        <div className={ Styles.infoDirectoryName }>
                            <FormattedMessage id='other' />:</div>
                        <div>
                            <FormattedMessage id='custom_tasks' />
                        </div>
                    </div>
                </div>
            </div>
        );

        const popup = (
            <span
                className={ Styles.statusTooltip }
                onClick={ () =>
                    this.setState({ toogleDirectory: !toogleDirectory })
                }
            >
                Открыть справочник по статусам
            </span>
        );

        return (
            <Form layout='horizontal'>
                <div className={ Styles.orderDescription }>
                    { num ? (
                        <div>
                            <FormattedMessage id='order-task-modal.order_number' />
                            :{ num }
                        </div>
                    ) : null }
                    { activeVehicle ? (
                        <div>
                            <FormattedMessage id='order-task-modal.vehicle' />:
                            { activeVehicle }
                        </div>
                    ) : null }
                </div>
                <div className={ Styles.statusPanel }>
                    <DecoratedSelect
                        field={ 'status' }
                        showSearch
                        formItem
                        hasFeedback
                        label={ <FormattedMessage id='status' /> }
                        getFieldDecorator={ getFieldDecorator }
                        className={ Styles.statusSelect }
                        placeholder={
                            <FormattedMessage id='order_task_modal.progressStatus_placeholder' />
                        }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        getPopupContainer={ trigger => trigger.parentNode }
                    >
                        { progressStatusOptions.map(({ id, value }) => {
                            return (
                                <Option value={ id } key={ v4() }>
                                    { value }
                                </Option>
                            );
                        }) }
                    </DecoratedSelect>
                    <Tooltip
                        placement='top'
                        title={ popup }
                        getPopupContainer={ trigger => trigger.parentNode }
                    >
                        <Icon
                            type='question-circle-o'
                            style={ { marginBottom: 8 } }
                        />
                    </Tooltip>
                </div>
                { toogleDirectory ? (
                    <div>{ textDirectory }</div>
                ) : (
                    <div>
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
                            getPopupContainer={ trigger => trigger.parentNode }
                        >
                            { priorityOptions.map(({ id, value }) => {
                                return (
                                    <Option value={ id } key={ v4() }>
                                        { value }
                                    </Option>
                                );
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
                            { stations.map(({ name, num }) => {
                                return (
                                    <Option value={ num } key={ v4() }>
                                        { name }
                                    </Option>
                                );
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
                                    message:  formatMessage({
                                        id: 'required_field',
                                    }),
                                },
                            ] }
                            // optionFilterProp='children'
                            getPopupContainer={ trigger => trigger.parentNode }
                        >
                            { managers.map(
                                ({ managerName, managerSurname, id }) => {
                                    return (
                                        <Option value={ id } key={ v4() }>
                                            { `${managerName} ${managerSurname}` }
                                        </Option>
                                    );
                                },
                            ) }
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
                                getCalendarContainer={ trigger =>
                                    trigger.parentNode
                                }
                                format={ 'YYYY-MM-DD' }
                                placeholder={
                                    <FormattedMessage id='order_task_modal.deadlineDate_placeholder' />
                                }
                            />
                            <DecoratedTimePicker
                                allowEmpty={ false }
                                minuteStep={ 30 }
                                field='deadlineTime'
                                label={ <FormattedMessage id='deadlineTime' /> }
                                formItem
                                formatMessage={ formatMessage }
                                className={ Styles.selectMargin }
                                getFieldDecorator={ getFieldDecorator }
                                value={ null }
                                format={ 'HH:mm' }
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                placeholder={ formatMessage({
                                    id:
                                        'order_task_modal.deadlineTime_placeholder',
                                }) }
                            />
                        </div>
                        <DecoratedTextArea
                            field='comment'
                            label={ <FormattedMessage id='comment' /> }
                            placeholder={ formatMessage({
                                id: 'order_task_modal.comment_placeholder',
                            }) }
                            formItem
                            autosize={ { minRows: 2, maxRows: 6 } }
                            rules={ [
                                {
                                    max:     2000,
                                    message: formatMessage({
                                        id: 'field_should_be_below_2000_chars',
                                    }),
                                },
                            ] }
                            className={ Styles.selectMargin }
                            getPopupContainer={ trigger => trigger.parentNode }
                            getFieldDecorator={ getFieldDecorator }
                        />
                    </div>
                ) }
            </Form>
        );
    }
}
