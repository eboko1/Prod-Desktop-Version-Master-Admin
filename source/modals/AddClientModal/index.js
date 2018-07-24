// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import {
    onChangeAddClientForm,
    fetchVehiclesInfo,
    addClientVehicle,
    updateArrayField,
    createClient,
    removeClientVehicle,
} from 'core/forms/addClientForm/duck';

import { MODALS } from 'core/modals/duck';

import { AddClientForm } from 'forms';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';

@withReduxForm({
    name:    'addClientForm',
    actions: {
        change: onChangeAddClientForm,
        fetchVehiclesInfo,
        addClientVehicle,
        removeClientVehicle,
        updateArrayField,
        createClient,
    },
})
export default class AddClientModal extends Component {
    render() {
        const { visible, resetModal, addClientFormData } = this.props;

        const { getFieldsValue, validateFields } = this.props.form;

        return (
            <Modal
                className={ Styles.addClientModal }
                width={ '80%' }
                title={ <FormattedMessage id='add-client-form.add_client' /> }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='add' /> }
                wrapClassName={ Styles.addClientModal }
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
                                birthday:   clientFormData.birthday,
                                emails:     clientFormData.emails.filter(Boolean),
                                middlename: clientFormData.patronymic,
                                name:       clientFormData.name,
                                surname:    clientFormData.surname,
                                sex:        clientFormData.sex,
                                status:     clientFormData.status,
                                vehicles,
                                phones:     clientFormData.phones,
                            };

                            this.props.createClient(clientEntity);
                            resetModal();
                        }
                    });
                } }
                onCancel={ () => resetModal() }
            >
                <AddClientForm
                    { ...this.props }
                    wrappedComponentRef={ this.props.wrappedComponentRef }
                    addClientFormData={ addClientFormData }
                />
            </Modal>
        );
    }
}
