// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';



import { MODALS } from 'core/modals/duck';

import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';

export default class AddClientModal extends Component {
    render() {
        const { visible, resetModal } = this.props;


        return (
            <Modal
                className={ Styles.addClientModal }
                width={ '80%' }
                title={ <FormattedMessage id='add-client-form.add_client' /> }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='add' /> }
                wrapClassName={ Styles.addClientModal }
                visible={ visible === MODALS.ORDER_TASK }
                onOk={ () => {
                    
                    resetModal();
                }
                }
                onCancel={ () => resetModal() }
            >
Hello
            </Modal>
        );
    }
}
