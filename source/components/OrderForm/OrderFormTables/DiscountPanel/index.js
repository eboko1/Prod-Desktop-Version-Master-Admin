// vendor
import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

class DiscountPanel extends Component {
    render() {
        const {
            getFieldDecorator,
            price,
            discountFieldName,
            fetchedOrder,
        } = this.props;

        const discount = this.props.form.getFieldValue(discountFieldName);

        const total = price - price * (discount / 100);

        return (
            <Catcher>
                <div className={ Styles.discountPanel }>
                    <DecoratedInputNumber
                        field={ discountFieldName }
                        initialValue={ _.get(fetchedOrder, `order.${discountFieldName}`) || 0 }
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={
                            <FormattedMessage id='order_form_table.discount' />
                        }
                        colon={ false }
                        className={ Styles.formItem }
                        min={ 0 }
                        max={ 100 }
                        formatter={ value => `${value}%` }
                        parser={ value => value.replace('%', '') }
                    />
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
                                `${value} грн.`.replace(
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
                                `${value} грн.`.replace(
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
