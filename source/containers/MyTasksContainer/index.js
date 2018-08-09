// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { Table, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    DecoratedTextArea,
    DecoratedSelect,
    DecoratedDatePicker,
    DecoratedTimePicker,
} from 'forms/DecoratedFields';
import { v4 } from 'uuid';

// proj
import { withReduxForm, getDateTimeConfig } from 'utils';

// import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { fetchMyTasks, onChangeMyTasksForm } from 'core/myTasks/duck';

import { Catcher } from 'commons';
import { OrderTaskModal } from 'modals';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {

    return {
        myTasks: state.myTasksContainer.myTasks,
    };
};

const mapDispatchToProps = {
    // fetchOrders,
    // fetchStatsCounts,
    // fetchUniversalFiltersForm,
    // setUniversalFilters,
    // onChangeUniversalFiltersForm,
    setModal,
    resetModal,
    fetchMyTasks,
};
@injectIntl
@withReduxForm({   
    name:    'myTasksForm',
    actions: {
        change: onChangeMyTasksForm,
    } })
@connect(mapStateToProps, mapDispatchToProps)
export default class MyTasksContainer extends Component {

    constructor(props){
        super(props)
        this.columns = [
            {
                title:     '',
                dataIndex: 'review',
                width:     '4%',
                render:    (text, record) => {
                    if(record.orderNum){
                        return (
                            <Icon
                                className={ Styles.editOrderTaskIcon }
                                onClick={ () => {
                                    initOrderTasksForm(record);
                                    setModal(MODALS.ORDER_TASK);
                                    changeModalStatus('editing');
                                } }
                                type='edit'
                            />
                        );
                    }
                },
            },
            
            {
                title:     <FormattedMessage id='orderNumber' />,
                dataIndex: 'orderNumber',
                width:     '4%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : '';
                },
            },
            {
                title:     <FormattedMessage id='status' />,
                dataIndex: 'status',
                width:     '8%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : '';
                },
            },
            {
                title:     <FormattedMessage id='priority' />,
                dataIndex: 'priority',
                width:     '4%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
            },
            {
                title:     <FormattedMessage id='urgency' />,
                dataIndex: 'urgency',
                width:     '8%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
            },
            {
                title:     <FormattedMessage id='responsible' />,
                dataIndex: 'responsibleName',
                width:     '8%',
                render:    (text, record) => {
                    return (
                        <div style={ { wordBreak: 'normal' } }>{ `${text} ${
                            record.responsibleSurname
                        }` }</div>
                    );
                },
            },
            {
                title:     <FormattedMessage id='position' />,
                dataIndex: 'position',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='stationName' />,
                dataIndex: 'stationName',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='startDate' />,
                dataIndex: 'startDate',
                width:     '8%',
                render:    (text, record) => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='deadlineDate' />,
                dataIndex: 'deadlineDate',
                width:     '8%',
                render:    (text, record) => (
                    <div>
                        { ' ' }
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='duration' />,
                dataIndex: 'duration',
                width:     '9%',
                render:    (text, record) => {
                    let durationText= moment.duration(text, 'seconds')
                    let duration=moment.utc(durationText.asMilliseconds()).format('HH:mm')

                    return  <div>
                        { text ? duration: null }
                    </div>
                },
            },
            {
                title:     <FormattedMessage id='endDate' />,
                dataIndex: 'endDate',
                width:     '8%',
                render:    (text, record) => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='comment' />,
                dataIndex: 'comment',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='author' />,
                dataIndex: 'author',
                width:     '8%',
                render:    (text, record) => (
                    <div>
                        { record.authorName } { record.authorSurname }
                    </div>
                ),
            },
        ];
    }

    componentWillMount(){
        this.props.fetchMyTasks()
    }

    render() {
        const { resetModal, universaFiltersModal, stats, filter } = this.props;
        const { myTasks } = this.props;
        const columns = this.columns;
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Catcher>
                <section className={ Styles.filters }>
                    <DecoratedDatePicker
                        field='filterDate'
                        label={ <FormattedMessage id='filterDate' /> }
                        formItem
                        ranges
                        formatMessage={ formatMessage }
                        className={ Styles.selectMargin }
                        getFieldDecorator={ getFieldDecorator }
                        value={ null }
                        getCalendarContainer={ trigger => trigger.parentNode }
                        format={ 'YYYY-MM-DD' }
                        
                        placeholder={
                            <FormattedMessage id='order_task_modal.deadlineDate_placeholder' />
                        }/>
                </section>
                <section className={ Styles.filters }>
                    <Table 
                        dataSource={ myTasks&&myTasks.orderTasks.length>0? myTasks.orderTasks.map((task, index) => ({
                            ...task,
                            index,
                            key: v4(),
                        })):[] }
                        size='small'
                        scroll={ { x: 2000 } }
                        columns={ columns }
                        pagination={ false }
                        locale={ {
                            emptyText: <FormattedMessage id='no_data' />,
                        } }
                    />
                </section>
                { /* <OrderTaskModal
                    wrappedComponentRef={ this.saveOrderTaskFormRef }
                    orderTaskEntity={ this.props.orderTaskEntity }
                    priorityOptions={ this.props.priorityOptions }
                    progressStatusOptions={ this.props.progressStatusOptions }
                    visible={ modal }
                    resetModal={ () => resetModal() }
                    num={ num }
                    orderTaskId={ this.props.orderTaskId }
                    orderId={ this.props.match.params.id }
                    resetOrderTasksForm={ this.props.resetOrderTasksForm }
                    stations={ this.props.stations }
                    managers={ this.props.managers }
                    saveNewOrderTask={ this.saveNewOrderTask }
                    orderTasks={ this.props.orderTasks }
                /> */ }
            </Catcher>
        );
    }
}
