// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import {
    onChangeAddClientForm,
    fetchVehiclesInfo,
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
        fetchVehiclesInfo,
        addClientVehicle,
        removeClientVehicle,
        createClient,
        handleError,
    },
})
export default class AddClientModal extends Component {
    render() {
        const {
            visible,
            resetModal,
            addClientFormData,
            searchQuery,
            vehicles,
        } = this.props;

        const { getFieldsValue, validateFields } = this.props.form;
        const title =
            this.props.intl.formatMessage({
                id: 'add-client-form.add_client',
            }) + (searchQuery ? ` (${searchQuery})` : '');

        return (
            <Modal
                className={ Styles.addClientModal }
                width={ '80%' }
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
                                }) => ({
                                    vehicleModelId:        modelId,
                                    vehicleModificationId: modificationId,
                                    vehicleVin:            vin,
                                    vehicleNumber:         number,
                                    vehicleYear:           year,
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
                            // resetModal();
                        }
                    });
                } }
                onCancel={ () => resetModal() }
            >
                <AbstractClientForm
                    { ...this.props }
                    wrappedComponentRef={ this.props.wrappedComponentRef }
                    addClientFormData={ addClientFormData }
                />
                { !_.isEmpty(vehicles) && (
                    <ClientsVehiclesTable
                        removeClientVehicle={ this.props.removeClientVehicle }
                        vehicles={ vehicles }
                    />
                ) }
                <AddClientVehicleForm
                    addClientVehicle={ this.props.addClientVehicle }
                />
            </Modal>
        );
    }
}
