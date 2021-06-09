// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import {
    onChangeAddClientForm,
    addClientVehicle,
    createClient,
    removeClientVehicle,
    handleError,
} from 'core/forms/addClientForm/duck';

import { MODALS, setModal, saveModal, loadModal } from 'core/modals/duck';
import { VehicleModal } from 'modals';
import { StyledButton } from 'commons';

import { AbstractClientForm } from 'forms';
import { ClientsVehiclesTable } from 'forms/OrderForm/OrderFormTables';
import { withReduxForm2 } from 'utils';

// own
import Styles from './styles.m.css';

/**
 * This modal is used to add a new client with or without vehicles.
 * @property {*} [props.searchQuery] - Initial client phone number, will be used if provided proper value
 * @property {*} [props.modalProps.initialPhoneNumber] - Initial client phone number, will be used if provided proper value
 * @property {Function()} [onSubmit] - Callbeck when submit button cliekced
 */
@injectIntl
@withReduxForm2({
    name:    'addClientForm',
    actions: {
        change: onChangeAddClientForm,
        addClientVehicle,
        removeClientVehicle,
        createClient,
        handleError,
        setModal,
        saveModal,
        loadModal
    },    
    mapStateToProps: state => ({
        isMobile: state.ui.views.isMobile,
        modalProps: state.modals.modalProps,
    }),
})
export default class AddClientModal extends Component {

    /**
     * Open vehicle modal to crate a new vehicle
     */
    onOpenVehicleModal = () => {
        const { setModal, saveModal } = this.props;

        saveModal();
        setModal(MODALS.VEHICLE, {mode: "ADD", autoSubmit: false});
    }

    /**
     * Reopen client modal after vehicle modal was closed
     */
    onCloseVehicleModal = () => {
        const { loadModal } = this.props;
        loadModal(MODALS.ADD_CLIENT);
    }

    onSubmit = () => {
        const {
            resetModal,
            onSubmit,
            form: { getFieldsValue, validateFields }
        } = this.props;

        validateFields([ 'name', 'phones' ], err => {
            if (!err) {
                const clientFormData = getFieldsValue();
                const vehicles = this.props.vehicles.map(
                    ({
                        modelId,
                        modificationId,
                        vin,
                        number,
                        year,
                        vehicleTypeId,
                        wheelRadius,
                    }) => ({
                        vehicleModelId:        modelId,
                        vehicleModificationId: modificationId,
                        vehicleVin:            vin,
                        vehicleNumber:         number,
                        vehicleYear:           year,
                        vehicleTypeId:         vehicleTypeId,
                        wheelRadius:           wheelRadius,
                    }),
                );

                const clientEntity = {
                    birthday: clientFormData.birthday,
                    emails:   clientFormData.emails
                        ? clientFormData.emails.filter(Boolean)
                        : clientFormData.emails,
                    middlename: clientFormData.patronymic,
                    name:       clientFormData.name,
                    surname:    clientFormData.surname,
                    sex:        clientFormData.sex,
                    status:     clientFormData.status,
                    vehicles,
                    phones:     clientFormData.phones
                        .filter(
                            phone =>
                                phone &&
                                phone.country &&
                                phone.number,
                        )
                        .map(
                            ({ number, country }) =>
                                country + number,
                        ),
                };

                this.props.createClient(clientEntity);
                resetModal();

                if(onSubmit) onSubmit(); //Callback
            }
        });
    }

    render() {
        const {
            visible,
            resetModal,
            addClientFormData,
            searchQuery,
            vehicles,
            isMobile,
            vehicleTypes,
            modalProps,

            addClientVehicle,

            intl: { formatMessage }
        } = this.props;

        //Get initial phone from props or modalProps
        const clientSearchQuery = searchQuery || _.get(modalProps, 'initialPhoneNumber');

        return (
            <Modal
                className={ Styles.addClientModal }
                width={ isMobile ? '95%' : '80%' }
                height={ '80%' }
                style={ { top: 20 } }
                title={ <>{formatMessage({ id: 'add-client-form.add_client'}) + (clientSearchQuery ? ` (${clientSearchQuery})` : '')}</> }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='add' /> }
                wrapClassName={ Styles.addClientModal }
                visible={ visible === MODALS.ADD_CLIENT }
                onOk={ () => this.onSubmit() }
                onCancel={ () => resetModal() }
                maskClosable={false}
            >
                <AbstractClientForm
                    { ...this.props }
                    searchQuery={clientSearchQuery}
                    wrappedComponentRef={ this.props.wrappedComponentRef }
                    addClientFormData={ addClientFormData }
                />
                
                <div className={Styles.addVehicleButtonCont} >
                    <StyledButton
                        type={"primary"}
                        onClick={() => this.onOpenVehicleModal()}
                    >
                        { <FormattedMessage id='not_owner' /> }
                    </StyledButton>
                </div>

                { !_.isEmpty(vehicles) && (
                    <ClientsVehiclesTable
                        vehicleTypes={vehicleTypes}
                        removeClientVehicle={ this.props.removeClientVehicle }
                        addClientVehicle={ this.props.addClientVehicle }
                        vehicles={ vehicles }
                    />
                ) }

                <VehicleModal
                    onClose={() => this.onCloseVehicleModal()}
                    onSubmit={({ vehicle }) => addClientVehicle(vehicle) }
                />
            </Modal>
        );
    }
}
