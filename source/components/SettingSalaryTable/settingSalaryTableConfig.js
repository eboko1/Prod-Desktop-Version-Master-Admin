// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Button, Select, Input } from 'antd';
// import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import { Numeral } from 'commons';
import {
    DecoratedSelect,
    DecoratedInputNumber,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import { permissions, isForbidden } from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

/* eslint-disable complexity */
export function columnsConfig(
    user,
    saveSalary,
    formatMessage,
    getFieldDecorator,
) {
    const period = {
        title:     <FormattedMessage id='setting-salary.period' />,
        dataIndex: 'period',
        width:     '10%',
        render:    (text, record) => (
            <DecoratedSelect
                field='period'
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({ id: 'setting-salary.period' }) }
                // value={ record.period }
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
                field='startDate'
                // initialValue={ moment(startDate) }
                format='YYYY-MM-DD'
                formatMessage={ formatMessage }
                getFieldDecorator={ getFieldDecorator }
            />
        ),
    };

    const endDate = {
        title:     <FormattedMessage id='setting-salary.end_date' />,
        dataIndex: 'endDate',
        width:     '15%',
        render:    (text, record) => {
            console.log('→ record', record);

            return (
                <DecoratedDatePicker
                    field='endDate'
                    // initialValue={ moment(startDate) }
                    format='YYYY-MM-DD'
                    // getCalendarContainer={ trigger => trigger.parentNode }
                    formatMessage={ formatMessage }
                    getFieldDecorator={ getFieldDecorator }
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
                field='ratePerPeriod'
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({
                    id: 'setting-salary.ratePerPeriod',
                }) }
                min={ 0 }
                // onKeyPress={ this.handleChangeNew.bind(this, null) }
                // defaultValue={ text }
            />
        ),
    };

    const percentFrom = {
        title:     <FormattedMessage id='setting-salary.percentFrom' />,
        dataIndex: 'percentFrom',
        width:     '15%',
        render:    (text, record) => (
            <DecoratedSelect
                field='percentFrom'
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({
                    id: 'setting-salary.percentFrom',
                }) }
                // onChange={ this.handleChangeNew.bind(this, 'percentFrom') }
                // value={ record.percentFrom }
            >
                { /* eslint-disable array-element-newline */ }
                { [
                    'ORDER',
                    'ORDER_HOURS',
                    'ORDER_SERVICES',
                    'SPARE_PARTS_PROFIT',
                    'ORDER_PROFIT',
                ].map(percent => (
                    <Option value={ percent } key={ v4() }>
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
                field='percent'
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({ id: 'setting-salary.percent' }) }
                // onKeyPress={ this.handleChangeNew.bind(this, null) }
                initialValue={ data || 0 }
                min={ 0 }
                max={ 100 }
                formatter={ value => `${value}%` }
                parser={ value => value.replace('%', '') }
            />
        ),
    };

    const considerDiscount = {
        title:     <FormattedMessage id='setting-salary.considerDiscount' />,
        dataIndex: 'considerDiscount',
        width:     '15%',
        render:    (text, record) => (
            <DecoratedSelect
                field='considerDiscount'
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({
                    id: 'setting-salary.considerDiscount',
                }) }
                // onChange={ this.handleChangeNew.bind(this, 'considerDiscount') }
                // value={ record.considerDiscount }
            >
                <Option value={ Boolean(true) } key='yes'>
                    <FormattedMessage id='yes' />
                </Option>

                <Option value={ false } key='no'>
                    <FormattedMessage id='no' />
                </Option>
            </DecoratedSelect>
        ),
    };

    const actions = {
        title:  '',
        key:    'delete',
        width:  'auto',
        render: (text, record) => {
            return (
                !isForbidden(
                    user,
                    permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                ) && (
                    <Icon
                        className={ Styles.saveSalary }
                        onClick={ () => saveSalary(record, record.id) }
                        type='save'
                    />
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
