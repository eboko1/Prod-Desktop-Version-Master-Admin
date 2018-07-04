// vendor
import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Select } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';
import moment from 'moment';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { fetchOrders, setUniversalFilters } from 'core/orders/duck';

import { DecoratedSelect, DecoratedDatePicker } from 'forms/DecoratedFields';
import { StatsCountsPanel } from 'components';
// import { UniversalFiltersForm } from 'forms';
import { withReduxForm, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;
const FormItem = Form.Item;

// const dateFormat = 'YYYY-MM-DD';

@injectIntl
@withReduxForm({
    name:    'universalFiltersForm',
    actions: {
        change: onChangeUniversalFiltersForm,
        fetchOrders,
        setUniversalFilters,
    },
})
export default class UniversalFiltersModal extends Component {
    state = {
        // Whether to apply loading visual effect for OK button or not
        confirmLoading: false,
    };

    handleChange = value => console.log('→ Select value', value);

    render() {
        const {
            show,
            visible,
            vehicleMakes,
            vehicleModels,
            managers,
            employees,
            creationReasons,
            orderComments,
            services,
            handleUniversalFiltersModalSubmit,
            setUniversalFiltersModal,
        } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const { formatMessage } = this.props.intl;

        // Parent Node which the selector should be rendered to.
        // Default to body. When position issues happen,
        // try to modify it into scrollable content and position it relative.
        // Example:
        // offical doc: https://codesandbox.io/s/4j168r7jw0
        // git issue: https://github.com/ant-design/ant-design/issues/8461
        let modalContentDivWrapper = null;

        const createSelect = (
            name,
            placeholder,
            options,
            multiple = 'default',
        ) => {
            return (
                <Select
                    showSearch
                    mode={ multiple }
                    style={ { width: 200 } }
                    placeholder={ placeholder }
                    // optionFilterProp='children'
                    getPopupContainer={ () => modalContentDivWrapper }
                    filterOption={ (input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                >
                    { options }
                </Select>
            );
        };

        return (
            <Modal
                className={ Styles.universalFiltersModal }
                width={ '80%' }
                title={ <FormattedMessage id='universal_filters' /> }
                cancelText={ <FormattedMessage id='universal_filters.cancel' /> }
                okText={ <FormattedMessage id='universal_filters.submit' /> }
                wrapClassName={ Styles.ufmoldal }
                visible={ visible }
                onOk={ () => handleUniversalFiltersModalSubmit() }
                onCancel={ () => setUniversalFiltersModal(false) }
            >
                <div
                    style={ { height: 600 } }
                    ref={ modal => {
                        modalContentDivWrapper = modal;
                    } }
                >
                    <StatsCountsPanel stats={ this.props.stats } />
                    <Form
                        layout='vertical'
                        // onSubmit={ this.handleSubmit }
                    >
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
                                getPopupContainer={ () => modalContentDivWrapper }
                                options={ vehicleMakes }
                                optionValue='makeId'
                                optionLabel='makeName'
                            />
                        </FormItem>
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
                                getPopupContainer={ () => modalContentDivWrapper }
                                options={ vehicleModels }
                                optionValue='id'
                                optionLabel='name'
                            />
                        </FormItem>
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
                                getPopupContainer={ () => modalContentDivWrapper }
                                options={ managers }
                                optionValue='id'
                                optionLabel='managerSurname'
                            />
                        </FormItem>
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
                                getPopupContainer={ () => modalContentDivWrapper }
                                options={ employees }
                                optionValue='id'
                                optionLabel='employeeSurname'
                            />
                        </FormItem>
                        <FormItem
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
                                getPopupContainer={ () => modalContentDivWrapper }
                                options={ creationReasons }
                                optionValue='creationReason'
                                optionLabel='creationReason'
                            />
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='universal_filters.service' />
                            }
                        >
                            <DecoratedSelect
                                field='creationReason'
                                mode='multiple'
                                showSearch
                                getFieldDecorator={ getFieldDecorator }
                                // style={ { width: 200 } }
                                placeholder={
                                    <FormattedMessage id='universal_filters.service' />
                                }
                                // optionFilterProp='children'
                                getPopupContainer={ () => modalContentDivWrapper }
                                options={ services }
                                optionValue='id'
                                optionLabel='serviceName'
                            />
                        </FormItem>

                        <FormItem label='beginDate'>
                            <DecoratedDatePicker
                                field='beginDate'
                                getFieldDecorator={ getFieldDecorator }
                                formatMessage={ formatMessage }
                                placeholder='boob date'
                                getCalendarContainer={ () =>
                                    modalContentDivWrapper
                                }
                                ranges={ {
                                    Today:        [ moment(), moment() ],
                                    'This Month': [ moment(), moment().endOf('month') ],
                                } }
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                            />
                        </FormItem>
                        <FormItem label='createDate'>
                            <DecoratedDatePicker
                                field='createDate'
                                getFieldDecorator={ getFieldDecorator }
                                formatMessage={ formatMessage }
                                getCalendarContainer={ () =>
                                    modalContentDivWrapper
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
                    </Form>
                </div>
            </Modal>
        );
    }
}
