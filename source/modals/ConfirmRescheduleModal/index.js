// vendor
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';

// own
import Styles from './styles.m.css';

export default class ConfirmRescheduleModal extends Component {
    render() {
        const { visible, reset, confirm } = this.props;

        return (
            <Modal
                cancelText={
                    <FormattedMessage id='order_form_table.confirm_exit_without_changes' />
                }
                visible={ visible === MODALS.CONFIRM_RESCHEDULE }
                onCancel={ () => reset() }
                footer={
                    <div className={ Styles.footer }>
                        <Button onClick={ () => reset() }>
                            <FormattedMessage id='no' />
                        </Button>
                        <Button
                            type='primary'
                            onClick={ () => {
                                confirm();
                                reset();
                            } }
                        >
                            <FormattedMessage id='yes' />
                        </Button>
                    </div>
                }
                maskClosable={false}
            >
                <FormattedMessage id='confirm_reschedule_repairs' />
            </Modal>
        );
    }
}
