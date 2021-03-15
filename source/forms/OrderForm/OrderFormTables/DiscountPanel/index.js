// vendor
import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { DecoratedInputNumber } from 'forms/DecoratedFields';
import { fetchAPI } from 'utils';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

@injectIntl
class DiscountPanel extends Component {
    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props);
    }
    
    _updateTimeMultiplier = async (multiplier) => {
        const { orderId, orderServices, laborTimeMultiplier } = this.props;
        const payload = {
            updateMode: true,
            laborTimeMultiplier: multiplier,
            services: orderServices.map(({id, count})=>({
                id,
                count: (count / laborTimeMultiplier) * multiplier,
            })),
        };

        await fetchAPI('PUT', `/orders/${orderId}`, null, payload)
        await this.props.reloadOrderForm(undefined, 'all');
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
            form: { getFieldDecorator, getFieldValue, getFieldsValue },
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
        } = this.props;

        const discount = getFieldValue(discountFieldName) || _.get(fetchedOrder, `order.${discountFieldName}`, 0);
        const total = Math.round((price - price * (discount / 100))*100)/100;
        const profit = servicesMode ? totalServicesProfit : totalDetailsProfit;

        const field = getFieldsValue([discountFieldName]);

        return (
            <Catcher>
                {servicesMode &&
                    <div className={Styles.servicesMarkup}>
                        <InputNumber
                            disabled={isServiceMarkupForbidden}
                            style={ { fontWeight: 700, margin: '0 12px 0 12px' } }
                            defaultValue={ laborTimeMultiplier || 1 }
                            step={ 0.1 }
                            min={ 0 }
                            formatter={ value => `${Math.round(value * 100)}%` }
                            parser={ value =>
                                Math.round(value.replace('%', '') / 100)
                            }
                            onChange={ value => this._updateTimeMultiplier(value) }
                        />
                        <FormattedMessage id='labors_table.mark_up' />
                    </div>
                }
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
                                style={ { color: profit < 0 ? 'red' : 'black' } }
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
