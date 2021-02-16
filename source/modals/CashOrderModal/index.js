// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';

import { CashOrderForm } from 'forms';

// own
import Styles from './styles.m.css';

export default class CashOrderModal extends Component {
    render() {
        const { visible, resetModal, modalProps, cashOrderEntity, fetchOrder, onOpenAnalyticsModal} = this.props;
        const printMode = _.get(modalProps, 'printMode');
        const editMode = _.get(modalProps, 'editMode');
        const fromOrder = _.get(modalProps, 'fromOrder');

        return (
            <Modal
                className={ Styles.modal }
                visible={ visible === MODALS.CASH_ORDER }
                footer={ null }
                onCancel={ resetModal }
                destroyOnClose
                maskClosable={false}
            >
                <CashOrderForm
                    resetModal={ resetModal }
                    printMode={ printMode }
                    editMode={ editMode }
                    fromOrder={ fromOrder }
                    cashOrderEntity={ cashOrderEntity }
                    fetchOrder={ fetchOrder }
                    onOpenAnalyticsModal={ onOpenAnalyticsModal }
                />
            </Modal>
        );
    }
}
