// vendor
import React, { Component } from 'react';
import {
    Table,
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

class ServicesTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     'service',
                dataIndex: 'service',
                width:     '30%',
                render:    (text, record) => (
                    <Select
                        style={ { width: 220 } }
                        onChange={ value => this.handleChange(value) }
                        placeholder='Select service'
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
                title:     'price',
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
                title:     'count',
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
                title:     'sum',
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
                    // return this.state.dataSource.length > 1 ? (
                    console.log('→ record', record);
                    console.log(
                        '→ this.state.dataSource.length',
                        this.state.dataSource.length,
                    );
                    const { dataSource } = this.state;

                    return dataSource.length > 1 &&
                        dataSource.length - 1 !== dataSource.indexOf(record) ? (
                        // record.key !== this.state.dataSource.length ? (
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
            // count: 1,
        };
    }

    // TODO: get back
    handleChange = value => {
        this.handleAdd();
    };

    onDelete = key => {
        const dataSource = [ ...this.state.dataSource ];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key),
        });
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key:     v4(),
            // key:     count,
            service: '',
            price:   0,
            count:   1,
            sum:     0,
            delete:  '',
        };
        this.setState({
            dataSource: [ ...dataSource, newData ],
            // count:      count + 1,
        });
    };

    onCellChange = (key, value, dataIndex) => {
        const dataSource = [ ...this.state.dataSource ];
        const target = dataSource.find(item => item.key === key);
        if (target) {
            target[ dataIndex ] = value;
            this.setState({ dataSource });
        }
    };

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;

        return (
            <Catcher>
                <Button
                    onClick={ () => this.handleAdd() }
                    type='primary'
                    style={ { marginBottom: 16 } }
                >
                    Add a row
                </Button>
                <Table
                    dataSource={ dataSource }
                    columns={ columns }
                    pagination={ false }
                />
                <div className={ Styles.durationPanel }>
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
                </div>
            </Catcher>
        );
    }
}

export default ServicesTable;
