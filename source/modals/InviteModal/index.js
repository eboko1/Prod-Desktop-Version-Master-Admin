// vendor
import React, { Component } from 'react';
import { Modal, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
// import { resetModal } from 'core/modals/duck';

// own
import Styles from './styles.m.css';
// const confirm = Modal.confirm;
//
// const InviteModal = props => {
//     console.log('→ props.visible', props.visible);
//
//     return confirm({
//         visible: props.visible,
//         title:   'Do you want to Invite',
//         content: `${props.count} cars to servise?`,
//         onOk() {
//             // props.confirmInviteModal();
//         },
//         onCancel() {
//             props.resetModal();
//         },
//     });
// };

// export default InviteModal;

export default class InviteModal extends Component {
    render() {
        const { visible, confirmInviteModal, resetModal, count } = this.props;

        console.log('→ visible', visible);

        return (
            <Modal
                // className={ Styles.addClientModal }
                // width={ '80%' }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='invite-modal.invite' /> }
                // wrapClassName={ Styles.addClientModal }
                visible={ visible }
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
