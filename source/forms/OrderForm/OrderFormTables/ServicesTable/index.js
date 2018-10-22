// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, InputNumber, Icon, Popconfirm, Select } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import {
    DecoratedSelect,
    DecoratedInputNumber,
    DecoratedCheckbox,
} from 'forms/DecoratedFields';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

class ServicesTable extends Component {
    constructor(props) {
        super(props);

        const orderServices = props.orderServices || [];
        this.uuid = orderServices.length;
        this.state = {
            keys: [ ..._.keys(orderServices), this.uuid++ ],
        };

        this.columns = () => {
            this.options = this.props.allServices.map(
                ({ id, type, serviceName }, index) => (
                    <Option
                        value={ `${type}|${id}` }
                        key={ `allServices-${index}` }
                    >
                        { serviceName }
                    </Option>
                ),
            );

            this.employees = this.props.employees.map(employee => (
                <Option
                    value={ employee.id }
                    key={ `employees-${employee.id}` }
                    disabled={ employee.disabled }
                >
                    { `${employee.name} ${employee.surname}` }
                </Option>
            ));

            const {
                form: { getFieldValue },
            } = this.props;

            const clientVehicleId = getFieldValue('clientVehicle');

            const editServicesForbidden =
                isForbidden(this.props.user, permissions.ACCESS_ORDER_SERVICES) ||
                !clientVehicleId;

            return [
                {
                    title:  <FormattedMessage id='order_form_table.service' />,
                    key:    'service',
                    width:  '30%',
                    render: ({ key }) => {
                        return (
                            <DecoratedSelect
                                disabled={ editServicesForbidden }
                                onSelect={ item => {
                                    const id = Number(
                                        item.replace(/[^\d]/g, ''),
                                    );
                                    const clientVehicleId = this.props.form.getFieldValue(
                                        'clientVehicle',
                                    );
                                    const vehicles = _.get(
                                        this.props,
                                        'selectedClient.vehicles',
                                    );

                                    if (
                                        clientVehicleId &&
                                        _.isArray(vehicles)
                                    ) {
                                        const vehicleQuery = {
                                            id: clientVehicleId,
                                        };
                                        const vehicle = _.find(
                                            vehicles,
                                            vehicleQuery,
                                        );
                                        const tecdocId = _.get(
                                            vehicle,
                                            'tecdocId',
                                        );
                                        if (tecdocId && id) {
                                            this.props.fetchTecdocSuggestions(
                                                tecdocId,
                                                id,
                                            );
                                        }
                                    }
                                } }
                                field={ `services[${key}].serviceName` }
                                getFieldDecorator={ this.props.getFieldDecorator }
                                mode={ 'combobox' }
                                optionLabelProp={ 'children' }
                                optionFilterProp={ 'children' }
                                showSearch
                                cnStyles={ Styles.serviceSelect }
                                onChange={ value =>
                                    this._handleServiceSelect(key, value)
                                }
                                initialValue={ this._getDefaultValue(
                                    key,
                                    'serviceName',
                                ) }
                                placeholder={
                                    <FormattedMessage id='order_form_table.service.placeholder' />
                                }
                                dropdownMatchSelectWidth={ false }
                                dropdownStyle={ { width: '70%' } }
                            >
                                { this.options }
                            </DecoratedSelect>
                        );
                    },
                },
                {
                    title:  <FormattedMessage id='order_form_table.price' />,
                    key:    'price',
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            initValue={
                                this._getDefaultValue(key, 'servicePrice') ||
                                this._getDefaultPrice(key) ||
                                0
                            }
                            field={ `services[${key}].servicePrice` }
                            getFieldDecorator={ this.props.getFieldDecorator }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editServicesForbidden
                            }
                            min={ 0 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    ),
                },
                {
                    title:  <FormattedMessage id='order_form_table.count' />,
                    key:    'count',
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            initValue={
                                this._getDefaultValue(key, 'serviceCount') || 1
                            }
                            field={ `services[${key}].serviceCount` }
                            getFieldDecorator={ this.props.getFieldDecorator }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editServicesForbidden
                            }
                            min={ 0.1 }
                            step={ 0.1 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    ),
                },
                {
                    title:  <FormattedMessage id='order_form_table.sum' />,
                    key:    'sum',
                    render: ({ key }) => {
                        const services = this.props.form.getFieldValue(
                            'services',
                        );
                        const value =
                            services[ key ].servicePrice *
                            services[ key ].serviceCount;

                        return (
                            <InputNumber
                                className={ Styles.sum }
                                disabled
                                defaultValue={ 0 }
                                value={ value }
                                formatter={ value =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ' ',
                                    )
                                }
                                parser={ value =>
                                    `${value}`.replace(/\$\s?|(\s)/g, '')
                                }
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
                                field={ `services[${key}].employeeId` }
                                initialValue={
                                    this._getDefaultValue(key, 'employeeId') ||
                                    this.props.form.getFieldValue('employee')
                                }
                                getFieldDecorator={ this.props.getFieldDecorator }
                                disabled={
                                    this._isFieldDisabled(key) ||
                                    editServicesForbidden
                                }
                            >
                                { this.employees }
                            </DecoratedSelect>
                        );
                    },
                },
                {
                    title: (
                        <FormattedMessage id='order_form_table.own_detail' />
                    ),
                    key:    'ownDetail',
                    render: ({ key }) => (
                        <DecoratedCheckbox
                            initValue={ this._getDefaultValue(key, 'ownDetail') }
                            field={ `services[${key}].ownDetail` }
                            getFieldDecorator={ this.props.getFieldDecorator }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editServicesForbidden
                            }
                        />
                    ),
                },
                {
                    title:  '',
                    key:    'delete',
                    render: ({ key }) => {
                        return (
                            this.state.keys.length > 1 &&
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
        };
    }

    _isFieldDisabled = key =>
        !_.get(this.props.form.getFieldValue('services'), [ key, 'serviceName' ]);

    _getDefaultPrice = key => {
        const service = this.props.form.getFieldValue(`services[${key}]`);
        const serviceName = _.get(service, 'serviceName');
        if (!serviceName) {
            return;
        }
        const baseService = this.props.allServices.find(
            ({ serviceId, type }) => `${type}|${serviceId}` === serviceName,
        );

        return _.get(baseService, 'servicePrice');
    };

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
        const services = this.props.form.getFieldValue('services');

        if (_.last(keys) === key && !services[ key ].serviceName) {
            this._handleAdd();
        }
    };

    _onDelete = redundantKey => {
        const { keys } = this.state;
        this.setState({ keys: keys.filter(key => redundantKey !== key) });
    };

    _handleAdd = () => {
        const { keys } = this.state;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        // const { getFieldDecorator, fetchedOrder } = this.props;
        const { keys } = this.state;

        // const editBodyForbidden = isForbidden(
        //     this.props.user,
        //     permissions.ACCESS_ORDER_BODY,
        // );

        const columns = this.columns();

        return (
            <Catcher>
                <Table
                    // rowKey={ v4 }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    pagination={ false }
                />
            </Catcher>
        );
    }
}

export default ServicesTable;
