// vendor
import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { v4 } from 'uuid';
import Styles from './styles.m.css';

// proj
import { Catcher } from 'commons';
import { MODALS } from 'core/modals/duck';

class TasksTable extends Component {
    constructor(props) {
        super(props);
        const { setModal, initOrderTasksForm, changeModalStatus } = this.props;
        this.columns = [
            {
                title:     '',
                dataIndex: 'review',
                width:     '8%',
                render:    (text, record) => {
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
                width:     '8%',
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
                width:     '8%',
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
                width:     'auto',
            },
        ];
    }

    render() {
        const { orderTasks } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ orderTasks.map((task, index) => ({
                        ...task,
                        index,
                        key: v4(),
                    })) }
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
