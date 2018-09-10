// vendor
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Table, Icon, Rate } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';

@withRouter
export default class EmployeeTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     '',
                dataIndex: 'review',
                width:     '15%',
                render:    (text, record) => {
                    return (
                        <>
                            {!isForbidden(
                                this.props.user,
                                permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                            ) ? (
                                <Icon
                                        className={ Styles.employeeTableIcon }
                                        onClick={ () => {
                                            this.props.deleteEmployee(
                                                record.id,
                                                this.props.kind,
                                            );
                                        } }
                                        type='delete'
                                    />
                                ) : null}
                        </>
                    );
                },
            },

            {
                title:     <FormattedMessage id='employee-table.employee' />,
                dataIndex: 'name',
                width:     '20%',
                render:    (text, record) => (
                    <div>
                        <Link
                            to={ book.editEmployee.replace(':id', record.id) }
                        >{ `${record.name} ${record.surname}` }</Link>
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='status' />,
                dataIndex: 'status',
                width:     '20%',
            },
            {
                title: (
                    <FormattedMessage id='employee-table.date_administation_delay' />
                ),
                dataIndex: 'hireDate',
                width:     '15%',
                render:    (text, record) => (
                    <div>
                        <p>
                            { record.hireDate
                                ? moment(record.hireDate).format('DD.MM.YYYY')
                                : '' }
                        </p>
                        <p>-</p>
                        <p>
                            { record.fireDate
                                ? moment(record.fireDate).format('DD.MM.YYYY')
                                : '' }
                        </p>
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='employee-table.rating' />,
                dataIndex: 'rating',
                width:     '20%',
                render:    (text, record) => (
                    <div>
                        { text ? <Rate disabled defaultValue={ text } /> : '' }
                    </div>
                ),
            },
        ];
    }

    render() {
        const { employees } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={
                        employees && employees.length > 0
                            ? employees.map((task, index) => ({
                                ...task,
                                index,
                                key: v4(),
                            }))
                            : null
                    }
                    columns={ columns }
                    scroll={ { x: 700 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}
