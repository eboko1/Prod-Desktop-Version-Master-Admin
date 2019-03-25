// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';

import { SubscribeForm } from 'forms';
import { images } from 'utils';

// own
import Styles from './styles.m.css';

export default class SubscribeModal extends Component {
    //_handleToSuccessModalSubmit = () => {
    //    onStatusChange;
    //};

    render() {
        const { visible, modalProps, resetModal } = this.props;
        const footer = this._renderModalFooter();

        return (
            <Modal
                title={ modalProps.name }
                visible={ visible === MODALS.SUBSCRIBE }
                //onOk={ () => this._handleToSuccessModalSubmit() }
                onCancel={ () => resetModal() }
                footer={ footer }
                destroyOnClose
                width={ 720 }
            >
                <SubscribeForm
                    resetModal={ resetModal }
                    modalProps={ modalProps }
                />
            </Modal>
        );
    }

    _renderModalFooter = () => {
        return (
            <div className={ Styles.modalFooter }>
                <div className={ Styles.terms }>
                    <img
                        className={ Styles.portmoneLogos }
                        src={ images.portmoneLogos }
                    />

                    <FormattedMessage id='subscription.terms' />
                </div>
                <div className={ Styles.support }>
                    <FormattedMessage id='subscription.support' />:{ ' ' }
                    <FormattedMessage id='subscription.phone' />{ ' ' }
                    <a href='tel:380442000902'>+380(44)2000902</a>,{ ' ' }
                    <a href='mailto:support@portmone.com'>
                        support@portmone.com
                    </a>
                </div>
            </div>
        );
    };
}
