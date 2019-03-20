// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, InputNumber, Icon, Popconfirm, Select } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import {
    DecoratedSelect,
    DecoratedAutoComplete,
    DecoratedInputNumber,
    DecoratedCheckbox,
} from 'forms/DecoratedFields';
import {
    permissions,
    isForbidden,
    numeralFormatter,
    numeralParser,
} from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
class ServicesTable extends Component {
    constructor(props) {
        super(props);

        const orderServices = props.orderServices || [];
        this.uuid = orderServices.length;

        this._handleSelectMap = {};
        this._localizationMap = {};

        const options = this._getServicesOptions();
        const employeesOptions = this._getEmployeesOptions();

        this.requiredRule = [
            {
                required: true,
                message:  this.props.intl.formatMessage({
                    id: 'required_field',
                }),
            },
        ];

        this.state = {
            keys: [ ..._.keys(orderServices), this.uuid++ ],
            options,
            employeesOptions,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(nextProps, this.props) ||
            !_.isEqual(nextState, this.state)
        );
    }

    componentDidUpdate(nextProps) {
        if (nextProps.employees !== this.props.employees) {
            const employeesOptions = this._getEmployeesOptions();
            this.setState({ employeesOptions });
        }

        if (nextProps.allServices !== this.props.allServices) {
            const options = this._getServicesOptions();
            this.setState({ options });
        }
    }

    // TODO: move into utils
    _getLocalization(key) {
        if (!this._localizationMap[ key ]) {
            this._localizationMap[ key ] = this.props.intl.formatMessage({
                id: key,
            });
        }

        return this._localizationMap[ key ];
    }

    // if ownDetail checkbox = false we look if selected client car has tecdoc id afterwards we fetch suggestions
    _onServiceSelect = (value, ownDetail) => {
        if (!ownDetail) {
            const { fields, selectedClient } = this.props;
            const id = Number(value.replace(/[^\d]/g, ''));

            const clientVehicleId = _.get(fields, 'clientVehicle');
            const vehicles = _.get(selectedClient, 'vehicles');
            if (clientVehicleId && _.isArray(vehicles)) {
                const vehicleQuery = { id: clientVehicleId };
                const vehicle = _.find(vehicles, vehicleQuery);
                const tecdocId = _.get(vehicle, 'tecdocId');
                if (tecdocId && id) {
                    this.props.fetchTecdocSuggestions(tecdocId, id);
                }
            }
        }
    };

    _getServicesOptions() {
        return _.get(this.props, 'allServices', []).map(
            ({ id, type, serviceName }, index) => (
                <Option value={ `${type}|${id}` } key={ `allServices-${index}` }>
                    { serviceName }
                </Option>
            ),
        );
    }

    _getEmployeesOptions() {
        return _.get(this.props, 'employees', []).map(employee => (
            <Option
                value={ employee.id }
                key={ `employees-${employee.id}` }
                disabled={ employee.disabled }
            >
                { `${employee.name} ${employee.surname}` }
            </Option>
        ));
    }
    //TODO: move into config
    _calculateColumns() {
        const {
            form: { getFieldDecorator },
            fields,
            user,
            errors,
        } = this.props;

        const clientVehicleId = _.get(fields, 'clientVehicle');

        const editServicesForbidden =
            isForbidden(user, permissions.ACCESS_ORDER_SERVICES) ||
            !clientVehicleId;

        const serviceSelectPlaceholder = clientVehicleId
            ? this._getLocalization('order_form_table.service.placeholder')
            : this._getLocalization(
                'order_form_table.service.no_vehicle_placeholder',
            );

        return [
            {
                title:  <FormattedMessage id='order_form_table.own_detail' />,
                key:    'ownDetail',
                render: ({ key }) => (
                    <DecoratedCheckbox
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(fields, `services[${key}].ownDetail`) }
                        initialValue={ this._getDefaultValue(key, 'ownDetail') }
                        field={ `services[${key}].ownDetail` }
                        getFieldDecorator={ getFieldDecorator }
                        disabled={ editServicesForbidden }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.service' />,
                key:    'service',
                width:  '30%',
                render: ({ key }) => {
                    if (!this._handleSelectMap[ key ]) {
                        this._handleSelectMap[ key ] = value =>
                            this._handleServiceSelect(key, value);
                    }

                    return (
                        <DecoratedAutoComplete
                            errors={ errors }
                            defaultGetValueProps
                            fieldValue={ _.get(
                                fields,
                                `services[${key}].serviceName`,
                            ) }
                            disabled={ editServicesForbidden }
                            onSelect={ value =>
                                this._onServiceSelect(
                                    value,
                                    _.get(fields, `services[${key}].ownDetail`),
                                )
                            }
                            field={ `services[${key}].serviceName` }
                            getFieldDecorator={ getFieldDecorator }
                            optionLabelProp={ 'children' }
                            optionFilterProp={ 'children' }
                            showSearch
                            cnStyles={ Styles.serviceSelect }
                            onChange={ this._handleSelectMap[ key ] }
                            initialValue={ this._getDefaultValue(
                                key,
                                'serviceName',
                            ) }
                            placeholder={ serviceSelectPlaceholder }
                            dropdownMatchSelectWidth={ false }
                            // dropdownStyle={ { width: '70%' } }
                        >
                            { this.state.options }
                        </DecoratedAutoComplete>
                    );
                },
            },
            {
                title:  <FormattedMessage id='order_form_table.prime_cost' />,
                width:  '9%',
                key:    'primeCost',
                render: ({ key }) => (
                    <DecoratedInputNumber
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(fields, `services[${key}].primeCost`) }
                        initialValue={ this._getDefaultValue(key, 'primeCost') }
                        field={ `services[${key}].primeCost` }
                        disabled={
                            this._isFieldDisabled(key) || editServicesForbidden
                        }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        min={ 0 }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.price' />,
                key:    'price',
                render: ({ key }) => (
                    <DecoratedInputNumber
                        className={ Styles.servicesRequiredFormItem }
                        formItem
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(
                            fields,
                            `services[${key}].servicePrice`,
                        ) }
                        initialValue={ _.defaultTo(
                            _.defaultTo(
                                this._getDefaultValue(key, 'servicePrice'),
                                this._getDefaultPrice(key),
                            ),
                            0,
                        ) }
                        field={ `services[${key}].servicePrice` }
                        getFieldDecorator={ getFieldDecorator }
                        rules={
                            !this._isFieldDisabled(key)
                                ? this.requiredRule
                                : void 0
                        }
                        disabled={
                            this._isFieldDisabled(key) || editServicesForbidden
                        }
                        min={ 0 }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.count' />,
                key:    'count',
                render: ({ key }) => (
                    <DecoratedInputNumber
                        formItem
                        className={ Styles.servicesRequiredFormItem }
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(
                            fields,
                            `services[${key}].serviceCount`,
                        ) }
                        initialValue={
                            this._getDefaultValue(key, 'serviceCount') || 1
                        }
                        field={ `services[${key}].serviceCount` }
                        rules={
                            !this._isFieldDisabled(key)
                                ? this.requiredRule
                                : void 0
                        }
                        getFieldDecorator={ getFieldDecorator }
                        disabled={
                            this._isFieldDisabled(key) || editServicesForbidden
                        }
                        min={ 0.1 }
                        step={ 0.1 }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.sum' />,
                key:    'sum',
                render: ({ key }) => {
                    const services = _.get(fields, 'services', []);
                    const value = (
                        _.get(services, [ key, 'servicePrice' ], 0) *
                        _.get(services, [ key, 'serviceCount' ], 1)
                    ).toFixed(2);

                    return (
                        <InputNumber
                            className={ Styles.sum }
                            disabled
                            defaultValue={ 0 }
                            value={ value }
                            formatter={ numeralFormatter }
                            parser={ numeralParser }
                        />
                    );
                },
            },
            {
                title:  <FormattedMessage id='order_form_table.master' />,
                key:    'employeeId',
                render: ({ key }) => {
                    return (
                        <DecoratedSelect
                            errors={ errors }
                            defaultGetValueProps
                            fieldValue={ _.get(
                                fields,
                                `services[${key}].employeeId`,
                            ) }
                            field={ `services[${key}].employeeId` }
                            initialValue={
                                this._getDefaultValue(key, 'employeeId') ||
                                _.get(fields, 'employee', void 0)
                            }
                            getFieldDecorator={ getFieldDecorator }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editServicesForbidden
                            }
                        >
                            { this.state.employeesOptions }
                        </DecoratedSelect>
                    );
                },
            },
            {
                title:  '',
                key:    'delete',
                render: ({ key }) => {
                    return (
                        this.state.keys.length > 1 &&
                        _.last(this.state.keys) !== key &&
                        !editServicesForbidden && (
                            <Popconfirm
                                title={
                                    <FormattedMessage id='add_order_form.delete_confirm' />
                                }
                                onConfirm={ () => this._onDelete(key) }
                            >
                                <Icon
                                    type='delete'
                                    className={ Styles.deleteIcon }
                                />
                            </Popconfirm>
                        )
                    );
                },
            },
        ];
    }

    _isFieldDisabled = key => !_.get(this.props.services, [ key, 'serviceName' ]);

    _getDefaultPrice = key => {
        const service = _.get(this.props.services, key);
        const serviceName = _.get(service, 'serviceName');
        if (!serviceName) {
            return;
        }
        const baseService = this.props.allServices.find(
            ({ serviceId, type }) => `${type}|${serviceId}` === serviceName,
        );

        return _.get(baseService, 'servicePrice');
    };

    // get default value of field
    // this method returns based on order API response ? response value : initialValue
    _getDefaultValue = (key, fieldName) => {
        const orderService = (this.props.orderServices || [])[ key ];
        const allServices = this.props.allServices;
        if (!orderService) {
            return;
        }

        const resolveServiceId = (type, serviceId, name) =>
            _.find(allServices, { type, serviceId })
                ? `${type}|${serviceId}`
                : name;

        const actions = {
            serviceName:
                orderService.type !== 'custom'
                    ? resolveServiceId(
                        orderService.type,
                        orderService.serviceId,
                        orderService.serviceName,
                    )
                    : orderService.serviceName,
            serviceCount: orderService.count,
            servicePrice: orderService.price,
            ownDetail:    orderService.ownDetail,
            employeeId:   orderService.employeeId,
        };

        return actions[ fieldName ];
    };

    _handleServiceSelect = key => {
        const { keys } = this.state;
        const services = this.props.services;

        if (_.last(keys) === key && !_.get(services, [ key, 'serviceName' ])) {
            this._handleAdd();
        }
    };

    _onDelete = redundantKey => {
        const { keys } = this.state;
        this.setState({ keys: keys.filter(key => redundantKey !== key) });
        this.props.form.setFieldsValue({
            [ `services[${redundantKey}]` ]: void 0,
        });
    };

    _handleAdd = () => {
        const { keys } = this.state;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const { keys } = this.state;
        const columns = this._calculateColumns();

        return (
            <Catcher>
                <Table
                    className={ Styles.serviceTable }
                    rowKey={ ({ key }) => key }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    pagination={ false }
                />
            </Catcher>
        );
    }
}

export default ServicesTable;
