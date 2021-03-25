// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { CashCreationForm } from 'forms';
import { MODALS, resetModal } from 'core/modals/duck';
import { withReduxForm2 } from 'utils';
import { createCashbox } from 'core/cash/duck';


@injectIntl
@withReduxForm2({
    name:    'addClientForm',
    actions: {
        resetModal,
        createCashbox
    },    
    mapStateToProps: state => ({
        isMobile: state.ui.views.isMobile,
		modal: state.modals.modal,
    }),
})
/**
 * This modal is used to create cash box, it is autonomous so the only thing you have to provide is the name of this module.
 */
export default class AddCashboxModal extends Component {
    constructor(props) {
        super(props);

        this.onOk = this.onOk.bind(this);
        this.saveFormRef = this.saveFormRef.bind(this);
    }

    handleCancel = () => {
		this.props.resetModal();
	};

    onOk(e) {
        e.preventDefault();
        if(!this.formRef) return;

        const { createCashbox } = this.props;

        this.formRef.validateFields((err, values) => {
            if (!err) {
                createCashbox(values);
                this.formRef.resetFields();
            }
        });

        this.props.resetModal();
    }

    saveFormRef(instance) {
        this.formRef = instance;
    }

    render() {
        const {
            modal
        } = this.props;

        return (
            <Modal
                destroyOnClose
                visible={modal === MODALS.ADD_CASHBOX}
                maskClosable={false}
                title={null}
                bodyStyle={{ paddingTop: 56 }}
                okText={<FormattedMessage id='save' />}
                okButtonProps={{
                    htmlType: 'submit',
                    form: 'cash-creation-form',
                }}
                cancelText={<FormattedMessage id='cancel' />}
                onCancel={() => this.handleCancel()}
                onOk={this.onOk}
            >
                <CashCreationForm
                    getFormRefCB={this.saveFormRef}//Get form refference
                />
            </Modal>
        );
    }
}
