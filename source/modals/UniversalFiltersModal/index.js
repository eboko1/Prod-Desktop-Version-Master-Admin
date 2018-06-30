// vendor
import React, { Component } from 'react';
import { Modal, Button, Form, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { fetchOrders, setUniversalFilters } from 'core/orders/duck';

import { StatsCountsPanel } from 'components';
// import { UniversalFiltersForm } from 'forms';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;
const FormItem = Form.Item;

const dateFormat = 'YYYY-MM-DD';

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

        const createDecoratedSelectField = (
            name,
            placeholder,
            options,
            multiple,
        ) => (
            <FormItem>
                { getFieldDecorator(name)(
                    createSelect(name, placeholder, options, multiple),
                ) }
            </FormItem>
        );

        const makesOptions = vehicleMakes.map(make => (
            <Option value={ make.makeId } key={ v4() }>
                { make.makeName }
            </Option>
        ));

        const modelsOptions = vehicleModels.map(model => (
            <Option value={ model.id } key={ v4() }>
                { model.name }
            </Option>
        ));

        const managersOptions = managers.map(manager => (
            <Option value={ manager.id } key={ v4() }>
                { `${manager.managerSurname} ${manager.managerName}` }
            </Option>
        ));

        const employeesOptions = employees.map(employee => (
            <Option value={ employee.id } key={ v4() }>
                { `${employee.employeeSurname} ${employee.employeeName}` }
            </Option>
        ));

        const creationReasonsOptions = creationReasons.map(creationReason => (
            <Option value={ creationReason } key={ v4() }>
                { creationReason }
            </Option>
        ));

        const orderCommentsOptions = orderComments
            .map(
                ({ status, id, comment }) =>
                    status === 'cancel' ? (
                        <Option value={ id } key={ v4() }>
                            { comment }
                        </Option>
                    ) : 
                        false
                ,
            )
            .filter(Boolean);

        const servicesOptions = services.map(({ id, serviceName }) => (
            <Option value={ id } key={ v4() }>
                { serviceName }
            </Option>
        ));

        const createDatePicker = (name, placeholder) => getFieldDecorator(name)(
            <DatePicker
                placeholder={ placeholder }
                getPopupContainer={ () => modalContentDivWrapper }
                getCalendarContainer={ () => modalContentDivWrapper }
                format={ dateFormat }
            />,
        );

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
                        { createDecoratedSelectField(
                            'make',
                            'select make',
                            makesOptions,
                        ) }
                        { createDecoratedSelectField(
                            'models',
                            'select models',
                            modelsOptions,
                            'multiple',
                        ) }
                        { createDecoratedSelectField(
                            'managers',
                            'select managers',
                            managersOptions,
                            'multiple',
                        ) }
                        { createDecoratedSelectField(
                            'employee',
                            'select employee',
                            employeesOptions,
                        ) }
                        { createDecoratedSelectField(
                            'creationReasons',
                            'select creationReasons',
                            creationReasonsOptions,
                            'multiple',
                        ) }
                        { createDecoratedSelectField(
                            'cancelReasons',
                            'select cancelReasons',
                            orderCommentsOptions,
                            'multiple',
                        ) }
                        { createDecoratedSelectField(
                            'service',
                            'select service',
                            servicesOptions,
                        ) }

                        { createDatePicker('startDate', 'select start date') }
                        { createDatePicker('endDate', 'select end date') }
                        { createDatePicker('createStartDate', 'select create start date') }
                        { createDatePicker('createEndDate', 'select create end date') }
                    </Form>
                </div>
            </Modal>
        );
    }
}
