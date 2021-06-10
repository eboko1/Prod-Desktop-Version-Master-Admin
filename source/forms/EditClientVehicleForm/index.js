// vendor
import React, { Component } from "react";
import { List, Form, Row, Col, notification, Icon, Button, Modal, Select, Popover } from "antd";
import { injectIntl, FormattedMessage } from "react-intl";
import _ from "lodash";

// proj
import { withReduxForm2 } from "utils";
import { AddClientVehicleForm } from "forms";
import { MODALS, setModal } from "core/modals/duck";
import { DecoratedInput, DecoratedCheckbox, DecoratedSelect, DecoratedInputNumber } from "forms/DecoratedFields";
import { permissions, isForbidden } from "utils";
import { Barcode } from "components";
import {
    onChangeClientVehicleForm,
    setEditableItem,
    setEditVehicle,
    setSelectedVehicle,
    handleError,
} from "core/forms/editClientVehicleForm/duck";
import {
    createOrderForClient
} from 'core/client/duck';

// own
import Styles from "./styles.m.css";
import { ClientVehicleTransfer } from "modals";
import book from "routes/book";
import { withRouter } from "react-router-dom";

const Option = Select.Option;
const { confirm } = Modal;

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message,
        description,
    });
};

@withRouter
@injectIntl
@withReduxForm2({
    name: "clientVehicleForm",
    actions: {
        change: onChangeClientVehicleForm,
        setEditableItem,
        setEditVehicle,
        setSelectedVehicle,
        handleError,
        createOrderForClient,
        setModal
    },
    mapStateToProps: state => ({
        user: state.auth,
    }),
})
export class EditClientVehicleForm extends Component {
    constructor(props) {
        super(props);

        this.apiErrorsMap = {
            REFERENCE_VIOLATION: props.intl.formatMessage({
                id: "reference_violation",
            }),
        };
    }

    renderSubmitEditIcon = (clientId, item, index, selectedVehicle) => {
        const canBeSaved = (selectedVehicle || item).modelId;

        return canBeSaved ? (
            <Icon
                type="save"
                className={Styles.saveIcon}
                onClick={() => {
                    this.props.form.validateFields(
                        [`clientVehicles[${index}]`],
                        (err, values) => {
                            if (!err) {
                                const vehicleModelId = (selectedVehicle || item)
                                    .modelId;
                                const vehicleModificationId = (
                                    selectedVehicle || item
                                ).modificationId;

                                this.props.updateClientVehicle(
                                    item.id,
                                    clientId,
                                    {
                                        ...values.clientVehicles[index],
                                        vehicleModelId,
                                        vehicleModificationId,
                                    },
                                );

                                this.props.setEditableItem(null);
                            }
                        },
                    );
                }}
            />
        ) : null;
    };

    /**
     * When we want to create a new order for this client and use specific vehicle
     * @param {*} param0 {vehicle} //Contains vehicle entity which has to be included in a new order
     */
    onCreateOrderForClient = ({vehicle}) => {
        const {
            createOrderForClient,
            clientEntity,
            user
        } = this.props;

        createOrderForClient({
            clientId: clientEntity.clientId,
            managerId: user.id,
            vehicleId: vehicle.id
        });
    }

    render() {
        const {
            clientEntity,
            editableItem,
            editVehicle,
            clientId,
            fetchClient,
            selectedVehicle,
            errors,
            user,
            vehicleTypes,

            history,

            setSelectedVehicle,
            setEditVehicle,
            setModal,
        } = this.props;
        const { CREATE_EDIT_DELETE_CLIENTS } = permissions;
        const isEditForbidden = isForbidden(user, CREATE_EDIT_DELETE_CLIENTS);

        if (errors.length) {
            const currentComponentErrors = errors.filter(({ response }) =>
                _.keys(this.apiErrorsMap).includes(_.get(response, "message")),
            );

            currentComponentErrors.forEach(componentError => {
                const description = this.apiErrorsMap[
                    componentError.response.message
                ];

                openNotificationWithIcon(
                    "error",
                    this.props.intl.formatMessage({
                        id: "package-container.error",
                    }),
                    description,
                );
                this.props.handleError(componentError.id);
            });
        }

        const vehicleLabel = (item, index) => {
            if (selectedVehicle && index === editableItem) {
                const {
                    makeName,
                    modelName,
                    modificationName,
                } = selectedVehicle;

                return (
                    <label>
                        <s>{`${item.make} ${item.model}`}</s>{" "}
                        {`${makeName} ${modelName} ${modificationName}`}
                    </label>
                );
            }

            if (!item.model) {
                return <label>----</label>;
            }

            return (
                <label>{`${item.make} ${item.model}${
                    item.modification ? " " + item.modification : ""
                }`}</label>
            );
        };

        return (
            <List
                size="small"
                bordered
                dataSource={clientEntity.vehicles}
                className={Styles.list}
                renderItem={(item, index) => (
                    <List.Item className={Styles.listItem}>
                        <Form className={Styles.form}>
                            <Row gutter={8} type="flex" align="bottom"
                                 className={Styles.vehicleItem}
                            >
                                <Col span={4}>
                                    <a onClick={() => {history.push(`${book.vehicle}/${item.id}`)}}>
                                        {vehicleLabel(item, index)}{" "}
                                    </a>
                                    {editableItem === index && !editVehicle && (
                                        <Button
                                            icon="swap"
                                            onClick={() => setEditVehicle(true)}
                                        />
                                    )}
                                    {editableItem === index && editVehicle && (
                                        <Modal
                                            visible
                                            style={{ minWidth: "950px" }}
                                            footer={null}
                                            onCancel={() =>
                                                setEditVehicle(false)
                                            }
                                            maskClosable={false}
                                        >
                                            <AddClientVehicleForm
                                                onlyVehicles
                                                addClientVehicle={vehicle => {
                                                    setSelectedVehicle(vehicle);
                                                }}
                                                editableVehicle={item}
                                            />
                                        </Modal>
                                    )}
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={1}>
                                    <DecoratedCheckbox
                                        fields={{}}
                                        field={`clientVehicles[${index}].enabled`}
                                        initialValue={!item.disabled}
                                        disabled={editableItem !== index}
                                        getFieldDecorator={
                                            this.props.form.getFieldDecorator
                                        }
                                    />
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={3}>
                                    {editableItem === index ? (
                                        <DecoratedInput
                                            formItem
                                            className={
                                                Styles.editClientVehicleFormItem
                                            }
                                            field={`clientVehicles[${index}].vehicleNumber`}
                                            initialValue={item.number}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                "required_field",
                                                        },
                                                    ),
                                                },
                                            ]}
                                            hasFeedback
                                            getFieldDecorator={
                                                this.props.form
                                                    .getFieldDecorator
                                            }
                                        />
                                    ) : (
                                        item.number
                                    )}
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={4}>
                                    {editableItem === index ? (
                                        <DecoratedInput
                                            fields={{}}
                                            className={
                                                Styles.editClientVehicleFormItem
                                            }
                                            formItem
                                            field={`clientVehicles[${index}].vehicleVin`}
                                            initialValue={item.vin}
                                            getFieldDecorator={
                                                this.props.form
                                                    .getFieldDecorator
                                            }
                                        />
                                    ) : (
                                        item.vin
                                    )}
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                {vehicleTypes &&
                                    <Col span={3}>
                                        {editableItem === index ? (
                                            <DecoratedSelect
                                                fields={{}}
                                                field={`clientVehicles[${index}].vehicleTypeId`}
                                                showSearch
                                                formItem
                                                initialValue={item.vehicleTypeId}
                                                getFieldDecorator={
                                                    this.props.form
                                                        .getFieldDecorator
                                                }
                                                placeholder={
                                                    <FormattedMessage id="tire.vehicleType" />
                                                }
                                                className={
                                                    Styles.editClientVehicleFormItem
                                                }
                                            >
                                                {vehicleTypes.map(({ id, name, defaultRadius })=>(
                                                    <Option value={id} radius={defaultRadius} key={id}>
                                                        {name}
                                                    </Option>
                                                ))}
                                            </DecoratedSelect>
                                        ) : (
                                            item.vehicleTypeName
                                        )}
                                    </Col>
                                }
                                {vehicleTypes &&
                                    <Col span={2}>
                                        {editableItem === index ? (
                                            <DecoratedInputNumber
                                                formItem
                                                className={
                                                    Styles.editClientVehicleFormItem
                                                }
                                                field={`clientVehicles[${index}].wheelRadius`}
                                                initialValue={item.wheelRadius}
                                                getFieldDecorator={
                                                    this.props.form
                                                        .getFieldDecorator
                                                }
                                                formatter={ value => `${Math.round(value)}R` }
                                                parser={ value => value.replace('R', '') }
                                                min={0}
                                            />
                                        ) : (
                                            item.wheelRadius ? item.wheelRadius + 'R' : null
                                        )}
                                    </Col>
                                }
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={3}>
                                    {editableItem === index ? (
                                        <div style={{display: "flex", alignItems: "center"}}>
                                        <DecoratedInput
                                            disabled
                                            className={
                                                Styles.editClientVehicleFormItem
                                            }
                                            field={`clientVehicles[${index}].barcode`}
                                            initialValue={item.barcode}
                                            hasFeedback
                                            getFieldDecorator={
                                                this.props.form
                                                    .getFieldDecorator
                                            }
                                        />
                                        <Barcode
                                            value={item.barcode}
                                            referenceId={item.id}
                                            table={'CLIENTS_VEHICLES'}
                                            prefix={'CVH'}
                                            iconStyle={{
                                                fontSize: 24,
                                                marginLeft: 4,
                                            }}
                                            onConfirm={()=>{
                                                fetchClient(clientId)
                                            }}
                                        />
                                        </div>
                                    ) : (
                                        item.barcode && 
                                        <Barcode
                                            value={item.barcode}
                                            iconStyle={{
                                                fontSize: 24
                                            }}
                                        />
                                    )}
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={1}>
                                    {!isEditForbidden ? (
                                        editableItem === index ? (
                                            this.renderSubmitEditIcon(
                                                clientId,
                                                item,
                                                index,
                                                selectedVehicle,
                                            )
                                        ) : (
                                            <Icon
                                                type="edit"
                                                className={Styles.editIcon}
                                                onClick={() => {
                                                        console.log("Here: ", item);
                                                        setModal(MODALS.VEHICLE, {mode: "EDIT", vehicleId: item.id});
                                                    }
                                                    // this.props.setEditableItem(
                                                    //     index,
                                                    // )
                                                }
                                            />
                                        )
                                    ) : null}
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={1}>
                                    {!isForbidden(user, permissions.ACCESS_CLIENTS_VEHICLE_TRANSFER) && !isEditForbidden ? (
                                        <ClientVehicleTransfer
                                            clientId={clientId}
                                            vehicleId={item.id}
                                            vehicles={clientEntity.vehicles}
                                        />
                                    ) : null}
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={1}>
                                    {!isEditForbidden ? (
                                        <Icon
                                            type="delete"
                                            className={Styles.deleteIcon}
                                            onClick={() =>
                                                this.props.deleteClientVehicle(
                                                    clientId,
                                                    item.id,
                                                )
                                            }
                                        />
                                    ) : null}
                                </Col>
                                {/* --------------------------------------------------------------------------- */}
                                <Col span={1}>
                                    <Popover content={<FormattedMessage id="client_page.hint_create_order_with_client_and_vehicle"/>}>
                                        <Button
                                            type="primary"
                                            onClick={() => this.onCreateOrderForClient({vehicle: item})}//Call with current vehicle
                                            disabled={ isForbidden(user, permissions.CREATE_ORDER) }

                                        >
                                            <Icon type="plus" className={Styles.newOrderIcon}/>
                                        </Button>
                                    </Popover>
                                </Col>
                            </Row>
                        </Form>
                    </List.Item>
                )}
            />
        );
    }
}