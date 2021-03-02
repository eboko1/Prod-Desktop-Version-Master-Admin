// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { Select, Icon, Popconfirm } from "antd";
import _ from "lodash";
import { v4 } from "uuid";
import classNames from "classnames/bind";

// proj
import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedInputNumber,
    DecoratedTextArea,
} from "forms/DecoratedFields";
import book from "routes/book";
import { permissions, isForbidden } from "utils";

// own
import Styles from "./styles.m.css";
import {
    formVerticalLayout,
    formCommentLayout,
    fromExpandedCommentLayout,
    formRecommendationLayout,
} from "../layouts";
import { ClientsSearchTable } from "./../OrderFormTables";
const Option = Select.Option;

let cx = classNames.bind(Styles);

// TODO: @yan
// specific label name formating
function formatVehicleLabel(vehicle, formatMessage) {
    const modelPart = vehicle.model
        ? `${vehicle.make} ${vehicle.model}`
        : formatMessage({ id: "add_order_form.no_model" });
    const horsePowerLabel = !vehicle.horsePower
        ? null
        : `(${vehicle.horsePower} ${formatMessage({
              id: "horse_power",
          })})`;
    const modificationPart = [vehicle.modification, horsePowerLabel]
        .filter(Boolean)
        .join(" ");
    const parts = [
        modelPart,
        vehicle.year,
        modificationPart,
    ];

    return parts
        .filter(Boolean)
        .map(String)
        .map(_.trimEnd)
        .join(", ");
}

@injectIntl
export default class OrderFormBody extends Component {
    constructor(props) {
        super(props);

        // Constant rules, styles, props
        this.requiredFieldRules = [
            {
                required: true,
                message: this.props.intl.formatMessage({
                    id: "required_field",
                }),
            },
        ];
        this.requiredNumberFieldRules = [
            {
                type: "number",
                message: this.props.intl.formatMessage({
                    id: "required_field",
                }),
            },
        ];
        this.recommendationRules = [
            {
                max: 2000,
                message: this.props.intl.formatMessage({
                    id: "field_should_be_below_2000_chars",
                }),
            },
        ];
        this._prevRecommendationAutoSize = { minRows: 2, maxRows: 6 };
        this._recommendationAutoSize = { minRows: 2, maxRows: 6 };
        this._clientPhoneBorderStyle = { borderRadius: 0 };

        // In order to reduce <FormatMessage> invocation
        this._localizationMap = {};

        // Default select options
        const clientPhonesOptions = this._getClientPhonesOptions();
        const clientVehiclesOptions = this._getClientVehiclesOptions();

        // ClientEmail required copy button, so we need to regenerate the value
        const recommendationStyles = this._getRecommendationStyles();

        // Configure initial state
        this.state = {
            clientPhonesOptions,
            clientVehiclesOptions,
            recommendationStyles,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedClient !== this.props.selectedClient) {
            const clientPhonesOptions = this._getClientPhonesOptions();
            const clientVehiclesOptions = this._getClientVehiclesOptions();

            this.setState({
                clientPhonesOptions,
                clientVehiclesOptions,
            });
        }
        if (
            prevProps.orderId !== this.props.orderId ||
            prevProps.orderHistory !== this.props.orderHistory
        ) {
            const recommendationStyles = this._getRecommendationStyles();
            this.setState({ recommendationStyles });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(nextProps, this.props) ||
            !_.isEqual(nextState, this.state)
        );
    }

    _getRecommendationStyles() {
        const { orderId: id, orderHistory } = this.props;
        const orders = _.get(orderHistory, "orders");
        const orderIndexInHistory = _.findIndex(orders, { id });
        const prevRecommendation =
            orderIndexInHistory !== -1
                ? _.get(orderHistory, [
                      "orders",
                      orderIndexInHistory + 1,
                      "recommendation",
                  ])
                : null;

        const value = cx({
            comment: true,
            commentExtended: !prevRecommendation,
        });

        return { value, prevRecommendation };
    }

    _getClientPhonesOptions() {
        return _.get(this.props, "selectedClient.phones", [])
            .filter(Boolean)
            .map(phone => (
                <Option value={phone} key={v4()}>
                    {phone}
                </Option>
            ));
    }

    _getClientVehiclesOptions() {
        return _.get(this.props, "selectedClient.vehicles", []).map(vehicle => (
            <Option value={vehicle.id} key={v4()} disabled={vehicle.disabled}>
                {formatVehicleLabel(vehicle, this.props.intl.formatMessage)}
            </Option>
        ));
    }

    _getLocalization(key) {
        if (!this._localizationMap[key]) {
            this._localizationMap[key] = this.props.intl.formatMessage({
                id: key,
            });
        }

        return this._localizationMap[key];
    }

    bodyUpdateIsForbidden() {
        return isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);
    }

    render() {
        const clientSearch = this._renderClientSearch();
        const clientColumn = this._renderClientColumn();
        const vehicleColumn = this._renderVehicleColumn();
        const comments = this._renderCommentsBlock();
        const clientsSearchTable = this._renderClientSearchTable();

        return (
            <div className={Styles.clientBlock}>
                {clientSearch}
                {clientsSearchTable}
                <div className={Styles.clientData}>
                    {clientColumn}
                    {vehicleColumn}
                </div>
                {comments}
            </div>
        );
    }

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            setClientSelection,
            searchClientQuery,
        } = this.props;

        return (
            <ClientsSearchTable
                clientsSearching={clientsSearching}
                setClientSelection={setClientSelection}
                visible={searchClientQuery && searchClientQuery.length > 2}
                clients={clients}
            />
        );
    };

    _renderClientSearch = () => {
        const { getFieldDecorator } = this.props.form;
        const { user, fields, errors } = this.props;
        const { CREATE_EDIT_DELETE_CLIENTS } = permissions;

        const disabledClientSearch =
            (!_.get(this.props, "order.status") ||
                _.get(this.props, "order.status") !== "reserve") &&
            _.get(this.props, "order.clientId");

        return !disabledClientSearch ? (
            <div className={Styles.client}>
                <DecoratedInput
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={_.get(fields, "searchClientQuery")}
                    className={Styles.clientSearchField}
                    field="searchClientQuery"
                    formItem
                    colon={false}
                    label={this._getLocalization(
                        "add_order_form.search_client",
                    )}
                    getFieldDecorator={getFieldDecorator}
                    disabled={
                        Boolean(disabledClientSearch) ||
                        this.bodyUpdateIsForbidden()
                    }
                    placeholder={this._getLocalization(
                        "add_order_form.search_client.placeholder",
                    )}
                    ref={this.clientRef}
                />
                {!isForbidden(user, CREATE_EDIT_DELETE_CLIENTS) ? 
                    <>
                        <Icon
                            type="plus"
                            className={Styles.addClientIcon}
                            onClick={() => this.props.setAddClientModal()}
                        />
                    </>
                : null}
            </div>
        ) : null;
    };

    _renderClientColumn = () => {
        const {
            selectedClient,
            fetchedOrder,
            fields,
            clientPhone,
            errors,
            orderStatus,
            createOrder,
            createStatus,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const hasClient = clientPhone;
        return (
            <div className={Styles.bodyColumn}>
                <div className={Styles.bodyColumnContent}>
                    <div className={Styles.contentWrapper}>
                        <div className={Styles.comboFieldWrapper}>
                            <FormattedMessage id="add_order_form.client" />
                            <div className={Styles.comboField}>
                                {selectedClient.name || selectedClient.surname
                                    ? (selectedClient.surname
                                          ? selectedClient.surname + " "
                                          : "") + `${selectedClient.name}`
                                    : void 0}
                            </div>
                        </div>
                        <DecoratedSelect
                            errors={errors}
                            defaultGetValueProps
                            fieldValue={_.get(fields, "clientPhone")}
                            field="clientPhone"
                            disabled={this.bodyUpdateIsForbidden()}
                            initialValue={
                                _.get(fetchedOrder, "order.clientPhone") ||
                                (this.bodyUpdateIsForbidden()
                                    ? void 0
                                    : _.get(selectedClient, "phones[0]"))
                            }
                            formItem
                            hasFeedback
                            className={`${Styles.clientCol} ${Styles.comboFieldSelect}`}
                            colon={false}
                            rules={this.requiredFieldRules}
                            getFieldDecorator={getFieldDecorator}
                            dropdownStyle={this._clientPhoneBorderStyle}
                        >
                            {this.state.clientPhonesOptions}
                        </DecoratedSelect>
                    </div>
                    {hasClient && (
                        <div className={Styles.iconsCol}>
                            {createOrder ? (
                                <Popconfirm
                                    title={
                                        <FormattedMessage id="save_order_changes" />
                                    }
                                    onConfirm={() => {
                                        createOrder(
                                            createStatus,
                                            `${book.client}/${selectedClient.clientId}`,
                                        );
                                    }}
                                >
                                    <Link
                                        to={`${book.client}/${selectedClient.clientId}`}
                                    >
                                        <Icon
                                            type="edit"
                                            className={Styles.editIcon}
                                        />
                                    </Link>
                                </Popconfirm>
                            ) : (
                                <Link
                                    to={`${book.client}/${selectedClient.clientId}`}
                                >
                                    <Icon
                                        type="edit"
                                        className={Styles.editIcon}
                                    />
                                </Link>
                            )}
                            <CopyToClipboard text={hasClient}>
                                <Icon
                                    type="copy"
                                    theme="outlined"
                                    className={Styles.copyIcon}
                                />
                            </CopyToClipboard>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    _renderVehicleColumn = () => {
        const {
            selectedClient,
            fetchedOrder,
            fields,
            clientVehicle,
            errors,
            createOrder,
            createStatus,
            updateOrderField,
            vehicleTypes,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const selectedVehicleId = clientVehicle;
        const clientVehicleRadius = Math.round(_.get(fetchedOrder, "order.clientVehicleRadius", 0));
        const clientVehicleTypeId = _.get(fetchedOrder, "order.clientVehicleTypeId", undefined);

        const selectedVehicle =
            selectedClient &&
            selectedVehicleId &&
            _.find(selectedClient.vehicles, { id: selectedVehicleId });

        console.log(clientVehicleTypeId, this);

        return (
            <div className={Styles.bodyColumn}>
                <div className={Styles.bodyColumnContent}>
                    <div className={Styles.contentWrapper}>
                        <div className={Styles.comboFieldWrapper}>
                            <FormattedMessage id="add_order_form.car" />
                            <div className={Styles.comboField}>
                                <div>
                                    {_.get(selectedVehicle, "number") && (
                                        <div>
                                            <FormattedMessage id="add_client_form.number" />
                                            : {_.get(selectedVehicle, "number")}
                                        </div>
                                    )}
                                    {_.get(selectedVehicle, "vin") && (
                                        <div>
                                            <FormattedMessage id="add_client_form.vin" />
                                            : {_.get(selectedVehicle, "vin")}
                                        </div>
                                    )}
                                </div>
                                <div className={Styles.vehicleType}>
                                    <DecoratedSelect
                                        field="clientVehicleTypeId"
                                        showSearch
                                        fieldValue={clientVehicleTypeId}
                                        defaultGetValueProps
                                        hasFeedback
                                        onChange={(value, option)=>{
                                            updateOrderField({
                                                clientVehicleTypeId: value,
                                            })
                                        }}
                                    >
                                        {vehicleTypes.map(({ id, name, defaultRadius })=>(
                                            <Option value={id} radius={defaultRadius} key={id}>
                                                {name}
                                            </Option>
                                        ))}
                                    </DecoratedSelect>
                                </div>
                                <div className={Styles.vehicleRadius}>
                                    <Icon 
                                        type="caret-left"
                                        onClick={()=>{
                                            updateOrderField({
                                                clientVehicleRadius: clientVehicleRadius - 1
                                            })
                                        }}
                                    />
                                    {clientVehicleRadius + 'R' }
                                    <Icon
                                        type="caret-right"
                                        onClick={()=>{
                                            updateOrderField({
                                                clientVehicleRadius: clientVehicleRadius + 1
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <DecoratedSelect
                            errors={errors}
                            defaultGetValueProps
                            fieldValue={_.get(fields, "clientVehicle")}
                            field="clientVehicle"
                            disabled={this.bodyUpdateIsForbidden()}
                            initialValue={
                                _.get(fetchedOrder, "order.clientVehicleId") ||
                                (this.bodyUpdateIsForbidden()
                                    ? void 0
                                    : _.get(selectedClient, "vehicles[0].id"))
                            }
                            formItem
                            hasFeedback
                            colon={false}
                            className={Styles.comboFieldSelect}
                            getFieldDecorator={getFieldDecorator}
                            rules={this.requiredFieldRules}
                            optionDisabled="enabled"
                        >
                            {this.state.clientVehiclesOptions}
                        </DecoratedSelect>
                    </div>
                    {selectedVehicle && (
                        <div className={Styles.iconsCol}>
                            {createOrder ? (
                                <Popconfirm
                                    title={
                                        <FormattedMessage id="save_order_changes" />
                                    }
                                    onConfirm={() => {
                                        createOrder(
                                            createStatus,
                                            `${book.client}/${selectedClient.clientId}`,
                                        );
                                    }}
                                >
                                    <Link
                                        to={`${book.client}/${selectedClient.clientId}`}
                                    >
                                        <Icon
                                            type="edit"
                                            className={Styles.editIcon}
                                        />
                                    </Link>
                                </Popconfirm>
                            ) : (
                                <Link
                                    to={`${book.client}/${selectedClient.clientId}`}
                                >
                                    <Icon
                                        type="edit"
                                        className={Styles.editIcon}
                                    />
                                </Link>
                            )}
                            <CopyToClipboard
                                text={`${selectedVehicle.make} ${selectedVehicle.model}`}
                            >
                                <Icon
                                    type="copy"
                                    theme="outlined"
                                    className={Styles.copyIcon}
                                />
                            </CopyToClipboard>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    _renderCommentsBlock = () => {
        const { fetchedOrder, user, fields, errors } = this.props;
        const { ACCESS_ORDER_COMMENTS } = permissions;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={Styles.commentsBlock}>
                <DecoratedTextArea
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={_.get(fields, "comment")}
                    className={this.state.recommendationStyles.value}
                    formItem
                    formItemLayout={
                        this.state.recommendationStyles.prevRecommendation
                            ? formCommentLayout
                            : fromExpandedCommentLayout
                    }
                    colon={false}
                    label={this._getLocalization(
                        "add_order_form.client_comments",
                    )}
                    disabled={isForbidden(user, ACCESS_ORDER_COMMENTS)}
                    getFieldDecorator={getFieldDecorator}
                    field="comment"
                    initialValue={_.get(fetchedOrder, "order.comment")}
                    rules={this.recommendationRules}
                    placeholder={this._getLocalization(
                        "add_order_form.client_comments",
                    )}
                    autoSize={this._recommendationAutoSize}
                />
                {this.state.recommendationStyles.prevRecommendation && (
                    <DecoratedTextArea
                        errors={errors}
                        className={Styles.comment}
                        formItem
                        formItemLayout={formRecommendationLayout}
                        colon={false}
                        label={this._getLocalization(
                            "add_order_form.prev_order_recommendations",
                        )}
                        disabled
                        getFieldDecorator={getFieldDecorator}
                        field="prevRecommendation"
                        initialValue={
                            this.state.recommendationStyles.prevRecommendation
                        }
                        rules={this.recommendationRules}
                        placeholder={this._getLocalization(
                            "add_order_form.client_comments",
                        )}
                        autoSize={this._prevRecommendationAutoSize}
                    />
                )}
            </div>
        );
    };
}
