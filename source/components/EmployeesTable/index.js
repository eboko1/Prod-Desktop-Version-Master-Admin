// vendor
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Table, Rate, Radio } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';
import book from 'routes/book';
// import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@withRouter
export default class EmployeesTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='employee-table.employee' />,
                dataIndex: 'name',
                width:     '25%',
                render:    (text, record) => (
                    <div>
                        <Link
                            className={ Styles.employeeName }
                            to={ book.editEmployee.replace(':id', record.id) }
                        >
                            { `${record.name} ${record.surname}` }
                            <div className={ Styles.jobTitle }>
                                { record.jobTitle }
                            </div>
                        </Link>
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='employee-table.status' />,
                dataIndex: 'fireDate',
                width:     '20%',
                render:    (data, record) =>
                    record.fireDate ? (
                        <div className={ Styles.fired }>
                            <FormattedMessage id='employee-table.fired' />
                            <div className={ Styles.fireReason }>
                                { record.fireReason }
                            </div>
                        </div>
                    ) : (
                        <div className={ Styles.working }>
                            <FormattedMessage id='employee-table.working' />
                        </div>
                    ),
            },
            {
                title:     <FormattedMessage id='employee-table.hire_date' />,
                dataIndex: 'hireDate',
                width:     '30%',
                render:    (text, record) => (
                    <div>
                        { record.hireDate &&
                            moment(record.hireDate).format('DD.MM.YYYY') }
                        { record.fireDate &&
                            ` - ${moment(record.fireDate).format(
                                'DD.MM.YYYY',
                            )}` }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='employee-table.rating' />,
                dataIndex: 'rating',
                width:     '20%',
                render:    value => value && this._renderRatingStars(value),
            },
            {
                title:  '',
                key:    'delete',
                width:  'auto%',
                render: () => {
                    return null;
                    // return (
                    //     !isForbidden(
                    //         this.props.user,
                    //         permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                    //     ) && (
                    //         <Icon
                    //             className={ Styles.EmployeesTableIcon }
                    //             onClick={ () => {
                    //                 this.props.deleteEmployee(
                    //                     record.id,
                    //                     this.props.kind,
                    //                 );
                    //             } }
                    //             type='delete'
                    //         />
                    //     )
                    // );
                },
            },
        ];
    }

    _setEmployeesFilterStatus = ({ status, disabled }) => {
        this.props.setEmployeesStatus({ status, disabled });
        this.props.fetchEmployees();
    };

    render() {
        const { employees } = this.props;
        const columns = this.columns;
        const statusFilter = this._renderEmployeeStatusFilter();

        return (
            <Catcher>
                { statusFilter }
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
                    scroll={ { x: 840 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }

    _renderRatingStars = rating => {
        const value = rating / 2;
        const ratingStarts = (
            <Rate
                className={ Styles.ratingStars }
                allowHalf
                disabled
                defaultValue={ value }
            />
        );

        return ratingStarts;
    };

    _renderEmployeeStatusFilter = () => {
        const { status } = this.props;

        return (
            <RadioGroup value={ status }>
                <RadioButton
                    value='all'
                    onClick={ () =>
                        this._setEmployeesFilterStatus({
                            status:   'all',
                            disabled: null,
                        })
                    }
                >
                    <FormattedMessage id='all' />
                </RadioButton>
                <RadioButton
                    value='working'
                    onClick={ () =>
                        this._setEmployeesFilterStatus({
                            status:   'working',
                            disabled: false,
                        })
                    }
                >
                    <FormattedMessage id='employee-table.filter.working' />
                </RadioButton>
                <RadioButton
                    value='fired'
                    onClick={ () =>
                        this._setEmployeesFilterStatus({
                            status:   'fired',
                            disabled: true,
                        })
                    }
                >
                    <FormattedMessage id='employee-table.filter.fired' />
                </RadioButton>
            </RadioGroup>
        );
    };
}
