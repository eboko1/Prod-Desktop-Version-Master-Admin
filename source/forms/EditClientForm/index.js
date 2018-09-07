// vendor
import React, { Component } from 'react';
import { Button } from 'antd';

// proj
import { AbstractClientForm } from 'forms';
import { withReduxForm2 } from 'utils';
import {
    onChangeClientForm,
    updateClient,
} from 'core/forms/editClientForm/duck';

// own
import Styles from './styles.m.css';

@withReduxForm2({
    name:    'editClientForm',
    actions: {
        change: onChangeClientForm,
        updateClient,
    },
})
export class EditClientForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <AbstractClientForm { ...this.props } />
                <Button
                    onClick={ () => {
                        this.props.form.validateFields((err, values) => {
                            if (!err) {
                                const clientFormData = values;

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
                                    phones:     clientFormData.phones
                                        .filter(Boolean)
                                        .map(
                                            ({ number, country }) =>
                                                country + number,
                                        ),
                                };

                                this.props.updateClient(
                                    this.props.clientId,
                                    clientEntity,
                                );
                            }
                        });
                    } }
                >
                    Edit
                </Button>
            </>
        );
    }
}
