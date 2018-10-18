// vendor
import React, { Component } from 'react';
import { Row, Col, Form, Select } from 'antd';
import _ from 'lodash';

// proj
import { DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

const masks = {
    ua: '+38 (0__) ___-__-__',
    pl: '+48 __ ___ __ __',
};

class PhoneNumberInput extends Component {
    constructor(props) {
        super(props);

        const mask = this.getMask(props.initialPhoneNumber);
        this.state = { mask };
    }

    getPreparedPhoneNumber(number) {
        const digitsNumber = String(number || '').replace(/[^\d]/g, '');

        return digitsNumber.startsWith('0')
            ? '38' + digitsNumber
            : digitsNumber;
    }

    getMask(initialPhoneNumber) {
        const phoneNumber = this.getPreparedPhoneNumber(initialPhoneNumber);
        /* eslint-disable */
        const maskConfig = _(masks)
            .toPairs()
            .find(([country, mask]) =>
                phoneNumber.startsWith(mask.replace(/[^\d]/g, "")),
            );
        /* eslint-enable */
        if (maskConfig) {
            return _.first(maskConfig);
        }

        return _.first(_.keys(masks));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialPhoneNumber !== this.props.initialPhoneNumber) {
            const maskCountry = this.getMask(this.props.initialPhoneNumber);
            this.setState({ mask: maskCountry });
        }
    }

    render() {
        const {
            fieldName,
            initialPhoneNumber,
            form: { getFieldDecorator, setFieldsValue, getFieldValue },
        } = this.props;
        const phoneNumber = this.getPreparedPhoneNumber(initialPhoneNumber);

        const { mask } = this.state;

        const selectedMask = masks[ mask ];
        const countryDigits = masks[ mask ].replace(/[^\d]/g, '');

        const characters = selectedMask.replace(/[^\d_]/g, '').length;

        const formatter = value => {
            const base = selectedMask; // default number state
            const escapedValue = String(value).replace(/[^\d]/g, '');
            const inputNumber =
                escapedValue.length < countryDigits.length
                    ? countryDigits
                    : escapedValue;
            const digits = inputNumber.replace(
                new RegExp(`^${countryDigits}`, ''),
                '',
            );

            const formattedNumber = digits
                .split('')
                .reduce((prev, cur) => prev.replace('_', cur), base); // replace _ with numbers
            const indexOfPlaceHolder = formattedNumber.indexOf('_'); // get index of first empty number
            const endPosition =
                indexOfPlaceHolder === -1
                    ? formattedNumber.length
                    : indexOfPlaceHolder;

            return formattedNumber.slice(0, endPosition).replace(/[^\d]+$/, ''); // slice & trim the end
        };

        const parser = value => {
            const replacedValue = value
                .replace(/[^\d]/g, '')
                .substring(0, characters);

            return replacedValue.length < countryDigits.length
                ? countryDigits
                : replacedValue;
        };

        const options = {
            formatter,
            parser,
            step:  null,
            style: { width: '100%' },
        };

        return (
            <Row type='flex' align='inline' className={ Styles.phoneNumberInput }>
                <Col span='6' className={ Styles.phoneNumberCountry }>
                    <FormItem>
                        <Select
                            value={ mask }
                            onChange={ mask => {
                                const currentPhoneNumber = getFieldValue(
                                    fieldName,
                                );
                                const digits = String(
                                    currentPhoneNumber,
                                ).replace(
                                    new RegExp(`^${countryDigits}`, ''),
                                    '',
                                );
                                const newCountryDigits = masks[ mask ].replace(
                                    /[^\d]/g,
                                    '',
                                );

                                setFieldsValue({
                                    [ fieldName ]: Number(
                                        newCountryDigits + digits,
                                    ),
                                });
                                this.setState({ mask });
                            } }
                        >
                            { [ ..._.keys(masks) ].map(value => (
                                <Option value={ value } key={ value }>
                                    { value }
                                </Option>
                            )) }
                        </Select>
                    </FormItem>
                </Col>
                <Col span='18'>
                    <DecoratedInputNumber
                        { ...options }
                        cnStyles={ Styles.phoneNumberInput }
                        hasFeedback
                        formItem
                        initialValue={ Number(phoneNumber) }
                        getFieldDecorator={ getFieldDecorator }
                        field={ fieldName }
                        rules={ [
                            {
                                required: true,
                                message:  this.props.intl.formatMessage({
                                    id: 'required_field',
                                }),
                            },
                            {
                                pattern:   new RegExp(`^[\\d]{${characters}}$`),
                                transform: value => String(value),
                                message:   this.props.intl.formatMessage({
                                    id: 'add_client_form.invalid_phone_format',
                                }),
                            },
                        ] }
                    />
                </Col>
            </Row>
        );
    }
}

export default PhoneNumberInput;
