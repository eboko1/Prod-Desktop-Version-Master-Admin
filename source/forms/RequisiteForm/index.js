//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button } from 'antd';

// proj
import { onChangeClientRequisiteForm } from 'core/forms/editClientRequisiteForm/duck';

import {
    DecoratedInput,
    DecoratedCheckbox,
} from 'forms/DecoratedFields';
import { withReduxForm2 } from 'utils';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm2({
    name:    'clientRequisiteForm',
    actions: {
        change: onChangeClientRequisiteForm,
    },
})
export class RequisiteForm extends Component {
    render() {
        const {
            requisite,
            updateRequisite,
        } = this.props;
        const { getFieldDecorator, validateFields } = this.props.form;


        return (
            <Form className={ Styles.requsitesForm }>
                <DecoratedInput
                    field={ 'name' }
                    formItem
                    colon={ false }
                    initialValue={ requisite.name }
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
                    initialValue={ requisite.address }
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
                    initialValue={ requisite.bank }
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
                    initialValue={ requisite.ifi }
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
                    initialValue={ requisite.ca }
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
                    initialValue={ requisite.itn }
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
                    initialValue={ !!requisite.enabled }
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
                                !err && updateRequisite(requisite.id, values),
                        )
                    }
                >
                    <FormattedMessage id='save' />
                </Button>
            </Form>
        );
    }
}
