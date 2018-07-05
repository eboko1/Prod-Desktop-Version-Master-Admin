// vendor
import React, { Component } from 'react';
import { Modal, Button, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';

// own
// import Styles from './styles.m.css';
const { TextArea } = Input;
const { Option } = Select;

export default class CancelResonModal extends Component {
    render() {
        const { visible, confirmCancelResonModal, resetModal } = this.props;

        return (
            <Modal
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='invite-modal.invite' /> }
                visible={ visible === MODALS.CANCEL_REASON }
                onOk={ () => confirmCancelResonModal() }
                onCancel={ () => resetModal() }
            >
                Отказаться от закказа?
                <Button onClick={ () => console.log('→ YES') }>Да</Button>
                <Button onClick={ () => console.log('→ NO') }>Нет</Button>
                { /* TODO fetch CancelReasons*/ }
                <Select>
                    <Option value='1'>REASON 1</Option>
                    <Option value='1'>REASON 2</Option>
                </Select>
                <TextArea rows={ 4 } autosize={ { minRows: 2, maxRows: 6 } } />
            </Modal>
        );
    }
}
