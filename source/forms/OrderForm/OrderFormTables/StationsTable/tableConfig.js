// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Select, Popconfirm } from 'antd';
import moment from 'moment';
import _ from 'lodash';

// proj
import {
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSelect,
} from 'forms/DecoratedFields';
import { OrderStatusIcon } from 'components';

import { getDateTimeConfig } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

/* eslint-disable complexity */
export function columnsConfig(
    props,
    state,
    formatMessage,
    handleAdd,
    onDelete,
    fetchAvailableHours,
    bodyUpdateIsForbidden,
    fetchedOrder,
) {
    // console.log('→cc  props', props);

    const _getDefaultValue = (key, fieldName) => {
        const orderStationLoads = (props.stationLoads || [])[ key ];
        if (!orderStationLoads) {
            return;
        }

        const fields = {
            status:     orderStationLoads.status,
            beginDate:  moment(orderStationLoads.beginDatetime),
            beginTime:  moment(orderStationLoads.beginDatetime),
            stationNum: orderStationLoads.stationNum,
            duration:   orderStationLoads.duration,
        };

        return fields[ fieldName ];
    };

    const beginDate = props.form.getFieldValue('beginDate');

    const { disabledDate, beginTime } = getDateTimeConfig(
        moment(beginDate),
        props.schedule,
    );

    // const beginDatetime =
    //     _.get(props.fetchedOrder, 'order.beginDatetime') ||
    //     (bodyUpdateIsForbidden()
    //         ? void 0
    //         : _.get(location, 'state.beginDatetime'));
    //
    // const momentBeginDatetime = beginDatetime ? moment(beginDatetime) : void 0;

    const statusCol = {
        title:  <FormattedMessage id='status' />,
        key:    'orderStationStatus',
        width:  '15%',
        render: ({ key }) => (
            <div className={ Styles.status }>
                <OrderStatusIcon
                    status={ _getDefaultValue(key, 'status') || 'TO_DO' }
                />
                <DecoratedSelect
                    field={ `stationLoads[${key}].status` }
                    getFieldDecorator={ props.form.getFieldDecorator }
                    initialValue={ _getDefaultValue(key, 'status') || 'TO_DO' }
                >
                    <Option value='TO_DO' key='TO_DO'>
                        <FormattedMessage id='order_form_table.TO_DO' />
                    </Option>
                    <Option value='COMPLETED' key='COMPLETED'>
                        <FormattedMessage id='order_form_table.COMPLETED' />
                    </Option>
                </DecoratedSelect>
            </div>
        ),
    };

    const dateCol = {
        title:  <FormattedMessage id='date' />,
        key:    'orderStationDate',
        width:  '15%',
        render: ({ key }) => (
            <DecoratedDatePicker
                getFieldDecorator={ props.getFieldDecorator }
                field={ `stationLoads[${key}].beginDate` }
                formatMessage={ formatMessage }
                placeholder={ formatMessage({
                    id: 'add_order_form.select_date',
                }) }
                disabledDate={ disabledDate }
                format={ 'YYYY-MM-DD' } // HH:mm
                showTime={ false }
                allowClear={ false }
                initialValue={ _getDefaultValue(key, 'beginDate') }
                onChange={ value => {
                    const station = props.form.getFieldValue(
                        `stationLoads[${key}].beginDate`,
                    );
                    if (station) {
                        fetchAvailableHours(station, value);
                    }
                } }
            />
        ),
    };

    const stationCol = {
        title:  <FormattedMessage id='order_form_table.station' />,
        key:    'orderStationNum',
        width:  '15%',
        render: ({ key }) => (
            <DecoratedSelect
                field={ `stationLoads[${key}].station` }
                getFieldDecorator={ props.form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                placeholder={ formatMessage({
                    id: 'add_order_form.select_station',
                }) }
                onSelect={ value => {
                    const beginDate = props.form.getFieldValue(
                        `stationLoads[${key}].beginDate`,
                    );
                    if (beginDate) {
                        fetchAvailableHours(value, beginDate);
                    }
                } }
                disabled={ bodyUpdateIsForbidden() }
                initialValue={ _getDefaultValue(key, 'stationNum') }
            >
                { props.stations.map(({ name, num }) => {
                    return (
                        <Option value={ num } key={ String(num) }>
                            { name || String(num) }
                        </Option>
                    );
                }) }
            </DecoratedSelect>
        ),
    };

    const timeCol = {
        title:  <FormattedMessage id='time' />,
        key:    'orderStationTime',
        width:  '10%',
        render: ({ key }) => (
            <DecoratedTimePicker
                disabled={
                    bodyUpdateIsForbidden() ||
                    !props.form.getFieldValue(
                        `stationLoads[${key}].beginDate`,
                    ) ||
                    !props.form.getFieldValue(`stationLoads[${key}].station`)
                }
                defaultOpenValue={ moment(`${beginTime}:00`, 'HH:mm:ss') }
                field={ `stationLoads[${key}].beginTime` }
                disabledHours={ () => {
                    const availableHours = props.availableHours || [];

                    return _.difference(
                        Array(24)
                            .fill(1)
                            .map((value, index) => index),
                        availableHours.map(availableHour =>
                            Number(moment(availableHour).format('HH'))),
                    );
                } }
                disabledMinutes={ hour => {
                    const availableHours = props.availableHours || [];

                    const availableMinutes = availableHours
                        .map(availableHour => moment(availableHour))
                        .filter(
                            availableHour =>
                                Number(availableHour.format('HH')) === hour,
                        )
                        .map(availableHour =>
                            Number(availableHour.format('mm')));

                    return _.difference([ 0, 30 ], availableMinutes);
                } }
                formatMessage={ formatMessage }
                getFieldDecorator={ props.form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  formatMessage({
                            id: 'add_order_form.please_provide_time',
                        }),
                    },
                ] }
                placeholder={ formatMessage({
                    id: 'add_order_form.provide_time',
                }) }
                minuteStep={ 30 }
                initialValue={ _getDefaultValue(key, 'beginTime') }
                onChange={ () => handleAdd(key) }
            />
        ),
    };

    const durationCol = {
        title:  <FormattedMessage id='order_form_table.duration' />,
        key:    'orderStationDuration',
        width:  '15%',
        render: ({ key }) => (
            <DecoratedSelect
                field={ `stationLoads[${key}].duration` }
                getFieldDecorator={ props.form.getFieldDecorator }
                options={ _(Array.from(Array(9).keys()))
                    .map(option => [
                        {
                            value: option,
                        },
                        {
                            value: option + 0.5,
                        },
                    ])
                    .flatten()
                    .slice(1, length - 1)
                    .value() }
                optionValue='value'
                optionLabel='value'
                initialValue={ _getDefaultValue(key, 'duration') || 0.5 }
            />
        ),
    };

    const deleteCol = {
        title:  '',
        key:    'delete',
        width:  'auto',
        render: ({ key }) => {
            return (
                state.keys.length > 2 &&
                _.first(state.keys) !== key &&
                _.last(state.keys) !== key && (
                    <Popconfirm
                        title={
                            <FormattedMessage id='add_order_form.delete_confirm' />
                        }
                        onConfirm={ () => onDelete(key) }
                    >
                        <Icon type='delete' className={ Styles.deleteIcon } />
                    </Popconfirm>
                )
            );
        },
    };

    return [ statusCol, dateCol, stationCol, timeCol, durationCol, deleteCol ];
}
