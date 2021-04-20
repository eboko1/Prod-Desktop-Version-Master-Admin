// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form } from 'antd';
import _ from 'lodash';

// proj
import { DecoratedInput, DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import Styles from "./styles.m.css";

const FormItem = Form.Item;

class ArrayInput extends Component {
    constructor(props) {
        super(props);

        //Create unique ID for each field which will be created for each array entry.
        this.uuid = props.initialValue ? props.initialValue.length : 0;

        //Get keys for each field by extracing keys from array or by creating new
        const keys = props.initialValue
            ? _.keys(props.initialValue)
            : props.optional
                ? []
                : [ this.uuid++ ];

        this.state = { keys };
    }

    /**
     * Get default value for a specific field
     * @param {*} key Unique field key
     * @returns Default field value or formatted default phone number
     */
    _getDefaultValue = key => {
        const value = (this.props.initialValue || [])[ key ];
        if (!value) {
            return void 0;
        }

        return this.props.phone
            ? Number(value.replace(/[^\d]/g, '').replace(/^38/, ''))
            : value;
    };

    /**
     * Remove key from global array of keys, so its field will be removed too
     * @param {*} key Key to remove
     */
    remove = key => {
        const {
            optional,
        } = this.props;

        const keys = this.state.keys;
        if (keys.length === 1 && !optional) {
            return;
        }

        this.setState({ keys: keys.filter(value => value !== key) });
    };

    /**
     * Add new unique key to array of kes, so new field will be created.
     */
    add = () => {
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { fieldName, fieldTitle, rules, optional } = this.props;

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
            if (this.props.phone) {
                getFieldDecorator(`${fieldName}[${key}][country]`, {
                    initialValue: '380',
                });
            }

            return (
                <Row type='flex' align='middle' key={ key }>
                    <Col span={ 20 }>
                        { this.props.phone ? (
                            //This is used for phone numbers
                            <DecoratedInputNumber
                                { ...options }
                                hasFeedback
                                fields={ {} }
                                initialValue={ this._getDefaultValue(key) }
                                formItem
                                label={ _.isFunction(fieldTitle)? fieldTitle(this._getDefaultValue(key)): fieldTitle }
                                getFieldDecorator={ getFieldDecorator }
                                key={ key }
                                field={ `${fieldName}[${key}][number]` }
                                rules={ rules }
                                className={Styles.arrayInput}
                            />
                        ) : (
                            //Is used if input is now like phone number
                            <DecoratedInput
                                { ...options }
                                hasFeedback
                                fields={ {} }
                                initialValue={ this._getDefaultValue(key) }
                                formItem
                                label={ _.isFunction(fieldTitle)? fieldTitle(this._getDefaultValue(key)): fieldTitle }
                                getFieldDecorator={ getFieldDecorator }
                                key={ key }
                                field={ `${fieldName}[${key}]` }
                                rules={ rules }
                                className={Styles.arrayInput}
                            />
                        ) }
                    </Col>
                    <Col span={ 4 }>
                        { keys.length > 1 || optional ? (
                            <Row type='flex' justify='center'>
                                <Icon
                                    key={ key }
                                    className='dynamic-delete-button'
                                    type='minus-circle-o'
                                    style={ { fontSize: 20, color: '#cc1300' } }
                                    disabled={ keys.length === 1 }
                                    onClick={ () => this.remove(key) }
                                />
                            </Row>
                        ) : null }
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
                                <Button
                                    type='dashed'
                                    onClick={ this.add }
                                    style={ { marginTop: 30 } }
                                >
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
