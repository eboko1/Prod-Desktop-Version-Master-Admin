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

import { MODALS } from 'core/modals/duck';

import { AbstractClientForm, AddClientVehicleForm } from 'forms';
import { ClientsVehiclesTable } from 'forms/OrderForm/OrderFormTables';
import { withReduxForm2 } from 'utils';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm2({
    name:    'addClientForm',
    actions: {
        change: onChangeAddClientForm,
        addClientVehicle,
        removeClientVehicle,
        createClient,
        handleError,
    },    
    mapStateToProps: state => ({
        isMobile: state.ui.views.isMobile,
        modalProps: state.modals.modalProps,
    }),
})
/**
 * @param props.searchQuery Initial client phone number, will be used if provided proper value
 */
export default class AddClientModal extends Component {
    render() {
        const {
            visible,
            resetModal,
            addClientFormData,
            searchQuery,
            vehicles,
            onSubmit,
            isMobile,
            vehicleTypes,
        } = this.props;

        //Get initial phone fom props or modalProps
        const clientSearchQuery = searchQuery || (this.props.modalProps && this.props.modalProps.initialPhoneNuber);

        const { getFieldsValue, validateFields } = this.props.form;
        const title =
            this.props.intl.formatMessage({
                id: 'add-client-form.add_client',
            }) + (clientSearchQuery ? ` (${clientSearchQuery})` : '');

        return (
            <Modal
                className={ Styles.addClientModal }
                width={ isMobile ? '95%' : '80%' }
                height={ '80%' }
                style={ { top: 20 } }
                title={ <>{title}</> }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='add' /> }
                wrapClassName={ Styles.addClientModal }
                // centered
                visible={ visible === MODALS.ADD_CLIENT }
                onOk={ () => {
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
                            if(onSubmit) onSubmit();
                        }
                    });
                } }
                onCancel={ () => resetModal() }
                maskClosable={false}
            >
                <AbstractClientForm
                    { ...this.props }
                    searchQuery={clientSearchQuery}
                    wrappedComponentRef={ this.props.wrappedComponentRef }
                    addClientFormData={ addClientFormData }
                />
                { !_.isEmpty(vehicles) && (
                    <ClientsVehiclesTable
                        vehicleTypes={vehicleTypes}
                        removeClientVehicle={ this.props.removeClientVehicle }
                        addClientVehicle={ this.props.addClientVehicle }
                        vehicles={ vehicles }
                    />
                ) }
                <AddClientVehicleForm
                    vehicleTypes={vehicleTypes}
                    addClientVehicle={ this.props.addClientVehicle }
                />
            </Modal>
        );
    }
}
