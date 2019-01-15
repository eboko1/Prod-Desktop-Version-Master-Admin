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
        const { visible, resetModal, modalProps, cashOrderEntity } = this.props;
        const printMode = _.get(modalProps, 'printMode');
        const editMode = _.get(modalProps, 'editMode');

        return (
            <Modal
                className={ Styles.modal }
                visible={ visible === MODALS.CASH_ORDER }
                footer={ null }
                onCancel={ resetModal }
            >
                <CashOrderForm
                    resetModal={ resetModal }
                    printMode={ printMode }
                    editMode={ editMode }
                    cashOrderEntity={ cashOrderEntity }
                />
            </Modal>
        );
    }
}
