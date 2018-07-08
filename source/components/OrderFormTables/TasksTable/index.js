// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Catcher } from 'commons';

// own
// import Styles from './styles.m.css';

class TasksTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='date' />,
                dataIndex: 'data',
                width:     '10%',
                render:    (text, record) => (
                    <div style={ { wordBreak: 'normal' } }>
                        { moment(record.datetime).format('DD.MM.YYYY HH:mm') }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='status' />,
                dataIndex: 'status',
                width:     '20%',
                // render:    (text, record) => <div>{}</div>,
            },
            {
                title:     <FormattedMessage id='name' />,
                dataIndex: 'name',
                width:     '35%',
            },
            {
                title:     <FormattedMessage id='text' />,
                dataIndex: 'text',
                width:     '35%',
            },
        ];
    }

    render() {
        const { orderTasks } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ orderTasks }
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
