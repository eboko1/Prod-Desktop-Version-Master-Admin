// vendor
import React, { Component } from "react";
import { Table, InputNumber, Icon, Popconfirm, Select } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { Catcher } from "commons";
import { TecDocActionsContainer } from "containers";
import {
    DecoratedInput,
    DecoratedInputNumber,
    LimitedDecoratedSelect,
} from "forms/DecoratedFields";
import {
    permissions,
    isForbidden,
    CachedInvoke,
    numeralFormatter,
    numeralParser,
} from "utils";

// own
import Styles from "./styles.m.css";
const Option = Select.Option;

const extractId = (details, name) => {
    const formId = Number(_.get(details, name));

    return _.isFinite(formId) ? formId : null;
};

const requiredLimitedOptions = (
    details,
    formFieldName,
    entityFieldName,
    source,
    sourceFilter,
) => {
    return (
        _(details)
            .map(formFieldName)
            .map(name => _.find(source, { [sourceFilter]: Number(name) }))
            .map(entityFieldName)
            .filter(Boolean)
            .value() || []
    );
};

@injectIntl
export default class DetailsTable extends Component {
    constructor(props) {
        super(props);

        const orderDetails = props.orderDetails || [];
        this.uuid = orderDetails.length;

        this._localizationMap = {};
        this._cachedInvoke = new CachedInvoke();

        this.state = {
            keys: [..._.keys(orderDetails), this.uuid++],
        };

        this.requiredRule = [
            {
                required: true,
                message: this.props.intl.formatMessage({
                    id: "required_field",
                }),
            },
        ];

        this.details = this.props.allDetails.details.map(
            ({ detailId, detailName }) => (
                <Option value={String(detailId)} key={`allDetails-${detailId}`}>
                    {detailName}
                </Option>
            ),
        );

        this.brands = this.props.allDetails.brands.map(
            ({ brandId, brandName }) => (
                <Option value={String(brandId)} key={`allBrands-${brandId}`}>
                    {brandName}
                </Option>
            ),
        );

        this.columns = () => {
            const { fields, errors } = this.props;
            const { details, brands } = this.props.allDetails;

            const {
                clientVehicleId,
                tecdocId: modificationId,
                details: formDetails,
            } = this.props;

            const editDetailsForbidden =
                isForbidden(
                    this.props.user,
                    permissions.ACCESS_ORDER_DETAILS,
                ) || !clientVehicleId;

            const detailSelectPlaceholder = clientVehicleId
                ? this._getLocalization("order_form_table.detail.placeholder")
                : this._getLocalization(
                      "order_form_table.detail.no_vehicle_placeholder",
                  );

            return [
                {
                    title: (
                        <FormattedMessage id="order_form_table.detail_name" />
                    ),
                    width: "20%",
                    key: "detail",
                    render: ({ key }) => {
                        const func = requiredLimitedOptions;
                        const detailArray = [
                            _.chain(formDetails)
                                .get(key)
                                .pick("detailName")
                                .value(),
                        ].filter(Boolean);
                        const args = [
                            detailArray,
                            "detailName",
                            "detailName",
                            details,
                            "detailId",
                        ];
                        const defaultDetails = this._cachedInvoke.getCachedResult(
                            func,
                            args,
                        );

                        return (
                            <LimitedDecoratedSelect
                                errors={errors}
                                defaultGetValueProps
                                fieldValue={_.get(
                                    fields,
                                    `details[${key}].detailName`,
                                )}
                                cnStyles={
                                    _.get(
                                        formDetails,
                                        `[${key}].multipleSuggestions`,
                                    )
                                        ? Styles.multipleSuggest
                                        : void 0
                                }
                                disabled={editDetailsForbidden}
                                field={`details[${key}].detailName`}
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                                optionLabelProp={"children"}
                                showSearch
                                onChange={this._cachedInvoke.getCachedResult(
                                    Function.prototype.bind,
                                    [null, key, modificationId],
                                    this._handleDetailSelect,
                                )}
                                initialValue={this._getDefaultValue(
                                    key,
                                    "detailName",
                                )}
                                placeholder={detailSelectPlaceholder}
                                dropdownMatchSelectWidth={false}
                                defaultValues={defaultDetails}
                            >
                                {this.details}
                            </LimitedDecoratedSelect>
                        );
                    },
                },
                {
                    title: <FormattedMessage id="order_form_table.brand" />,
                    width: "13%",
                    key: "brand",
                    render: ({ key }) => {
                        const func = requiredLimitedOptions;
                        const brandArray = [
                            _.chain(formDetails)
                                .get(key)
                                .pick("detailBrandName")
                                .value(),
                        ].filter(Boolean);
                        const args = [
                            brandArray,
                            "detailBrandName",
                            "brandName",
                            brands,
                            "brandId",
                        ];
                        const defaultBrands = this._cachedInvoke.getCachedResult(
                            func,
                            args,
                        );

                        return (
                            <LimitedDecoratedSelect
                                errors={errors}
                                defaultGetValueProps
                                fieldValue={_.get(
                                    fields,
                                    `details[${key}].detailBrandName`,
                                )}
                                optionLabelProp={"children"}
                                initialValue={this._getDefaultValue(
                                    key,
                                    "detailBrandName",
                                )}
                                field={`details[${key}].detailBrandName`}
                                disabled={
                                    this._isFieldDisabled(key) ||
                                    editDetailsForbidden
                                }
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                                showSearch
                                placeholder={this._getLocalization(
                                    "order_form_table.brand.placeholder",
                                )}
                                dropdownMatchSelectWidth={false}
                                // dropdownStyle={ { width: '35%' } }
                                defaultValues={defaultBrands}
                            >
                                {this.brands}
                            </LimitedDecoratedSelect>
                        );
                    },
                },
                {
                    title: (
                        <FormattedMessage id="order_form_table.detail_code" />
                    ),
                    width: "10%",
                    key: "code",
                    render: ({ key }) => (
                        <DecoratedInput
                            errors={errors}
                            defaultGetValueProps
                            fieldValue={_.get(
                                fields,
                                `details[${key}].detailCode`,
                            )}
                            cnStyles={
                                _.get(
                                    formDetails,
                                    `[${key}].multipleSuggestions`,
                                )
                                    ? Styles.multipleSuggest
                                    : void 0
                            }
                            initialValue={this._getDefaultValue(
                                key,
                                "detailCode",
                            )}
                            field={`details[${key}].detailCode`}
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
                    width: "15%",
                    title: <FormattedMessage id="order_form_table.suggest" />,
                    key: "tecDocActions",
                    render: ({ key }) => {
                        const detailIdFieldName = `[${key}].detailName`;
                        const brandIdFieldName = `[${key}].detailBrandName`;

                        const detailId = extractId(
                            formDetails,
                            detailIdFieldName,
                        );
                        const brandId = extractId(
                            formDetails,
                            brandIdFieldName,
                        );

                        return (
                            <TecDocActionsContainer
                                detailId={detailId}
                                brandId={brandId}
                                detailCode={_.get(
                                    formDetails,
                                    `[${key}].detailCode`,
                                )}
                                index={key}
                                onSelect={this._onTecdocSelect.bind(this, key)}
                                details={details}
                                modificationId={modificationId}
                                brands={brands}
                            />
                        );
                    },
                },
                {
                    title: (
                        <FormattedMessage id="order_form_table.purchasePrice" />
                    ),
                    width: "9%",
                    key: "purchasePrice",
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            errors={errors}
                            defaultGetValueProps
                            fieldValue={_.get(
                                fields,
                                `details[${key}].purchasePrice`,
                            )}
                            initialValue={this._getDefaultValue(
                                key,
                                "purchasePrice",
                            )}
                            field={`details[${key}].purchasePrice`}
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            min={0}
                            formatter={numeralFormatter}
                            parser={numeralParser}
                        />
                    ),
                },
                {
                    title: <FormattedMessage id="order_form_table.price" />,
                    width: "9%",
                    key: "price",
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            className={Styles.detailsRequiredFormItem}
                            rules={
                                !this._isFieldDisabled(key)
                                    ? this.requiredRule
                                    : void 0
                            }
                            errors={errors}
                            formItem
                            fieldValue={_.get(
                                fields,
                                `details[${key}].detailPrice`,
                            )}
                            field={`details[${key}].detailPrice`}
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            initialValue={
                                this._getDefaultValue(key, "detailPrice") || 0
                            }
                            min={0}
                            formatter={numeralFormatter}
                            parser={numeralParser}
                        />
                    ),
                },
                {
                    title: <FormattedMessage id="order_form_table.count" />,
                    width: "7.5%",
                    key: "count",
                    render: ({ key }) => (
                        <DecoratedInputNumber
                            className={Styles.detailsRequiredFormItem}
                            rules={
                                !this._isFieldDisabled(key)
                                    ? this.requiredRule
                                    : void 0
                            }
                            errors={errors}
                            formItem
                            fieldValue={_.get(
                                fields,
                                `details[${key}].detailCount`,
                            )}
                            field={`details[${key}].detailCount`}
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            disabled={
                                this._isFieldDisabled(key) ||
                                editDetailsForbidden
                            }
                            initialValue={
                                this._getDefaultValue(key, "detailCount") || 1
                            }
                            min={0.1}
                            step={0.1}
                            formatter={numeralFormatter}
                            parser={numeralParser}
                        />
                    ),
                },
                {
                    title: <FormattedMessage id="order_form_table.sum" />,
                    width: "10%",
                    key: "sum",
                    render: ({ key }) => {
                        const details = this.props.details;
                        const value = (
                            _.get(details, [key, "detailPrice"], 0) *
                            _.get(details, [key, "detailCount"], 0)
                        ).toFixed(2);

                        return (
                            <InputNumber
                                className={Styles.sum}
                                disabled
                                defaultValue={0}
                                value={value}
                                formatter={numeralFormatter}
                                parser={numeralParser}
                            />
                        );
                    },
                },
                {
                    title: "",
                    width: "auto",
                    key: "delete",
                    render: ({ key }) =>
                        this.state.keys.length > 1 &&
                        _.last(this.state.keys) !== key &&
                        !editDetailsForbidden && (
                            <Popconfirm
                                title={
                                    <FormattedMessage id="add_order_form.delete_confirm" />
                                }
                                onConfirm={() => this._onDelete(key)}
                            >
                                <Icon
                                    type="delete"
                                    className={Styles.deleteIcon}
                                />
                            </Popconfirm>
                        ),
                },
            ];
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(nextProps, this.props) ||
            !_.isEqual(nextState, this.state)
        );
    }

    componentDidUpdate(prevProps) {
        const {
            form: { setFieldsValue },
        } = this.props;

        if (
            this.props.detailsSuggestions !== prevProps.detailsSuggestions &&
            this.props.detailsSuggestions.length
        ) {
            // set detail code and brand after detail select
            const fields = _.map(this.props.detailsSuggestions, suggestion => {
                const { key, suggestions } = suggestion;
                // format to antd format
                const config = [
                    {
                        name: `details[${key}].detailCode`,
                        value: _.get(suggestions, "[0].partNumber"),
                    },
                    {
                        name: `details[${key}].detailBrandName`,
                        value: _.get(suggestions, "[0].brandId"),
                    },
                ];

                return _(config)
                    .map(
                        ({ name, value }) =>
                            value && [name, value ? String(value) : void 0],
                    )
                    .filter(Boolean)
                    .fromPairs()
                    .value();
            });
            // clear recommendation and set new values
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
                    keys: _.uniq([...keys, ...newKeys, this.uuid++]),
                }); // uniq because of intersection

                const fields = suggestions.map((suggestion, index) => {
                    const globalIndex = oldUuid + index;
                    const config = [
                        {
                            name: `details[${globalIndex}].detailName`,
                            value: suggestion.detailId,
                        },
                        {
                            name: `details[${globalIndex}].detailCode`,
                            value: _.get(suggestion, "tecdoc[0].partNumber"),
                        },
                        {
                            name: `details[${globalIndex}].detailBrandName`,
                            value: _.get(suggestion, "tecdoc[0].brandId"),
                        },
                        {
                            name: `details[${globalIndex}].detailCount`,
                            value: _.get(suggestion, "quantity"),
                        },
                        {
                            name: `details[${globalIndex}].multipleSuggestions`,
                            value: Boolean((suggestion.tecdoc || []).length),
                        },
                    ];

                    config.forEach(
                        ({ name, value }) => value && getFieldDecorator(name),
                    );

                    return _(config)
                        .map(
                            ({ name, value }) =>
                                value && [name, value ? String(value) : void 0],
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

    _getLocalization(key) {
        if (!this._localizationMap[key]) {
            this._localizationMap[key] = this.props.intl.formatMessage({
                id: key,
            });
        }

        return this._localizationMap[key];
    }

    _onTecdocSelect(key, brandId, partNumber) {
        const fieldsValue = {
            [`details[${key}].detailCode`]: partNumber,
            [`details[${key}].detailBrandName`]: brandId
                ? String(brandId)
                : void 0,
        };

        this.props.form.setFieldsValue(fieldsValue);
    }

    _getDefaultValue = (key, fieldName) => {
        const orderDetail = (this.props.orderDetails || [])[key];
        if (!orderDetail) {
            return;
        }

        const actions = {
            detailName:
                (orderDetail.detailId || orderDetail.detailName) &&
                String(orderDetail.detailId || orderDetail.detailName),
            detailCount: orderDetail.count,
            detailCode: orderDetail.detailCode,
            detailPrice: orderDetail.price,
            purchasePrice: orderDetail.purchasePrice,
            detailBrandName:
                (orderDetail.brandId || orderDetail.brandName) &&
                String(orderDetail.brandId || orderDetail.brandName),
        };

        return actions[fieldName];
    };

    _isFieldDisabled = key => {
        return !_.get(this.props.details, [key, "detailName"]);
    };

    _handleDetailSelect = (key, modificationId, value) => {
        const { keys } = this.state;
        const formDetails = this.props.details;

        if (_.last(keys) === key && !_.get(formDetails, [key, "detailName"])) {
            this._handleAdd();
        }

        const propsDetails = this.props.allDetails.details;
        const detail = _.find(propsDetails, { detailId: Number(value) });
        const productId = _.get(detail, "productId");

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
            [`details[${redundantKey}]`]: void 0,
        });
    };

    _handleAdd = () => {
        const { keys } = this.state;
        this.setState({ keys: [...keys, this.uuid++] });
    };

    render() {
        const { keys } = this.state;
        const columns = this.columns();

        return (
            <Catcher>
                <Table
                    className={Styles.detailsTable}
                    loading={
                        this.props.detailsSuggestionsFetching ||
                        this.props.suggestionsFetching
                    }
                    dataSource={keys.map(key => ({ key }))}
                    columns={columns}
                    pagination={false}
                />
            </Catcher>
        );
    }
}
