// vendor
import React, { Component } from 'react';
import { Form } from 'antd';

// proj
import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';

// own

export default class CashCreationForm extends Component {
    render() {
        return (
            <Form>
                <div>Каса</div>
                <DecoratedInput />
                <DecoratedSelect />
                <DecoratedInput />
            </Form>
        );
    }
}
