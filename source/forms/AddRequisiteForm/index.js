//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button } from 'antd';

// proj
import { onChangeClientRequisiteForm } from 'core/forms/addClientRequisiteForm/duck';

import {
    DecoratedInput,
    DecoratedCheckbox,
} from 'forms/DecoratedFields';
import { withReduxForm2 } from 'utils';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm2({
    name:    'addClientRequisiteForm',
    actions: {
        change: onChangeClientRequisiteForm,
    },
})
export class AddRequisiteForm extends Component {
    render() {
        const {
            createRequisite,
        } = this.props;
        const { getFieldDecorator, validateFields } = this.props.form;

        return (
            <Form className={ Styles.requsitesForm }>
                <DecoratedInput
                    field={ 'name' }
                    formItem
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='client_requisites_container.name' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'address' }
                    formItem
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='client_requisites_container.address' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'bank' }
                    formItem
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='client_requisites_container.bank' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'ifi' }
                    formItem
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='client_requisites_container.ifi' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'ca' }
                    formItem
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='client_requisites_container.ca' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'itn' }
                    formItem
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='client_requisites_container.itn' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedCheckbox
                    field={ 'enabled' }
                    formItem
                    colon={ false }
                    initValue
                    label={
                        <FormattedMessage id='client_requisites_container.enabled' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                    formItemLayout={ {
                        labelCol:   { span: 14 },
                        wrapperCol: { span: 6 },
                    } }
                />

                <Button
                    type='primary'
                    style={ { width: '100%' } }
                    onClick={ () =>
                        validateFields(
                            (err, values) =>
                                !err && createRequisite(values),
                        )
                    }
                >
                    <FormattedMessage id='save' />
                </Button>
            </Form>
        );
    }
}
