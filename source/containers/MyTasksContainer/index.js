// vendor
import React, { Component } from 'react';
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
import {
    fetchMyTasks,
    onChangeMyTasksForm,
    getActiveOrder,
} from 'core/myTasks/duck';
import { setModal, MODALS } from 'core/modals/duck';
import { initOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm({
    name:    'myTasksForm',
    actions: {
        change: onChangeMyTasksForm,
        fetchMyTasks,
        setModal,
        initOrderTasksForm,
        getActiveOrder,
    },
})
export default class MyTasksContainer extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     '',
                dataIndex: 'review',
                width:     '4%',
                render:    (text, record) => {
                    if (record.orderNum) {
                        if (record.status !== 'CLOSED') {
                            return (
                                <Icon
                                    className={ Styles.editOrderTaskIcon }
                                    onClick={ () => {
                                        this.props.initOrderTasksForm(record);
                                        this.props.setModal(MODALS.ORDER_TASK);
                                        this.props.getActiveOrder(
                                            record.orderId,
                                        );
                                    } }
                                    type='edit'
                                />
                            );
                        }
                    }
                },
            },

            {
                title:     <FormattedMessage id='orderNumber' />,
                dataIndex: 'orderId',
                width:     '7%',
            },
            {
                title:     <FormattedMessage id='status' />,
                dataIndex: 'status',
                width:     '7%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : '';
                },
            },
            {
                title:     <FormattedMessage id='priority' />,
                dataIndex: 'priority',
                width:     '6%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
            },
            {
                title:     <FormattedMessage id='urgency' />,
                dataIndex: 'urgency',
                width:     '7%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
            },
            {
                title:     <FormattedMessage id='vehicle' />,
                dataIndex: 'vehicleMakeName',
                width:     '7%',
                render:    (text, record) => {
                    return record.vehicleMakeName ? (
                        <div>
                            { record.vehicleMakeName } { record.vehicleModelName }
                        </div>
                    ) : null;
                },
            },
            {
                title:     <FormattedMessage id='responsible' />,
                dataIndex: 'responsibleName',
                width:     '7%',
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
                width:     '7%',
            },
            {
                title:     <FormattedMessage id='stationName' />,
                dataIndex: 'stationName',
                width:     '7%',
            },
            {
                title:     <FormattedMessage id='startDate' />,
                dataIndex: 'startDate',
                width:     '7%',
                render:    (text, record) => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='deadlineDate' />,
                dataIndex: 'deadlineDate',
                width:     '7%',
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
                width:     '8%',
                render:    (text, record) => {
                    let durationText = moment.duration(text, 'seconds');
                    let duration = moment
                        .utc(durationText.asMilliseconds())
                        .format('HH:mm');

                    return <div>{ text ? duration : null }</div>;
                },
            },
            {
                title:     <FormattedMessage id='endDate' />,
                dataIndex: 'endDate',
                width:     '7%',
                render:    (text, record) => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='comment' />,
                dataIndex: 'comment',
                width:     '7%',
            },
            {
                title:     <FormattedMessage id='author' />,
                dataIndex: 'author',
                width:     '7%',
                render:    (text, record) => (
                    <div>
                        { record.authorName } { record.authorSurname }
                    </div>
                ),
            },
        ];
    }

    componentDidMount() {
        this.props.fetchMyTasks();
    }

    render() {
        const { myTasks } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                { /* <section className={ Styles.filters }>
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
                </section> */ }
                <section className={ Styles.filters }>
                    <Table
                        dataSource={
                            myTasks && myTasks.orderTasks.length > 0
                                ? myTasks.orderTasks.map((task, index) => ({
                                    ...task,
                                    index,
                                    key: v4(),
                                }))
                                : []
                        }
                        size='small'
                        scroll={ { x: 2200 } }
                        columns={ columns }
                        pagination={ false }
                        locale={ {
                            emptyText: <FormattedMessage id='no_data' />,
                        } }
                    />
                </section>
            </Catcher>
        );
    }
}
