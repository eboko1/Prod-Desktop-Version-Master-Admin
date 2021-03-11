// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { CashCreationForm } from 'forms';
import { MODALS, resetModal } from 'core/modals/duck';
import { withReduxForm2 } from 'utils';


@injectIntl
@withReduxForm2({
    name:    'addClientForm',
    actions: {
        resetModal
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

    handleCancel = () => {
		this.props.resetModal();
	};

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
            >
                <CashCreationForm />
            </Modal>
        );
    }
}
