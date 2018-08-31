//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Select, Button } from 'antd';
import { v4 } from 'uuid';

// proj
import { onChangeCancelReasonForm } from 'core/forms/cancelReasonForm/duck';

import { DecoratedSelect, DecoratedTextArea } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';
const { Option } = Select;

@injectIntl
@withReduxForm({
    name:    'cancelReasonForm',
    actions: {
        change: onChangeCancelReasonForm,
    },
})
export class CancelReasonForm extends Component {
    render() {
        const {
            orderComments,
            handleCancelReasonModalSubmit,
            resetModal,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Form layout='vertical'>
                <div className={ Styles.title }>
                    <FormattedMessage id='cancel_reason.title' />
                </div>
                <div className={ Styles.submit }>
                    <Button
                        onClick={ () => handleCancelReasonModalSubmit('cancel') }
                        className={ Styles.submitButton }
                    >
                        <FormattedMessage id='yes' />
                    </Button>
                    <Button
                        onClick={ () => resetModal() }
                        className={ Styles.submitButton }
                    >
                        <FormattedMessage id='no' />
                    </Button>
                </div>
                { orderComments && (
                    <DecoratedSelect
                        formItem
                        label={ <FormattedMessage id='cancel_reason.select_cancel_reason' /> }
                        field='cancelReason'
                        getFieldDecorator={ getFieldDecorator }
                        getPopupContainer={ trigger => trigger.parentNode }
                    >
                        { orderComments
                            .map(
                                ({ status, id, comment }) =>
                                    status === 'cancel' ? (
                                        <Option value={ id } key={ v4() }>
                                            { comment }
                                        </Option>
                                    ) : 
                                        false
                                ,
                            )
                            .filter(Boolean) }
                    </DecoratedSelect>
                ) }
                <DecoratedTextArea
                    field='cancelComment'
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ formatMessage({ id: 'cancel_reason.other_cancel_reason'}) }
                    rows={ 4 }
                    autosize={ { minRows: 2, maxRows: 6 } }
                />
            </Form>
        );
    }
}
