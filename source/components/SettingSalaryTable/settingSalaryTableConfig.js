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
import { DecoratedSelect, DecoratedInputNumber } from 'forms/DecoratedFields';
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
    const jobTitle = {
        title:     <FormattedMessage id='setting-salary.jobTitle' />,
        dataIndex: 'jobTitle',
        width:     '7.5%',
    };

    const period = {
        title:     <FormattedMessage id='setting-salary.period' />,
        dataIndex: 'period',
        width:     '7.5%',
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
        width:     '12.5%',
        render:    (text, record) => (
            <div>
                startDate
                { /* { record.hireDate &&
                    moment(record.hireDate).format('DD.MM.YYYY') }
                { record.fireDate &&
                    ` - ${moment(record.fireDate).format('DD.MM.YYYY')}` } */ }
            </div>
        ),
    };

    const endDate = {
        title:     <FormattedMessage id='setting-salary.end_date' />,
        dataIndex: 'endDate',
        width:     '12.5%',
        render:    (text, record) => (
            <div>
                { console.log('→ record', record) }
                endDate
                { /* { record.hireDate &&
                    moment(record.hireDate).format('DD.MM.YYYY') }
                { record.fireDate &&
                    ` - ${moment(record.fireDate).format('DD.MM.YYYY')}` } */ }
            </div>
        ),
    };

    const ratePerPeriod = {
        title:     <FormattedMessage id='setting-salary.ratePerPeriod' />,
        dataIndex: 'ratePerPeriod',
        width:     '7.5%',
        render:    (text, record) => (
            <DecoratedInputNumber
                field='ratePerPeriod'
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({
                    id: 'setting-salary.ratePerPeriod',
                }) }
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
        render:    (text, record) => (
            <DecoratedInputNumber
                field='percent'
                getFieldDecorator={ getFieldDecorator }
                placeholder={ formatMessage({ id: 'setting-salary.percent' }) }
                // onKeyPress={ this.handleChangeNew.bind(this, null) }
                defaultValue={ text }
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
        width:     '12.5%',
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
                        onClick={ () => saveSalary(record, record.id) }
                        type='save'
                    />
                )
            );
        },
    };

    /* eslint-disable array-element-newline */
    return [
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
