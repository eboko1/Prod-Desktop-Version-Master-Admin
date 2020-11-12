// vendor
import React, { Component } from "react";
import { List, Form, Row, Col, notification, Icon, Button, Modal, Select } from "antd";
import { injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { withReduxForm2 } from "utils";
import { AddClientVehicleForm } from "forms";
import { DecoratedInput, DecoratedCheckbox } from "forms/DecoratedFields";
import {
    onChangeClientVehicleForm,
    setEditableItem,
    setEditVehicle,
    setSelectedVehicle,
    handleError,
} from "core/forms/editClientVehicleForm/duck";
import { permissions, isForbidden } from "utils";

// own
import Styles from "./styles.m.css";
const Option = Select.Option;

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message,
        description,
    });
};

@injectIntl
@withReduxForm2({
    name: "clientVehicleForm",
    actions: {
        change: onChangeClientVehicleForm,
        setEditableItem,
        setEditVehicle,
        setSelectedVehicle,
        handleError,
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

    render() {
        const {
            clientEntity,
            editableItem,
            editVehicle,
            clientId,
            selectedVehicle,
            errors,
            user,

            setSelectedVehicle,
            setEditVehicle,
        } = this.props;
        console.log(this);
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
                        <Form>
                            <Row gutter={8} type="flex" align="bottom">
                                <Col span={8}>
                                    {vehicleLabel(item, index)}{" "}
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
                                <Col span={2}>
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
                                <Col span={4}>
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
                                <Col span={3}>
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
                                                onClick={() =>
                                                    this.props.setEditableItem(
                                                        index,
                                                    )
                                                }
                                            />
                                        )
                                    ) : null}
                                </Col>
                                <Col span={3}>
                                    {!isEditForbidden && editableItem != index ? (
                                        <ClientVehicleTransfer
                                            clientId={clientId}
                                            vehicleId={item.id}
                                            vehicles={clientEntity.vehicles}
                                        />
                                    ) : null}
                                </Col>
                                <Col span={3}>
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
                            </Row>
                        </Form>
                    </List.Item>
                )}
            />
        );
    }
}

class ClientVehicleTransfer extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            clients: [],
            clientId: undefined,
            newOwnerId: undefined,
            vehicles: [],
            vehicleId: undefined,
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            visible: false,
            clients: [],
            newOwnerId: undefined,
            newOwnerId: undefined,
            vehicles: [],
            vehicleId: undefined,
        })
    }

    handleOk = () => {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/clients/vehicles/${this.state.vehicleId}`;
        fetch(url, {
            method: "PUT",
            headers: {
                Authorization: token,
            },
            body: JSON.stringify({clientId: this.state.newOwnerId})
        })
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }
            return Promise.resolve(response);
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            window.location.reload();
        })
        .catch(function(error) {
            console.log("error", error);
        });
        this.handleCancel();
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/clients`;
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        })
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }
            return Promise.resolve(response);
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            that.setState({
                clients: data.clients,
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    render() {
        const { visible, clients, vehicles, newOwnerId, clientId, vehicleId } = this.state;
        return (
            <>
                <Icon
                    type="sync"
                    className={Styles.carTransferIcon}
                    onClick={() => {
                        this.setState({
                            visible: true,
                            clientId: Number(this.props.clientId),
                            vehicleId: Number(this.props.vehicleId),
                            vehicles: this.props.vehicles,
                        });
                        this.fetchData();
                    }}
                />
                <Modal
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    style={{
                        minWidth: 640
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div style={{width: '50%'}}>
                            <span style={{fontWeight: 500}}>От</span>
                            <Select
                                showSearch
                                value={clientId}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                optionFilterProp={"children"}
                                onChange={(value, option)=>{
                                    this.setState({
                                        clientId: value,
                                        vehicles: option.props.vehicles,
                                        vehicleId: option.props.vehicles.length ? option.props.vehicles[0] : undefined,
                                    })
                                }}
                            >
                                {
                                    clients.map(({clientId, name, surname, phones, vehicles}, key)=>
                                        <Option value={clientId} key={key} vehicles={vehicles}>
                                            {name} {surname} {phones[0]}
                                        </Option>
                                    )    
                                }
                            </Select>
                            <Select
                                showSearch
                                value={vehicleId}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                onChange={(value, option)=>{
                                    this.setState({
                                        vehicleId: value,
                                    })
                                }}
                            >
                                {
                                    vehicles.map(({id, make, model}, key)=>
                                        <Option value={id} key={key}>
                                            {make} {model}
                                        </Option>
                                    )    
                                }
                            </Select>
                        </div>
                        <div style={{width: '50%'}}>
                            <span style={{fontWeight: 500}}>Кому</span>
                            <Select
                                showSearch
                                value={newOwnerId}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                onChange={(value, option)=>{
                                    this.setState({
                                        newOwnerId: value,
                                    })
                                }}
                            >
                                {
                                    clients.map(({clientId, name, surname, phones}, key)=>
                                        <Option value={clientId} key={key}>
                                            {name} {surname} {phones[0]}
                                        </Option>
                                    )    
                                }
                            </Select>
                        </div>
                    </div>
                </Modal>
            </>
        )
    }
}