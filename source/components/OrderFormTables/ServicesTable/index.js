// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    Table,
    Form,
    InputNumber,
    // Input,
    Icon,
    Popconfirm,
    Select,
} from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { DecoratedSelect, DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
import {servicesStats} from "../../../forms/OrderForm/stats";
const Option = Select.Option;
const FormItem = Form.Item;

class ServicesTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='order_form_table.service' />,
                dataIndex: 'service',
                width:     '30%',
                render:    (text, record) => {
                    return (
                        <DecoratedSelect
                            field={ `services[${record.key}][serviceName]` }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            showSearch
                            cnStyles={ Styles.serviceSelect }
                            onChange={ value =>
                                this.handleServiceSelect(record.key, value)
                            }
                            onSearch={ value =>
                                this.props.onServiceSearch(value)
                            }
                            placeholder={
                                <FormattedMessage id='order_form_table.service.placeholder' />
                            }
                            dropdownMatchSelectWidth={ false }
                            dropdownStyle={ { width: '70%' } }
                        >
                            { this.props.allServices.map(
                                ({ id, type, serviceName }) => (
                                    <Option value={ `${type}|${id}` } key={ v4() }>
                                        { serviceName }
                                    </Option>
                                ),
                            ) }
                        </DecoratedSelect>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.price' />,
                dataIndex: 'price',
                render:    (text, record) => (
                    <DecoratedInputNumber
                        field={ `services[${record.key}][servicePrice]` }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        disabled={
                            !this.props.services[ record.key ].serviceName.value
                        }
                        min={ 0 }
                        // defaultValue={ record.price }
                        // onChange={ value =>
                        //     this.onCellChange(record.key, value, 'price')
                        // }
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                dataIndex: 'count',
                render:    (text, record) => (
                    <DecoratedInputNumber
                        field={ `services[${record.key}][serviceCount]` }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        disabled={
                            !this.props.services[ record.key ].serviceName.value
                        }
                        min={ 0.1 }
                        step={ 0.1 }
                        // defaultValue={ record.count }
                        // onChange={ value =>
                        //     this.onCellChange(record.key, value, 'count')
                        // }
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                dataIndex: 'sum',
                render:    (text, record) => {
                    const service = this.props.services[ record.key ];
                    const value =
                        service.servicePrice.value * service.serviceCount.value;

                    return (
                        <InputNumber
                            className={ Styles.sum }
                            disabled
                            defaultValue={ 0 }
                            value={ value ? value : 0 }
                        />
                    );
                },
            },
            {
                title:     '',
                dataIndex: 'delete',
                render:    (text, record) => {
                    const dataSource = this.props.services;

                    return dataSource[ record.key ].serviceName.value ? (
                        <Popconfirm
                            title='Sure to delete?'
                            onConfirm={ () => this.onDelete(record.key) }
                        >
                            <Icon type='delete' className={ Styles.deleteIcon } />
                        </Popconfirm>
                    ) : null;
                },
            },
        ];
    }

    handleServiceSelect = key => {
        const dataSource = { ...this.props.services };

        const emptyFields = _(dataSource)
            .values()
            .map('serviceName')
            .map('value')
            .filter(value => !value)
            .value().length;

        if (
            !emptyFields ||
            emptyFields === 1 && !dataSource[ key ].serviceName.value
        ) {
            this.handleAdd();
        }
    };

    onDelete = key => {
        const dataSource = { ...this.props.services };
        const clearedDataSource = _.pickBy(
            dataSource,
            (value, name) => name !== key,
        );
        this.props.onChangeOrderServices(clearedDataSource);
    };

    handleAdd = () => {
        const id = v4();
        // TODO move to saga
        const newData = {
            serviceName: {
                errors:     void 0,
                name:       `services[${id}][serviceName]`,
                touched:    true,
                validating: false,
                value:      void 0,
                dirty:      false,
            },
            serviceCount: {
                errors:     void 0,
                name:       `services[${id}][serviceCount]`,
                touched:    true,
                validating: false,
                value:      void 0,
                dirty:      false,
            },
            servicePrice: {
                errors:     void 0,
                name:       `services[${id}][servicePrice]`,
                touched:    true,
                validating: false,
                value:      void 0,
                dirty:      false,
            },
        };

        this.props.onChangeOrderServices({
            ...this.props.services,
            ...{ [ v4() ]: newData },
        });
    };

    // onCellChange = (key, value, dataIndex) => {
    //     const dataSource = [ ...this.state.dataSource ];
    //     console.log('→ dataSource', dataSource);
    //     const target = dataSource.find(item => item.key === key);
    //     console.log('→ target', target);
    //     if (target) {
    //         target[ dataIndex ] = value;
    //         this.setState({ dataSource });
    //     }
    // };

    render() {
        const { employees } = this.props;
        const dataSource = _(this.props.services)
            .toPairs()
            .map(([ key, value ]) => ({ ...value, key }))
            .value();

        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ dataSource }
                    columns={ columns }
                    pagination={ false }
                />
                <div className={ Styles.durationPanel }>
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.duration' />
                        }
                        className={ Styles.durationPanelItem }
                    >
                        <Select
                            defaultValue='15'
                            onChange={ value => this.handleChange(value) }
                        >
                            <Option value='15'>15</Option>
                            <Option value='30'>30</Option>
                            <Option value='45'>45</Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='order_form_table.master' />
                        }
                        className={ Styles.durationPanelItem }
                    >
                        <DecoratedSelect
                            field={ 'employee' }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        >
                            { employees.map(employee => (
                                <Option
                                    value={ employee.id }
                                    key={ v4() }
                                    disabled={ employee.disabled }
                                >
                                    { `${employee.employeeName} ${
                                        employee.employeeSurname
                                    }` }
                                </Option>
                            )) }
                        </DecoratedSelect>
                    </FormItem>
                </div>
            </Catcher>
        );
    }
}

export default ServicesTable;

/* <Select
    showSearch
    allowClear
    style={ { width: 220 } }
    onChange={ value =>
        this.handleServiceSelect(record.key, value)
    }
    placeholder={
        <FormattedMessage id='order_form_table.service.placeholder' />
    }
    dropdownMatchSelectWidth={ false }
    dropdownStyle={ { width: '70%' } }
    optionFilterProp='children'
    filterOption={ (input, option) =>
        option.props.children
            ? option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            : null
    }
>
    { this.props.allServices.map(service => (
        <Option value={ service.serviceId } key={ v4() }>
            { service.serviceName }
        </Option>
    )) }
</Select> */
