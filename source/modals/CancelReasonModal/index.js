// vendor
import React, { Component } from 'react';
import { Modal, Button, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { MODALS } from 'core/modals/duck';

// own
// import Styles from './styles.m.css';
const { TextArea } = Input;
const { Option } = Select;

export default class CancelResonModal extends Component {
    render() {
        const {
            visible,
            confirmCancelResonModal,
            resetModal,
            orderComments,
        } = this.props;

        return (
            <Modal
                cancelText={ <FormattedMessage id='cancel' /> }
                visible={ visible === MODALS.CANCEL_REASON }
                onCancel={ () => resetModal() }
                footer={ null }
            >
                <div>Отказаться от закказа?</div>
                <div>
                    <Button onClick={ () => confirmCancelResonModal() }>
                        Да
                    </Button>
                    <Button onClick={ () => resetModal() }>Нет</Button>
                </div>
                { /* TODO submit*/ }
                { orderComments && (
                    <Select getPopupContainer={ trigger => trigger.parentNode }>
                        { orderComments
                            .map(
                                ({ status, id, comment }) =>
                                    status === 'cancel' ? (
                                        <Option
                                            value={ id }
                                            key={ v4() }
                                            styles={ { width: '220px' } }
                                        >
                                            { comment }
                                        </Option>
                                    ) : 
                                        false
                                ,
                            )
                            .filter(Boolean) }
                    </Select>
                ) }
                <TextArea rows={ 4 } autosize={ { minRows: 2, maxRows: 6 } } />
            </Modal>
        );
    }
}
