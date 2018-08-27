// vendor
import React, { Component } from 'react';
import { Table, Icon, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { v4 } from 'uuid';
import { withRouter } from 'react-router';

// proj
import { Catcher } from 'commons';
import book from 'routes/book';
import Styles from './styles.m.css';

@withRouter
class EmployeeTable extends Component {
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
                            <Link
                                to={ book.editEmployee.replace(':id', record.id) }
                            >
                                <Icon
                                    className={ Styles.employeeTableIcon }
                                    onClick={ () => {
                                        this.props.initEmployeeForm(record);
                                    } }
                                    type='edit'
                                />
                            </Link>
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
                        </>
                    );
                },
            },
            // {
            //     title:     <FormattedMessage id='employee-table.photo' />,
            //     dataIndex: 'avatar',
            //     width:     '15%',
            //     render:    (text, record) => {
            //         let avatar= text?JSON.parse(text):''
            //         console.log(avatar)

            //         return    <div><img src={ avatar?avatar.original.path:'' }></img></div>
            //     },
            // },
            {
                title:     <FormattedMessage id='employee-table.employee' />,
                dataIndex: 'name',
                width:     '20%',
                render:    (text, record) => (
                    <div>{ `${record.name} ${record.surname}` }</div>
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
                        { /* { `${record.hireDate?moment(record.hireDate).format('DD.MM.YYYY'):''}/${record.fireDate?moment(record.fireDate).format('DD.MM.YYYY'):''}` } */ }
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

export default EmployeeTable;
