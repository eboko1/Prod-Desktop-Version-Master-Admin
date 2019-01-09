// vendor
import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';

import { DecoratedInput } from 'forms/DecoratedFields';

@injectIntl
@Form.create()
export default class SupplierModal extends Component {
    _submit = () => {
        const { form, createSupplier, resetModal, modalProps } = this.props;

        const supplierId = _.get(modalProps, 'id');

        form.validateFields((err, values) => {
            if (!err) {
                supplierId
                    ? createSupplier({ ...values, id: supplierId })
                    : createSupplier(values);
                form.resetFields();
                resetModal();
            }
        });
    };

    render() {
        const {
            visible,
            resetModal,

            modalProps,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        const supplierName = _.get(modalProps, 'name');

        return (
            <Modal
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='save' /> }
                visible={ visible === MODALS.SUPPLIER }
                onOk={ () => this._submit() }
                onCancel={ () => resetModal() }
            >
                <Form onSubmit={ this._submit }>
                    <DecoratedInput
                        field='name'
                        formItem
                        initialValue={ supplierName ? supplierName : null }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'supplier-modal.name_validation',
                                }),
                            },
                        ] }
                        hasFeedback
                        label={
                            <FormattedMessage
                                id={
                                    supplierName
                                        ? 'supplier-modal.edit_supplier'
                                        : 'supplier-modal.add_supplier'
                                }
                            />
                        }
                        placeholder={ formatMessage({
                            id: 'supplier-modal.supplier_name_placeholder',
                        }) }
                        getFieldDecorator={ getFieldDecorator }
                    />
                </Form>
            </Modal>
        );
    }
}
