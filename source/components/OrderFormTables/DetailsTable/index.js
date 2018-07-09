// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import {
    Table,
    Form,
    Input,
    InputNumber,
    Icon,
    Popconfirm,
    Select,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import { DecoratedSelect, DecoratedInput, DecoratedInputNumber } from 'forms/DecoratedFields';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

class DetailsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                dataIndex: 'detailName',
                width:     '25%',
                render:    (text, record) => (
                    <DecoratedSelect
                        field={ `details[${record.key}][detailName]` }
                        getFieldDecorator={
                            this.props.form.getFieldDecorator
                        }
                        showSearch
                        onChange={ value =>
                            this.handleDetailSelect(record.key, value)
                        }
                        onSearch={ value =>
                            this.props.onDetailSearch(value)
                        }
                        placeholder={
                            <FormattedMessage id='order_form_table.detail.placeholder' />
                        }
                        dropdownMatchSelectWidth={ false }
                        dropdownStyle={ { width: '70%' } }
                    >
                        { this.props.filteredDetails.map(
                            ({ detailId, detailName }) => (
                                <Option value={ detailId } key={ v4() }>
                                    { detailName }
                                </Option>
                            ),
                        ) }
                    </DecoratedSelect>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                dataIndex: 'brand',
                width:     '20%',
                render:    (text, record) => (
                    <DecoratedSelect
                        field={ `details[${record.key}][detailBrandName]` }
                        getFieldDecorator={
                            this.props.form.getFieldDecorator
                        }
                        disabled={
                            !_.get(this.props.details[ record.key ], 'detailName.value')
                        }
                        showSearch
                        placeholder={
                            <FormattedMessage id='order_form_table.brand.placeholder' />
                        }
                        dropdownMatchSelectWidth={ false }
                        dropdownStyle={ { width: '35%' } }
                        onSearch={ value =>
                            this.props.onBrandSearch(value)
                        }
                    >
                        { this.props.allDetails.brands.map(
                            ({ brandId, brandName}) => (
                                <Option value={ brandId } key={ v4() }>
                                    { brandName }
                                </Option>
                            ),
                        ) }
                    </DecoratedSelect>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                dataIndex: 'detailCode',
                width:     '20%',
                render:    (text, record) => (
                    <DecoratedInput
                        field={ `details[${record.key}][detailCode]` }
                        disabled={
                            !_.get(this.props.details[ record.key ], 'detailName.value')
                        }
                        getFieldDecorator={
                            this.props.form.getFieldDecorator
                        }
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.price' />,
                dataIndex: 'price',
                width:     '10%',
                render:    (text, record) => (
                    <DecoratedInputNumber
                        field={ `details[${record.key}][detailPrice]` }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        disabled={
                            !_.get(this.props.details[ record.key ], 'detailName.value')
                        }
                        min={ 0 }
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                dataIndex: 'count',
                width:     '10%',
                render:    (text, record) => (
                    <DecoratedInputNumber
                        field={ `details[${record.key}][detailCount]` }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        disabled={
                            !_.get(this.props.details[ record.key ], 'detailName.value')
                        }
                        min={ 0.1 }
                        step={ 0.1 }
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                dataIndex: 'detailsSum',
                width:     '15%',
                render:    (text, record) => {
                    const detail = this.props.details[ record.key ];
                    const value =
                        detail.detailPrice.value * detail.detailCount.value;

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
                    const dataSource = this.props.details;

                    return _.get(dataSource[ record.key ], 'detailName.value') ? (
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

    handleDetailSelect = key => {
        const dataSource = { ...this.props.details };

        const emptyFields = _(dataSource)
            .values()
            .map('detailName')
            .map('value')
            .filter(value => !value)
            .value().length;

        if (
            !emptyFields ||
            emptyFields === 1 && !dataSource[ key ].detailName.value
        ) {
            this.handleAdd();
        }
    };

    onDelete = key => {
        const dataSource = { ...this.props.details };
        const clearedDataSource = _.pickBy(
            dataSource,
            (value, name) => name !== key,
        );
        this.props.onChangeOrderDetails(clearedDataSource);
    };

    handleAdd = () => {
        const newData = this.props.defaultDetail();

        this.props.onChangeOrderDetails({
            ...this.props.details,
            ...newData,
        });
    };

    render() {
        const dataSource = _(this.props.details)
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
            </Catcher>
        );
    }
}

export default DetailsTable;
