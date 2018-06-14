// Core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { intlActions } from 'core/intl/actions';
import { connect } from 'react-redux';

import { Button } from 'antd';

// Instruments
import { messages } from 'store/intl';

@connect(state => ({ intl: state.intl }), {
    updateIntl: intlActions.updateIntl,
})
export default class LanguagePad extends Component {
    _setEnLocale = () => {
        this.props.updateIntl({
            locale:   'en',
            messages: messages.en,
        });
    };

    _setRuLocale = () => {
        this.props.updateIntl({
            locale:   'ru',
            messages: messages.ru,
        });
    };

    _setUkLocale = () => {
        this.props.updateIntl({
            locale:   'uk',
            messages: messages.uk,
        });
    };

    render() {
        return (
            <div>
                <div>
                    <FormattedMessage
                        id='LanguagePad-1'
                        defaultMessage='Loading...'
                    />
                </div>
                <div>
                    <Button onClick={ this._setRuLocale }>ru🇷🇺</Button>
                    <Button onClick={ this._setUkLocale }>ua🇺🇦</Button>
                    <Button onClick={ this._setEnLocale }>en🇺🇸</Button>
                </div>
            </div>
        );
    }
}
