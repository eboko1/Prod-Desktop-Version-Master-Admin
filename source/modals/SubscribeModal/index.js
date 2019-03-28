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
        const {
            user,
            visible,
            modalProps,
            resetModal,
            subscribe,
            verifyPromoCode,
            promoCode,
            subscribed,
        } = this.props;

        const footer = this._renderModalFooter();

        return (
            <Modal
                title={ modalProps.name }
                visible={ visible === MODALS.SUBSCRIBE }
                //onOk={ () => this._handleToSuccessModalSubmit() }
                onCancel={ () => resetModal() }
                footer={ footer }
                destroyOnClose
                width={ 760 }
            >
                <SubscribeForm
                    user={ user }
                    subscribe={ subscribe }
                    resetModal={ resetModal }
                    modalProps={ modalProps }
                    verifyPromoCode={ verifyPromoCode }
                    promoCode={ promoCode }
                    subscribed={ subscribed }
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
                    <a href='tel:380442000902'>+380(44)200-09-02</a>,{ ' ' }
                    <a href='mailto:support@portmone.com'>
                        support@portmone.com
                    </a>
                </div>
                <div className={ Styles.support }>
                    <FormattedMessage id='footer.support' /> Carbook.Pro:&nbsp;
                    <a href='tel:380442994556'>+38(044)299-45-56</a>
                    &nbsp;
                    <FormattedMessage id='or' />
                    &nbsp;
                    <a href='mailto:support@carbook.pro'>support@carbook.pro</a>
                    &nbsp;
                </div>
            </div>
        );
    };
}
