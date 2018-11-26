//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

// proj
import {
    onChangeSetDetailProductForm,
    fetchProductNames,
    fetchDetails,
    submitDetailProduct,
} from 'core/forms/setDetailProduct/duck';

import {
    DecoratedInput,
    DecoratedSelect,
    LimitedDecoratedSelect,
} from 'forms/DecoratedFields';

import { withReduxForm } from 'utils';

// own
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name:    'setDetailProductForm',
    actions: {
        change: onChangeSetDetailProductForm,
        fetchProductNames,
        fetchDetails,
        submitDetailProduct,
    },
})
export class SetDetailProductForm extends Component {
    componentDidMount() {
        this.props.fetchDetails();
    }

    render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;

        const { details, brands, products } = this.props;
        const fields = getFieldsValue();
        const { detailId, articleNumber, supplierId, productId } = fields;

        const requiredDetails = fields.detailId
            ? [
                _.chain(details)
                    .find({ detailId })
                    .get('detailName')
                    .value(),
            ].filter(Boolean)
            : [];
        const requiredSuppliers = fields.supplierId
            ? [
                _.chain(brands)
                    .find({ supplierId })
                    .get('brandName')
                    .value(),
            ].filter(Boolean)
            : [];

        return (
            <Form>
                <DecoratedInput
                    field={ 'articleNumber' }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    hasFeedback
                    label={
                        <FormattedMessage id='detail_product.article_number' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                />
                <LimitedDecoratedSelect
                    showSearch
                    defaultValues={ requiredSuppliers }
                    field={ 'supplierId' }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    label={ <FormattedMessage id='detail_product.supplier_id' /> }
                    hasFeedback
                    getFieldDecorator={ getFieldDecorator }
                >
                    { _.map(brands, ({ supplierId, brandName }) => (
                        <Option value={ supplierId } key={ supplierId }>
                            { brandName }
                        </Option>
                    )) }
                </LimitedDecoratedSelect>
                <Button
                    style={ { width: '100%' } }
                    type='primary'
                    disabled={ !articleNumber || !supplierId }
                    onClick={ () =>
                        this.props.fetchProductNames(articleNumber, supplierId)
                    }
                >
                    <FormattedMessage id='detail_product.fetch_product_names' />
                </Button>
                <LimitedDecoratedSelect
                    showSearch
                    disabled={ !articleNumber || !supplierId }
                    defaultValues={ requiredDetails }
                    field={ 'detailId' }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    label={ <FormattedMessage id='detail_product.detail_id' /> }
                    hasFeedback
                    getFieldDecorator={ getFieldDecorator }
                >
                    { _.map(details, ({ detailId, detailName }) => (
                        <Option value={ detailId } key={ detailId }>
                            { detailName }
                        </Option>
                    )) }
                </LimitedDecoratedSelect>
                <DecoratedSelect
                    showSearch
                    field={ 'productId' }
                    disabled={ !products }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    label={ <FormattedMessage id='detail_product.product_id' /> }
                    hasFeedback
                    getFieldDecorator={ getFieldDecorator }
                >
                    { _.map(products, ({ id, productName }) => (
                        <Option value={ id } key={ id }>
                            { productName }
                        </Option>
                    )) }
                </DecoratedSelect>
                <Button
                    type='primary'
                    style={ { width: '100%' } }
                    disabled={ !detailId || !productId }
                    onClick={ () =>
                        this.props.submitDetailProduct(detailId, productId)
                    }
                >
                    <FormattedMessage id='submit' />
                </Button>
            </Form>
        );
    }
}
