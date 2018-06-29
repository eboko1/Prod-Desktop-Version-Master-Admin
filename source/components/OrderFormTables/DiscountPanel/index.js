// vendor
import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

class DiscountPanel extends Component {
    onChange(value) {
        console.log('changed', value);
    }

    render() {
        return (
            <Catcher>
                <div className={ Styles.discountPanel }>
                    <FormItem
                        label={
                            <FormattedMessage id='order_form_table.discount' />
                        }
                    >
                        <InputNumber
                            defaultValue={ 0 }
                            min={ 0 }
                            max={ 100 }
                            formatter={ value => `${value}%` }
                            parser={ value => value.replace('%', '') }
                            onChange={ value => this.onChange(value) }
                        />
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='order_form_table.sum_without_discount' />
                        }
                    >
                        <InputNumber
                            disabled
                            defaultValue={ 0 }
                            min={ 0 }
                            formatter={ value =>
                                `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ',',
                                )
                            }
                            parser={ value => value.replace(/\$\s?|(,*)/g, '') }
                            onChange={ value => this.onChange(value) }
                        />
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='order_form_table.total_sum' />
                        }
                    >
                        <InputNumber
                            disabled
                            defaultValue={ 0 }
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
