//vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Button } from "antd";
import moment from "moment";

// proj
import { onChangeBusinessPackageForm } from "core/forms/businessPackageForm/duck";

import {
    DecoratedDatePicker,
    DecoratedTextArea,
    DecoratedInputNumber,
} from "forms/DecoratedFields";
import { withReduxForm } from "utils";

@injectIntl
@withReduxForm({
    name: "businessPackageForm",
    actions: {
        change: onChangeBusinessPackageForm,
    },
})
export class BusinessPackageForm extends Component {
    render() {
        const { getFieldDecorator, validateFields } = this.props.form;
        const { businessPackage } = this.props;
        const {
            activationDatetime,
            expirationDatetime,
            comment,
            amount,
            id: businessPackageId,
            businessName,
            packageName,
        } = businessPackage || {};
        const { formatMessage } = this.props.intl;

        return (
            { businessPackage } && (
                <Form layout={"horizontal"}>
                    <FormattedMessage id="business-package-form.business" />:{" "}
                    <b>{businessName}</b>
                    <br />
                    <FormattedMessage id="business-package-form.package" />:{" "}
                    <b>{packageName}</b>
                    <br />
                    <DecoratedDatePicker
                        field={"activationDatetime"}
                        formItem
                        showTime
                        initialValue={moment(activationDatetime)}
                        format="YYYY-MM-DD HH:mm:ss"
                        getCalendarContainer={trigger => trigger.parentNode}
                        formatMessage={formatMessage}
                        rules={[
                            {
                                required: true,
                                message: this.props.intl.formatMessage({
                                    id:
                                        "business-package-form.activation_datetime_error",
                                }),
                            },
                        ]}
                        hasFeedback
                        label={
                            <FormattedMessage id="business-package-form.activation_datetime" />
                        }
                        getFieldDecorator={getFieldDecorator}
                    />
                    <DecoratedDatePicker
                        field={"expirationDatetime"}
                        formItem
                        showTime
                        initialValue={moment(expirationDatetime)}
                        format="YYYY-MM-DD HH:mm:ss"
                        getCalendarContainer={trigger => trigger.parentNode}
                        formatMessage={formatMessage}
                        rules={[
                            {
                                required: true,
                                message: this.props.intl.formatMessage({
                                    id:
                                        "business-package-form.expiration_datetime_error",
                                }),
                            },
                        ]}
                        hasFeedback
                        label={
                            <FormattedMessage id="business-package-form.expiration_datetime" />
                        }
                        getFieldDecorator={getFieldDecorator}
                    />
                    <DecoratedTextArea
                        field="comment"
                        formItem
                        rules={[
                            {
                                max: 2000,
                                message: formatMessage({
                                    id: "field_should_be_below_2000_chars",
                                }),
                            },
                        ]}
                        initialValue={comment}
                        getPopupContainer={trigger => trigger.parentNode}
                        label={
                            <FormattedMessage id="business-package-form.comment" />
                        }
                        getFieldDecorator={getFieldDecorator}
                    />
                    <DecoratedInputNumber
                        field="amount"
                        formItem
                        style={{ width: "100%" }}
                        initialValue={amount}
                        getPopupContainer={trigger => trigger.parentNode}
                        label={
                            <FormattedMessage id="business-package-form.amount" />
                        }
                        getFieldDecorator={getFieldDecorator}
                    />
                    <Button
                        style={{ width: "100%" }}
                        onClick={() =>
                            validateFields(
                                (err, values) =>
                                    !err &&
                                    this.props.updateBusinessPackage(
                                        businessPackageId,
                                        values,
                                    ),
                            )
                        }
                    >
                        <FormattedMessage id="business-package-form.edit" />
                    </Button>
                </Form>
            )
        );
    }
}
