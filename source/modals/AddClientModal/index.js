// vendor
import React, { Component } from 'react';
import { Modal, Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { onChangeAddClientForm } from 'core/forms/addClientForm/duck';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;
const FormItem = Form.Item;

@withReduxForm({
    name:    'addClientModalForm',
    actions: {
        change: onChangeAddClientForm,
    },
})
export default class AddClientModal extends Component {
    render() {
        const {
            visible,
            handleAddClientModalSubmit,
            setAddClientModal,
        } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;

        return (
            <Modal
                className={ Styles.addClientModal }
                width={ '80%' }
                title={ <FormattedMessage id='add-client-form.add_client' /> }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='add' /> }
                wrapClassName={ Styles.addClientModal }
                visible={ visible }
                onOk={ () => handleAddClientModalSubmit() }
                onCancel={ () => setAddClientModal(false) }
            >
                <Form
                    layout='vertical'
                    // onSubmit={ this.handleSubmit }
                >
                    addClientForm
                </Form>
            </Modal>
        );
    }
}
