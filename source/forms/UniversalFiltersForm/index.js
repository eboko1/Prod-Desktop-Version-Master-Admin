// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import { Form, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { fetchOrders, setUniversalFilters } from 'core/orders/duck';

import { DecoratedSelect, DecoratedDatePicker } from 'forms/DecoratedFields';

import { withReduxForm, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

@injectIntl
@withReduxForm({
    name:    'universalFiltersForm',
    actions: {
        change: onChangeUniversalFiltersForm,
        fetchOrders,
        setUniversalFilters,
    },
})
export class UniversalFiltersForm extends Component {
    render() {
        const {
            vehicleMakes,
            vehicleModels,
            managers,
            employees,
            creationReasons,
            orderComments,
            services,
            handleUniversalFiltersModalSubmit,
            // setUniversalFiltersModal,
        } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const { formatMessage } = this.props.intl;

        const makeId = _.get(this.props, 'fields.make.value');

        return (
            <Form
                layout='vertical'
                onSubmit={ () => handleUniversalFiltersModalSubmit() }
            >
                <Row gutter={ 8 }>
                    <Col span={ 12 }>
                        <FormItem label='beginDate'>
                            <DecoratedDatePicker
                                field='beginDate'
                                getFieldDecorator={ getFieldDecorator }
                                formatMessage={ formatMessage }
                                placeholder='boob date'
                                getCalendarContainer={ trigger =>
                                    trigger.parentNode
                                }
                                ranges={ {
                                    // day
                                    [ formatMessage({
                                        id: 'datepicker.today',
                                    }) ]: getDaterange('today', 'ant'),
                                    // month
                                    [ formatMessage({
                                        id: 'datepicker.month',
                                    }) ]: getDaterange('prevMonth', 'ant'),
                                    [ formatMessage({
                                        id: 'datepicker.year',
                                    }) ]: getDaterange('prevYear', 'ant'),
                                    [ formatMessage({
                                        id: 'datepicker.year',
                                    }) ]: getDaterange('prevYear', 'ant'),
                                } }
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 12 }>
                        <FormItem label='createDate'>
                            <DecoratedDatePicker
                                field='createDate'
                                getFieldDecorator={ getFieldDecorator }
                                formatMessage={ formatMessage }
                                getCalendarContainer={ trigger =>
                                    trigger.parentNode
                                }
                                ranges={ {
                                    Today:        getDaterange('today', 'ant'),
                                    'This Month': getDaterange(
                                        'prevMonth',
                                        'ant',
                                    ),
                                } }
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                            />
                        </FormItem>
                    </Col>
                </Row>
                { /* <Row gutter={ 24 }>
                    <Col span={ 12 }>
                        <FormItem label='createDate'>
                            <DecoratedDatePicker
                                field='createDate'
                                getFieldDecorator={ getFieldDecorator }
                                formatMessage={ formatMessage }
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                ranges={ {
                                    Today:        getDaterange('today', 'ant'),
                                    'This Month': getDaterange(
                                        'prevMonth',
                                        'ant',
                                    ),
                                } }
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                            />
                        </FormItem>
                    </Col>
                </Row> */ }
                <Row gutter={ 8 }>
                    <Col span={ 6 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters.make' />
                            }
                        >
                            <DecoratedSelect
                                field='make'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.make' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ vehicleMakes }
                                optionValue='makeId'
                                optionLabel='makeName'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters.model' />
                            }
                        >
                            <DecoratedSelect
                                field='models'
                                mode='multiple'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.model' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={
                                    makeId
                                        ? vehicleModels.filter(
                                            ({ makeId: modelMakeId }) =>
                                                makeId === modelMakeId,
                                        )
                                        : vehicleModels
                                }
                                optionValue='id'
                                optionLabel='name'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem label={ 'TODO: YEAR' }>
                            <DecoratedSelect
                                field='models'
                                mode='multiple'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.model' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ vehicleModels }
                                optionValue='id'
                                optionLabel='name'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem label={ 'TODO: ODOMETR' }>
                            <DecoratedSelect
                                field='services'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.service' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ services }
                                optionValue='id'
                                optionLabel='serviceName'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 2 } />
                </Row>
                <Row gutter={ 8 }>
                    <Col span={ 12 }>
                        { /* <FormItem
                            label={
                                <FormattedMessage id='universal_filters.creationReason' />
                            }
                        >
                            <DecoratedSelect
                                field='creationReason'
                                mode='multiple'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                placeholder={
                                    <FormattedMessage id='universal_filters.creationReason' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ creationReasons }
                                optionValue='creationReason'
                                optionLabel='creationReason'
                            />
                        </FormItem> */ }
                        <FormItem label={ 'ODOMETR' }>
                            <DecoratedSelect
                                field='services'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.service' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ services }
                                optionValue='id'
                                optionLabel='serviceName'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters.manager' />
                            }
                        >
                            <DecoratedSelect
                                field='manager'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.manager' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ managers }
                                optionValue='id'
                                optionLabel='managerSurname'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters.employee' />
                            }
                        >
                            <DecoratedSelect
                                field='employee'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.employee' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ employees }
                                optionValue='id'
                                optionLabel='employeeSurname'
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={ 8 }>
                    <Col span={ 12 }>
                        <FormItem label={ 'TODO: Кол-во Посещений' }>
                            <DecoratedSelect
                                field='manager'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.manager' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ managers }
                                optionValue='id'
                                optionLabel='managerSurname'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem label={ 'TODO: Посещал' }>
                            <DecoratedSelect
                                field='employee'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.employee' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ employees }
                                optionValue='id'
                                optionLabel='employeeSurname'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem label={ 'TODO: Последние' }>
                            <DecoratedSelect
                                field='employee'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.employee' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ employees }
                                optionValue='id'
                                optionLabel='employeeSurname'
                            />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}
