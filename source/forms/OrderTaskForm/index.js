// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { FormattedMessage } from 'react-intl';

//proj
import { onChangeOrderForm } from 'core/forms/orderForm/duck';

// TODO: импортировать все необходимые филды для форы
// import { } from 'forms/DecoratedFields';

import { withReduxForm } from 'utils';

// TODO: опционально, если нужно сложную верстку, можешь создать
// https://ant.design/components/form/ ищи Layout
// реф в ../OrderForm
// import {} from './layouts';

// own
// TODO: если нужно кастомить стилизацию - добавить модуль со стилями
// import Styles from './styles.m.css';

@withReduxForm({
    name:    'orderTaskForm',
    actions: {
        change: onChangeOrderForm,
    },
})
export class OrderTaskForm extends Component {
    render() {
        return <Form layout='horizontal'>orderTaskForm</Form>;
    }
}
