// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Row, Col, Select } from 'antd';
import { v4 } from 'uuid';

import {
    DecoratedSelect,
    DecoratedDatePicker,
    DecoratedInputNumber,
} from 'forms/DecoratedFields';

import { getDaterange } from 'utils';

// own
const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
export class UniversalFiltersForm extends Component {
    render() {
        const {
            vehicleMakes,
            vehicleModels,
            managers,
            employees,
            services,
            handleUniversalFiltersModalSubmit,
        } = this.props;

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formatMessage } = this.props.intl;

        const makeId = getFieldValue('make');
        const vehiclesYears = [];
        for (let year = new Date().getFullYear(); year >= 1900; year--) {
            vehiclesYears.push(year);
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
                                    // this day
                                    [ formatMessage({
                                        id: 'datepicker.today',
                                    }) ]: getDaterange('today', 'ant'),
                                    // prev month
                                    [ formatMessage({
                                        id: 'datepicker.prev_month',
                                    }) ]: getDaterange('prevMonth', 'ant'),
                                    // prev year
                                    [ formatMessage({
                                        id: 'datepicker.prev_year',
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
                                    // this day
                                    [ formatMessage({
                                        id: 'datepicker.today',
                                    }) ]: getDaterange('today', 'ant'),
                                    // prev month
                                    [ formatMessage({
                                        id: 'datepicker.prev_month',
                                    }) ]: getDaterange('prevMonth', 'ant'),
                                    // prev year
                                    [ formatMessage({
                                        id: 'datepicker.prev_year',
                                    }) ]: getDaterange('prevYear', 'ant'),
                                } }
                                // showTime
                                format='YYYY-MM-DD HH:mm:ss'
                            />
                        </FormItem>
                    </Col>
                </Row>
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
                                { vehiclesYears
                                    .sort((a, b) => b - a)
                                    .map(year => (
                                        <Option value={ year } key={ v4() }>
                                            { String(year) }
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
                                field='odometerGreater'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={ formatMessage({
                                    id: 'universal_filters_form.mileage_from',
                                }) }
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
                                field='odometerLower'
                                getFieldDecorator={ getFieldDecorator }
                                placeholder={ formatMessage({
                                    id: 'universal_filters_form.mileage_to',
                                }) }
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={ 8 }>
                    <Col span={ 12 }>
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
                                placeholder={ formatMessage({
                                    id:
                                        'universal_filters_form.number_of_visits_from',
                                }) }
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
                                placeholder={ formatMessage({
                                    id:
                                        'universal_filters_form.number_of_visits_to',
                                }) }
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
                                placeholder={ formatMessage({
                                    id: 'universal_filters_form.last',
                                }) }
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
