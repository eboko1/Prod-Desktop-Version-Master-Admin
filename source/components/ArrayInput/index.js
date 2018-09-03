// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form } from 'antd';

// proj
import { DecoratedInput, DecoratedInputNumber } from 'forms/DecoratedFields';

// own
const FormItem = Form.Item;

class ArrayInput extends Component {
    constructor(props) {
        super(props);

        this.uuid = 0;
        const keys = props.optional ? [] : [ this.uuid++ ];
        this.state = {
            keys,
        };
    }

    remove = key => {
        const {
            optional,
            // form: { getFieldValue, setFieldsValue },
        } = this.props;

        //const keys = getFieldValue(`${this.props.fieldName}Keys`);
        const keys = this.state.keys;
        if (keys.length === 1 && !optional) {
            return;
        }

        this.setState({ keys: keys.filter(value => value !== key) });
        // setFieldsValue({
        //     [ `${this.props.fieldName}Keys` ]: keys.filter(
        //         value => value !== key,
        //     ),
        // });
    };

    add = () => {
        // const keys = this.props.form.getFieldValue(
        //     `${this.props.fieldName}Keys`,
        // );
        // this.props.form.setFieldsValue({
        //     [ `${this.props.fieldName}Keys` ]: [ ...keys, uuid++ ],
        // });
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { fieldName, fieldTitle, rules, optional } = this.props;

        // getFieldDecorator(`${fieldName}Keys`, {
        //     initialValue: optional ? [] : [ 0 ],
        // });
        //const keys = getFieldValue(`${fieldName}Keys`);
        const keys = this.state.keys;

        const formatter = value => {
            const base = '+38 (0__) ___-__-__';
            const digits = String(value).replace(/[^\d]/g, '');

            const formattedNumber = digits
                .split('')
                .reduce((prev, cur) => prev.replace('_', cur), base);
            const indexOfPlaceHolder = formattedNumber.indexOf('_');
            const endPosition =
                indexOfPlaceHolder === -1
                    ? formattedNumber.length
                    : indexOfPlaceHolder;

            return formattedNumber.slice(0, endPosition).replace(/[^\d]+$/, '');
        };

        const parser = value =>
            value
                .replace(/[^\d]/g, '')
                .replace(/^\d/, '')
                .replace(/^\d/, '')
                .replace(/^\d/, '');

        const options = this.props.phone
            ? { formatter, parser, step: null, style: { width: '100%' } }
            : {};

        const formItems = keys.map(key => {
            return (
                <Row type='flex' align='middle' key={ key }>
                    { this.props.phone &&
                        getFieldDecorator(
                            `${fieldName}[${key}][country]`,
                            { initialValue: '380' },
                        ) }
                    <Col span={ 20 }>
                        { this.props.phone ? (
                            <DecoratedInputNumber
                                { ...options }
                                hasFeedback
                                formItem
                                label={ fieldTitle }
                                getFieldDecorator={ getFieldDecorator }
                                key={ key }
                                field={ `${fieldName}[${key}][number]` }
                                rules={ rules }
                            />
                        ) : (
                            <DecoratedInput
                                { ...options }
                                hasFeedback
                                formItem
                                label={ fieldTitle }
                                getFieldDecorator={ getFieldDecorator }
                                key={ key }
                                field={ `${fieldName}[${key}]` }
                                rules={ rules }
                            />
                        ) }
                    </Col>
                    <Col span={ 4 }>
                        <Row type='flex' justify='center'>
                            { keys.length > 1 || optional ? (
                                <Icon
                                    key={ key }
                                    className='dynamic-delete-button'
                                    type='minus-circle-o'
                                    style={ { fontSize: 20, color: '#cc1300' } }
                                    disabled={ keys.length === 1 }
                                    onClick={ () => this.remove(key) }
                                />
                            ) : null }
                        </Row>
                    </Col>
                </Row>
            );
        });

        return (
            <Col>
                { formItems }
                <Row type='flex'>
                    <Col span={ 20 }>
                        <Row type='flex' justify='center'>
                            <FormItem>
                                <Button type='dashed' onClick={ this.add }>
                                    <Icon type='plus' /> { this.props.buttonText }
                                </Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default ArrayInput;
