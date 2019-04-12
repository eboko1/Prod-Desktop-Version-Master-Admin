// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { createProduct } from 'core/storage/products';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';

import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';

// own
const Option = Select.Option;

const ProductForm = props => {
    const {
        form,
        intl: { formatMessage },
    } = props;

    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    const _submit = event => {
        event.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                props.createProduct(values);
                props.form.resetFields();
            }
        });
    };

    return (
        <Form onSubmit={ _submit }>
            <DecoratedInput
                formItem
                fields={ {} }
                label={ formatMessage({ id: 'storage.product_code' }) }
                field='code'
                getFieldDecorator={ form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'required',
                    },
                ] }
            />
            <DecoratedInput
                formItem
                label={ formatMessage({ id: 'storage.product_name' }) }
                fields={ {} }
                field='name'
                getFieldDecorator={ form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'required',
                    },
                ] }
            />
            <DecoratedSelect
                formItem
                label={ formatMessage({ id: 'storage.measure_units' }) }
                fields={ {} }
                field='measure'
                getFieldDecorator={ form.getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
            >
                <Option value={ 'items' } key={ 'items' }>
                    { formatMessage({ id: 'storage.measure.items' }) }
                </Option>
                <Option value={ 'liters' } key={ 'liters' }>
                    { formatMessage({ id: 'storage.measure.liters' }) }
                </Option>
            </DecoratedSelect>
            <DecoratedInput
                formItem
                label={ formatMessage({ id: 'storage.trade_code' }) }
                fields={ {} }
                field='tradeCode'
                getFieldDecorator={ form.getFieldDecorator }
            />
            <DecoratedSelect
                formItem
                label={ formatMessage({ id: 'storage.price_group' }) }
                fields={ {} }
                field='priceGroup'
                getFieldDecorator={ form.getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
            >
                { props.priceGroups.map(({ number, multiplier }) => (
                    <Option value={ number } key={ number }>
                        <span>
                            { formatMessage({ id: 'storage.price_group' }) } -{ ' ' }
                            { number }{ ' ' }
                        </span>
                        <span>
                            ({ formatMessage({ id: 'storage.markup' }) } -{ ' ' }
                            { multiplier })
                        </span>
                    </Option>
                )) }
            </DecoratedSelect>
            <DecoratedInput
                formItem
                label={ formatMessage({ id: 'storage.certificate' }) }
                fields={ {} }
                field='certificate'
                getFieldDecorator={ form.getFieldDecorator }
            />

            <Button type='primary' htmlType='submit'>
                { props.intl.formatMessage({ id: 'submit' }) }
            </Button>
        </Form>
    );
};

const mapStateToProps = state => ({
    priceGroups: selectPriceGroups(state),
});

export const StoreProductForm = injectIntl(
    connect(
        mapStateToProps,
        { createProduct, fetchPriceGroups },
    )(Form.create()(ProductForm)),
);
