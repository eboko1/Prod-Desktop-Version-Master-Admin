// vendor
import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher, Numeral } from 'commons';
import { DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

@injectIntl
class DiscountPanel extends Component {
    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props);
    }

    async updateTimeMultiplier(multiplier) {
        this.laborTimeMultiplier = multiplier;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method:  'PUT',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ laborTimeMultiplier: multiplier }),
            });
            const result = await response.json();
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    _updateOrderField = (field) => {
        const { reloadOrderForm, orderId } = this.props;
        let token = localStorage.getItem("_my.carbook.pro_token");
        let url = __API_URL__;
        let params = `/orders/${orderId}`;
        url += params;
        fetch(url, {
            method: "PUT",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(field),
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }
                return Promise.resolve(response);
            })
            .then(function(response) {
                reloadOrderForm(undefined, 'all');
                return response.json();
            })
            .catch(function(error) {
                console.log("error", error);
            });
    }

    render() {
        const {
            form: { getFieldDecorator, getFieldsValue, getFieldValue },
            price,
            totalDetailsProfit,
            totalServicesProfit,
            discountFieldName,
            fetchedOrder,
            forbidden,
            detailsMode,
            servicesMode,
            isServiceMarkupForbidden,
            laborTimeMultiplier,
            isMobile,
        } = this.props;

        const discount = getFieldValue(discountFieldName) || _.get(fetchedOrder, `order.${discountFieldName}`, 0);
        const total = Math.round((price - price * (discount / 100))*100)/100;
        const profit = Math.round((price-total)*100)/100;
        const mask = "0,0.00";

        const field = getFieldsValue([discountFieldName]);

        return (
            <Catcher>
                {!isMobile ? 
                    <div className={ Styles.discountPanel }>
                        <DecoratedInputNumber
                            field={ discountFieldName }
                            disabled={ forbidden }
                            initialValue={
                                _.get(fetchedOrder, `order.${discountFieldName}`) || 0
                            }
                            getFieldDecorator={ getFieldDecorator }
                            formItem
                            label={
                                <FormattedMessage id='order_form_table.discount' />
                            }
                            colon={ false }
                            className={ Styles.formItem }
                            min={ -100 }
                            max={ 100 }
                            step={ 1 }
                            formatter={ value => `${Math.round(value)}%` }
                            parser={ value => value.replace('%', '') }
                            onChange={ value => {
                                field[discountFieldName] = value;
                                this._updateOrderField(field)
                            } }
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
                                style={ { color: 'black' } }
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
                        { (detailsMode || servicesMode) && (
                            <FormItem
                                label={<FormattedMessage id='order_form_table.discount' />}
                                colon={ false }
                                className={ Styles.formItem }
                            >
                                <InputNumber
                                    disabled
                                    value={ profit }
                                    style={ { color: total < 0 ? 'red' : 'black' } }
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
                        <FormItem
                            label={
                                <FormattedMessage id='order_form_table.total_sum' />
                            }
                            colon={ false }
                            className={ Styles.formItem }
                        >
                            <InputNumber
                                disabled
                                style={ { color: 'black' } }
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
                    </div> :
                    <div className={ Styles.mobileDiscountPanel }>
                        <div className={ Styles.mobileDiscount }>   
                            <FormattedMessage id='order_form_table.discount' />
                            <DecoratedInputNumber
                                field={ discountFieldName }
                                disabled={ forbidden }
                                initialValue={
                                    _.get(fetchedOrder, `order.${discountFieldName}`) ||
                                    0
                                }
                                getFieldDecorator={ getFieldDecorator }
                                formItem
                                colon={ false }
                                className={ Styles.mobileFormItem }
                                min={ -100 }
                                max={ 100 }
                                step={ 1 }
                                formatter={ value => `${Math.round(value)}%` }
                                parser={ value => value.replace('%', '') }
                                onChange={ value => {
                                    field[discountFieldName] = value;
                                    this._updateOrderField(field)
                                } }
                            />
                        </div>
                        <div className={ Styles.mobileSumBlock }>
                            <div className={ Styles.mobileSumRow }>
                                <FormattedMessage id='order_form_table.sum_without_discount' />
                                <Numeral
                                    mask={mask}
                                    className={Styles.sumNumeral}
                                    nullText="0"
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                >
                                    {Number(price)}
                                </Numeral>
                            </div>
                            <div className={ Styles.mobileSumRow }>
                                <FormattedMessage id='order_form_table.discount' />
                                <Numeral
                                    mask={mask}
                                    className={Styles.sumNumeral}
                                    nullText="0"
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                >
                                    {Number(profit)}
                                </Numeral>
                            </div>
                            <div className={ Styles.mobileSumRow }>
                                <FormattedMessage id='order_form_table.total_sum' />
                                <Numeral
                                    mask={mask}
                                    className={Styles.sumNumeral}
                                    nullText="0"
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                >
                                    {Number(total)}
                                </Numeral>
                            </div>
                        </div>
                    </div>
                }
            </Catcher>
        );
    }
}

export default DiscountPanel;
