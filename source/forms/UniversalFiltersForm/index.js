// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import { Form, Row, Col, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { fetchOrders, setUniversalFilters } from 'core/orders/duck';

import {
    DecoratedSelect,
    DecoratedDatePicker,
    DecoratedInputNumber,
} from 'forms/DecoratedFields';

import { withReduxForm, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

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
        const vehiclesYears = [];
        const range = new Array(200);
        for (let i = 0; i < range.length; i++) {
            vehiclesYears.push(1900 + i);
        }

        return (
            <Form
                layout='vertical'
                onSubmit={ () => handleUniversalFiltersModalSubmit() }
            >
                <Row gutter={ 8 }>
                    <Col span={ 12 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.enrollment_date' />
                            }
                        >
                            <DecoratedDatePicker
                                field='beginDate'
                                getFieldDecorator={ getFieldDecorator }
                                formatMessage={ formatMessage }
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
                                // showTime
                                format='YYYY-MM-DD HH:mm'
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 12 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.create_date' />
                            }
                        >
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
                                <FormattedMessage id='universal_filters_form.make' />
                            }
                        >
                            <DecoratedSelect
                                field='make'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.all' />
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
                                <FormattedMessage id='universal_filters_form.models' />
                            }
                        >
                            <DecoratedSelect
                                field='models'
                                mode='multiple'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.all' />
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
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.year' />
                            }
                        >
                            <DecoratedSelect
                                field='year'
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.year' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            >
                                { vehiclesYears.map(vehiclesYear => (
                                    <Option
                                        value={ vehiclesYear }
                                        key={ v4() }
                                        name={ String(vehiclesYear) }
                                    >
                                        { vehiclesYear }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        </FormItem>
                    </Col>
                    <Col span={ 3 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.mileage_from' />
                            }
                        >
                            <DecoratedInputNumber
                                field='odometerLower'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.mileage_from' />
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
                    <Col span={ 3 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.mileage_to' />
                            }
                        >
                            <DecoratedInputNumber
                                field='odometerGreater'
                                getFieldDecorator={ getFieldDecorator }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.mileage_to' />
                                }
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={ 8 }>
                    <Col span={ 12 }>
                        { /* <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.creationReason' />
                            }
                        >
                            <DecoratedSelect
                                field='creationReason'
                                mode='multiple'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.creationReason' />
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
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.service' />
                            }
                        >
                            <DecoratedSelect
                                field='service'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.all' />
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
                                <FormattedMessage id='universal_filters_form.managers' />
                            }
                        >
                            <DecoratedSelect
                                field='managers'
                                mode='multiple'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.all' />
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
                                <FormattedMessage id='universal_filters_form.served_employee' />
                            }
                        >
                            <DecoratedSelect
                                field='employee'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.all' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                options={ employees }
                                optionValue='id'
                                optionLabel='surname'
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={ 8 }>
                    <Col span={ 6 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.number_of_visits_from' />
                            }
                        >
                            <DecoratedInputNumber
                                field='ordersGreater'
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.number_of_visits_from' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 6 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.number_of_visits_to' />
                            }
                        >
                            <DecoratedInputNumber
                                field='ordersLower'
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.number_of_visits_to' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            />
                        </FormItem>
                    </Col>
                    <Col span={ 4 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.visited' />
                            }
                        >
                            <DecoratedSelect
                                field='notVisit'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.not_selected' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            >
                                <Option
                                    value={ false }
                                    key={ v4() }
                                    name={
                                        <FormattedMessage id='universal_filters_form.visited' />
                                    }
                                >
                                    <FormattedMessage id='universal_filters_form.visited' />
                                </Option>
                                <Option
                                    value
                                    key={ v4() }
                                    name={
                                        <FormattedMessage id='universal_filters_form.not_visited' />
                                    }
                                >
                                    <FormattedMessage id='universal_filters_form.not_visited' />
                                </Option>
                            </DecoratedSelect>
                        </FormItem>
                    </Col>
                    <Col span={ 4 }>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters_form.last' />
                            }
                        >
                            <DecoratedInputNumber
                                field='notVisitDays'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters_form.last' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}
