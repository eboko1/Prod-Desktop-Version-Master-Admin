// vendor
import React, { Component } from 'react';
import { Table, InputNumber, Icon, Popconfirm, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { DecoratedInput, DecoratedInputNumber } from 'forms/DecoratedFields';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { TecDocActionsContainer } from 'containers';
import { LimitedDecoratedSelect } from 'components';
import { permissions, isForbidden } from 'utils';
// own
import Styles from './styles.m.css';

const Option = Select.Option;

const extractId = (getFieldValue, name) => {
    const formId = Number(getFieldValue(name));

    return _.isFinite(formId) ? formId : null;
};

const requiredLimitedOptions = (
    form,
    formFieldName,
    entityFieldName,
    source,
    sourceFilter,
) => {
    return (
        _(form.getFieldValue('details'))
            .map(formFieldName)
            .map(name => _.find(source, { [ sourceFilter ]: Number(name) }))
            .map(entityFieldName)
            .filter(Boolean)
            .value() || []
    );
};

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

        this.columns = () => {
            const {
                form: { getFieldValue },
                form,
            } = this.props;
            const { details, brands } = this.props.allDetails;

            const { clientVehicleId, tecdocId: modificationId } = this.props;

            const editDetailsForbidden =
                isForbidden(
                    this.props.user,
                    permissions.ACCESS_ORDER_DETAILS,
                ) || !clientVehicleId;

            const defaultBrands = requiredLimitedOptions(
                form,
                'detailBrandName',
                'brandName',
                brands,
                'brandId',
            );
            const defaultDetails = requiredLimitedOptions(
                form,
                'detailName',
                'detailName',
                details,
                'detailId',
            );

            return [
                {
                    title: (
                        <FormattedMessage id='order_form_table.detail_name' />
                    ),
                    width:  '20%',
                    key:    'detail',
                    render: ({ key }) => {
                        return (
                            <LimitedDecoratedSelect
                                cnStyles={
                                    getFieldValue(
                                        `details[${key}][multipleSuggestions]`,
                                    )
                                        ? Styles.multipleSuggest
                                        : void 0
                                }
                                disabled={ editDetailsForbidden }
                                field={ `details[${key}][detailName]` }
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                                mode={ 'combobox' }
                                optionLabelProp={ 'children' }
                                showSearch
                                onChange={ value =>
                                    this._handleDetailSelect(
                                        key,
                                        value,
                                        modificationId,
                                    )
                                }
                                initialValue={ this._getDefaultValue(
                                    key,
                                    'detailName',
                                ) }
                                placeholder={
                                    <FormattedMessage id='order_form_table.detail.placeholder' />
                                }
                                dropdownMatchSelectWidth={ false }
                                dropdownStyle={ { width: '70%' } }
                                defaultValues={ defaultDetails }
                            >
                                { this.details }
                            </LimitedDecoratedSelect>
                        );
                    },
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
                                this._getDefaultValue(key, 'detailBrandName') ||
                                0
                            }
                            field={ `details[${key}][detailBrandName]` }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            showSearch
                            placeholder={
                                <FormattedMessage id='order_form_table.brand.placeholder' />
                            }
                            dropdownMatchSelectWidth={ false }
                            dropdownStyle={ { width: '35%' } }
                            defaultValues={ defaultBrands }
                        >
                            { this.brands }
                        </LimitedDecoratedSelect>
                    ),
                },
                {
                    title: (
                        <FormattedMessage id='order_form_table.detail_code' />
                    ),
                    width:  '10%',
                    key:    'code',
                    render: ({ key }) => (
                        <DecoratedInput
                            cnStyles={
                                getFieldValue(
                                    `details[${key}][multipleSuggestions]`,
                                )
                                    ? Styles.multipleSuggest
                                    : void 0
                            }
                            initialValue={ this._getDefaultValue(
                                key,
                                'detailCode',
                            ) }
                            field={ `details[${key}][detailCode]` }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />
                    ),
                },
                {
                    width:  '10%',
                    title:  <FormattedMessage id='order_form_table.suggest' />,
                    key:    'tecDocActions',
                    render: ({ key }) => {
                        const detailIdFieldName = `details[${key}][detailName]`;
                        const brandIdFieldName = `details[${key}][detailBrandName]`;

                        const detailId = extractId(
                            getFieldValue,
                            detailIdFieldName,
                        );
                        const brandId = extractId(
                            getFieldValue,
                            brandIdFieldName,
                        );

                        return (
                            <TecDocActionsContainer
                                detailId={ detailId }
                                brandId={ brandId }
                                detailCode={ getFieldValue(
                                    `details[${key}][detailCode]`,
                                ) }
                                index={ key }
                                onSelect={ (brandId, partNumber) => {
                                    const fieldsValue = {
                                        [ `details[${key}][detailCode]` ]:      partNumber,
                                        [ `details[${key}][detailBrandName]` ]: brandId
                                            ? String(brandId)
                                            : void 0,
                                    };

                                    this.props.form.setFieldsValue(fieldsValue);
                                } }
                                details={ details }
                                modificationId={ modificationId }
                                brands={ brands }
                            />
                        );
                    },
                },
                {
                    title: (
                        <FormattedMessage id='order_form_table.purchasePrice' />
                    ),
                    width:  '10%',
                    key:    'purchasePrice',
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            initialValue={ this._getDefaultValue(
                                key,
                                'purchasePrice',
                            ) }
                            field={ `details[${key}][purchasePrice]` }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
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
                    title:  <FormattedMessage id='order_form_table.price' />,
                    width:  '10%',
                    key:    'price',
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            field={ `details[${key}][detailPrice]` }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            initValue={
                                this._getDefaultValue(key, 'detailPrice') || 0
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
                    width:  '10%',
                    key:    'count',
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            field={ `details[${key}][detailCount]` }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            initValue={
                                this._getDefaultValue(key, 'detailCount') || 1
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
                    width:  '10%',
                    key:    'sum',
                    render: ({ key }) => {
                        const details = this.props.form.getFieldValue(
                            'details',
                        );
                        const value =
                            details[ key ].detailPrice * details[ key ].detailCount;

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
                    title:  '',
                    width:  '5%',
                    key:    'delete',
                    render: ({ key }) =>
                        this.state.keys.length > 1 &&
                        _.last(this.state.keys) !== key &&
                        !editDetailsForbidden && (
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
                        ),
                },
            ];
        };
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

    _handleDetailSelect = (key, value, modificationId) => {
        const { keys } = this.state;
        const formDetails = this.props.form.getFieldValue('details');

        if (_.last(keys) === key && !formDetails[ key ].detailName) {
            this._handleAdd();
        }

        const propsDetails = this.props.allDetails.details;
        const detail = _.find(propsDetails, { detailId: Number(value) });
        const productId = _.get(detail, 'productId');

        if (productId && modificationId) {
            this.props.fetchTecdocDetailsSuggestions(
                modificationId,
                productId,
                key,
            );
        }
    };

    _onDelete = redundantKey => {
        const { keys } = this.state;
        this.setState({ keys: keys.filter(key => redundantKey !== key) });
        this.props.form.setFieldsValue({
            [ `details[${redundantKey}]` ]: void 0,
        });
    };

    _handleAdd = () => {
        const { keys } = this.state;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    componentDidUpdate(prevProps) {
        const {
            form: { setFieldsValue },
        } = this.props;

        if (
            this.props.detailsSuggestions !== prevProps.detailsSuggestions &&
            this.props.detailsSuggestions.length
        ) {
            const fields = _.map(this.props.detailsSuggestions, suggestion => {
                const { key, suggestions } = suggestion;
                const config = [
                    {
                        name:  `details[${key}][detailCode]`,
                        value: _.get(suggestions, '[0].partNumber'),
                    },
                    {
                        name:  `details[${key}][detailBrandName]`,
                        value: _.get(suggestions, '[0].brandId'),
                    },
                ];

                return _(config)
                    .map(
                        ({ name, value }) =>
                            value && [ name, value ? String(value) : void 0 ],
                    )
                    .filter(Boolean)
                    .fromPairs()
                    .value();
            });

            this.props.clearTecdocDetailsSuggestions();
            setFieldsValue(_.merge(...fields));
        }

        if (
            this.props.suggestions !== prevProps.suggestions &&
            this.props.suggestions.length
        ) {
            const { keys } = this.state;
            const { suggestions } = this.props;
            const { getFieldDecorator, setFieldsValue } = this.props.form;

            if (suggestions.length) {
                const oldUuid = this.uuid - 1; // Start with -1, because of empty last row
                const newKeys = Array(suggestions.length) // generate new keys
                    .fill(oldUuid)
                    .map((value, index) => oldUuid + index);

                this.uuid += suggestions.length - 1; // -1, because of replacement of empty row
                this.setState({
                    keys: _.uniq([ ...keys, ...newKeys, this.uuid++ ]),
                }); // uniq because of intersection

                const fields = suggestions.map((suggestion, index) => {
                    const globalIndex = oldUuid + index;
                    const config = [
                        {
                            name:  `details[${globalIndex}][detailName]`,
                            value: suggestion.detailId,
                        },
                        {
                            name:  `details[${globalIndex}][detailCode]`,
                            value: _.get(suggestion, 'tecdoc[0].partNumber'),
                        },
                        {
                            name:  `details[${globalIndex}][detailBrandName]`,
                            value: _.get(suggestion, 'tecdoc[0].brandId'),
                        },
                        {
                            name:  `details[${globalIndex}][detailCount]`,
                            value: _.get(suggestion, 'quantity'),
                        },
                        {
                            name:  `details[${globalIndex}][multipleSuggestions]`,
                            value: Boolean((suggestion.tecdoc || []).length),
                        },
                    ];

                    config.forEach(
                        ({ name, value }) => value && getFieldDecorator(name),
                    );

                    return _(config)
                        .map(
                            ({ name, value }) =>
                                value && [ name, value ? String(value) : void 0 ],
                        )
                        .filter(Boolean)
                        .fromPairs()
                        .value();
                });

                this.props.clearTecdocSuggestions();
                setFieldsValue(_.merge(...fields));
            }
        }
    }

    render() {
        const { keys } = this.state;
        const columns = this.columns();

        return (
            <Catcher>
                <Table
                    loading={
                        this.props.detailsSuggestionsFetching ||
                        this.props.suggestionsFetching
                    }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    pagination={ false }
                />
            </Catcher>
        );
    }
}

export default DetailsTable;
