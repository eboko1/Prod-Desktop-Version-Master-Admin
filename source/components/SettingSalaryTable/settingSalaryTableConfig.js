// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip, Button, Select, Input } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import { Numeral } from 'commons';
import { permissions, isForbidden } from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

/* eslint-disable complexity */
export function columnsConfig(
    user, saveSalary,
) {
    const employee = {
        title:     <FormattedMessage id='employee-table.employee' />,
        dataIndex: 'name',
        width:     '25%',
        render:    (text, record) => (
            <Link
                className={ Styles.employeeName }
                to={ book.editEmployee.replace(':id', record.id) }
            >
                { `${record.name} ${record.surname}` }
                <div className={ Styles.jobTitle }>{ record.jobTitle }</div>
            </Link>
        ),
    };

    const jobTitle = {
        title:     <FormattedMessage id='employee-table.status' />,
        dataIndex: 'jobTitle',
        width:     '20%',
    };

    const period = {
        title:     <FormattedMessage id='setting-salary.period' />,
        dataIndex: 'period',
        width:     '10%',
        render:    (text, record) => (
            <Select
                name='period'
                placeholder={ <FormattedMessage id='setting-salary.period' /> }
                // onChange={ this.handleChangeNew.bind(this, 'period') }
                // style={ { minWidth: '135px' } }
                value={ record.period }
            >
                { [ 'DAY', 'WEEK', 'MONTH' ].map((period, index) => (
                    <Option value={ period } key={ `${period}-${index}` }>
                        <FormattedMessage id={ period } />
                    </Option>
                )) }
            </Select>
        ),
    };

    const startDate = {
        title:     <FormattedMessage id='employee-table.hire_date' />,
        dataIndex: 'hireDate',
        width:     '30%',
        render:    (text, record) => (
            <div>
                { record.hireDate &&
                    moment(record.hireDate).format('DD.MM.YYYY') }
                { record.fireDate &&
                    ` - ${moment(record.fireDate).format('DD.MM.YYYY')}` }
            </div>
        ),
    };

    const endDate = {
        title:     <FormattedMessage id='employee-table.hire_date' />,
        dataIndex: 'hireDate',
        width:     '30%',
        render:    (text, record) => (
            <div>
                { record.hireDate &&
                    moment(record.hireDate).format('DD.MM.YYYY') }
                { record.fireDate &&
                    ` - ${moment(record.fireDate).format('DD.MM.YYYY')}` }
            </div>
        ),
    };

    const ratePerPeriod = {
        title:     <FormattedMessage id='setting-salary.ratePerPeriod' />,
        dataIndex: 'ratePerPeriod',
        width:     '10%',

        render: (text, record) => (
            <Input
                name='ratePerPeriod'
                placeholder={
                    <FormattedMessage id='setting-salary.ratePerPeriod' />
                }
                // onKeyPress={ this.handleChangeNew.bind(this, null) }
                defaultValue={ text }
            />
        ),
    };

    const percentFrom = {
        title:     <FormattedMessage id='setting-salary.percentFrom' />,
        dataIndex: 'percentFrom',
        width:     '10%',
        render:    (text, record) => (
            <Select
                name='percentFrom'
                placeholder={
                    <FormattedMessage id='setting-salary.percentFrom' />
                }
                // onChange={ this.handleChangeNew.bind(this, 'percentFrom') }
                style={ { minWidth: '135px' } }
                value={ record.percentFrom }
            >
                { [ 'ORDER', 'ORDER_HOURS', 'ORDER_SERVICES', 'SPARE_PARTS_PROFIT', 'ORDER_PROFIT' ].map(percent => (
                    <Option value={ percent } key={ v4() }>
                        <FormattedMessage id={ `${percent}` } />
                    </Option>
                )) }
            </Select>
        ),
    };

    const percent = {
        title:     <FormattedMessage id='setting-salary.percent' />,
        dataIndex: 'percent',
        width:     '10%',
        render:    (text, record) => (
            <Input
                name='percent'
                placeholder={ <FormattedMessage id='setting-salary.percent' /> }
                // onKeyPress={ this.handleChangeNew.bind(this, null) }
                defaultValue={ text }
            />
        ),
    };

    const considerDiscount = {
        title:     <FormattedMessage id='setting-salary.considerDiscount' />,
        dataIndex: 'considerDiscount',
        width:     '10%',
        render:    (text, record) => (
            <Select
                name='considerDiscount'
                placeholder={
                    <FormattedMessage id='setting-salary.considerDiscount' />
                }
                // onChange={ this.handleChangeNew.bind(this, 'considerDiscount') }
                value={ record.considerDiscount }
            >
                <Option value key='yes'>
                    <FormattedMessage id='yes' />
                </Option>

                <Option value={ false } key='no'>
                    <FormattedMessage id='no' />
                </Option>
            </Select>
        ),
    };

    const actions = {
        title:  '',
        key:    'delete',
        width:  'auto%',
        render: (text, record) => {
            return (
                !isForbidden(
                    user,
                    permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                ) && (
                    <Icon
                        className={ Styles.employeesTableIcon }
                        onClick={ () => saveSalary(record, record.id) }
                        type='save'
                    />
                )
            );
        },
    };

    /* eslint-disable array-element-newline */
    return [
        employee,
        jobTitle,
        period,
        startDate,
        endDate,
        ratePerPeriod,
        percentFrom,
        percent,
        considerDiscount,
        actions,
    ];
    /* eslint-enable array-element-newline */
}
