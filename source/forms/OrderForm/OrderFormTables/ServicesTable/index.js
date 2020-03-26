// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, InputNumber, Icon, Popconfirm, Select, Input, Button } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import {
    DecoratedInput,
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

    _laborIdToServiceName = (laborId) => {
        if(!laborId) {
            return;
        }
        const { allServices } = this.props;
        const service = allServices.find((elem)=>elem.laborId == laborId);
        return service ? service.name : laborId;
    }

    _serviceNameToLaborId = (serviceName) => {
        if(!serviceName) {
            return;
        }
        const { allServices } = this.props;
        const service = allServices.find((elem)=>elem.name == serviceName);
        return service ? service.laborId : serviceName;
    }

    _getServicesOptions() {
        return _.get(this.props, 'allServices', []).map(
            ({ laborId, masterLaborId, productId, name }, index) => (
                <Option value={ name } key={ `allServices-${index}` }>
                    { name }
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
                key:    'laborId',
                width: '0%',
                render: ({ key }) => {
                    const confirmed = this.props.orderServices.length > key && this.props.orderServices[key].agreement;
                    return (
                        <DecoratedInput
                            hiddeninput="hiddeninput"
                            errors={ errors }
                            defaultGetValueProps
                            fieldValue={ this._serviceNameToLaborId(
                                _.get(fields, `services[${key}].laborId`)
                                )
                            }
                            initialValue={ this._serviceNameToLaborId(this._getDefaultValue(key, 'laborId')) }
                            field={ `services[${key}].laborId` }
                            getFieldDecorator={ getFieldDecorator }
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id='order_form_table.own_detail' />,
                key:    'ownDetail',
                render: ({ key }) => {
                    const confirmed = this.props.orderServices.length > key && this.props.orderServices[key].agreement;
                    return (
                        <DecoratedCheckbox
                            errors={ errors }
                            defaultGetValueProps
                            fieldValue={ _.get(fields, `services[${key}].ownDetail`) }
                            initialValue={ this._getDefaultValue(key, 'ownDetail') }
                            field={ `services[${key}].ownDetail` }
                            getFieldDecorator={ getFieldDecorator }
                            disabled={ editServicesForbidden }
                        />
                    )
                }
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
                    const confirmed = this.props.orderServices.length > key && this.props.orderServices[key].agreement;
                    return (
                        <DecoratedAutoComplete
                            errors={ errors }
                            defaultGetValueProps
                            fieldValue={
                                _.get(fields, `services[${key}].serviceName`)
                            }
                            disabled={ editServicesForbidden || confirmed.length }
                            onSelect={ value => {
                                    this.props.form.setFieldsValue({
                                        [`services[${key}].serviceName`]: value,
                                        [`services[${key}].laborId`]: this._serviceNameToLaborId(value),
                                    });
                                    console.log(fields);

                                    this._onServiceSelect(
                                        value,
                                        false, //_.get(fields, `services[${key}].ownDetail`),
                                    );
                                }
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
                            )}
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
                render: ({ key }) => {
                    const confirmed = this.props.orderServices.length > key && this.props.orderServices[key].agreement;
                    const servicePrice = _.get(fields,`services[${key}].servicePrice`);
                    return (
                        <DecoratedInputNumber
                            errors={ errors }
                            defaultGetValueProps
                            fieldValue={ _.get(fields, `services[${key}].primeCost`) }
                            initialValue={ this._getDefaultValue(key, 'primeCost') }
                            field={ `services[${key}].primeCost` }
                            disabled={
                                this._isFieldDisabled(key) || editServicesForbidden || confirmed=="REJECTED"
                            }
                            getFieldDecorator={ this.props.form.getFieldDecorator }
                            min={ 0 }
                            step={0.1}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id='order_form_table.price' />,
                key:    'price',
                render: ({ key }) => {
                    const confirmed = this.props.orderServices.length > key && this.props.orderServices[key].agreement;
                    return (
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
                                this._isFieldDisabled(key) || editServicesForbidden || confirmed.length
                            }
                            min={ 0 }
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id='hours' />,
                key:    'count',
                render: ({ key }) => {
                    const confirmed = this.props.orderServices.length > key && this.props.orderServices[key].agreement;
                    return (
                        <DecoratedInputNumber
                            formItem
                            className={ Styles.servicesRequiredFormItem }
                            errors={ errors }
                            defaultGetValueProps
                            fieldValue={ _.get(
                                fields,
                                `services[${key}].serviceHours`,
                            ) }
                            initialValue={
                                this._getDefaultValue(key, 'serviceHours') || 1
                            }
                            field={ `services[${key}].serviceHours` }
                            rules={
                                !this._isFieldDisabled(key)
                                    ? this.requiredRule
                                    : void 0
                            }
                            getFieldDecorator={ getFieldDecorator }
                            disabled={
                                this._isFieldDisabled(key) || editServicesForbidden || confirmed.length
                            }
                            min={ 0.1 }
                            step={ 0.1 }
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id='order_form_table.sum' />,
                key:    'sum',
                render: ({ key }) => {
                    const services = _.get(fields, 'services', []);
                    const value = (
                        _.get(services, [ key, 'servicePrice' ], 0) *
                        _.get(services, [ key, 'serviceHours' ], 1)
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
                    const confirmed = this.props.orderServices.length > key && this.props.orderServices[key].agreement;
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
                    )
                },
            },
            {
                title:  <FormattedMessage id='order_form_table.status' />,
                key: 'agreement',
                render: ({ key }) => {
                    const confirmed = this.props.orderServices != undefined && 
                                    this.props.orderServices.length > key ? 
                                    this.props.orderServices[key].agreement.toLowerCase() : "undefined";
                    let color;
                    switch(confirmed) {
                        case "rejected":
                            color = 'rgb(255, 126, 126)';
                            break;
                        case "agreed":
                            color = 'rgb(81, 205, 102)';
                            break;
                        default:
                            color = null;
                    }
                    return (
                        <div style={{display: 'flex'}}>
                            <Input
                                disabled
                                style={{color: color}}
                                value={this.props.intl.formatMessage({
                                    id: `status.${confirmed}`,
                                })}
                            />
                            <DecoratedInput
                                hiddeninput="hiddeninput"
                                errors={ errors }
                                defaultGetValueProps
                                fieldValue={ _.get(fields, `services[${key}].agreement`) }
                                initialValue={ this._getDefaultValue(key, 'agreement') }
                                field={ `services[${key}].agreement` }
                                getFieldDecorator={ getFieldDecorator }
                            />
                        </div>
                    )
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
            (service) => service.name === serviceName,
        );
        return _.get(baseService, 'servicePrice');
    };

    // get default value of field
    // this method returns based on order API response ? response value : initialValue
    _getDefaultValue = (key, fieldName) => {
        const orderService = (this.props.orderServices || [])[ key ];
        const allServices = this.props.allServices;
        if (!orderService) {
            /*const laborId = _.get(this.props, `services[${key}].serviceName`);
            if(laborId) {
                const service = this._laborIdToServiceName(laborId);

                const actions = {
                    serviceName:  service.name,
                    serviceHours: undefined,
                    servicePrice: undefined,
                    ownDetail:    undefined,
                    employeeId:   undefined,
                    laborId:      service.laborId,
                    agreement:    "UNDEFINED",
                };
        
                return actions[ fieldName ];
            }*/
            return;
        }


        const actions = {
            serviceName:  orderService.serviceName,
            serviceHours: orderService.hours,
            servicePrice: orderService.price,
            ownDetail:    orderService.ownDetail,
            employeeId:   orderService.employeeId,
            laborId:      orderService.laborId,
            agreement:    orderService.agreement,
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
