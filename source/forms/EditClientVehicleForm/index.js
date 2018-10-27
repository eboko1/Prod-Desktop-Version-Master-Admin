// vendor
import React, { Component } from 'react';
import { List, Form, Row, Col, notification, Icon, Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { withReduxForm2 } from 'utils';
import { AddClientVehicleForm } from 'forms';
import { DecoratedInput, DecoratedCheckbox } from 'forms/DecoratedFields';
import {
    onChangeClientVehicleForm,
    setEditableItem,
    setEditVehicle,
    setSelectedVehicle,
    handleError,
} from 'core/forms/editClientVehicleForm/duck';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';

const openNotificationWithIcon = (type, message, description) => {
    notification[ type ]({
        message,
        description,
    });
};

@injectIntl
@withReduxForm2({
    name:    'clientVehicleForm',
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
                id: 'reference_violation',
            }),
        };
    }

    renderSubmitEditIcon = (clientId, item, index, selectedVehicle) => {
        const canBeSaved = (selectedVehicle || item).modelId;

        return canBeSaved ? (
            <Icon
                type='save'
                className={ Styles.saveIcon }
                onClick={ () => {
                    this.props.form.validateFields(
                        [ `clientVehicles[${index}]` ],
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
                                        ...values.clientVehicles[ index ],
                                        vehicleModelId,
                                        vehicleModificationId,
                                    },
                                );

                                this.props.setEditableItem(null);
                            }
                        },
                    );
                } }
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
        const { CREATE_EDIT_DELETE_CLIENTS } = permissions;
        const isEditForbidden = isForbidden(user, CREATE_EDIT_DELETE_CLIENTS);

        if (errors.length) {
            const currentComponentErrors = errors.filter(({ response }) =>
                _.keys(this.apiErrorsMap).includes(_.get(response, 'message')));

            currentComponentErrors.forEach(componentError => {
                const description = this.apiErrorsMap[
                    componentError.response.message
                ];

                openNotificationWithIcon(
                    'error',
                    this.props.intl.formatMessage({
                        id: 'package-container.error',
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
                        <s>{ `${item.make} ${item.model}` }</s>{ ' ' }
                        { `${makeName} ${modelName} ${modificationName}` }
                    </label>
                );
            }

            if (!item.model) {
                return <label>----</label>;
            }

            return (
                <label>{ `${item.make} ${item.model}${
                    item.modification ? ' ' + item.modification : ''
                }` }</label>
            );
        };

        return (
            <List
                size='small'
                bordered
                dataSource={ clientEntity.vehicles }
                renderItem={ (item, index) => (
                    <List.Item className={ Styles.listItem }>
                        <Form>
                            <Row gutter={ 8 } type='flex' align='bottom'>
                                <Col span={ 8 }>
                                    { vehicleLabel(item, index) }{ ' ' }
                                    { editableItem === index &&
                                        !editVehicle && (
                                        <Button
                                            icon='swap'
                                            onClick={ () =>
                                                setEditVehicle(true)
                                            }
                                        >
                                        </Button>
                                    ) }
                                    { editableItem === index &&
                                        editVehicle && (
                                        <Modal
                                            visible
                                            style={ { minWidth: '950px' } }
                                            footer={ null }
                                            onCancel={ () =>
                                                setEditVehicle(false)
                                            }
                                        >
                                            <AddClientVehicleForm
                                                onlyVehicles
                                                addClientVehicle={ vehicle => {
                                                    setSelectedVehicle(
                                                        vehicle,
                                                    );
                                                } }
                                            />
                                        </Modal>
                                    ) }
                                </Col>
                                <Col span={ 2 }>
                                    <DecoratedCheckbox
                                        field={ `clientVehicles[${index}].enabled` }
                                        initialValue={ !item.disabled }
                                        disabled={ editableItem !== index }
                                        getFieldDecorator={
                                            this.props.form.getFieldDecorator
                                        }
                                    />
                                </Col>
                                <Col span={ 4 }>
                                    { editableItem === index ? (
                                        <DecoratedInput
                                            formItem
                                            className={ Styles.editClientVehicleFormItem }
                                            field={ `clientVehicles[${index}].vehicleNumber` }
                                            initialValue={ item.number }
                                            rules={ [
                                                {
                                                    required: true,
                                                    message:  this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'required_field',
                                                        },
                                                    ),
                                                },
                                            ] }
                                            hasFeedback
                                            getFieldDecorator={
                                                this.props.form
                                                    .getFieldDecorator
                                            }
                                        />
                                    ) : 
                                        item.number
                                    }
                                </Col>
                                <Col span={ 4 }>
                                    { editableItem === index ? (
                                        <DecoratedInput
                                            className={ Styles.editClientVehicleFormItem }
                                            formItem
                                            field={ `clientVehicles[${index}].vehicleVin` }
                                            initialValue={ item.vin }
                                            getFieldDecorator={
                                                this.props.form
                                                    .getFieldDecorator
                                            }
                                        />
                                    ) : 
                                        item.vin
                                    }
                                </Col>
                                <Col span={ 3 }>
                                    { !isEditForbidden ? 
                                        editableItem === index ? 
                                            this.renderSubmitEditIcon(
                                                clientId,
                                                item,
                                                index,
                                                selectedVehicle,
                                            )
                                            : (
                                                <Icon
                                                    type='edit'
                                                    className={ Styles.editIcon }
                                                    onClick={ () =>
                                                        this.props.setEditableItem(
                                                            index,
                                                        )
                                                    }
                                                />
                                            )
                                        : null }
                                </Col>
                                <Col span={ 3 }>
                                    { !isEditForbidden ? (
                                        <Icon
                                            type='delete'
                                            className={ Styles.deleteIcon }
                                            onClick={ () =>
                                                this.props.deleteClientVehicle(
                                                    clientId,
                                                    item.id,
                                                )
                                            }
                                        />
                                    ) : null }
                                </Col>
                            </Row>
                        </Form>
                    </List.Item>
                ) }
            />
        );
    }
}
