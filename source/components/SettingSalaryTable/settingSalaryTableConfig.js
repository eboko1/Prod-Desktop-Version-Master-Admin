// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Row, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    DecoratedCheckbox,
    DecoratedSelect,
    DecoratedInputNumber,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

/* eslint-disable complexity */
export function columnsConfig(
    formatMessage,
    form,
    initialSettingSalaries,
    createSalary,
    updateSalary,
    deleteSalary,
    user,
) {
    const { getFieldDecorator } = form;
    const getDateTitle = (key, title) => {
        const date = _.get(initialSettingSalaries, [ key, title ]);

        return date ? moment(date) : date;
    };

    const period = {
        title:     <FormattedMessage id='setting-salary.period' />,
        dataIndex: 'period',
        width:     '15%',
        render:    (text, record) => (
            <DecoratedSelect
                field={ `settingSalaries[${record.key}][period]` }
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({ id: 'setting-salary.period' }) }
                initialValue={ _.get(initialSettingSalaries, [ record.key, 'period' ]) }
                disabled={ isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) }
            >
                { [ 'DAY', 'WEEK', 'MONTH' ].map((period, index) => (
                    <Option value={ period } key={ `${period}-${index}` }>
                        <FormattedMessage id={ period } />
                    </Option>
                )) }
            </DecoratedSelect>
        ),
    };

    const startDate = {
        title:     <FormattedMessage id='setting-salary.start_date' />,
        dataIndex: 'startDate',
        width:     '15%',
        render:    (text, record) => (
            <DecoratedDatePicker
                fields={ {} }
                field={ `settingSalaries[${record.key}][startDate]` }
                // initialValue={ moment(startDate) }
                initialValue={ getDateTitle(record.key, 'startDate') }
                format='YYYY-MM-DD'
                formatMessage={ formatMessage }
                getFieldDecorator={ getFieldDecorator }
                disabled={ isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) }
            />
        ),
    };

    const endDate = {
        title:     <FormattedMessage id='setting-salary.end_date' />,
        dataIndex: 'endDate',
        width:     '15%',
        render:    (text, record) => {
            return (
                <DecoratedDatePicker
                    fields={ {} }
                    field={ `settingSalaries[${record.key}][endDate]` }
                    initialValue={ getDateTitle(record.key, 'endDate') }
                    format='YYYY-MM-DD'
                    // getCalendarContainer={ trigger => trigger.parentNode }
                    formatMessage={ formatMessage }
                    getFieldDecorator={ getFieldDecorator }
                    disabled={ isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) }
                />
            );
        },
    };

    const ratePerPeriod = {
        title:     <FormattedMessage id='setting-salary.ratePerPeriod' />,
        dataIndex: 'ratePerPeriod',
        width:     '10%',
        render:    (text, record) => (
            <DecoratedInputNumber
                fields={ {} }
                initialValue={ _.get(initialSettingSalaries, [ record.key, 'ratePerPeriod' ]) }
                field={ `settingSalaries[${record.key}][ratePerPeriod]` }
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({
                    id: 'setting-salary.ratePerPeriod',
                }) }
                min={ 0 }
                // onKeyPress={ this.handleChangeNew.bind(this, null) }
                // defaultValue={ text }
                disabled={ isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) }
            />
        ),
    };

    const percentFrom = {
        title:     <FormattedMessage id='setting-salary.percentFrom' />,
        dataIndex: 'percentFrom',
        width:     '20%',
        render:    (text, record) => (
            <DecoratedSelect
                field={ `settingSalaries[${record.key}][percentFrom]` }
                initialValue={ _.get(initialSettingSalaries, [ record.key, 'percentFrom' ]) }
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({
                    id: 'setting-salary.percentFrom',
                }) }
                // onChange={ this.handleChangeNew.bind(this, 'percentFrom') }
                // value={ record.percentFrom }
                disabled={ isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) }
            >
                { /* eslint-disable array-element-newline */ }
                { [
                    'ORDER',
                    'ORDER_HOURS',
                    'ORDER_SERVICES',
                    'SPARE_PARTS',
                    'SPARE_PARTS_PROFIT',
                    'ORDER_PROFIT',
                ].map(percent => (
                    <Option value={ percent } key={ percent }>
                        <FormattedMessage id={ `${percent}` } />
                    </Option>
                )) }
                { /* eslint-enable array-element-newline */ }
            </DecoratedSelect>
        ),
    };

    const percent = {
        title:     <FormattedMessage id='setting-salary.percent' />,
        dataIndex: 'percent',
        width:     '10%',
        render:    (data, record) => (
            <DecoratedInputNumber
                field={ `settingSalaries[${record.key}][percent]` }
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({ id: 'setting-salary.percent' }) }
                // onKeyPress={ this.handleChangeNew.bind(this, null) }
                initialValue={ _.get(initialSettingSalaries, [ record.key, 'percent' ]) }
                min={ 0 }
                max={ 100 }
                formatter={ value => `${value}%` }
                parser={ value => value.replace('%', '') }
                disabled={ isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) }
            />
        ),
    };

    const considerDiscount = {
        title:     <FormattedMessage id='setting-salary.considerDiscount' />,
        dataIndex: 'considerDiscount',
        width:     '5%',
        render:    (text, record) => (
            <Row type='flex' align='center'>
                <DecoratedCheckbox
                    fields={ {} }
                    field={ `settingSalaries[${record.key}][considerDiscount]` }
                    getFieldDecorator={ getFieldDecorator }
                    initialValue={ _.get(initialSettingSalaries, [ record.key, 'considerDiscount' ]) }
                    disabled={ isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) }
                />
            </Row>
        ),
    };

    const actions = {
        title:  '',
        key:    'delete',
        width:  'auto',
        render: (text, record) => {
            return (
                !isForbidden(user, permissions.CREATE_EDIT_DELETE_EMPLOYEES) && 
                !isForbidden(user, permissions.ACCESS_EMPLOYEE_SALARIES_CRUD) && (
                    <div>
                        <Icon
                            className={ Styles.saveSalary }
                            onClick={ () => {
                                const entity = _.get(
                                    form.getFieldValue('settingSalaries'),
                                    record.key,
                                );
                                const salaryId = _.get(initialSettingSalaries, [ record.key, 'id' ]);

                                if (!salaryId) {
                                    createSalary(entity);
                                } else {
                                    updateSalary(salaryId, entity);
                                }
                            } }
                            type='save'
                        />
                        { _.get(initialSettingSalaries, [ record.key, 'id' ]) && (
                            <Icon
                                className={ Styles.saveSalary }
                                onClick={ () => {
                                    const salaryId = _.get(
                                        initialSettingSalaries,
                                        [ record.key, 'id' ],
                                    );

                                    if (salaryId) {
                                        deleteSalary(salaryId);
                                    }
                                } }
                                type='delete'
                            />
                        ) }
                    </div>
                )
            );
        },
    };

    /* eslint-disable array-element-newline */
    return [
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
