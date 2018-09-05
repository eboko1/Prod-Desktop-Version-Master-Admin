// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, Icon, Tooltip } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { MODALS } from 'core/modals/duck';
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

class TasksTable extends Component {
    constructor(props) {
        super(props);
        const { setModal, initOrderTasksForm, changeModalStatus } = this.props;

        this.columns = [
            {
                title:     '',
                dataIndex: 'review',
                key:       'review',
                width:     '4%',
                render:    (text, record) => {
                    if (record.orderNum) {
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
                title:     <FormattedMessage id='status' />,
                dataIndex: 'status',
                key:       'status',
                width:     '8%',
                render:    text => {
                    return text ? <FormattedMessage id={ text } /> : '';
                },
            },
            {
                title:     <FormattedMessage id='priority' />,
                dataIndex: 'priority',
                key:       'priority',
                width:     '8%',
                render:    text => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
            },
            {
                title:     <FormattedMessage id='urgency' />,
                dataIndex: 'urgency',
                key:       'urgency',
                width:     '8%',
                render:    text => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
            },
            {
                title:     <FormattedMessage id='responsible' />,
                dataIndex: 'responsibleName',
                key:       'responsibleName',
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
                key:       'position',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='stationName' />,
                dataIndex: 'stationName',
                key:       'stationName',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='startDate' />,
                dataIndex: 'startDate',
                key:       'startDate',
                width:     '8%',
                render:    text => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='deadlineDate' />,
                dataIndex: 'deadlineDate',
                key:       'deadlineDate',
                width:     '8%',
                render:    text => (
                    <div>
                        { ' ' }
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='duration' />,
                dataIndex: 'duration',
                key:       'duration',
                width:     '9%',
                render:    text => {
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
                key:       'endDate',
                width:     '8%',
                render:    text => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='comment' />,
                dataIndex: 'comment',
                key:       'comment',
                width:     '8%',
                render:    text => (
                    <div>
                        <Tooltip
                            placement='bottomLeft'
                            title={ <span>{ text }</span> }
                            getPopupContainer={ trigger => trigger.parentNode }
                        >
                            <div className={ Styles.commentDiv }>{ text }</div>
                        </Tooltip>
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='author' />,
                dataIndex: 'author',
                key:       'author',
                width:     '8%',
                render:    (text, record) => (
                    <div>
                        { record.authorName } { record.authorSurname }
                    </div>
                ),
            },
        ];
    }

    sortHistory = (a, b) => {
        if (moment(a.startDate).isAfter(b.startDate)) {
            return -1;
        }
        if (moment(b.startDate).isAfter(a.startDate)) {
            return 1;
        }

        return 0;
    };

    render() {
        const { orderTasks } = this.props;
        const columns = this.columns;
        console.log(orderTasks);

        return (
            <Catcher>
                <Table
                    dataSource={
                        orderTasks.orderTasks &&
                        orderTasks.orderTasks[ 0 ].history.length > 0
                            ? [
                                ...orderTasks.orderTasks.map(
                                    (task, index) => ({
                                        ...task,
                                        index,
                                        key: v4(),
                                    }),
                                ),
                                ...orderTasks.orderTasks[ 0 ].history
                                    .sort(this.sortHistory)
                                    .map((task, index) => ({
                                        ...task,
                                        index,
                                        key: v4(),
                                    })),
                            ]
                            : orderTasks.orderTasks
                                ? [
                                    ...orderTasks.orderTasks.map(
                                        (task, index) => ({
                                            ...task,
                                            index,
                                            key: v4(),
                                        }),
                                    ),
                                ]
                                : []
                    }
                    size='small'
                    scroll={ { x: 2000 } }
                    columns={ columns }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}

export default TasksTable;
