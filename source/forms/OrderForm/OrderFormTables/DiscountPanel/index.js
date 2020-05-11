// vendor
import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

@injectIntl
class DiscountPanel extends Component {
    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props);
    }

    render() {
        const {
            form: { getFieldDecorator },
            price,
            totalDetailsProfit,
            totalServicesProfit,
            discountFieldName,
            fetchedOrder,
            forbidden,
            detailsMode,
            servicesMode,
        } = this.props;

        const discount = this.props.form.getFieldValue(discountFieldName);

        const total = (price - price * (discount / 100)).toFixed(2);

        const profit = servicesMode ? totalServicesProfit : totalDetailsProfit;

        return (
            <Catcher>
                <div className={ Styles.discountPanel }>
                    <DecoratedInputNumber
                        field={ discountFieldName }
                        disabled={ forbidden }
                        initialValue={
                            _.get(fetchedOrder, `order.${discountFieldName}`) ||
                            0
                        }
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={
                            <FormattedMessage id='order_form_table.discount' />
                        }
                        colon={ false }
                        className={ Styles.formItem }
                        min={ 0 }
                        max={ 100 }
                        step={ 1 }
                        formatter={ value => `${Math.round(value)}%` }
                        parser={ value => value.replace('%', '') }
                        onChange={(value)=>{
                            this.props.reloadOrderForm();
                        }}
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
                            style={{color: 'black'}}
                            value={ price }
                            min={ 0 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
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
                            style={{color: 'black'}}
                            value={ total }
                            min={ 0 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    </FormItem>
                    { (detailsMode || servicesMode) && (
                        <FormItem
                            label={
                                <FormattedMessage
                                    id={ `${
                                        servicesMode
                                            ? 'order_form_table.services_profit'
                                            : 'order_form_table.details_profit'
                                    }` }
                                />
                            }
                            colon={ false }
                            className={ Styles.formItem }
                        >
                            <InputNumber
                                disabled
                                value={
                                    servicesMode
                                        ? totalServicesProfit
                                        : totalDetailsProfit
                                }
                                style={{color: profit < 0 ? 'red' : 'black'}}
                                formatter={ value =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ' ',
                                    )
                                }
                                parser={ value =>
                                    `${value}`.replace(/\$\s?|(\s)/g, '')
                                }
                            />
                        </FormItem>
                    ) }
                </div>
            </Catcher>
        );
    }
}

export default DiscountPanel;
