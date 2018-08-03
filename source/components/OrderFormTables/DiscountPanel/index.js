// vendor
import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';
import { DecoratedSelect, DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

class DiscountPanel extends Component {
    render() {
        const { getFieldDecorator } = this.props;
        const discountFieldName = this.props.discountFieldName;

        const discount = ~~this.props.fields[ discountFieldName ].value;
        const price = this.props.price;

        const total = price - price * (discount / 100);

        return (
            <Catcher>
                <div className={ Styles.discountPanel }>
                    <FormItem
                        label={
                            <FormattedMessage id='order_form_table.discount' />
                        }
                        colon={ false }
                        className={ Styles.formItem }
                    >
                        <DecoratedInputNumber
                            field={ discountFieldName }
                            getFieldDecorator={ getFieldDecorator }
                            min={ 0 }
                            max={ 100 }
                            formatter={ value => `${value}%` }
                            parser={ value => value.replace('%', '') }
                        />
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='order_form_table.sum_without_discount' />
                        }
                        colon={ false }
                        className={ Styles.formItem }
                    >
                        <InputNumber
                            disabled
                            value={ this.props.price }
                            min={ 0 }
                            formatter={ value =>
                                `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ',',
                                )
                            }
                            parser={ value => value.replace(/\$\s?|(,*)/g, '') }
                        />
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='order_form_table.total_sum' />
                        }
                        colon={ false }
                        className={ Styles.formItem }
                    >
                        <InputNumber
                            disabled
                            value={ total }
                            min={ 0 }
                            formatter={ value =>
                                `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ',',
                                )
                            }
                            parser={ value => value.replace(/\$\s?|(,*)/g, '') }
                            // onChange={ value => this.onChange(value) }
                        />
                    </FormItem>
                </div>
            </Catcher>
        );
    }
}

export default DiscountPanel;
