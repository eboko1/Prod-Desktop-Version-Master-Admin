// vendor
import React, { Component } from 'react';
import { Modal, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';

// own
import Styles from './styles.m.css';

export default class InviteModal extends Component {
    render() {
        const { visible, confirmInviteModal, resetModal, count } = this.props;

        return (
            <Modal
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='invite-modal.invite' /> }
                visible={ visible === MODALS.INVITE }
                onOk={ () => confirmInviteModal() }
                onCancel={ () => resetModal() }
            >
                <Icon type='question-circle' className={ Styles.icon } />
                <FormattedMessage id='invite-modal.text1' />
                <span className={ Styles.count }>{ count }</span>
                <FormattedMessage id='invite-modal.text2' />
            </Modal>
        );
    }
}
