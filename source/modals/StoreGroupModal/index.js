// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Form } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { MODALS, selectModalProps } from "core/modals/duck";

import { DecoratedInput, DecoratedCheckbox } from "forms/DecoratedFields";

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const mapStateToProps = state => ({
    modalProps: selectModalProps(state),
});

@injectIntl
@Form.create()
@connect(mapStateToProps)
export default class StoreGroupModal extends Component {
    _submit = () => {
        const { form, resetModal, modalProps } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                console.log("→ StoreGroupModal Submit values", values);
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

        const name = _.get(modalProps, "storeGroup.name");
        const id = _.get(modalProps, "storeGroup.id");
        return (
            <Modal
                cancelText={<FormattedMessage id="cancel" />}
                okText={<FormattedMessage id="save" />}
                visible={visible === MODALS.STORE_GROUP}
                onOk={() => this._submit()}
                onCancel={() => resetModal()}
            >
                <Form onSubmit={this._submit} style={{ padding: 24 }}>
                    <DecoratedInput
                        fields={{}}
                        field="name"
                        formItem
                        formItemLayout={formItemLayout}
                        label="Name"
                        initialValue={name}
                        getFieldDecorator={getFieldDecorator}
                    />
                    <DecoratedInput
                        fields={{}}
                        field="priceGroupNumber"
                        getFieldDecorator={getFieldDecorator}
                        initialValue={id}
                        hiddeninput="hiddeninput"
                    />
                    {modalProps.create && (
                        <DecoratedCheckbox
                            fields={{}}
                            formItem
                            label="SystemWide"
                            formItemLayout={formItemLayout}
                            field="systemWide"
                            getFieldDecorator={getFieldDecorator}
                        />
                    )}
                </Form>
            </Modal>
        );
    }
}
