// vendor
import React, { Component } from "react";
import { Button, Form } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";

// proj
import { AbstractClientForm } from "forms";
import { withReduxForm2 } from "utils";
import {
    onChangeClientForm,
    updateClient,
} from "core/forms/editClientForm/duck";
import { permissions, isForbidden } from "utils";

// own
import Styles from "./styles.m.css";

@withReduxForm2({
    name: "editClientForm",
    actions: {
        change: onChangeClientForm,
        updateClient,
    },
    mapStateToProps: state => ({
        user: state.auth,
    }),
})
@injectIntl
export class EditClientForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;
        const { CREATE_EDIT_DELETE_CLIENTS } = permissions;

        return (
            <>
                <AbstractClientForm {...this.props} />
                <Form className={Styles.editClientForm}>
                    <Button
                        disabled={isForbidden(user, CREATE_EDIT_DELETE_CLIENTS)}
                        type="primary"
                        className={Styles.editClientButton}
                        onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    const clientFormData = values;

                                    const clientEntity = {
                                        birthday: clientFormData.birthday,
                                        emails: clientFormData.emails
                                            ? clientFormData.emails.filter(
                                                  Boolean,
                                              )
                                            : clientFormData.emails,
                                        middlename: clientFormData.patronymic,
                                        name: clientFormData.name,
                                        surname: clientFormData.surname,
                                        sex: clientFormData.sex,
                                        status: clientFormData.status,
                                        paymentRespite: clientFormData.paymentRespite,
                                        phones: clientFormData.phones
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

                                    this.props.updateClient(
                                        this.props.clientId,
                                        clientEntity,
                                    );
                                }
                            });
                        }}
                    >
                        <FormattedMessage id="edit" />
                    </Button>
                </Form>
            </>
        );
    }
}
