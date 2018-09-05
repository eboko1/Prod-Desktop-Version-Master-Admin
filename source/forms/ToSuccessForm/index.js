//vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Button } from 'antd';

// proj
import { onChangeToSuccessForm } from 'core/forms/toSuccessForm/duck';

import { DecoratedCheckbox } from 'forms/DecoratedFields';
import { withReduxForm2 } from 'utils';

// own
import Styles from './styles.m.css';

@withReduxForm2({
    name:    'toSuccessForm',
    actions: {
        change: onChangeToSuccessForm,
    },
    mapStateToProps: state => ({
        businessName: state.auth.businessName,
    }),
})
export class ToSuccessForm extends Component {
    render() {
        const { handleToSuccessModalSubmit, resetModal } = this.props;
        const { getFieldDecorator } = this.props.form;
        // const { formatMessage } = this.props.intl;

        return (
            <Form layout='vertical'>
                <div className={ Styles.title }>
                    <FormattedMessage id='to_success.title' />
                </div>
                <div className={ Styles.submit }>
                    <Button
                        onClick={ () => handleToSuccessModalSubmit('success') }
                        className={ Styles.submitButton }
                        type='primary'
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
                <div>
                    <div className={ Styles.checkbox }>
                        <DecoratedCheckbox
                            field='toSuccess'
                            getFieldDecorator={ getFieldDecorator }
                        >
                            <FormattedMessage id='to_success.send_message' />:
                            <br />
                            <FormattedMessage id='to_success.sms1' />
                            { this.props.businessName }
                            <FormattedMessage id='to_success.sms2' />
                        </DecoratedCheckbox>
                    </div>
                    { /* <div className={ Styles.checkbox }>
                        <DecoratedCheckbox
                            field='sms'
                            getFieldDecorator={ getFieldDecorator }
                        >
                            <FormattedMessage id='to_success.create_new' />
                        </DecoratedCheckbox>
                    </div> */ }
                </div>
            </Form>
        );
    }
}
