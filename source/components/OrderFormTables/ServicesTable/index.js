// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    Table,
    Form,
    InputNumber,
    // Input,
    Icon,
    Button,
    Popconfirm,
    Select,
} from 'antd';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
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
                render:    (text, record) => (
                    <Select
                        style={ { width: 220 } }
                        onChange={ value =>
                            this.handleServiceSelect(record.key, value)
                        }
                        placeholder={
                            <FormattedMessage id='order_form_table.service.placeholder' />
                        }
                    >
                        <Option value='jack'>Jack</Option>
                        <Option value='lucy'>Lucy</Option>
                        <Option value='disabled' disabled>
                            Disabled
                        </Option>
                        <Option value='Yiminghe'>yiminghe</Option>
                    </Select>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.price' />,
                dataIndex: 'price',
                render:    (text, record) => (
                    <InputNumber
                        min={ 0 }
                        defaultValue={ record.price }
                        onChange={ value =>
                            this.onCellChange(record.key, value, 'price')
                        }
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                dataIndex: 'count',
                render:    (text, record) => (
                    <InputNumber
                        min={ 0.1 }
                        step={ 0.1 }
                        defaultValue={ record.count }
                        onChange={ value =>
                            this.onCellChange(record.key, value, 'count')
                        }
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                dataIndex: 'sum',
                render:    (text, record) => {
                    const value = record.price * record.count;

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
                    const { dataSource } = this.state;

                    return dataSource.length > 1 &&
                        dataSource.length - 1 !== dataSource.indexOf(record) ? (
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

        this.state = {
            dataSource: [
                {
                    key:     v4(),
                    service: '',
                    price:   0,
                    count:   1,
                    sum:     0,
                    delete:  '',
                },
            ],
        };
    }

    handleServiceSelect = (key, value) => {
        const dataSource = [ ...this.state.dataSource ];

        const target = dataSource.find(item => item.key === key);
        if (target) {
            if (target.service === '') {
                this.handleAdd();
            }
            target.service = value;
            this.setState({ ...dataSource });
        }
    };

    onDelete = key => {
        const dataSource = [ ...this.state.dataSource ];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key),
        });
    };

    handleAdd = () => {
        const { dataSource } = this.state;
        const newData = {
            key:     v4(),
            service: '',
            price:   0,
            count:   1,
            sum:     0,
            delete:  '',
        };
        this.setState({ dataSource: [ ...dataSource, newData ] });
    };

    onCellChange = (key, value, dataIndex) => {
        const dataSource = [ ...this.state.dataSource ];
        const target = dataSource.find(item => item.key === key);
        if (target) {
            target[ dataIndex ] = value;
            this.setState({ dataSource });
        }
    };

    handleChange = value => console.log('→ value', value);

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ dataSource }
                    columns={ columns }
                    pagination={ false }
                />
                <div className={ Styles.durationPanel }>
                    <FormItem label='Duration'>
                        <Select
                            defaultValue='lucy'
                            style={ { width: 120 } }
                            onChange={ value => this.handleChange(value) }
                        >
                            <Option value='jack'>Jack</Option>
                            <Option value='lucy'>Lucy</Option>
                            <Option value='disabled' disabled>
                                Disabled
                            </Option>
                            <Option value='Yiminghe'>yiminghe</Option>
                        </Select>
                    </FormItem>
                    <FormItem label='Master'>
                        <Select
                            defaultValue='lucy'
                            style={ { width: 120 } }
                            onChange={ value => this.handleChange(value) }
                        >
                            <Option value='jack'>Jack</Option>
                            <Option value='lucy'>Lucy</Option>
                            <Option value='disabled' disabled>
                                Disabled
                            </Option>
                            <Option value='Yiminghe'>yiminghe</Option>
                        </Select>
                    </FormItem>
                </div>
            </Catcher>
        );
    }
}

export default ServicesTable;
