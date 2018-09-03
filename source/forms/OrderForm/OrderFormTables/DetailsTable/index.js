// vendor
import React, { Component } from 'react';
import { Table, InputNumber, Icon, Popconfirm, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { DecoratedInput, DecoratedInputNumber } from 'forms/DecoratedFields';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { LimitedDecoratedSelect } from 'components';
import { permissions, isForbidden } from 'utils';
// own
import Styles from './styles.m.css';
const Option = Select.Option;

class DetailsTable extends Component {
    constructor(props) {
        super(props);

        const orderDetails = props.orderDetails || [];
        this.uuid = orderDetails.length;
        this.state = {
            keys: [ ..._.keys(orderDetails), this.uuid++ ],
        };

        this.details = this.props.allDetails.details.map(
            ({ detailId, detailName }) => (
                <Option value={ String(detailId) } key={ `allDetails-${detailId}` }>
                    { detailName }
                </Option>
            ),
        );

        this.brands = this.props.allDetails.brands.map(
            ({ brandId, brandName }) => (
                <Option value={ String(brandId) } key={ `allBrands-${brandId}` }>
                    { brandName }
                </Option>
            ),
        );

        const editDetailsForbidden = isForbidden(props.user, permissions.ACCESS_ORDER_DETAILS);

        this.columns = [
            {
                title:  <FormattedMessage id='order_form_table.detail_name' />,
                width:  '25%',
                key:    'detail',
                render: ({ key }) => (
                    <LimitedDecoratedSelect
                        disabled={ editDetailsForbidden }
                        field={ `details[${key}][detailName]` }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        mode={ 'combobox' }
                        optionLabelProp={ 'children' }
                        showSearch
                        onChange={ value => this._handleDetailSelect(key, value) }
                        initialValue={ this._getDefaultValue(key, 'detailName') }
                        placeholder={
                            <FormattedMessage id='order_form_table.detail.placeholder' />
                        }
                        dropdownMatchSelectWidth={ false }
                        dropdownStyle={ { width: '70%' } }
                        defaultValues={
                            _(_(this.props).get('orderDetails'))
                                .map('detailName')
                                .value() || []
                        }
                    >
                        { this.details }
                    </LimitedDecoratedSelect>
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.brand' />,
                width:  '15%',
                key:    'brand',
                render: ({ key }) => (
                    <LimitedDecoratedSelect
                        mode={ 'combobox' }
                        optionLabelProp={ 'children' }
                        initialValue={
                            this._getDefaultValue(key, 'detailBrandName') || 0
                        }
                        field={ `details[${key}][detailBrandName]` }
                        disabled={ this._isFieldDisabled(key) || editDetailsForbidden }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        showSearch
                        placeholder={
                            <FormattedMessage id='order_form_table.brand.placeholder' />
                        }
                        dropdownMatchSelectWidth={ false }
                        dropdownStyle={ { width: '35%' } }
                        defaultValues={
                            _(_(this.props).get('orderDetails'))
                                .map('brandName')
                                .value() || []
                        }
                    >
                        { this.brands }
                    </LimitedDecoratedSelect>
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.detail_code' />,
                width:  '20%',
                key:    'code',
                render: ({ key }) => (
                    <DecoratedInput
                        initialValue={ this._getDefaultValue(key, 'detailCode') }
                        field={ `details[${key}][detailCode]` }
                        disabled={ this._isFieldDisabled(key) || editDetailsForbidden }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.purchasePrice' />,
                key:    'purchasePrice',
                width:  '20%',
                render: ({ key }) => (
                    <DecoratedInputNumber
                        initialValue={ this._getDefaultValue(
                            key,
                            'purchasePrice',
                        ) }
                        field={ `details[${key}][purchasePrice]` }
                        disabled={ this._isFieldDisabled(key) || editDetailsForbidden }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        min={ 0 }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.price' />,
                width:  '10%',
                key:    'price',
                render: ({ key }) => (
                    <DecoratedInputNumber
                        field={ `details[${key}][detailPrice]` }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        disabled={ this._isFieldDisabled(key) || editDetailsForbidden }
                        initValue={
                            this._getDefaultValue(key, 'detailPrice') || 0
                        }
                        min={ 0 }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.count' />,
                width:  '10%',
                key:    'count',
                render: ({ key }) => (
                    <DecoratedInputNumber
                        field={ `details[${key}][detailCount]` }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        disabled={ this._isFieldDisabled(key) || editDetailsForbidden }
                        initValue={
                            this._getDefaultValue(key, 'detailCount') || 1
                        }
                        min={ 0.1 }
                        step={ 0.1 }
                    />
                ),
            },
            {
                title:  <FormattedMessage id='order_form_table.sum' />,
                width:  '15%',
                key:    'sum',
                render: ({ key }) => {
                    const details = this.props.form.getFieldValue('details');
                    const value =
                        details[ key ].detailPrice * details[ key ].detailCount;

                    return (
                        <InputNumber
                            className={ Styles.sum }
                            disabled
                            defaultValue={ 0 }
                            value={ value }
                        />
                    );
                },
            },
            {
                title:  '',
                key:    'delete',
                render: ({ key }) =>
                    this.state.keys.length > 1 && !editDetailsForbidden && (
                        <Popconfirm
                            title='Sure to delete?'
                            onConfirm={ () => this._onDelete(key) }
                        >
                            <Icon type='delete' className={ Styles.deleteIcon } />
                        </Popconfirm>
                    ),
            },
        ];
    }

    _isFieldDisabled = key =>
        !_.get(this.props.form.getFieldValue('details'), [ key, 'detailName' ]);

    _getDefaultValue = (key, fieldName) => {
        const orderDetail = (this.props.orderDetails || [])[ key ];
        if (!orderDetail) {
            return;
        }

        const actions = {
            detailName:
                (orderDetail.detailId || orderDetail.detailName) &&
                String(orderDetail.detailId || orderDetail.detailName),
            detailCount:     orderDetail.count,
            detailCode:      orderDetail.detailCode,
            detailPrice:     orderDetail.price,
            purchasePrice:   orderDetail.purchasePrice,
            detailBrandName:
                (orderDetail.brandId || orderDetail.brandName) &&
                String(orderDetail.brandId || orderDetail.brandName),
        };

        return actions[ fieldName ];
    };

    _handleDetailSelect = key => {
        const { keys } = this.state;
        const details = this.props.form.getFieldValue('details');

        if (_.last(keys) === key && !details[ key ].detailName) {
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
        const { keys } = this.state;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    pagination={ false }
                />
            </Catcher>
        );
    }
}

export default DetailsTable;
