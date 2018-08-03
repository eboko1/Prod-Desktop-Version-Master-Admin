// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Catcher } from 'commons';

class TasksTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='progressStatus' />,
                dataIndex: 'progressStatus',
                width:     '8%',
                render:    (text, record) => (
                    <div style={ { wordBreak: 'normal' } }>{ text }</div>
                ),
            },
            {
                title:     <FormattedMessage id='priority' />,
                dataIndex: 'priority',
                width:     '8%',
                // render:    (text, record) => <div>{}</div>,
            },
            {
                title:     <FormattedMessage id='urgency' />,
                dataIndex: 'urgency',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='responsable' />,
                dataIndex: 'text',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='position' />,
                dataIndex: 'position',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='post' />,
                dataIndex: 'post',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='startDate' />,
                dataIndex: 'startDate',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='deadlineDate' />,
                dataIndex: 'deadlineDate',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='duration' />,
                dataIndex: 'duration',
                width:     '8%',
            },
            {
                title:     <FormattedMessage id='endDate' />,
                dataIndex: 'endDate',
                width:     '8%',
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
                    //   dataSource={orderTasks}
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
