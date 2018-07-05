// vendor
import React, { Component } from 'react';
import { Modal, Button, Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';

// own
// import Styles from './styles.m.css';

export default class ToSuccessModal extends Component {
    onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }
    render() {
        const { visible, confirmToSuccessModal, resetModal } = this.props;

        return (
            <Modal
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='invite-modal.invite' /> }
                visible={ visible === MODALS.TO_SUCCESS }
                onOk={ () => confirmToSuccessModal() }
                onCancel={ () => resetModal() }
            >
                Закрыть наряд заказ?
                <Button onClick={ () => console.log('→ YES') }>Да</Button>
                <Button onClick={ () => resetModal() }>Нет</Button>
                <div>
                    <Checkbox onChange={ e => this.onChange(e) } />
                    <span>Создать обращение с напоминанием о новом заезде</span>
                </div>
                <div>
                    <Checkbox onChange={ e => this.onChange(e) } />
                    <span>Создать обращение с напоминанием о новом заезде</span>
                </div>
            </Modal>
        );
    }
}
